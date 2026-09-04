import os
import logging
import fitz  # PyMuPDF
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Profile, Job, TailoredResume, CoverLetter
from app.auth import get_current_user
from app.schemas.profile import (
    ProfileUpdate, 
    ResumeHealthResponse, 
    TailoredResumeResponse, 
    TailoredResumeCompareResponse,
    CoverLetterResponse
)
from app.utils.file_handling import validate_upload_file, save_user_resume
from app.services.resume_intelligence import resume_intelligence_service
from app.services.matching_engine import MatchingEngine
from app.services.job_service import job_service
from app.services.tailor_service import tailor_service
from app.services.cover_letter import cover_letter_generator, VALID_TONES

router = APIRouter(tags=["Profile"])
engine = MatchingEngine()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    try:
        if ext == ".pdf":
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
            doc.close()
        elif ext in [".docx", ".doc"]:
            import docx2txt
            text = docx2txt.process(file_path)
        elif ext in [".txt", ".md"]:
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        else:
            logging.warning(f"Unsupported file extension: {ext}")
    except Exception as e:
        logging.error(f"Error extracting text from {file_path}: {e}")
    return text.strip()


@router.post("/profile")
async def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    profile.preferred_role = profile_data.preferred_role
    profile.skills = profile_data.skills
    profile.experience_level = profile_data.experience_level
    profile.location_preference = profile_data.location_preference
    profile.salary_expectation = profile_data.salary_expectation
    
    current_user.is_profile_complete = 1
    db.commit()
    return {"message": "Profile updated successfully"}


@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    validate_upload_file(file)

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    file_path = save_user_resume(file, current_user.id, profile.resume_path, UPLOAD_DIR)
    
    try:
        extracted_text = extract_text(file_path)
    except Exception as e:
        if os.path.isfile(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from document. File may be corrupt or encrypted."
        )

    profile.resume_path = file_path
    profile.resume_text = extracted_text
    profile.has_resume = True
    db.commit()
    
    return {
        "message": "Resume uploaded and parsed successfully", 
        "filename": file.filename,
        "text_preview": extracted_text[:200] + "..." if extracted_text else "No text extracted"
    }


@router.get("/resume/health")
async def get_resume_health(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile or not profile.resume_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No uploaded resume found for user. Please upload a resume first."
        )

    analysis = resume_intelligence_service.analyze_resume_health(profile.resume_text)
    return analysis


# ==========================================
# RESUME TAILORING V2 & PERSISTENCE (P3-04)
# ==========================================

@router.post("/resume/tailor", response_model=TailoredResumeResponse)
async def generate_and_save_tailored_resume(
    job_id: int = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile or not profile.resume_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No uploaded resume found for user. Please upload a resume first."
        )

    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target job listing not found."
        )

    latest = (
        db.query(TailoredResume)
        .filter(TailoredResume.user_id == current_user.id, TailoredResume.job_id == job_id)
        .order_by(TailoredResume.version.desc())
        .first()
    )
    next_version = (latest.version + 1) if latest else 1

    job_skills = engine.extract_skills(job.description)
    resume_skills = engine.extract_skills(profile.resume_text)
    missing_skills = list(set(job_skills) - set(resume_skills))

    match_result = engine.calculate_v2_match_score(
        resume_text=profile.resume_text,
        job_description=f"{job.skills_required} {job.description}",
        candidate_role=profile.preferred_role,
        candidate_experience=profile.experience_level,
        job_title=job.title,
        job_experience=job.experience_level
    )
    match_score = float(match_result["match_percentage"])

    tailored_text = tailor_service.generate_tailored_resume_text(
        resume_text=profile.resume_text,
        job_title=job.title,
        company=job.company,
        job_description=job.description,
        missing_skills=missing_skills
    )

    tailored_record = TailoredResume(
        user_id=current_user.id,
        job_id=job.id,
        original_resume_text=profile.resume_text,
        tailored_resume_text=tailored_text,
        version=next_version,
        match_score=match_score,
        job_title=job.title,
        company=job.company
    )

    db.add(tailored_record)
    db.commit()
    db.refresh(tailored_record)

    return tailored_record


@router.get("/resume/tailored", response_model=List[TailoredResumeResponse])
async def list_tailored_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = (
        db.query(TailoredResume)
        .filter(TailoredResume.user_id == current_user.id)
        .order_by(TailoredResume.created_at.desc())
        .all()
    )
    return records


@router.get("/resume/tailored/{tailored_id}", response_model=TailoredResumeResponse)
async def get_tailored_resume(
    tailored_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = (
        db.query(TailoredResume)
        .filter(TailoredResume.id == tailored_id, TailoredResume.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tailored resume record not found."
        )
    return record


@router.get("/resume/tailored/{tailored_id}/compare", response_model=TailoredResumeCompareResponse)
async def compare_tailored_resume(
    tailored_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = (
        db.query(TailoredResume)
        .filter(TailoredResume.id == tailored_id, TailoredResume.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tailored resume record not found."
        )

    diff_data = tailor_service.generate_diff(record.original_resume_text, record.tailored_resume_text)

    return {
        "id": record.id,
        "job_id": record.job_id,
        "version": record.version,
        "job_title": record.job_title,
        "company": record.company,
        "application_url": record.job.application_url if record.job else None,
        "diff_lines": diff_data["diff_lines"],
        "added_count": diff_data["added_count"],
        "removed_count": diff_data["removed_count"],
        "unchanged_count": diff_data["unchanged_count"]
    }


@router.delete("/resume/tailored/{tailored_id}")
async def delete_tailored_resume(
    tailored_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = (
        db.query(TailoredResume)
        .filter(TailoredResume.id == tailored_id, TailoredResume.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tailored resume record not found."
        )

    db.delete(record)
    db.commit()

    return {"message": "Tailored resume version deleted successfully"}


# ==========================================
# INTELLIGENT COVER LETTERS V2 (P3-05)
# ==========================================

@router.post("/cover-letters", response_model=CoverLetterResponse)
async def generate_and_save_cover_letter(
    job_id: int = Form(...),
    tone: str = Form("Professional"),
    tailored_resume_id: Optional[int] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generates a multi-tone cover letter, calculates version number, and persists record in database.
    """
    if tone not in VALID_TONES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid tone '{tone}'. Supported tones are: {', '.join(sorted(VALID_TONES))}."
        )

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile or not profile.resume_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No uploaded resume found for user. Please upload a resume first."
        )

    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target job listing not found."
        )

    if tailored_resume_id:
        t_res = db.query(TailoredResume).filter(
            TailoredResume.id == tailored_resume_id,
            TailoredResume.user_id == current_user.id
        ).first()
        if not t_res:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tailored resume record not found or does not belong to user."
            )

    # Determine next version per user + job + tone combination
    latest = (
        db.query(CoverLetter)
        .filter(
            CoverLetter.user_id == current_user.id,
            CoverLetter.job_id == job_id,
            CoverLetter.tone == tone
        )
        .order_by(CoverLetter.version.desc())
        .first()
    )
    next_version = (latest.version + 1) if latest else 1

    extracted_skills = engine.extract_skills(profile.resume_text)
    candidate_name = current_user.full_name or "Candidate"

    content = cover_letter_generator.generate(
        job_title=job.title,
        company=job.company,
        job_description=job.description,
        candidate_name=candidate_name,
        candidate_skills=extracted_skills,
        tone=tone
    )

    cover_letter_record = CoverLetter(
        user_id=current_user.id,
        job_id=job.id,
        tailored_resume_id=tailored_resume_id,
        content=content,
        tone=tone,
        version=next_version,
        job_title=job.title,
        company=job.company
    )

    db.add(cover_letter_record)
    db.commit()
    db.refresh(cover_letter_record)

    return cover_letter_record


@router.get("/cover-letters", response_model=List[CoverLetterResponse])
async def list_cover_letters(
    job_id: Optional[int] = None,
    tone: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves all saved cover letters for the authenticated user, optionally filtered by job_id or tone.
    """
    query = db.query(CoverLetter).filter(CoverLetter.user_id == current_user.id)
    if job_id:
        query = query.filter(CoverLetter.job_id == job_id)
    if tone:
        query = query.filter(CoverLetter.tone == tone)

    records = query.order_by(CoverLetter.created_at.desc()).all()
    return records


@router.get("/cover-letters/{cover_letter_id}", response_model=CoverLetterResponse)
async def get_cover_letter(
    cover_letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieves a single saved cover letter by ID for the authenticated user.
    """
    record = (
        db.query(CoverLetter)
        .filter(CoverLetter.id == cover_letter_id, CoverLetter.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter record not found."
        )
    return record


@router.delete("/cover-letters/{cover_letter_id}")
async def delete_cover_letter(
    cover_letter_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Deletes a saved cover letter record belonging to the authenticated user.
    """
    record = (
        db.query(CoverLetter)
        .filter(CoverLetter.id == cover_letter_id, CoverLetter.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cover letter record not found."
        )

    db.delete(record)
    db.commit()

    return {"message": "Cover letter version deleted successfully"}
