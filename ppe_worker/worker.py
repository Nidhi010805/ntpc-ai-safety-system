
import time
import logging
import requests

from pathlib import Path
from dotenv import load_dotenv

# Load .env BEFORE importing config
load_dotenv(Path(__file__).with_name(".env"))

import config
from model_adapter import run_ppe_inference


load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("PPE-WORKER")

SESSION = requests.Session()

SESSION.headers.update({
    "X-Worker-Token": config.WORKER_TOKEN
})


# =====================================
# API HELPERS
# =====================================

def api_url(endpoint):
    return f"{config.API_BASE_URL}{endpoint}"


def heartbeat():

    response = SESSION.post(
        api_url("/worker/heartbeat"),
        json={
            "worker_id": config.WORKER_ID,
            "model_name": config.MODEL_NAME,
            "model_version": config.MODEL_VERSION
        },
        timeout=20
    )

    response.raise_for_status()

    logger.info("Worker heartbeat successful.")


# =====================================
# FETCH NEXT JOB
# =====================================

def fetch_next_job():

    response = SESSION.get(
        api_url("/worker/jobs/next"),
        params={
            "worker_id": config.WORKER_ID
        },
        timeout=30
    )

    response.raise_for_status()

    return response.json().get("job")


# =====================================
# DOWNLOAD INPUT VIDEO
# =====================================

def download_video(job):

    job_id = job["job_id"]

    destination = (
        Path(config.DOWNLOAD_DIR)
        / f"{job_id}.mp4"
    )

    response = SESSION.get(
        api_url(f"/worker/jobs/{job_id}/input"),
        params={
            "worker_id": config.WORKER_ID
        },
        stream=True,
        timeout=300
    )

    response.raise_for_status()

    with destination.open("wb") as file:

        for chunk in response.iter_content(
            chunk_size=1024 * 1024
        ):
            if chunk:
                file.write(chunk)

    logger.info("Downloaded video: %s", job_id)

    return destination


# =====================================
# UPLOAD ANNOTATED VIDEO
# =====================================

def upload_annotated_video(job_id, video_path):

    video_path = Path(video_path)

    if not video_path.is_file():
        raise FileNotFoundError(
            "Annotated video not found."
        )

    with video_path.open("rb") as video:

        response = SESSION.post(
            api_url(
                f"/worker/jobs/{job_id}/upload-video"
            ),
            params={
                "worker_id": config.WORKER_ID
            },
            files={
                "file": (
                    "annotated.mp4",
                    video,
                    "video/mp4"
                )
            },
            timeout=600
        )

    response.raise_for_status()

    logger.info("Annotated video uploaded.")


# =====================================
# UPDATE JOB PROGRESS
# =====================================

def update_progress(job_id, progress, message):

    response = SESSION.post(
        api_url(
            f"/worker/jobs/{job_id}/progress"
        ),
        json={
            "worker_id": config.WORKER_ID,
            "progress": progress,
            "message": message
        },
        timeout=30
    )

    response.raise_for_status()


# =====================================
# COMPLETE JOB
# =====================================

def complete_job(job_id, result):

    response = SESSION.post(
        api_url(
            f"/worker/jobs/{job_id}/complete"
        ),
        json={
            "worker_id": config.WORKER_ID,
            "result": result
        },
        timeout=120
    )

    response.raise_for_status()

    logger.info("Job completed: %s", job_id)


# =====================================
# FAIL JOB
# =====================================

def fail_job(job_id, error):

    try:
        response = SESSION.post(
            api_url(
                f"/worker/jobs/{job_id}/fail"
            ),
            json={
                "worker_id": config.WORKER_ID,
                "error": str(error)[:1000]
            },
            timeout=30
        )

        response.raise_for_status()

    except requests.RequestException:
        logger.exception("Could not report job failure.")


# =====================================
# PROCESS SINGLE JOB
# =====================================

def process_job(job):

    job_id = job["job_id"]

    logger.info("Processing PPE job: %s", job_id)

    try:

        update_progress(
            job_id,
            5,
            "Downloading CCTV video."
        )

        video_path = download_video(job)

        output_dir = (
            Path(config.OUTPUT_DIR) / job_id
        )

        output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        update_progress(
            job_id,
            10,
            "Starting PPE model inference."
        )

        result = run_ppe_inference(
            video_path,
            output_dir
        )

        update_progress(
            job_id,
            85,
            "Inference completed. Uploading results."
        )

        annotated_path = result.pop(
            "annotated_video_path",
            None
        )

        if annotated_path:

            upload_annotated_video(
                job_id,
                annotated_path
            )

            result["annotated_video_url"] = (
                f"/api/ppe/jobs/{job_id}/video"
            )

        update_progress(
            job_id,
            95,
            "Saving detection results."
        )

        complete_job(
            job_id,
            result
        )

        logger.info(
            "Successfully processed job: %s",
            job_id
        )

    except Exception as exc:

        logger.exception(
            "PPE job failed: %s",
            job_id
        )

        fail_job(job_id, str(exc))


# =====================================
# MAIN WORKER LOOP
# =====================================

def main():

    if not config.WORKER_TOKEN:
        raise RuntimeError(
            "PPE_WORKER_API_TOKEN is missing."
        )

    logger.info("Starting PPE Worker...")
    logger.info("Worker ID: %s", config.WORKER_ID)

    last_heartbeat = 0

    while True:

        try:

            if (
                time.monotonic() - last_heartbeat
                >= config.HEARTBEAT_INTERVAL
            ):

                heartbeat()
                last_heartbeat = time.monotonic()

            job = fetch_next_job()

            if job:

                process_job(job)

            else:

                time.sleep(config.POLL_INTERVAL)

        except requests.RequestException:

            logger.exception(
                "Backend connection failed. Retrying..."
            )

            time.sleep(config.POLL_INTERVAL)

        except KeyboardInterrupt:

            logger.info("PPE Worker stopped.")
            break


if __name__ == "__main__":
    main()
