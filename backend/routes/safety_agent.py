from fastapi import APIRouter, Query
from pydantic import BaseModel, Field

from services.rag_service import search_documents
from services.safety_service import (
    answer_safety_question,
    detect_category
)


router = APIRouter()


class SafetyRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=2,
        max_length=2000
    )

    zone: str | None = Field(
        default=None,
        max_length=200
    )


@router.post("/chat")
def safety_chat(
    request: SafetyRequest
):
    message = request.message.strip()

    zone = (
        request.zone.strip()
        if request.zone
        else None
    )

    result = answer_safety_question(
        message=message,
        zone=zone
    )

    return {
        "success": True,
        "query": message,
        "zone": zone,
        "data": result
    }


@router.get("/search")
def search_safety_documents(
    query: str = Query(
        ...,
        min_length=2,
        max_length=2000
    )
):
    clean_query = query.strip()

    category = detect_category(
        clean_query
    )

    results = search_documents(
        query=clean_query,
        limit=10,
        category=category
    )

    return {
        "success": True,
        "query": clean_query,
        "detected_category": category,
        "total_results": len(results),
        "results": results
    }


@router.get("/health")
def safety_agent_health():
    return {
        "success": True,
        "service": "safety-agent",
        "status": "running"
    }