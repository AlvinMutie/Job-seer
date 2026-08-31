from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database import get_db
from app.core.config import settings
from app.core.errors import APIException, ErrorCode

router = APIRouter(tags=["Health"])


@router.get("/health")
async def health_liveness():
    """
    Liveness Health Endpoint:
    Indicates that the Job Seer application process is active and running.
    """
    return {
        "status": "ok",
        "app": "Job Seer",
        "environment": settings.ENVIRONMENT
    }


@router.get("/health/ready")
async def health_readiness(db: Session = Depends(get_db)):
    """
    Readiness Health Endpoint:
    Verifies backend database connection health before routing user traffic.
    """
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected",
            "environment": settings.ENVIRONMENT
        }
    except Exception as e:
        raise APIException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            error_code=ErrorCode.INTERNAL_ERROR,
            message="Database connectivity check failed. Service unavailable.",
            details={"error_type": "DatabaseConnectionError"}
        )
