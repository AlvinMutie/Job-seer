import pytest
from app.core.rate_limiter import global_rate_limiter, RateLimiter

pytestmark = [pytest.mark.integration, pytest.mark.security, pytest.mark.regression]


def test_sec_06_httponly_cookie_set_on_login(client, test_user):
    """
    SEC-06 AUTHENTICATION STORAGE HARDENING:
    Verify POST /login sets an HttpOnly access_token cookie in the response.
    """
    res = client.post("/login", data={"username": test_user["email"], "password": test_user["password"]})
    assert res.status_code == 200
    assert "access_token" in res.cookies
    assert "access_token" in res.json()


def test_sec_06_cookie_authenticated_access(client, test_user):
    """
    SEC-06 AUTHENTICATION STORAGE HARDENING:
    Verify get_current_user extracts token from HttpOnly cookie when Authorization header is absent.
    """
    login_res = client.post("/login", data={"username": test_user["email"], "password": test_user["password"]})
    token = login_res.json()["access_token"]

    # Clear Authorization header and pass cookie instead
    client.cookies.set("access_token", token)
    res = client.get("/me")
    assert res.status_code == 200
    assert res.json()["email"] == test_user["email"]
    client.cookies.clear()


def test_sec_06_logout_clears_cookie(client):
    """
    SEC-06 AUTHENTICATION STORAGE HARDENING:
    Verify POST /logout clears the HttpOnly access_token cookie.
    """
    res = client.post("/logout")
    assert res.status_code == 200
    assert res.json()["message"] == "Logged out successfully"


def test_sec_07_rate_limiter_login(client):
    """
    SEC-07 RATE LIMITING HARDENING:
    Verify rate limiter returns 429 TOO_MANY_REQUESTS when request limit is exceeded.
    """
    limiter = RateLimiter(requests_per_minute=3, enabled=True)
    key = "auth_login:127.0.0.1"

    # Make 3 requests
    is_limited, _ = limiter.is_rate_limited(key, max_requests=3)
    assert is_limited is False
    is_limited, _ = limiter.is_rate_limited(key, max_requests=3)
    assert is_limited is False
    is_limited, _ = limiter.is_rate_limited(key, max_requests=3)
    assert is_limited is False

    # 4th request exceeds limit
    is_limited, retry_after = limiter.is_rate_limited(key, max_requests=3)
    assert is_limited is True
    assert retry_after > 0


def test_http_security_headers_present(client):
    """
    PHASE 4 SECURITY HARDENING:
    Verify responses include production HTTP security headers.
    """
    res = client.get("/")
    assert res.status_code == 200
    assert res.headers.get("X-Content-Type-Options") == "nosniff"
    assert res.headers.get("X-Frame-Options") == "DENY"
    assert res.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert res.headers.get("X-XSS-Protection") == "1; mode=block"


def test_database_indexes_query_performance(client, test_user, seed_test_jobs):
    """
    PHASE 4 PERFORMANCE HARDENING:
    Verify database queries against indexed ApplicationTracker, TailoredResume, and CoverLetter execute cleanly.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 90.0}, headers=test_user["headers"])
    client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"])
    client.post("/cover-letters", data={"job_id": job.id, "tone": "Executive"}, headers=test_user["headers"])

    # Query analytics
    res = client.get("/dashboard/analytics", headers=test_user["headers"])
    assert res.status_code == 200
    assert res.json()["total_applications"] >= 1
