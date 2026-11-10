
import os
import hmac
import shutil

from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Header,
    Depends
)
from fastapi.responses import FileResponse

from services.fire_smoke.job_manager import (
    create_job,
    save_video,
    get_job,
    list_jobs,
    queue_job,
    get_next_job,
    get_input_video,
    get_output_path,
    complete_job,
    fail_job,
    OUTPUT_DIR
)

router = APIRouter()


# Worker Authentication
def verify_worker_token(
    x_worker_token: str = Header(default="")
):
    expected_token = os.getenv("WORKER_API_TOKEN", "")

    if not expected_token:
        raise HTTPException(
            status_code=503,
            detail="Worker API token is not configured."
        )

    if not hmac.compare_digest(x_worker_token, expected_token):
        raise HTTPException(
            status_code=401,
            detail="Invalid worker token."
        )

    return True


# Health Check
@router.get("/health")
def fire_smoke_health():
    return {
        "success": True,
        "service": "fire-smoke-api",
        "status": "running",
        "model_status": "not_configured"
    }


# Model Information
@router.get("/model-info")
def fire_smoke_model_info():
    return {
        "success": True,
        "model_name": "DINOv3 + Faster R-CNN",
        "model_status": "not_configured",
        "inference_location": "Kaggle GPU",
        "message": "Model checkpoint and inference configuration are pending."
    }


# Upload Input Video
@router.post("/jobs")
def upload_video(file: UploadFile = File(...)):
    try:
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No filename provided."
            )

        job_id, video_path = save_video(file)
        create_job(video_path, job_id=job_id)

        if not queue_job(job_id):
            raise HTTPException(
                status_code=500,
                detail="Could not queue video job."
            )

        return {
            "success": True,
            "message": "Video uploaded and queued successfully.",
            "job": get_job(job_id)
        }

    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    finally:
        file.file.close()


# Get All Jobs
@router.get("/jobs")
def get_all_jobs():
    return {
        "success": True,
        "jobs": list_jobs()
    }


# Get Job Status
@router.get("/jobs/{job_id}")
def get_job_status(job_id: str):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    return {
        "success": True,
        "job": job
    }


# Worker: Get Next Pending Job
@router.get(
    "/worker/jobs/next",
    dependencies=[Depends(verify_worker_token)]
)
def worker_get_next_job():
    job = get_next_job()

    if not job:
        return {
            "success": True,
            "job": None,
            "message": "No pending jobs."
        }

    return {
        "success": True,
        "job": job
    }


# Worker: Download Input Video
@router.get(
    "/worker/jobs/{job_id}/input",
    dependencies=[Depends(verify_worker_token)]
)
def worker_get_input_video(job_id: str):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    video_path = get_input_video(job_id)

    if not video_path or not Path(video_path).is_file():
        raise HTTPException(
            status_code=404,
            detail="Input video not found."
        )

    return FileResponse(
        path=video_path,
        media_type="application/octet-stream",
        filename=Path(video_path).name
    )


# Worker: Upload Annotated Video
@router.post(
    "/worker/jobs/{job_id}/upload-video",
    dependencies=[Depends(verify_worker_token)]
)
def worker_upload_video(
    job_id: str,
    file: UploadFile = File(...)
):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if job["status"] != "processing":
        raise HTTPException(
            status_code=409,
            detail="Job is not currently processing."
        )

    if (
        not file.filename
        or Path(file.filename).suffix.lower() != ".mp4"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only MP4 annotated videos are supported."
        )

    output_path = get_output_path(job_id, "annotated.mp4")

    try:
        with output_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    return {
        "success": True,
        "message": "Annotated video uploaded successfully.",
        "filename": "annotated.mp4"
    }


# Worker: Upload Detection Events CSV
@router.post(
    "/worker/jobs/{job_id}/upload-events",
    dependencies=[Depends(verify_worker_token)]
)
def worker_upload_events(
    job_id: str,
    file: UploadFile = File(...)
):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if job["status"] != "processing":
        raise HTTPException(
            status_code=409,
            detail="Job is not currently processing."
        )

    if (
        not file.filename
        or Path(file.filename).suffix.lower() != ".csv"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    output_path = get_output_path(job_id, "events.csv")

    try:
        with output_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    return {
        "success": True,
        "message": "Detection events uploaded successfully.",
        "filename": "events.csv"
    }


# Worker: Submit Completed Results
@router.post(
    "/worker/jobs/{job_id}/complete",
    dependencies=[Depends(verify_worker_token)]
)
def worker_complete_job(job_id: str, payload: dict):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if job["status"] != "processing":
        raise HTTPException(
            status_code=409,
            detail="Job is not currently processing."
        )

    result = payload.get("result")

    if not isinstance(result, dict):
        raise HTTPException(
            status_code=400,
            detail="A valid result object is required."
        )

    updated_job = complete_job(job_id, result)

    return {
        "success": True,
        "message": "Inference results received.",
        "job": updated_job
    }



# Worker: Submit Completed Results
@router.post(
    "/worker/jobs/{job_id}/complete",
    dependencies=[Depends(verify_worker_token)]
)
def worker_complete_job(job_id: str, payload: dict):
    job = get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if job["status"] != "processing":
        raise HTTPException(
            status_code=409,
            detail="Job is not currently processing."
        )

    result = payload.get("result")

    if not isinstance(result, dict):
        raise HTTPException(
            status_code=400,
            detail="A valid result object is required."
        )

    video_path = get_output_path(job_id, "annotated.mp4")
    csv_path = get_output_path(job_id, "events.csv")

    if not video_path.is_file() or not csv_path.is_file():
        raise HTTPException(
            status_code=409,
            detail="Annotated video and detection CSV must be uploaded before completing the job."
        )

    updated_job = complete_job(job_id, result)

    return {
        "success": True,
        "message": "Inference results received.",
        "job": updated_job
    }


# Get Detection Results
@router.get("/jobs/{job_id}/results")
def get_job_results(job_id: str):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    if job["status"] != "completed":
        raise HTTPException(
            status_code=409,
            detail="Inference results are not available yet."
        )

    return {
        "success": True,
        "job_id": job_id,
        "result": job.get("result")
    }


# Get Annotated Video
@router.get("/jobs/{job_id}/video")
def get_annotated_video(job_id: str):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    video_path = OUTPUT_DIR / job_id / "annotated.mp4"

    if not video_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Annotated video is not available yet."
        )

    return FileResponse(
        path=video_path,
        media_type="video/mp4",
        filename="annotated.mp4"
    )


# Get Detection Events CSV
@router.get("/jobs/{job_id}/events")
def get_detection_events(job_id: str):
    job = get_job(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    csv_path = OUTPUT_DIR / job_id / "events.csv"

    if not csv_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Detection events CSV is not available yet."
        )

    return FileResponse(
        path=csv_path,
        media_type="text/csv",
        filename="events.csv"
    )
