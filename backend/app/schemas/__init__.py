# Package marker for API Pydantic schemas / DTOs
from app.schemas.auth import UserCreate, Token
from app.schemas.profile import ProfileUpdate
from app.schemas.matching import MatchRequest
from app.schemas.applications import ApplicationCreate

__all__ = [
    "UserCreate",
    "Token",
    "ProfileUpdate",
    "MatchRequest",
    "ApplicationCreate"
]
