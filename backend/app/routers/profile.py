import os
import logging
import fitz  # PyMuPDF
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, Profile
from app.auth import get_current_user
from app.schemas.profile import ProfileUpdate
from app.utils.file_handling import validate_upload_file, save_user_resume
from app.services.resume_intelligence import resume_intelligence_service

router = APIRouter(tags=["Profile"])

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
    # 1. Validate file extension, size limit (10MB), and MIME magic bytes
    validate_upload_file(file)

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
    
    # 2. Save file using server-side UUID filename and clean up old resume
    file_path = save_user_resume(file, current_user.id, profile.resume_path, UPLOAD_DIR)
    
    # 3. Extract text from the uploaded file safely
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
    """
    Retrieves ATS readiness health report for the authenticated user's uploaded resume.
    """
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile or not profile.resume_text:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No uploaded resume found for user. Please upload a resume first."
        )

    analysis = resume_intelligence_service.analyze_resume_health(profile.resume_text)
    return analysis
