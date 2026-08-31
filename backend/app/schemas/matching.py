from pydantic import BaseModel


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str
