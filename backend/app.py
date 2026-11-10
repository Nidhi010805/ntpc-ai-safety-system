
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.safety_agent import (
    router as safety_agent_router
)

from routes.fire_smoke import (
    router as fire_smoke_router
)


app = FastAPI(
    title="HeightX-Safe Backend",
    description=(
        "AI-powered industrial safety backend with "
        "local safety knowledge retrieval, "
        "AI Safety Agent, and Fire & Smoke Detection."
    ),
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Safety Agent API
app.include_router(
    safety_agent_router,
    prefix="/api/safety-agent",
    tags=["Safety Agent"]
)


# Fire & Smoke Detection API
app.include_router(
    fire_smoke_router,
    prefix="/api/fire-smoke",
    tags=["Fire & Smoke Detection"]
)


@app.get("/")
def root():
    return {
        "success": True,
        "service": "HeightX-Safe Backend",
        "status": "running",
        "version": "1.0.0",
        "message": (
            "HeightX-Safe Industrial Safety "
            "AI Backend is running."
        )
    }


@app.get("/api/health")
def health():
    return {
        "success": True,
        "status": "ok",
        "service": "heightx-safe-backend",
        "safety_agent": "/api/safety-agent/chat",
        "fire_smoke": "/api/fire-smoke/health",
        "documentation": "/docs"
    }
