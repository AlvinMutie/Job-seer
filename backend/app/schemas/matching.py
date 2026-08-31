from typing import List, Dict, Optional
from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str
    candidate_role: Optional[str] = None
    candidate_experience: Optional[str] = None


class MatchBreakdown(BaseModel):
    skills: float = Field(..., ge=0.0, le=100.0, description="Skill overlap score (40% weight)")
    content: float = Field(..., ge=0.0, le=100.0, description="TF-IDF content similarity score (30% weight)")
    experience: float = Field(..., ge=0.0, le=100.0, description="Experience level alignment score (15% weight)")
    role_title: float = Field(..., ge=0.0, le=100.0, description="Role title alignment score (15% weight)")


class MatchWeights(BaseModel):
    skills: float = 0.40
    content: float = 0.30
    experience: float = 0.15
    role_title: float = 0.15


class MatchResponse(BaseModel):
    match_percentage: float = Field(..., ge=0.0, le=100.0)
    breakdown: MatchBreakdown
    weights: MatchWeights
    explanation: str
    matched_skills: List[str]
    missing_skills: List[str]
    tailoring_advice: List[str]
