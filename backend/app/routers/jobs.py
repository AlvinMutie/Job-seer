from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.job_service import job_service

router = APIRouter(tags=["Jobs"])


@router.get("/jobs")
async def get_jobs(
    location: Optional[str] = Query(default=None), 
    remote_status: Optional[str] = Query(default=None), 
    experience_level: Optional[str] = Query(default=None),
    keywords: Optional[str] = Query(default=None),
    search: Optional[str] = Query(default=None),
    sort_by: str = Query(default="posted_at"),
    order: str = Query(default="desc"),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db)
):
    """
    Fetch jobs repository listing with filtering, keyword search, safe column sorting, and limit/offset pagination.
    """
    jobs = await job_service.get_jobs(
        db=db,
        location=location,
        remote_status=remote_status,
        experience_level=experience_level,
        keywords=keywords,
        search=search,
        sort_by=sort_by,
        order=order,
        limit=limit,
        offset=offset
    )
    return jobs
