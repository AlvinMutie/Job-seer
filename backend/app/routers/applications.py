import datetime
from typing import Optional, List
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.models import User, Job, ApplicationTracker, ApplicationStatus
from app.auth import get_current_user
from app.schemas.applications import ApplicationCreate, ApplicationUpdate, ApplicationResponse

router = APIRouter(tags=["Applications"])


def parse_date_str(date_str: Optional[str]) -> Optional[datetime.datetime]:
    if not date_str or not date_str.strip():
        return None
    try:
        # Accepts YYYY-MM-DD or ISO 8601 strings
        clean_str = date_str.strip().split("T")[0]
        return datetime.datetime.strptime(clean_str, "%Y-%m-%d")
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid date format '{date_str}'. Expected format YYYY-MM-DD."
        )


def validate_application_url(url: Optional[str]) -> Optional[str]:
    if not url or not url.strip():
        return None
    clean_url = url.strip()
    parsed = urlparse(clean_url)
    if parsed.scheme.lower() not in ["http", "https"]:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid URL scheme '{parsed.scheme}'. Only http and https URLs are allowed."
        )
    return clean_url


def match_status_enum(status_input: str) -> ApplicationStatus:
    status_clean = status_input.strip().lower().replace("_", " ")
    for s in ApplicationStatus:
        if s.value.lower() == status_clean or s.name.lower() == status_clean:
            return s
    valid_statuses = ", ".join([s.value for s in ApplicationStatus])
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=f"Invalid status '{status_input}'. Valid statuses are: {valid_statuses}"
    )


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
        target_status = match_status_enum(status_filter)
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
            "applied_date": app.applied_date.strftime("%Y-%m-%d") if app.applied_date else (app.applied_at.strftime("%Y-%m-%d") if app.applied_at else None),
            "interview_date": app.interview_date.strftime("%Y-%m-%d") if app.interview_date else None,
            "follow_up_date": app.follow_up_date.strftime("%Y-%m-%d") if app.follow_up_date else None,
            "application_url": app.application_url,
            "notes": app.notes
        })
    return results


@router.get("/applications/{app_id}")
async def get_application(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single tracked application by ID for the current authenticated user.
    """
    app = (
        db.query(ApplicationTracker)
        .options(joinedload(ApplicationTracker.job))
        .filter(ApplicationTracker.id == app_id, ApplicationTracker.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked application not found."
        )

    job = app.job
    return {
        "id": app.id,
        "job_id": app.job_id,
        "title": job.title if job else "Unknown Position",
        "company": job.company if job else "Unknown Company",
        "status": app.status.value if hasattr(app.status, 'value') else app.status,
        "score": app.match_score,
        "date": app.applied_at.strftime("%Y-%m-%d") if app.applied_at else "Recently",
        "applied_date": app.applied_date.strftime("%Y-%m-%d") if app.applied_date else (app.applied_at.strftime("%Y-%m-%d") if app.applied_at else None),
        "interview_date": app.interview_date.strftime("%Y-%m-%d") if app.interview_date else None,
        "follow_up_date": app.follow_up_date.strftime("%Y-%m-%d") if app.follow_up_date else None,
        "application_url": app.application_url,
        "notes": app.notes
    }


@router.post("/applications")
async def create_application(
    app_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_status = match_status_enum(app_data.status)
    applied_dt = parse_date_str(app_data.applied_date)
    interview_dt = parse_date_str(app_data.interview_date)
    follow_up_dt = parse_date_str(app_data.follow_up_date)
    app_url = validate_application_url(app_data.application_url)

    job = db.query(Job).filter(Job.id == app_data.job_id).first()
    if not app_url and job and getattr(job, "application_url", None):
        app_url = job.application_url

    existing = db.query(ApplicationTracker).filter(
        ApplicationTracker.user_id == current_user.id,
        ApplicationTracker.job_id == app_data.job_id
    ).first()
    
    if existing:
        existing.status = target_status
        if app_data.notes is not None:
            existing.notes = app_data.notes
        if applied_dt is not None:
            existing.applied_date = applied_dt
        if interview_dt is not None:
            existing.interview_date = interview_dt
        if follow_up_dt is not None:
            existing.follow_up_date = follow_up_dt
        if app_url is not None:
            existing.application_url = app_url
        db.commit()
        return {"message": "Application updated"}
    
    new_app = ApplicationTracker(
        user_id=current_user.id,
        job_id=app_data.job_id,
        status=target_status,
        match_score=app_data.match_score,
        notes=app_data.notes,
        applied_at=datetime.datetime.now(datetime.timezone.utc),
        applied_date=applied_dt,
        interview_date=interview_dt,
        follow_up_date=follow_up_dt,
        application_url=app_url
    )
    db.add(new_app)
    db.commit()
    return {"message": "Application tracked successfully"}


@router.patch("/applications/{app_id}")
async def update_application(
    app_id: int,
    update_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates tracked application details (status, applied_date, interview_date, follow_up_date, application_url, notes).
    """
    app = (
        db.query(ApplicationTracker)
        .filter(ApplicationTracker.id == app_id, ApplicationTracker.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked application not found."
        )

    if update_data.status is not None:
        app.status = match_status_enum(update_data.status)

    if update_data.notes is not None:
        app.notes = update_data.notes

    if update_data.applied_date is not None:
        app.applied_date = parse_date_str(update_data.applied_date)

    if update_data.interview_date is not None:
        app.interview_date = parse_date_str(update_data.interview_date)

    if update_data.follow_up_date is not None:
        app.follow_up_date = parse_date_str(update_data.follow_up_date)

    if update_data.application_url is not None:
        app.application_url = validate_application_url(update_data.application_url)

    db.commit()
    return {"message": "Application updated successfully"}


@router.delete("/applications/{app_id}")
async def delete_application(
    app_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes a tracked application belonging to the authenticated user.
    """
    app = (
        db.query(ApplicationTracker)
        .filter(ApplicationTracker.id == app_id, ApplicationTracker.user_id == current_user.id)
        .first()
    )
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracked application not found."
        )

    db.delete(app)
    db.commit()
    return {"message": "Application deleted successfully"}
