from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.auth import get_current_user
from app.services.job_service import job_service
from app.services.external_job_service import external_job_service

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


@router.post("/jobs/sync-external")
async def sync_external_jobs_endpoint(
    keywords: Optional[str] = Query(default=None),
    location: Optional[str] = Query(default=None),
    country: Optional[str] = Query(default="us"),
    max_results: int = Query(default=15, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Query external job boards (Adzuna) for live real-world postings, normalize, deduplicate, and persist to repository.
    Automatically falls back to candidate's target role or extracted skills if keywords are not specified.
    """
    search_keywords = keywords
    if not search_keywords and current_user.profile:
        if current_user.profile.preferred_role:
            search_keywords = current_user.profile.preferred_role
        elif current_user.profile.skills:
            search_keywords = current_user.profile.skills.split(",")[0].strip()
    
    if not search_keywords:
        search_keywords = "Software Developer"

    search_location = location
    if not search_location and current_user.profile and current_user.profile.location_preference:
        search_location = current_user.profile.location_preference

    try:
        result = await external_job_service.sync_external_jobs(
            db=db,
            keywords=search_keywords,
            location=search_location,
            country=country,
            max_results=max_results
        )
        return result
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(err)
        )
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"External job board communication error: {str(err)}"
        )

