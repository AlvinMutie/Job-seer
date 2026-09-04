import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProfileUpdate(BaseModel):
    preferred_role: Optional[str] = None
    skills: Optional[str] = None
    experience_level: Optional[str] = None
    location_preference: Optional[str] = None
    salary_expectation: Optional[str] = None


class ContactChecks(BaseModel):
    email: bool = False
    phone: bool = False
    linkedin: bool = False
    github: bool = False
    portfolio: bool = False


class SkillDomains(BaseModel):
    programming_languages: List[str] = []
    frontend: List[str] = []
    backend: List[str] = []
    databases: List[str] = []
    cloud_devops: List[str] = []
    data_ai: List[str] = []
    other: List[str] = []


class ResumeHealthBreakdown(BaseModel):
    completeness: float = Field(..., ge=0.0, le=100.0)
    ats_health: float = Field(..., ge=0.0, le=100.0)
    contact_information: float = Field(..., ge=0.0, le=100.0)
    skills: float = Field(..., ge=0.0, le=100.0)


class ResumeHealthResponse(BaseModel):
    health_score: float = Field(..., ge=0.0, le=100.0)
    classification: str
    breakdown: ResumeHealthBreakdown
    sections_detected: List[str]
    contact_checks: ContactChecks
    skill_domains: SkillDomains
    recommendations: List[str]


class TailoredResumeResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    version: int
    original_resume_text: str
    tailored_resume_text: str
    match_score: Optional[float] = None
    job_title: Optional[str] = None
    company: Optional[str] = None
    application_url: Optional[str] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class DiffLineItem(BaseModel):
    line: str
    type: str  # "added" | "removed" | "unchanged"


class TailoredResumeCompareResponse(BaseModel):
    id: int
    job_id: int
    version: int
    job_title: Optional[str] = None
    company: Optional[str] = None
    application_url: Optional[str] = None
    diff_lines: List[DiffLineItem]
    added_count: int
    removed_count: int
    unchanged_count: int


class CoverLetterResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    tailored_resume_id: Optional[int] = None
    content: str
    tone: str
    version: int
    job_title: Optional[str] = None
    company: Optional[str] = None
    application_url: Optional[str] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)
