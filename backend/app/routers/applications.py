import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.models import User, Job, ApplicationTracker, ApplicationStatus
from app.auth import get_current_user
from app.schemas.applications import ApplicationCreate

router = APIRouter(tags=["Applications"])


@router.get("/applications")
async def get_applications(
    status_filter: Optional[str] = Query(default=None, alias="status"),
    search: Optional[str] = Query(default=None),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch tracked applications for the current user with optional status filtering, keyword search, and pagination.
    """
    query = (
        db.query(ApplicationTracker)
        .options(joinedload(ApplicationTracker.job))
        .filter(ApplicationTracker.user_id == current_user.id)
    )

    # 1. Status Filter
    if status_filter:
        target_status = None
        status_clean = status_filter.strip().lower().replace("_", " ")
        for s in ApplicationStatus:
            if s.value.lower() == status_clean or s.name.lower() == status_clean:
                target_status = s
                break
        if not target_status:
            valid_statuses = ", ".join([s.value for s in ApplicationStatus])
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status filter '{status_filter}'. Valid statuses are: {valid_statuses}"
            )
        query = query.filter(ApplicationTracker.status == target_status)

    # 2. Keyword Search Filter (title, company, notes)
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.join(Job, ApplicationTracker.job_id == Job.id, isouter=True).filter(
            or_(
                Job.title.ilike(term),
                Job.company.ilike(term),
                ApplicationTracker.notes.ilike(term)
            )
        )

    # 3. Deterministic Ordering (Newest applications first)
    query = query.order_by(ApplicationTracker.id.desc())

    # 4. Limit and Offset Pagination
    apps = query.offset(offset).limit(limit).all()

    results = []
    for app in apps:
        job = app.job
        results.append({
            "id": app.id,
            "job_id": app.job_id,
            "title": job.title if job else "Unknown Position",
            "company": job.company if job else "Unknown Company",
            "status": app.status.value if hasattr(app.status, 'value') else app.status,
            "score": app.match_score,
            "date": app.applied_at.strftime("%Y-%m-%d") if app.applied_at else "Recently",
            "notes": app.notes
        })
    return results


@router.post("/applications")
async def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if exists
    existing = db.query(ApplicationTracker).filter(
        ApplicationTracker.user_id == current_user.id,
        ApplicationTracker.job_id == app_data.job_id
    ).first()
    
    if existing:
        existing.status = app_data.status
        db.commit()
        return {"message": "Application updated"}
    
    new_app = ApplicationTracker(
        user_id=current_user.id,
        job_id=app_data.job_id,
        status=app_data.status,
        match_score=app_data.match_score,
        notes=app_data.notes,
        applied_at=datetime.datetime.now(datetime.timezone.utc)
    )
    db.add(new_app)
    db.commit()
    return {"message": "Application tracked successfully"}
