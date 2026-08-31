import pytest
from app.core.config import settings


def test_cors_allowed_origin_header(client):
    """Verify that requests from a trusted frontend origin receive Access-Control-Allow-Origin header."""
    headers = {"Origin": "http://localhost:5173"}
    response = client.get("/jobs", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert response.headers.get("access-control-allow-credentials") == "true"


def test_cors_second_allowed_origin_header(client):
    """Verify that requests from a second configured origin (e.g. http://localhost:3000) receive CORS header."""
    headers = {"Origin": "http://localhost:3000"}
    response = client.get("/jobs", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_cors_untrusted_origin_rejected(client):
    """
    SECURITY BOUNDARY VERIFICATION (P0-04):
    Verify that requests from an untrusted origin do NOT receive Access-Control-Allow-Origin header.
    """
    headers = {"Origin": "http://malicious-website.com"}
    response = client.get("/jobs", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") is None


def test_cors_preflight_options_request(client):
    """Verify OPTIONS preflight request from allowed origin returns proper CORS headers."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Authorization, Content-Type"
    }
    response = client.options("/jobs", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "POST" in response.headers.get("access-control-allow-methods", "")


def test_cors_settings_no_wildcard():
    """Programmatically verify that allowed origins in settings do not contain wildcard '*'."""
    assert "*" not in settings.ALLOWED_ORIGINS
    assert "http://localhost:5173" in settings.ALLOWED_ORIGINS
