import os
from typing import Literal, List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator, ValidationInfo


class Settings(BaseSettings):
    """Centralized application configuration management loaded from environment variables."""

    ENVIRONMENT: Literal["development", "testing", "production"] = Field(
        default="development",
        description="Runtime environment mode"
    )
    SECRET_KEY: str = Field(
        default="dev-secret-key-change-in-production-min-32-chars",
        description="JWT signing secret key"
    )
    ALGORITHM: str = Field(default="HS256", description="JWT signing algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60 * 24,  # 1 day (1440 minutes)
        description="JWT token validity in minutes"
    )
    DATABASE_URL: str = Field(
        default="sqlite:///./job_hunter_v3.db",
        description="SQLAlchemy database connection string"
    )
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        description="Comma-separated list of allowed CORS origins"
    )
    COOKIE_SECURE_OVERRIDE: Optional[bool] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def COOKIE_SECURE(self) -> bool:
        """Evaluates whether authentication cookies must require HTTPS (Secure=True in production)."""
        if self.COOKIE_SECURE_OVERRIDE is not None:
            return self.COOKIE_SECURE_OVERRIDE
        env = os.getenv("ENVIRONMENT", self.ENVIRONMENT).lower()
        if env == "production":
            return True
        return False

    @property
    def ALLOWED_ORIGINS(self) -> List[str]:
        """Parses CORS_ORIGINS string into a list of cleaned origin URLs."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @field_validator("CORS_ORIGINS")
    @classmethod
    def validate_cors_origins(cls, v: str, info: Optional[ValidationInfo] = None) -> str:
        """Validate CORS_ORIGINS to ensure wildcard origins are prohibited in production."""
        origins = [o.strip() for o in v.split(",") if o.strip()]
        env_val = info.data.get("ENVIRONMENT") if info and hasattr(info, "data") and info.data else None
        env = str(env_val or os.getenv("ENVIRONMENT") or "development").lower()
        if "*" in origins and env == "production":
            raise ValueError(
                "CRITICAL SECURITY FAILURE: Wildcard CORS origin '*' is strictly prohibited in production."
            )
        return v

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str, info: Optional[ValidationInfo] = None) -> str:
        """Enforce strict production secret key security validation."""
        env_val = info.data.get("ENVIRONMENT") if info and hasattr(info, "data") and info.data else None
        env = str(env_val or os.getenv("ENVIRONMENT") or "development").lower()
        
        if env == "production":
            weak_indicators = ["change-me", "dev-secret-key", "super-secret-key", "123456789"]
            if not v or len(v) < 32 or v.lower() == "secret" or any(w in v.lower() for w in weak_indicators):
                raise ValueError(
                    "CRITICAL SECURITY FAILURE: Production SECRET_KEY must be configured "
                    "via environment variable, be at least 32 characters long, and not use default placeholders."
                )
        return v


settings = Settings()
