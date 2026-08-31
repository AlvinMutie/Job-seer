import pytest
from app.models.models import Job, User, Profile

pytestmark = [pytest.mark.integration, pytest.mark.regression]

def test_job_search_keyword_filter(client, seed_test_jobs):
    """Test GET /jobs filtering by keyword parameter returns matching jobs."""
    response = client.get("/jobs?keywords=Python")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Senior Python Developer"


def test_job_search_location_filter(client, seed_test_jobs):
    """Test GET /jobs filtering by location parameter returns matching jobs."""
    response = client.get("/jobs?location=Remote")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 1
    assert jobs[0]["title"] == "Senior Python Developer"


def test_job_search_nonexistent_keyword(client, seed_test_jobs):
    """Test GET /jobs searching for non-existent keyword returns empty list."""
    response = client.get("/jobs?keywords=NonExistentSkill123")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 0


def test_profile_update_flow(client, test_user):
    """Test POST /profile updates user career preferences successfully."""
    payload = {
        "preferred_role": "Lead Backend Architect",
        "skills": "Go, Docker, Kubernetes, AWS",
        "experience_level": "Lead / Architect",
        "location_preference": "Remote",
        "salary_expectation": "$180k"
    }
    response = client.post("/profile", json=payload, headers=test_user["headers"])
    assert response.status_code == 200
    assert response.json()["message"] == "Profile updated successfully"

    # Verify via /me
    me_res = client.get("/me", headers=test_user["headers"]).json()
    assert me_res["profile"]["preferred_role"] == "Lead Backend Architect"
    assert me_res["profile"]["skills"] == "Go, Docker, Kubernetes, AWS"
    assert me_res["profile"]["experience_level"] == "Lead / Architect"


def test_profile_update_unauthenticated(client):
    """Test POST /profile without Authorization header returns 401 Unauthorized."""
    payload = {
        "preferred_role": "Lead Architect",
        "skills": "Python",
        "experience_level": "Senior",
        "location_preference": "Remote",
        "salary_expectation": "$150k"
    }
    response = client.post("/profile", json=payload)
    assert response.status_code == 401
