
import os

# Backend configuration
BACKEND_URL = os.getenv(
    "PPE_BACKEND_URL",
    "http://localhost:8001"
).rstrip("/")

API_BASE_URL = f"{BACKEND_URL}/api/ppe"

# Worker identity
WORKER_ID = os.getenv(
    "PPE_WORKER_ID",
    "ppe-worker-01"
)

# Authentication
WORKER_TOKEN = os.getenv(
    "PPE_WORKER_API_TOKEN",
    ""
)

# Model information
MODEL_NAME = os.getenv(
    "PPE_MODEL_NAME",
    "PPE-Detection"
)

MODEL_VERSION = os.getenv(
    "PPE_MODEL_VERSION",
    "1.0.0"
)

# Worker settings
POLL_INTERVAL = int(
    os.getenv("PPE_POLL_INTERVAL", "5")
)

HEARTBEAT_INTERVAL = int(
    os.getenv("PPE_HEARTBEAT_INTERVAL", "20")
)

# Local storage
BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DOWNLOAD_DIR = os.path.join(
    BASE_DIR,
    "downloads"
)

OUTPUT_DIR = os.path.join(
    BASE_DIR,
    "outputs"
)

os.makedirs(DOWNLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Video extensions
SUPPORTED_VIDEO_EXTENSIONS = (
    ".mp4",
    ".avi",
    ".mov",
    ".mkv"
)
