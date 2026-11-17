
import uuid
import shutil
import sqlite3
import json

from pathlib import Path
from datetime import datetime, timezone


# ==============================
# DIRECTORY CONFIGURATION
# ==============================

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data" / "ppe"
UPLOAD_DIR = DATA_DIR / "uploads"
OUTPUT_DIR = DATA_DIR / "outputs"

DB_PATH = DATA_DIR / "jobs.db"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".mp4", ".avi", ".mov", ".mkv"
}


# ==============================
# DATABASE CONNECTION
# ==============================

def get_db_connection():
    connection = sqlite3.connect(
        DB_PATH,
        timeout=30
    )

    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA journal_mode=WAL")

    return connection


def current_time():
    return datetime.now(timezone.utc).isoformat()


# ==============================
# DATABASE INITIALIZATION
# ==============================

def initialize_database():

    with get_db_connection() as connection:

        connection.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                job_id TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                filename TEXT NOT NULL,
                video_path TEXT NOT NULL,
                worker_id TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                progress INTEGER DEFAULT 0,
                message TEXT,
                result TEXT,
                error TEXT
            )
        """)

        connection.execute("""
            CREATE TABLE IF NOT EXISTS workers (
                worker_id TEXT PRIMARY KEY,
                status TEXT NOT NULL,
                model_name TEXT,
                model_version TEXT,
                last_seen TEXT NOT NULL
            )
        """)

        connection.commit()


initialize_database()


# ==============================
# DATABASE ROW CONVERSION
# ==============================

def row_to_dict(row):

    if row is None:
        return None

    job = dict(row)

    if job.get("result"):
        job["result"] = json.loads(job["result"])
    else:
        job["result"] = None

    return job


# ==============================
# SAVE UPLOADED VIDEO
# ==============================

def save_video(upload_file):

    original_name = Path(
        upload_file.filename or ""
    ).name

    extension = Path(
        original_name
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise ValueError(
            "Unsupported video format. "
            "Allowed: MP4, AVI, MOV, MKV."
        )

    job_id = str(uuid.uuid4())

    destination = (
        UPLOAD_DIR / f"{job_id}{extension}"
    )

    with destination.open("wb") as buffer:
        shutil.copyfileobj(
            upload_file.file,
            buffer
        )

    return job_id, destination


# ==============================
# CREATE JOB
# ==============================

def create_job(upload_file):

    job_id, video_path = save_video(upload_file)

    now = current_time()

    job = {
        "job_id": job_id,
        "status": "queued",
        "filename": Path(
            upload_file.filename
        ).name,
        "video_path": str(video_path),
        "worker_id": None,
        "created_at": now,
        "updated_at": now,
        "progress": 0,
        "message": "Waiting for PPE worker.",
        "result": None,
        "error": None
    }

    with get_db_connection() as connection:

        connection.execute("""
            INSERT INTO jobs (
                job_id,
                status,
                filename,
                video_path,
                worker_id,
                created_at,
                updated_at,
                progress,
                message,
                result,
                error
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            job["job_id"],
            job["status"],
            job["filename"],
            job["video_path"],
            None,
            job["created_at"],
            job["updated_at"],
            0,
            job["message"],
            None,
            None
        ))

        connection.commit()

    return job


# ==============================
# GET JOB
# ==============================

def get_job(job_id):

    with get_db_connection() as connection:

        row = connection.execute("""
            SELECT * FROM jobs
            WHERE job_id = ?
        """, (job_id,)).fetchone()

    return row_to_dict(row)


# ==============================
# LIST ALL JOBS
# ==============================

def list_jobs():

    with get_db_connection() as connection:

        rows = connection.execute("""
            SELECT * FROM jobs
            ORDER BY created_at DESC
        """).fetchall()

    return [
        row_to_dict(row)
        for row in rows
    ]


# ==============================
# WORKER REGISTRATION / HEARTBEAT
# ==============================

def register_worker(
    worker_id,
    model_name=None,
    model_version=None
):

    now = current_time()

    with get_db_connection() as connection:

        connection.execute("""
            INSERT INTO workers (
                worker_id,
                status,
                model_name,
                model_version,
                last_seen
            )
            VALUES (?, ?, ?, ?, ?)

            ON CONFLICT(worker_id)
            DO UPDATE SET
                status = 'online',
                model_name = excluded.model_name,
                model_version = excluded.model_version,
                last_seen = excluded.last_seen
        """, (
            worker_id,
            "online",
            model_name,
            model_version,
            now
        ))

        connection.commit()

    return {
        "worker_id": worker_id,
        "status": "online",
        "last_seen": now
    }


def get_worker_status():

    with get_db_connection() as connection:

        rows = connection.execute("""
            SELECT * FROM workers
            ORDER BY last_seen DESC
        """).fetchall()

    workers = []

    now = datetime.now(timezone.utc)

    for row in rows:

        worker = dict(row)

        last_seen = datetime.fromisoformat(
            worker["last_seen"]
        )

        online = (
            (now - last_seen).total_seconds() < 60
        )

        worker["status"] = (
            "online" if online else "offline"
        )

        workers.append(worker)

    return workers


# ==============================
# CLAIM NEXT PENDING JOB
# ==============================

def claim_next_job(worker_id):

    with get_db_connection() as connection:

        connection.execute("BEGIN IMMEDIATE")

        row = connection.execute("""
            SELECT * FROM jobs
            WHERE status = 'queued'
            ORDER BY created_at ASC
            LIMIT 1
        """).fetchone()

        if row is None:
            connection.commit()
            return None

        job_id = row["job_id"]

        now = current_time()

        connection.execute("""
            UPDATE jobs
            SET
                status = 'processing',
                worker_id = ?,
                progress = 0,
                message = ?,
                updated_at = ?
            WHERE job_id = ?
            AND status = 'queued'
        """, (
            worker_id,
            "PPE inference started.",
            now,
            job_id
        ))

        connection.commit()

    return get_job(job_id)


# ==============================
# UPDATE JOB PROGRESS
# ==============================

def update_progress(
    job_id,
    progress,
    message=None,
    worker_id=None
):

    progress = max(
        0,
        min(100, int(progress))
    )

    now = current_time()

    with get_db_connection() as connection:

        if worker_id:

            cursor = connection.execute("""
                UPDATE jobs
                SET
                    progress = ?,
                    message = ?,
                    updated_at = ?
                WHERE job_id = ?
                AND worker_id = ?
                AND status = 'processing'
            """, (
                progress,
                message,
                now,
                job_id,
                worker_id
            ))

        else:

            cursor = connection.execute("""
                UPDATE jobs
                SET
                    progress = ?,
                    message = ?,
                    updated_at = ?
                WHERE job_id = ?
                AND status = 'processing'
            """, (
                progress,
                message,
                now,
                job_id
            ))

        connection.commit()

        if cursor.rowcount == 0:
            return None

    return get_job(job_id)


# ==============================
# COMPLETE JOB
# ==============================

def complete_job(
    job_id,
    result,
    worker_id
):

    now = current_time()

    with get_db_connection() as connection:

        cursor = connection.execute("""
            UPDATE jobs
            SET
                status = 'completed',
                progress = 100,
                message = 'PPE detection completed.',
                result = ?,
                error = NULL,
                updated_at = ?
            WHERE job_id = ?
            AND worker_id = ?
            AND status = 'processing'
        """, (
            json.dumps(result),
            now,
            job_id,
            worker_id
        ))

        connection.commit()

        if cursor.rowcount == 0:
            return None

    return get_job(job_id)


# ==============================
# FAIL JOB
# ==============================

def fail_job(
    job_id,
    error,
    worker_id
):

    now = current_time()

    with get_db_connection() as connection:

        cursor = connection.execute("""
            UPDATE jobs
            SET
                status = 'failed',
                message = 'PPE detection failed.',
                error = ?,
                updated_at = ?
            WHERE job_id = ?
            AND worker_id = ?
            AND status = 'processing'
        """, (
            str(error),
            now,
            job_id,
            worker_id
        ))

        connection.commit()

        if cursor.rowcount == 0:
            return None

    return get_job(job_id)


# ==============================
# GET INPUT VIDEO
# ==============================

def get_input_video(job_id):

    job = get_job(job_id)

    if not job:
        return None

    video_path = Path(job["video_path"])

    if not video_path.exists():
        return None

    return video_path


# ==============================
# OUTPUT FILE PATH
# ==============================

def get_output_path(job_id, filename):

    safe_filename = Path(filename).name

    job_dir = OUTPUT_DIR / job_id
    job_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    return job_dir / safe_filename
