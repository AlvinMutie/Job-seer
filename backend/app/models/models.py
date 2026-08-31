import datetime
import enum
from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class ApplicationStatus(enum.Enum):
    NOT_APPLIED = "Not Applied"
    APPLIED = "Applied"
    INTERVIEW = "Interview"
    REJECTED = "Rejected"
    OFFER = "Offer"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_profile_complete = Column(Integer, default=0) # 0 for False, 1 for True (SQLite compatibility)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    preferred_role = Column(String)
    skills = Column(Text)  # Comma separated
    experience_level = Column(String)
    location_preference = Column(String)
    salary_expectation = Column(String)
    resume_path = Column(String, nullable=True)
    resume_text = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")

User.profile = relationship("Profile", back_populates="user", uselist=False)

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    location = Column(String)
    description = Column(Text)
    remote_status = Column(String)  # "Remote", "On-site", "Hybrid"
    experience_level = Column(String)
    skills_required = Column(Text)  # Comma separated or JSON
    salary_range = Column(String, nullable=True)
    posted_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content_text = Column(Text)
    extracted_skills = Column(Text)  # Comma separated
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    
    user = relationship("User")

class TailoredResume(Base):
    __tablename__ = "tailored_resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), index=True)
    original_resume_text = Column(Text)
    tailored_resume_text = Column(Text)
    version = Column(Integer, default=1)
    match_score = Column(Float, nullable=True)
    job_title = Column(String, nullable=True)
    company = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User")
    job = relationship("Job")

class CoverLetter(Base):
    __tablename__ = "cover_letters"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), index=True)
    tailored_resume_id = Column(Integer, ForeignKey("tailored_resumes.id"), nullable=True)
    content = Column(Text)
    tone = Column(String, default="Professional", index=True)
    version = Column(Integer, default=1)
    job_title = Column(String, nullable=True)
    company = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc))

    user = relationship("User")
    job = relationship("Job")
    tailored_resume = relationship("TailoredResume")

class ApplicationTracker(Base):
    __tablename__ = "application_tracker"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    status = Column(Enum(ApplicationStatus, values_callable=lambda obj: [e.value for e in obj]), default=ApplicationStatus.NOT_APPLIED)
    match_score = Column(Float)
    applied_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    user = relationship("User")
    job = relationship("Job")
