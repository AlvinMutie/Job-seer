from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.models import User, Profile, ApplicationTracker, TailoredResume, CoverLetter, ApplicationStatus
from app.auth import get_current_user
from app.schemas.dashboard import (
    DashboardAnalyticsResponse, 
    StatusCounts, 
    RecentApplicationItem,
    RecentTailoredItem,
    RecentCoverLetterItem
)
from app.services.resume_intelligence import resume_intelligence_service

router = APIRouter(tags=["Dashboard"])


@router.get("/dashboard/analytics", response_model=DashboardAnalyticsResponse)
async def get_dashboard_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Computes and retrieves aggregated Command Center intelligence analytics for the current user.
    """
    # 1. Fetch user's tracked applications
    apps = (
        db.query(ApplicationTracker)
        .options(joinedload(ApplicationTracker.job))
        .filter(ApplicationTracker.user_id == current_user.id)
        .order_by(ApplicationTracker.id.desc())
        .all()
    )

    total_applications = len(apps)

    status_counts = StatusCounts()
    total_score_sum = 0.0
    scored_count = 0

    for app in apps:
        if app.match_score is not None:
            total_score_sum += app.match_score
            scored_count += 1

        val = app.status.value if hasattr(app.status, 'value') else app.status
        if val == ApplicationStatus.NOT_APPLIED.value:
            status_counts.not_applied += 1
        elif val == ApplicationStatus.APPLIED.value:
            status_counts.applied += 1
        elif val == ApplicationStatus.INTERVIEW.value:
            status_counts.interview += 1
        elif val == ApplicationStatus.OFFER.value:
            status_counts.offer += 1
        elif val == ApplicationStatus.REJECTED.value:
            status_counts.rejected += 1

    average_match_score = round(total_score_sum / scored_count, 1) if scored_count > 0 else 0.0

    # 2. ATS Health Check for User's Resume
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    ats_health_score = None
    ats_classification = "No Resume Uploaded"

    if profile and profile.resume_text:
        report = resume_intelligence_service.analyze_resume_health(profile.resume_text)
        ats_health_score = report["health_score"]
        ats_classification = report["classification"]

    # 3. Counts for saved tailored resumes and cover letters
    tailored_resumes = (
        db.query(TailoredResume)
        .filter(TailoredResume.user_id == current_user.id)
        .order_by(TailoredResume.created_at.desc())
        .all()
    )
    tailored_count = len(tailored_resumes)

    cover_letters = (
        db.query(CoverLetter)
        .filter(CoverLetter.user_id == current_user.id)
        .order_by(CoverLetter.created_at.desc())
        .all()
    )
    cover_letters_count = len(cover_letters)

    # 4. Recent Items Payloads
    recent_apps = []
    for app in apps[:5]:
        job = app.job
        recent_apps.append(RecentApplicationItem(
            id=app.id,
            job_id=app.job_id,
            title=job.title if job else "Unknown Position",
            company=job.company if job else "Unknown Company",
            status=app.status.value if hasattr(app.status, 'value') else app.status,
            score=app.match_score,
            applied_date=app.applied_date.strftime("%Y-%m-%d") if app.applied_date else (app.applied_at.strftime("%Y-%m-%d") if app.applied_at else None),
            interview_date=app.interview_date.strftime("%Y-%m-%d") if app.interview_date else None
        ))

    recent_tailored = [
        RecentTailoredItem(
            id=t.id,
            job_id=t.job_id,
            job_title=t.job_title,
            company=t.company,
            version=t.version,
            match_score=t.match_score,
            created_at=t.created_at
        ) for t in tailored_resumes[:3]
    ]

    recent_letters = [
        RecentCoverLetterItem(
            id=c.id,
            job_id=c.job_id,
            job_title=c.job_title,
            company=c.company,
            tone=c.tone,
            version=c.version,
            created_at=c.created_at
        ) for c in cover_letters[:3]
    ]

    return DashboardAnalyticsResponse(
        total_applications=total_applications,
        status_counts=status_counts,
        average_match_score=average_match_score,
        ats_health_score=ats_health_score,
        ats_classification=ats_classification,
        tailored_resumes_count=tailored_count,
        cover_letters_count=cover_letters_count,
        recent_applications=recent_apps,
        recent_tailored_resumes=recent_tailored,
        recent_cover_letters=recent_letters
    )
