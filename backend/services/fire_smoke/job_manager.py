
import uuid
import shutil
import threading
import sqlite3
import json

from collections import deque
from pathlib import Path
from datetime import datetime, timezone


# Directory Configuration
BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data" / "fire_smoke"
UPLOAD_DIR = DATA_DIR / "uploads"
OUTPUT_DIR = DATA_DIR / "outputs"
DB_PATH = DATA_DIR / "jobs.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# Job Storage
_jobs_lock = threading.Lock()
_pending_jobs = deque()

ALLOWED_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}


# Database Connection
def get_db_connection():
    connection = sqlite3.connect(DB_PATH, timeout=30)
    connection.row_factory = sqlite3.Row
    return connection


# Initialize Database
def initialize_database():
    with get_db_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                job_id TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                filename TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                progress INTEGER DEFAULT 0,
                message TEXT,
                result TEXT,
                error TEXT
            )
        """)

        connection.commit()


# Convert database row into dictionary
def row_to_job(row):
    if row is None:
        return None

    job = dict(row)

    if job["result"]:
        job["result"] = json.loads(job["result"])
    else:
        job["result"] = None

    return job


# Restore pending jobs after backend restart
def restore_pending_jobs():
    with get_db_connection() as connection:
        rows = connection.execute("""
            SELECT job_id
            FROM jobs
            WHERE status = 'queued'
            ORDER BY created_at ASC
        """).fetchall()

    with _jobs_lock:
        _pending_jobs.clear()
        _pending_jobs.extend(row["job_id"] for row in rows)


# Create database when this module loads
initialize_database()
restore_pending_jobs()


# Create Job
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

    with get_db_connection() as connection:
        connection.execute("""
            INSERT INTO jobs (
                job_id, status, filename,
                created_at, updated_at, progress,
                message, result, error
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job["job_id"],
            job["status"],
            job["filename"],
            job["created_at"],
            job["updated_at"],
            job["progress"],
            job["message"],
            None,
            job["error"]
        ))

        connection.commit()

    return job.copy()


# Get Job
def get_job(job_id: str):
    """Get job details."""

    with get_db_connection() as connection:
        row = connection.execute(
            "SELECT * FROM jobs WHERE job_id = ?",
            (job_id,)
        ).fetchone()

    return row_to_job(row)


# Update Job
def update_job(job_id: str, **updates):
    """Update job status or result."""

    allowed_fields = {
        "status",
        "filename",
        "progress",
        "message",
        "result",
        "error"
    }

    updates = {
        key: value
        for key, value in updates.items()
        if key in allowed_fields
    }

    if not updates:
        return get_job(job_id)

    updates["updated_at"] = datetime.now(
        timezone.utc
    ).isoformat()

    if "result" in updates:
        updates["result"] = (
            json.dumps(updates["result"])
            if updates["result"] is not None
            else None
        )

    columns = ", ".join(
        f"{column} = ?" for column in updates
    )

    values = list(updates.values())
    values.append(job_id)

    with get_db_connection() as connection:
        cursor = connection.execute(
            f"UPDATE jobs SET {columns} WHERE job_id = ?",
            values
        )
        connection.commit()

        if cursor.rowcount == 0:
            return None

    return get_job(job_id)


# Save Uploaded Video
def save_video(upload_file) -> tuple[str, str]:
    """Save uploaded video safely."""

    original_name = Path(
        upload_file.filename or ""
    ).name

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


# Output File Path
def get_output_path(job_id: str, filename: str) -> Path:
    """Build a safe output path for a job."""

    safe_name = Path(filename).name
    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    return job_dir / safe_name


# List All Jobs
def list_jobs():
    """Return all jobs, newest first."""

    with get_db_connection() as connection:
        rows = connection.execute("""
            SELECT * FROM jobs
            ORDER BY created_at DESC
        """).fetchall()

    return [row_to_job(row) for row in rows]


# Queue Job
def queue_job(job_id: str):
    """Add an uploaded job to the inference queue."""

    with _jobs_lock:
        job = get_job(job_id)

        if not job:
            return False

        if job["status"] in {"completed", "failed"}:
            return False

        updated = update_job(
            job_id,
            status="queued",
            message="Waiting for inference worker."
        )

        if not updated:
            return False

        if job_id not in _pending_jobs:
            _pending_jobs.append(job_id)

    return True


# Get Next Job
def get_next_job():
    """Return the next queued job to the worker."""

    with _jobs_lock:
        while _pending_jobs:
            job_id = _pending_jobs.popleft()
            job = get_job(job_id)

            if not job or job["status"] != "queued":
                continue

            updated = update_job(
                job_id,
                status="processing",
                message="Inference worker is processing the video."
            )

            return updated

    return None


# Get Input Video
def get_input_video(job_id: str):
    """Get uploaded video path for a job."""

    job = get_job(job_id)

    if not job:
        return None

    video_path = UPLOAD_DIR / job["filename"]

    if not video_path.is_file():
        return None

    return str(video_path)


# Complete Job
def complete_job(job_id: str, result: dict):
    """Save inference results and mark job completed."""

    return update_job(
        job_id,
        status="completed",
        progress=100,
        result=result,
        error=None,
        message="Inference completed."
    )


# Fail Job
def fail_job(job_id: str, error: str):
    """Mark a job as failed."""

    return update_job(
        job_id,
        status="failed",
        error=error,
        message="Video inference failed."
    )
