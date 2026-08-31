from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User
from app.auth import get_current_user
from app.services.matching_engine import MatchingEngine
from app.services.job_service import job_service
from app.services.cover_letter import cover_letter_generator
from app.services.tailor_service import tailor_service

router = APIRouter(tags=["Matching"])
engine = MatchingEngine()


@router.post("/match")
async def match_resume(
    resume_text: str = Form(...), 
    job_id: int = Form(...), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculates multi-factor explainable match score between candidate resume and target job listing.
    """
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
        
    job_content = f"{job.skills_required} {job.description}"
    
    candidate_role = current_user.profile.preferred_role if (current_user.profile and current_user.profile.preferred_role) else None
    candidate_experience = current_user.profile.experience_level if (current_user.profile and current_user.profile.experience_level) else None
    
    result = engine.calculate_v2_match_score(
        resume_text=resume_text,
        job_description=job_content,
        candidate_role=candidate_role,
        candidate_experience=candidate_experience,
        job_title=job.title,
        job_experience=job.experience_level
    )
    
    return result


@router.post("/generate-cover-letter")
async def generate_cover_letter_api(
    job_id: int = Form(...),
    candidate_name: str = Form(...),
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    skills = engine.extract_skills(resume_text)
    letter = cover_letter_generator.generate(
        job.title, job.company, job.description, candidate_name, skills
    )
    return {"cover_letter": letter}


@router.post("/tailor-resume")
async def tailor_resume_api(
    job_id: int = Form(...),
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    job_skills = engine.extract_skills(job.description)
    resume_skills = engine.extract_skills(resume_text)
    
    missing_skills = list(set(job_skills) - set(resume_skills))
    
    suggestions = tailor_service.generate_suggestions(
        resume_text, job.title, missing_skills
    )
    
    return {
        "job_title": job.title,
        "company": job.company,
        "suggestions": suggestions
    }
