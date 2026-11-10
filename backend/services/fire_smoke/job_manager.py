
import uuid
import shutil
import threading

from collections import deque
from pathlib import Path
from datetime import datetime, timezone


# Directory Configuration
BASE_DIR = Path(__file__).resolve().parents[2]

UPLOAD_DIR = BASE_DIR / "data" / "fire_smoke" / "uploads"
OUTPUT_DIR = BASE_DIR / "data" / "fire_smoke" / "outputs"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Job Storage
_jobs = {}
_jobs_lock = threading.Lock()
_pending_jobs = deque()


# Allowed Video Formats
ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}


def create_job(source_file: str, job_id: str = None) -> dict:
    """Create a new video-processing job."""

    job_id = job_id or str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()

    job = {
        "job_id": job_id,
        "status": "uploaded",
        "filename": Path(source_file).name,
        "created_at": now,
        "updated_at": now,
        "progress": 0,
        "message": "Video uploaded successfully.",
        "result": None,
        "error": None
    }

    with _jobs_lock:
        _jobs[job_id] = job

    return job.copy()


def get_job(job_id: str):
    """Get job details."""

    with _jobs_lock:
        job = _jobs.get(job_id)
        return job.copy() if job else None


def update_job(job_id: str, **updates):
    """Update job status or result."""

    with _jobs_lock:
        job = _jobs.get(job_id)

        if not job:
            return None

        job.update(updates)
        job["updated_at"] = datetime.now(
            timezone.utc
        ).isoformat()

        return job.copy()


def save_video(upload_file) -> tuple[str, str]:
    """Save uploaded video safely."""

    original_name = Path(upload_file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported video format. "
            "Allowed: MP4, AVI, MOV, MKV."
        )

    job_id = str(uuid.uuid4())
    destination = UPLOAD_DIR / f"{job_id}{extension}"

    with destination.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)

    return job_id, str(destination)


def get_output_path(job_id: str, filename: str) -> Path:
    """Build a safe output path for a job."""

    safe_name = Path(filename).name
    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    return job_dir / safe_name


def list_jobs():
    """Return all jobs, newest first."""

    with _jobs_lock:
        jobs = [job.copy() for job in _jobs.values()]

    return sorted(
        jobs,
        key=lambda item: item["created_at"],
        reverse=True
    )


def queue_job(job_id: str):
    """Add an uploaded job to the inference queue."""

    with _jobs_lock:
        if job_id not in _jobs:
            return False

        if job_id not in _pending_jobs:
            _pending_jobs.append(job_id)

        _jobs[job_id]["status"] = "queued"
        _jobs[job_id]["message"] = (
            "Waiting for inference worker."
        )
        _jobs[job_id]["updated_at"] = datetime.now(
            timezone.utc
        ).isoformat()

    return True


def get_next_job():
    """Return the next queued job to the worker."""

    with _jobs_lock:
        while _pending_jobs:
            job_id = _pending_jobs.popleft()
            job = _jobs.get(job_id)

            if not job or job["status"] != "queued":
                continue

            job["status"] = "processing"
            job["message"] = (
                "Inference worker is processing the video."
            )
            job["updated_at"] = datetime.now(
                timezone.utc
            ).isoformat()

            return job.copy()

        return None


def get_input_video(job_id: str):
    """Get uploaded video path for a job."""

    with _jobs_lock:
        job = _jobs.get(job_id)

        if not job:
            return None

        video_path = UPLOAD_DIR / job["filename"]

        if not video_path.is_file():
            return None

        return str(video_path)


def complete_job(job_id: str, result: dict):
    """Save inference results and mark job completed."""

    with _jobs_lock:
        job = _jobs.get(job_id)

        if not job:
            return None

        job["status"] = "completed"
        job["progress"] = 100
        job["result"] = result
        job["error"] = None
        job["message"] = "Inference completed."
        job["updated_at"] = datetime.now(
            timezone.utc
        ).isoformat()

        return job.copy()


def fail_job(job_id: str, error: str):
    """Mark a job as failed."""

    return update_job(
        job_id,
        status="failed",
        error=error,
        message="Video inference failed."
    )
