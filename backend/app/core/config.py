import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator


class Settings(BaseSettings):
    """Centralized application configuration management loaded from environment variables."""

    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production-min-32-chars",
        description="JWT signing secret key"
    )
    ALGORITHM: str = Field(default="HS256", description="JWT signing algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60 * 24,  # 1 day (1440 minutes)
        description="JWT token validity in minutes"
    )
    ENVIRONMENT: Literal["development", "testing", "production"] = Field(
        default="development",
        description="Runtime environment mode"
    )
    DATABASE_URL: str = Field(
        default="sqlite:///./job_hunter_v3.db",
        description="SQLAlchemy database connection string"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info) -> str:
        """Enforce strict production secret key security validation."""
        # Note: info.data might not contain ENVIRONMENT if validation runs per-field order,
        # so we also check os.getenv("ENVIRONMENT") or fallback.
        env = os.getenv("ENVIRONMENT", "development").lower()
        
        if env == "production":
            weak_indicators = ["change-me", "dev-secret-key", "super-secret-key", "secret", "123456"]
            if not v or len(v) < 32 or any(w in v.lower() for w in weak_indicators):
                raise ValueError(
                    "CRITICAL SECURITY FAILURE: Production SECRET_KEY must be configured "
                    "via environment variable, be at least 32 characters long, and not use default placeholders."
                )
        return v


settings = Settings()
