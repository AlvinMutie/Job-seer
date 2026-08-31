import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Job, ApplicationTracker
from app.auth import get_current_user
from app.schemas.applications import ApplicationCreate

router = APIRouter(tags=["Applications"])


@router.get("/applications")
async def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    apps = db.query(ApplicationTracker).filter(ApplicationTracker.user_id == current_user.id).all()
    results = []
    for app in apps:
        job = db.query(Job).filter(Job.id == app.job_id).first()
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
