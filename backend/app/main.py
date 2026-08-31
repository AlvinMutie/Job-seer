import os
import shutil
import logging
from typing import List, Optional

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
import pydantic
from sqlalchemy.orm import Session
import fitz  # PyMuPDF

from app.services.matching_engine import MatchingEngine
from app.services.job_service import job_service
from app.services.cover_letter import cover_letter_generator
from app.services.tailor_service import tailor_service
from app.database import get_db, init_db
from app.models.models import User, Profile, Job
from app.auth import get_password_hash, verify_password, create_access_token, get_current_user
from app.core.config import settings
from app.utils.file_handling import validate_upload_file, save_user_resume

app = FastAPI(title="Smart Job Hunter API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = MatchingEngine()

class MatchRequest(pydantic.BaseModel):
    resume_text: str
    job_description: str

class UserCreate(pydantic.BaseModel):
    full_name: str
    email: str
    password: str

class Token(pydantic.BaseModel):
    access_token: str
    token_type: str

class ProfileUpdate(pydantic.BaseModel):
    preferred_role: str
    skills: str
    experience_level: str
    location_preference: str
    salary_expectation: str

class ApplicationCreate(pydantic.BaseModel):
    job_id: int
    status: str = "Applied"
    match_score: float
    notes: Optional[str] = None

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
async def root():
    return {"message": "Welcome to Smart Job Hunter API", "status": "running"}

@app.get("/jobs")
async def get_jobs(
    location: Optional[str] = None, 
    remote_status: Optional[str] = None, 
    experience_level: Optional[str] = None,
    keywords: Optional[str] = None,
    db: Session = Depends(get_db)
):
    jobs = await job_service.get_jobs(db, location, remote_status, experience_level, keywords)
    return jobs

@app.post("/match")
async def match_resume(
    resume_text: str = Form(...), 
    job_id: int = Form(...), 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        return {"error": "Job not found"}
        
    # Combine job skills and description for better matching
    job_content = f"{job.skills_required} {job.description}"
    
    score = engine.calculate_match_score(resume_text, job_content)
    resume_skills = engine.extract_skills(resume_text)
    job_skills = engine.extract_skills(job_content)
    
    comparison = engine.compare_skills(resume_skills, job_skills)
    
    return {
        "match_percentage": score,
        "matched_skills": comparison["matched"],
        "missing_skills": comparison["missing"],
        "tailoring_advice": comparison["tailoring_advice"]
    }

@app.post("/generate-cover-letter")
async def generate_cover_letter_api(
    job_id: int = Form(...),
    candidate_name: str = Form(...),
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        return {"error": "Job not found"}
    
    skills = engine.extract_skills(resume_text)
    letter = cover_letter_generator.generate(
        job.title, job.company, job.description, candidate_name, skills
    )
    return {"cover_letter": letter}

@app.post("/tailor-resume")
async def tailor_resume_api(
    job_id: int = Form(...),
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = await job_service.get_job_by_id(db, job_id)
    if not job:
        return {"error": "Job not found"}
    
    # Extract skills for precise tailoring
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

# --- Auth Endpoints ---

@app.post("/register", response_model=Token)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        is_profile_complete=0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    logging.info(f"Fetch /me: user_id={current_user.id}, profile_found={profile is not None}")
    
    # Ensure full_name is at least an empty string
    name = current_user.full_name or "Professional Hunter"
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": name,
        "is_profile_complete": current_user.is_profile_complete == 1,
        "profile": {
            "preferred_role": profile.preferred_role if profile else None,
            "skills": profile.skills if profile else None,
            "experience_level": profile.experience_level if profile else None,
            "has_resume": bool(profile.resume_path) if profile else False,
            "resume_text": profile.resume_text if profile else None
        } if profile else None
    }

@app.post("/profile")
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

@app.post("/upload-resume")
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

@app.get("/applications")
async def get_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.models import ApplicationTracker, Job
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

@app.post("/applications")
async def create_application(app_data: ApplicationCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from app.models.models import ApplicationTracker, ApplicationStatus
    import datetime
    
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
        applied_at=datetime.datetime.utcnow()
    )
    db.add(new_app)
    db.commit()
    return {"message": "Application tracked successfully"}

if __name__ == "__main__":
    import uvicorn
    # Use string reference to allow for potential reload support if run directly
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
