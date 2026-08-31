import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    job_id: int
    status: str = "Applied"
    match_score: Optional[float] = None
    notes: Optional[str] = None
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    follow_up_date: Optional[str] = None
    application_url: Optional[str] = None


class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    follow_up_date: Optional[str] = None
    application_url: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: int
    job_id: int
    title: str
    company: str
    status: str
    score: Optional[float] = None
    date: str
    applied_date: Optional[str] = None
    interview_date: Optional[str] = None
    follow_up_date: Optional[str] = None
    application_url: Optional[str] = None
    notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
