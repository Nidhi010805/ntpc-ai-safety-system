
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
from pydantic import BaseModel, Field

from services.ppe import job_manager as jm
from services.ppe.result_adapter import normalize_results


router = APIRouter()


# =====================================
# WORKER AUTHENTICATION
# =====================================

def verify_worker_token(
    x_worker_token: str = Header(default="")
):
    expected_token = os.getenv("PPE_WORKER_API_TOKEN", "")

    if not expected_token:
        raise HTTPException(
            status_code=503,
            detail="PPE worker token is not configured."
        )

    if not hmac.compare_digest(
        x_worker_token,
        expected_token
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid worker token."
        )

    return True


# =====================================
# REQUEST MODELS
# =====================================

class HeartbeatRequest(BaseModel):
    worker_id: str = Field(min_length=1, max_length=100)
    model_name: str = "Unknown"
    model_version: str = "Unknown"


class ProgressRequest(BaseModel):
    worker_id: str
    progress: int = Field(ge=0, le=99)
    message: str = "Processing video."


class CompleteRequest(BaseModel):
    worker_id: str
    result: dict


class FailRequest(BaseModel):
    worker_id: str
    error: str


# =====================================
# HEALTH CHECK
# =====================================

@router.get("/health")
def ppe_health():

    workers = jm.get_worker_status()

    online_workers = [
        worker for worker in workers
        if worker["status"] == "online"
    ]

    return {
        "success": True,
        "service": "ppe-detection-api",
        "status": "running",
        "worker_status": (
            "online" if online_workers else "offline"
        ),
        "workers": online_workers
    }


# =====================================
# UPLOAD VIDEO
# =====================================

@router.post("/jobs")
def upload_ppe_video(
    file: UploadFile = File(...)
):

    try:
        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="No filename provided."
            )

        job = jm.create_job(file)

        return {
            "success": True,
            "message": "PPE video uploaded successfully.",
            "job": job
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )

    finally:
        file.file.close()


# =====================================
# GET ALL JOBS
# =====================================

@router.get("/jobs")
def get_all_ppe_jobs():

    return {
        "success": True,
        "jobs": jm.list_jobs()
    }


# =====================================
# GET JOB STATUS
# =====================================

@router.get("/jobs/{job_id}")
def get_ppe_job(job_id: str):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="PPE job not found."
        )

    return {
        "success": True,
        "job": job
    }


# =====================================
# GET DETECTION RESULTS
# =====================================

@router.get("/jobs/{job_id}/results")
def get_ppe_results(job_id: str):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="PPE job not found."
        )

    if job["status"] != "completed":
        raise HTTPException(
            status_code=409,
            detail="PPE detection is not completed yet."
        )

    return {
        "success": True,
        "results": job["result"]
    }


# =====================================
# WORKER HEARTBEAT
# =====================================

@router.post(
    "/worker/heartbeat",
    dependencies=[Depends(verify_worker_token)]
)
def worker_heartbeat(payload: HeartbeatRequest):

    return {
        "success": True,
        "worker": jm.register_worker(
            worker_id=payload.worker_id,
            model_name=payload.model_name,
            model_version=payload.model_version
        )
    }


# =====================================
# WORKER FETCH NEXT JOB
# =====================================

@router.get(
    "/worker/jobs/next",
    dependencies=[Depends(verify_worker_token)]
)
def worker_next_job(worker_id: str):

    workers = jm.get_worker_status()

    worker_exists = any(
        worker["worker_id"] == worker_id
        and worker["status"] == "online"
        for worker in workers
    )

    if not worker_exists:
        raise HTTPException(
            status_code=403,
            detail="Worker must register before fetching jobs."
        )

    job = jm.claim_next_job(worker_id)

    if not job:
        return {
            "success": True,
            "job": None,
            "message": "No pending PPE jobs."
        }

    return {
        "success": True,
        "job": job
    }


# =====================================
# WORKER DOWNLOAD INPUT VIDEO
# =====================================

@router.get(
    "/worker/jobs/{job_id}/input",
    dependencies=[Depends(verify_worker_token)]
)
def worker_download_video(
    job_id: str,
    worker_id: str
):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if (
        job["status"] != "processing"
        or job["worker_id"] != worker_id
    ):
        raise HTTPException(
            status_code=403,
            detail="This job is not assigned to this worker."
        )

    video_path = jm.get_input_video(job_id)

    if not video_path:
        raise HTTPException(
            status_code=404,
            detail="Input video not found."
        )

    return FileResponse(
        path=video_path,
        filename=Path(video_path).name,
        media_type="application/octet-stream"
    )


# =====================================
# WORKER REPORT PROGRESS
# =====================================

@router.post(
    "/worker/jobs/{job_id}/progress",
    dependencies=[Depends(verify_worker_token)]
)
def worker_progress(
    job_id: str,
    payload: ProgressRequest
):

    updated = jm.update_progress(
        job_id=job_id,
        progress=payload.progress,
        message=payload.message[:300],
        worker_id=payload.worker_id
    )

    if not updated:
        raise HTTPException(
            status_code=409,
            detail="Job not found or not assigned to this worker."
        )

    return {
        "success": True,
        "job": updated
    }


# =====================================
# WORKER UPLOAD ANNOTATED VIDEO
# =====================================

@router.post(
    "/worker/jobs/{job_id}/upload-video",
    dependencies=[Depends(verify_worker_token)]
)
def worker_upload_video(
    job_id: str,
    worker_id: str,
    file: UploadFile = File(...)
):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if (
        job["status"] != "processing"
        or job["worker_id"] != worker_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Job is not assigned to this worker."
        )

    if (
        not file.filename
        or Path(file.filename).suffix.lower() != ".mp4"
    ):
        raise HTTPException(
            status_code=400,
            detail="Only MP4 output videos are supported."
        )

    output_path = jm.get_output_path(
        job_id,
        "annotated.mp4"
    )

    try:
        with output_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    return {
        "success": True,
        "message": "Annotated video uploaded."
    }


# =====================================
# WORKER COMPLETE JOB
# =====================================

@router.post(
    "/worker/jobs/{job_id}/complete",
    dependencies=[Depends(verify_worker_token)]
)
def worker_complete_job(
    job_id: str,
    payload: CompleteRequest
):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    if (
        job["status"] != "processing"
        or job["worker_id"] != payload.worker_id
    ):
        raise HTTPException(
            status_code=403,
            detail="Job is not assigned to this worker."
        )

    try:
        result = normalize_results(
            payload.result,
            job_id
        )

        completed = jm.complete_job(
            job_id,
            result,
            payload.worker_id
        )

        if not completed:
            raise HTTPException(
                status_code=409,
                detail="Could not complete PPE job."
            )

        return {
            "success": True,
            "message": "PPE detection completed.",
            "job": completed
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        )


# =====================================
# WORKER REPORT FAILURE
# =====================================

@router.post(
    "/worker/jobs/{job_id}/fail",
    dependencies=[Depends(verify_worker_token)]
)
def worker_fail_job(
    job_id: str,
    payload: FailRequest
):

    updated = jm.fail_job(
        job_id,
        payload.error[:1000],
        payload.worker_id
    )

    if not updated:
        raise HTTPException(
            status_code=409,
            detail="Could not mark job as failed."
        )

    return {
        "success": True,
        "message": "PPE job marked as failed."
    }


# =====================================
# VIEW ANNOTATED VIDEO
# =====================================

@router.get("/jobs/{job_id}/video")
def get_annotated_video(job_id: str):

    job = jm.get_job(job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    output_path = jm.get_output_path(
        job_id,
        "annotated.mp4"
    )

    if not output_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Annotated video is not available."
        )

    return FileResponse(
        path=output_path,
        media_type="video/mp4",
        filename="annotated.mp4"
    )
