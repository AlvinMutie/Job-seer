from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.job_service import job_service

router = APIRouter(tags=["Jobs"])


@router.get("/jobs")
async def get_jobs(
    location: Optional[str] = None, 
    remote_status: Optional[str] = None, 
    experience_level: Optional[str] = None,
    keywords: Optional[str] = None,
    db: Session = Depends(get_db)
):
    jobs = await job_service.get_jobs(db, location, remote_status, experience_level, keywords)
    return jobs
