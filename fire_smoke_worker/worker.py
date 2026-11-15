"""Fire / smoke inference worker for the HeightX-Safe backend.

Videos uploaded on the Fire & Smoke page wait in the backend's job queue
(backend/routes/fire_smoke.py). This worker takes them one at a time and runs
the fire-and-smoke team's Model 7 on them with that team's own video script
(predict_video_dinov3.py), so the alarm logic is exactly theirs:

  1. GET  /worker/jobs/next                take the next queued video
  2. GET  /worker/jobs/{id}/input          download it
  3. predict_video_dinov3.py               annotated video + alarm log (CSV)
  4. ffmpeg                                re-encode to H.264, which browsers can play
  5. POST /worker/jobs/{id}/upload-video   \
     POST /worker/jobs/{id}/upload-events   > hand the results back
     POST /worker/jobs/{id}/complete       /

It reports progress while it works and a heartbeat every few seconds (the page
shows whether a worker is running), and marks the job failed if anything
breaks. It only needs HTTP access to the backend, so it runs on this laptop
(CPU, about 2 s per checked frame) or in a Kaggle notebook with a GPU.
See README.md.
"""

from __future__ import annotations

import argparse
import csv
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from collections import deque
from pathlib import Path

import httpx

HERE = Path(__file__).resolve().parent
MODEL_REPO = "https://github.com/CoderIsSleeping/fire-and-smoke.git"
# The commit of the model team's code this worker was written and tested against.
MODEL_COMMIT = "b68c152b94bccad7f6e21084628d0384b0e7f9b2"
HEARTBEAT_SECONDS = 10
PROGRESS_SECONDS = 3
MAX_EVENTS = 500
# tqdm's progress line from predict_video_dinov3.py: "frames:  12%|#2   | 160/1343 [00:10<01:15, ...]"
FRAMES_DONE = re.compile(r"(\d+)/(\d+) \[")


class BackendError(Exception):
    def __init__(self, status: int, message: str) -> None:
        super().__init__(message)
        self.status = status


class Backend:
    def __init__(self, api: str, token: str) -> None:
        self.api = api.rstrip("/")
        self.client = httpx.Client(
            headers={"X-Worker-Token": token},
            timeout=httpx.Timeout(60.0, connect=10.0),
        )

    def call(self, method: str, path: str, **kwargs) -> httpx.Response:
        response = self.client.request(method, f"{self.api}{path}", **kwargs)
        if response.status_code >= 400:
            try:
                detail = response.json().get("detail")
            except ValueError:
                detail = response.text[:200]
            raise BackendError(response.status_code, f"{method} {path} -> {response.status_code}: {detail}")
        return response

    def download(self, path: str, target: Path) -> None:
        with self.client.stream("GET", f"{self.api}{path}", timeout=600) as response:
            if response.status_code >= 400:
                raise BackendError(response.status_code, f"GET {path} -> {response.status_code}")
            with target.open("wb") as handle:
                for chunk in response.iter_bytes(1 << 20):
                    handle.write(chunk)

    def upload(self, path: str, file: Path, name: str, media_type: str) -> None:
        with file.open("rb") as handle:
            self.call("POST", path, files={"file": (name, handle, media_type)}, timeout=600)


class Heartbeat(threading.Thread):
    """Tells the backend every few seconds that a worker is running, and what it is doing."""

    def __init__(self, api: str, token: str, info: dict) -> None:
        super().__init__(name="heartbeat", daemon=True)
        self.backend = Backend(api, token)
        self.info = info
        self.wake = threading.Event()
        self.stopped = threading.Event()
        self.failing = False

    def run(self) -> None:
        while not self.stopped.is_set():
            self.wake.clear()
            try:
                self.backend.call("POST", "/worker/heartbeat", json=dict(self.info))
                self.failing = False
            except (httpx.HTTPError, BackendError) as error:
                if not self.failing:
                    print(f"heartbeat not delivered: {error}", flush=True)
                self.failing = True
            self.wake.wait(HEARTBEAT_SECONDS)

    def update(self, **changes) -> None:
        self.info.update(changes)
        self.wake.set()

    def stop(self) -> None:
        self.stopped.set()
        self.wake.set()


class JobProgress:
    def __init__(self, backend: Backend, job_id: str) -> None:
        self.backend = backend
        self.job_id = job_id
        self.sent_at = 0.0

    def send(self, percent: int, message: str, every: float = 0.0) -> None:
        now = time.monotonic()
        if now - self.sent_at < every:
            return
        self.sent_at = now
        try:
            self.backend.call(
                "POST", f"/worker/jobs/{self.job_id}/progress", json={"progress": percent, "message": message}
            )
        except httpx.HTTPError as error:
            print(f"progress not delivered: {error}", flush=True)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Run Model 7 on the videos queued in the HeightX-Safe backend.")
    p.add_argument("--api", default=os.getenv("FIRE_SMOKE_API_URL", "http://localhost:8000/api/fire-smoke"),
                   help="The backend's fire-smoke API (default: %(default)s).")
    p.add_argument("--token", default=os.getenv("WORKER_API_TOKEN"),
                   help="Same value as WORKER_API_TOKEN on the backend (default: that environment variable).")
    p.add_argument("--weights", default=os.getenv("FIRE_SMOKE_WEIGHTS", str(HERE / "models" / "model7_dinov3_896_negs.pt")),
                   help="Trained checkpoint (default: %(default)s).")
    p.add_argument("--model-code", default=os.getenv("FIRE_SMOKE_MODEL_CODE", str(HERE / "fire-and-smoke")),
                   help="Checkout of the fire-and-smoke repository; cloned there if missing (default: %(default)s).")
    p.add_argument("--model-name", default="Model 7 · DINOv3 ViT-S + Faster R-CNN · 896 px")
    p.add_argument("--device", default="auto", help="auto, cpu or cuda.")
    p.add_argument("--stride", type=int, default=0,
                   help="Check every Nth frame. 0 picks 2 on a GPU and 5 on a CPU, as the model team runs it.")
    alarm = p.add_argument_group("alarm rule (Model 7 values from the model team's sample_run.bat)")
    alarm.add_argument("--conf", type=float, default=0.80)
    alarm.add_argument("--exit-conf", type=float, default=0.65)
    alarm.add_argument("--window", type=int, default=15)
    alarm.add_argument("--enter-hits", type=int, default=6)
    p.add_argument("--poll-seconds", type=float, default=5.0)
    p.add_argument("--once", action="store_true", help="Exit after one job.")
    return p.parse_args()


def resolve_device(requested: str) -> str:
    import torch

    if requested == "auto":
        return "cuda" if torch.cuda.is_available() else "cpu"
    if requested.startswith("cuda") and not torch.cuda.is_available():
        print("CUDA is not available here; using the CPU.", flush=True)
        return "cpu"
    return requested


def ensure_model_code(path: Path) -> Path:
    script = path / "scripts" / "predict_video_dinov3.py"
    if script.is_file():
        return script
    if path.exists() and any(path.iterdir()):
        raise SystemExit(f"{path} is not a fire-and-smoke checkout (no scripts/predict_video_dinov3.py).")
    if not shutil.which("git"):
        raise SystemExit(f"Model code not found at {path}. Install git, or clone {MODEL_REPO} there yourself.")
    print(f"Cloning the model team's code into {path} ...", flush=True)
    subprocess.run(["git", "clone", "-q", MODEL_REPO, str(path)], check=True)
    subprocess.run(["git", "-C", str(path), "checkout", "-q", MODEL_COMMIT], check=True)
    return script


def find_ffmpeg() -> str | None:
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        return shutil.which("ffmpeg")


def video_info(path: Path) -> dict:
    import cv2

    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        raise RuntimeError("OpenCV could not open the uploaded video.")
    frames = int(capture.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = capture.get(cv2.CAP_PROP_FPS)
    width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    capture.release()
    fps = fps if 0 < fps <= 240 else 25.0
    return {
        "frames": frames,
        "fps": round(fps, 2),
        "duration_s": round(frames / fps, 1) if frames > 0 else None,
        "width": width,
        "height": height,
    }


def run_model(args, script: Path, device: str, stride: int, source: Path, raw: Path, events_csv: Path,
              progress: JobProgress) -> None:
    command = [
        sys.executable, str(script),
        "--weights", args.weights, "--label", "Model 7",
        "--source", str(source), "--output", str(raw), "--events", str(events_csv),
        "--conf", str(args.conf), "--exit-conf", str(args.exit_conf),
        "--window", str(args.window), "--enter-hits", str(args.enter_hits),
        "--stride", str(stride), "--device", device,
    ]
    env = {**os.environ, "PYTHONUNBUFFERED": "1", "PYTHONIOENCODING": "utf-8"}
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                               cwd=str(script.parent.parent), env=env)
    tail: deque = deque(maxlen=20)
    pending = ""
    try:
        while True:
            chunk = process.stdout.read1(4096)
            if not chunk:
                break
            pending += chunk.decode("utf-8", errors="replace")
            *lines, pending = re.split(r"[\r\n]", pending)
            for line in (line.strip() for line in lines):
                if not line:
                    continue
                match = FRAMES_DONE.search(line)
                if match:
                    done, total = int(match[1]), int(match[2])
                    progress.send(5 + 85 * done // max(total, 1), f"Checking frames: {done} of {total}",
                                  every=PROGRESS_SECONDS)
                else:
                    tail.append(line)
        code = process.wait()
    except BaseException:
        process.kill()
        raise
    if code != 0:
        raise RuntimeError("The model script failed: " + " | ".join(list(tail)[-6:]))


def transcode(ffmpeg: str | None, raw: Path, target: Path) -> bool:
    """OpenCV writes MPEG-4 Part 2, which browsers do not play; H.264 they do."""
    if not ffmpeg:
        print("ffmpeg not found (pip install imageio-ffmpeg): uploading the video as OpenCV wrote it, "
              "which downloads fine but will not play in the browser.", flush=True)
        return False
    result = subprocess.run(
        [ffmpeg, "-y", "-loglevel", "error", "-i", str(raw),
         "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",  # H.264 needs even sizes
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
         "-movflags", "+faststart", "-an", str(target)],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"ffmpeg could not re-encode the video: {result.stderr.strip()[-300:]}", flush=True)
        return False
    return True


def summarise(args, events_csv: Path, video: dict, device: str, stride: int, seconds: float,
              playable: bool) -> dict:
    events = []
    with events_csv.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            events.append({
                "frame": int(row["frame"]),
                "time_s": float(row["time_s"]),
                "event": row["event"],
                "class": row["class"] or None,
                "score": float(row["score"]) if row["score"] else None,
                "box": [int(row[key]) for key in ("x1", "y1", "x2", "y2")] if row["x1"] else None,
                "detail": row["detail"],
            })

    alarms = [event for event in events if event["event"] == "ALARM_ON"]
    cues = [event for event in events if event["event"] == "OCCLUDED_FIRE_CUE"]
    fire = sum(1 for event in alarms if event["class"] == "fire")
    smoke = sum(1 for event in alarms if event["class"] == "smoke")
    scores = [event["score"] for event in (alarms or cues) if event["score"] is not None]

    return {
        "verdict": "fire" if fire else "smoke" if smoke else "possible_hidden_fire" if cues else "clear",
        "fire_alarms": fire,
        "smoke_alarms": smoke,
        "hidden_fire_cues": len(cues),
        "first_alarm_s": min((event["time_s"] for event in alarms + cues), default=None),
        "peak_score": max(scores, default=None),
        "events": events[:MAX_EVENTS],
        "events_total": len(events),
        "video": video,
        "model": {"name": args.model_name, "weights": Path(args.weights).name, "device": device},
        "settings": {
            "conf": args.conf,
            "exit_conf": args.exit_conf,
            "window": args.window,
            "enter_hits": args.enter_hits,
            "stride": stride,
        },
        "processing_seconds": round(seconds, 1),
        "browser_playable": playable,
    }


def process_job(job: dict, backend: Backend, heartbeat: Heartbeat, args, script: Path, device: str,
                stride: int, ffmpeg: str | None) -> None:
    job_id = job["job_id"]
    heartbeat.update(state="processing", job_id=job_id)
    progress = JobProgress(backend, job_id)
    started = time.monotonic()
    work = Path(tempfile.mkdtemp(prefix="fire_smoke_job_"))
    print(f"\njob {job_id}: started", flush=True)
    try:
        progress.send(2, "Downloading the video")
        source = work / f"input{Path(job['filename']).suffix.lower() or '.mp4'}"
        backend.download(f"/worker/jobs/{job_id}/input", source)
        video = video_info(source)

        progress.send(5, f"Loading the model on {device}")
        raw, events_csv = work / "model_output.mp4", work / "events.csv"
        run_model(args, script, device, stride, source, raw, events_csv, progress)

        progress.send(91, "Encoding the annotated video for the browser")
        annotated = work / "annotated.mp4"
        playable = transcode(ffmpeg, raw, annotated)
        if not playable:
            annotated = raw

        progress.send(96, "Uploading the results")
        backend.upload(f"/worker/jobs/{job_id}/upload-video", annotated, "annotated.mp4", "video/mp4")
        backend.upload(f"/worker/jobs/{job_id}/upload-events", events_csv, "events.csv", "text/csv")
        result = summarise(args, events_csv, video, device, stride, time.monotonic() - started, playable)
        backend.call("POST", f"/worker/jobs/{job_id}/complete", json={"result": result})
        print(f"job {job_id}: done in {result['processing_seconds']} s -> {result['verdict']} "
              f"({result['fire_alarms']} fire, {result['smoke_alarms']} smoke, "
              f"{result['hidden_fire_cues']} hidden-fire alarms)", flush=True)
    except Exception as error:
        print(f"job {job_id}: failed: {error}", flush=True)
        try:
            backend.call("POST", f"/worker/jobs/{job_id}/fail", json={"error": str(error)})
        except (httpx.HTTPError, BackendError) as report_error:
            print(f"job {job_id}: could not report the failure: {report_error}", flush=True)
    finally:
        shutil.rmtree(work, ignore_errors=True)
        heartbeat.update(state="idle", job_id=None)


def wait_for_backend(backend: Backend) -> None:
    """Hand back any job a stopped worker left half-done, retrying until the backend answers."""
    announced = False
    while True:
        try:
            requeued = backend.call("POST", "/worker/requeue-interrupted").json().get("requeued", 0)
            if requeued:
                print(f"{requeued} unfinished job(s) put back in the queue.", flush=True)
            return
        except httpx.HTTPError:
            if not announced:
                print(f"Waiting for the backend at {backend.api} ...", flush=True)
                announced = True
            time.sleep(5)
        except BackendError as error:
            if error.status == 503:
                raise SystemExit("The backend has no WORKER_API_TOKEN set. Start it with the same token, "
                                 "e.g. in PowerShell:  $env:WORKER_API_TOKEN='...'; uvicorn app:app")
            if error.status == 401:
                raise SystemExit("The backend rejected the token: use the same WORKER_API_TOKEN on both sides.")
            raise


def main() -> None:
    args = parse_args()
    if not args.token:
        raise SystemExit("Set WORKER_API_TOKEN (the same value the backend runs with) or pass --token.")
    weights = Path(args.weights)
    if not weights.is_file():
        raise SystemExit(f"Model file not found: {weights}\n"
                         "Copy weights/best.pt from the training results there, or pass --weights.")
    args.weights = str(weights.resolve())

    script = ensure_model_code(Path(args.model_code))
    device = resolve_device(args.device)
    stride = args.stride or (2 if device.startswith("cuda") else 5)
    ffmpeg = find_ffmpeg()
    backend = Backend(args.api, args.token)

    print(f"model   : {args.model_name} ({weights.name}) on {device}, checking every {stride} frames", flush=True)
    print(f"alarm   : {args.enter_hits} of {args.window} checks at confidence >= {args.conf}", flush=True)
    print(f"backend : {backend.api}", flush=True)
    wait_for_backend(backend)

    heartbeat = Heartbeat(args.api, args.token,
                          {"model": args.model_name, "device": device, "state": "idle", "job_id": None})
    heartbeat.start()
    print("Waiting for videos ...", flush=True)

    busy = False
    try:
        while True:
            try:
                job = backend.call("GET", "/worker/jobs/next").json().get("job")
            except (httpx.HTTPError, BackendError) as error:
                print(f"could not reach the backend ({error}); retrying", flush=True)
                time.sleep(args.poll_seconds)
                continue
            if not job:
                time.sleep(args.poll_seconds)
                continue

            busy = True
            process_job(job, backend, heartbeat, args, script, device, stride, ffmpeg)
            busy = False
            if args.once:
                break
    except KeyboardInterrupt:
        if busy:
            print("\nStopped in the middle of a job; putting it back in the queue.", flush=True)
            try:
                backend.call("POST", "/worker/requeue-interrupted")
            except (httpx.HTTPError, BackendError):
                pass
    finally:
        heartbeat.stop()


if __name__ == "__main__":
    main()
