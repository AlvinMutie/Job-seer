from pydantic import BaseModel


class ProfileUpdate(BaseModel):
    preferred_role: str
    skills: str
    experience_level: str
    location_preference: str
    salary_expectation: str
