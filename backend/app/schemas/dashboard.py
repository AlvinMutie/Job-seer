import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, Field, ConfigDict


class StatusCounts(BaseModel):
    not_applied: int = 0
    applied: int = 0
    interview: int = 0
    offer: int = 0
    rejected: int = 0


class RecentApplicationItem(BaseModel):
    id: int
    job_id: int
    title: str
    company: str
    status: str
    score: Optional[float] = None
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None


class RecentTailoredItem(BaseModel):
    id: int
    job_id: int
    job_title: Optional[str] = None
    company: Optional[str] = None
    version: int
    match_score: Optional[float] = None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class RecentCoverLetterItem(BaseModel):
    id: int
    job_id: int
    job_title: Optional[str] = None
    company: Optional[str] = None
    tone: str
    version: int
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class DashboardAnalyticsResponse(BaseModel):
    total_applications: int
    status_counts: StatusCounts
    average_match_score: float
    ats_health_score: Optional[float] = None
    ats_classification: str
    tailored_resumes_count: int
    cover_letters_count: int
    recent_applications: List[RecentApplicationItem]
    recent_tailored_resumes: List[RecentTailoredItem]
    recent_cover_letters: List[RecentCoverLetterItem]

    model_config = ConfigDict(from_attributes=True)
