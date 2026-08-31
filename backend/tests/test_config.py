import os
import pytest
from app.core.config import Settings


def test_config_loads_defaults():
    """Verify default Settings values populate correctly in development mode."""
    config = Settings()
    assert config.ALGORITHM == "HS256"
    assert config.ACCESS_TOKEN_EXPIRE_MINUTES == 1440
    assert config.ENVIRONMENT == "development"
    assert "sqlite" in config.DATABASE_URL


def test_config_loads_from_env_vars(monkeypatch):
    """Verify Settings loads custom variables from environment."""
    monkeypatch.setenv("SECRET_KEY", "custom-test-secret-key-12345678901234567890")
    monkeypatch.setenv("ENVIRONMENT", "testing")
    
    config = Settings()
    assert config.SECRET_KEY == "custom-test-secret-key-12345678901234567890"
    assert config.ENVIRONMENT == "testing"


def test_config_production_fails_without_strong_secret(monkeypatch):
    """Verify that production environment fails validation if secret key is weak or default."""
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("SECRET_KEY", "super-secret-key-change-me-in-production")
    
    with pytest.raises(ValueError) as exc_info:
        Settings.validate_secret_key("super-secret-key-change-me-in-production", None)
    
    assert "CRITICAL SECURITY FAILURE" in str(exc_info.value)


def test_source_code_contains_no_hardcoded_jwt_secret():
    """Programmatically verify that the old hardcoded JWT secret is absent from all app source files."""
    old_secret = "super-secret-key-change-me-in-production"
    app_dir = os.path.join(os.path.dirname(__file__), "..", "app")
    
    for root, _, files in os.walk(app_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    assert old_secret not in content, f"Hardcoded secret found in {file_path}"
