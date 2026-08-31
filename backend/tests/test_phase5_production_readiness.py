import pytest
from app.core.config import Settings

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_health_liveness_endpoint(client):
    """
    PHASE 5 PRODUCTION READINESS:
    Verify GET /health liveness probe returns HTTP 200 with ok status and Job Seer app label.
    """
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["app"] == "Job Seer"


def test_health_readiness_endpoint(client):
    """
    PHASE 5 PRODUCTION READINESS:
    Verify GET /health/ready readiness probe tests live database connection.
    """
    res = client.get("/health/ready")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ready"
    assert data["database"] == "connected"


def test_root_endpoint_job_seer_branding(client):
    """
    PHASE 5 REBRAND VERIFICATION:
    Verify root GET / returns Job Seer API message.
    """
    res = client.get("/")
    assert res.status_code == 200
    assert "Job Seer" in res.json()["message"]


def test_cookie_secure_property_in_production(monkeypatch):
    """
    PHASE 5 PRODUCTION CONFIGURATION:
    Verify COOKIE_SECURE evaluates True when ENVIRONMENT is production.
    """
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("SECRET_KEY", "a-very-strong-production-secret-key-min-32-chars-long")
    monkeypatch.setenv("CORS_ORIGINS", "https://jobseer.app")
    prod_settings = Settings()
    assert prod_settings.COOKIE_SECURE is True


def test_production_config_rejects_weak_secret_key(monkeypatch):
    """
    PHASE 5 PRODUCTION SECURITY VALIDATION:
    Verify production environment rejects weak or default placeholder SECRET_KEY.
    """
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("SECRET_KEY", "dev-secret-key-change-me")
    monkeypatch.setenv("CORS_ORIGINS", "https://jobseer.app")
    with pytest.raises(ValueError, match="CRITICAL SECURITY FAILURE"):
        Settings()
