from typing import Optional
from pydantic import BaseModel


class ApplicationCreate(BaseModel):
    job_id: int
    status: str = "Applied"
    match_score: float
    notes: Optional[str] = None
