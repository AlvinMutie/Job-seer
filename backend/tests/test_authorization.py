import pytest
import io

pytestmark = [pytest.mark.security, pytest.mark.regression]


def test_public_root_health_check(client):
    """Verify GET / is accessible publicly without authentication."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"


def test_public_get_jobs_unauthenticated(client, seed_test_jobs):
    """Verify GET /jobs is accessible publicly without authentication."""
    response = client.get("/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 2


def test_public_get_jobs_authenticated(client, test_user, seed_test_jobs):
    """Verify GET /jobs remains accessible when authenticated."""
    response = client.get("/jobs", headers=test_user["headers"])
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 2


def test_match_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY BOUNDARY VERIFICATION (P0-02/P1-04):
    Verify that POST /match without Authorization header is rejected with 401 Unauthorized.
    """
    payload = {
        "resume_text": "I am a Senior Python developer skilled in FastAPI and AWS.",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/match", data=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_match_malformed_jwt_rejected(client, seed_test_jobs):
    """Verify POST /match with invalid JWT returns 401 Unauthorized."""
    payload = {
        "resume_text": "Python developer",
        "job_id": seed_test_jobs[0].id
    }
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    response = client.post("/match", data=payload, headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_match_authenticated_success(client, test_user, seed_test_jobs):
    """Verify POST /match with valid Bearer token processes request and returns 200 OK."""
    payload = {
        "resume_text": "I am a Senior Python developer skilled in FastAPI and AWS.",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/match", data=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert "match_percentage" in data
    assert "matched_skills" in data


def test_tailor_resume_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY BOUNDARY VERIFICATION (P0-02/P1-04):
    Verify that POST /tailor-resume without Authorization header is rejected with 401 Unauthorized.
    """
    payload = {
        "resume_text": "Python developer",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/tailor-resume", data=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_tailor_resume_malformed_jwt_rejected(client, seed_test_jobs):
    """Verify POST /tailor-resume with invalid JWT returns 401 Unauthorized."""
    payload = {
        "resume_text": "Python developer",
        "job_id": seed_test_jobs[0].id
    }
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    response = client.post("/tailor-resume", data=payload, headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_tailor_resume_authenticated_success(client, test_user, seed_test_jobs):
    """Verify POST /tailor-resume with valid Bearer token processes request and returns 200 OK."""
    payload = {
        "resume_text": "Python developer",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/tailor-resume", data=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert "suggestions" in data
    assert data["job_title"] == "Senior Python Developer"


def test_generate_cover_letter_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY BOUNDARY VERIFICATION (P0-02/P1-04):
    Verify that POST /generate-cover-letter without Authorization header is rejected with 401 Unauthorized.
    """
    payload = {
        "job_id": seed_test_jobs[0].id,
        "candidate_name": "Test Candidate",
        "resume_text": "Python developer"
    }
    response = client.post("/generate-cover-letter", data=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_generate_cover_letter_malformed_jwt_rejected(client, seed_test_jobs):
    """Verify POST /generate-cover-letter with invalid JWT returns 401 Unauthorized."""
    payload = {
        "job_id": seed_test_jobs[0].id,
        "candidate_name": "Test Candidate",
        "resume_text": "Python developer"
    }
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    response = client.post("/generate-cover-letter", data=payload, headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_generate_cover_letter_authenticated_success(client, test_user, seed_test_jobs):
    """Verify POST /generate-cover-letter with valid Bearer token processes request and returns 200 OK."""
    payload = {
        "job_id": seed_test_jobs[0].id,
        "candidate_name": "Test Candidate",
        "resume_text": "Python developer"
    }
    response = client.post("/generate-cover-letter", data=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert "cover_letter" in data


def test_profile_unauthenticated_rejected(client):
    """
    SECURITY BOUNDARY VERIFICATION (P1-04):
    Verify that POST /profile without Authorization header returns 401 Unauthorized.
    """
    payload = {
        "preferred_role": "Senior Engineer",
        "skills": "Python, FastAPI",
        "experience_level": "Senior",
        "location_preference": "Remote",
        "salary_expectation": "$130k"
    }
    response = client.post("/profile", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_applications_get_unauthenticated_rejected(client):
    """
    SECURITY BOUNDARY VERIFICATION (P1-04):
    Verify that GET /applications without Authorization header returns 401 Unauthorized.
    """
    response = client.get("/applications")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_applications_post_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY BOUNDARY VERIFICATION (P1-04):
    Verify that POST /applications without Authorization header returns 401 Unauthorized.
    """
    payload = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 90.0
    }
    response = client.post("/applications", json=payload)
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_resource_owner_profile_isolation(client, test_user, secondary_user):
    """Verify User 1 token fetches User 1 profile and secondary user token fetches secondary user profile."""
    res1 = client.get("/me", headers=test_user["headers"])
    assert res1.status_code == 200
    assert res1.json()["email"] == test_user["email"]
    assert res1.json()["profile"]["preferred_role"] == "Senior Python Developer"

    res2 = client.get("/me", headers=secondary_user["headers"])
    assert res2.status_code == 200
    assert res2.json()["email"] == secondary_user["email"]
    assert res2.json()["profile"]["preferred_role"] == "React Engineer"


def test_resource_owner_applications_isolation(client, test_user, secondary_user, seed_test_jobs):
    """Verify applications created by User 1 are isolated from User 2."""
    app_payload = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 85.5
    }
    create_res = client.post("/applications", json=app_payload, headers=test_user["headers"])
    assert create_res.status_code == 200

    u1_apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(u1_apps) == 1
    assert u1_apps[0]["title"] == "Senior Python Developer"

    u2_apps = client.get("/applications", headers=secondary_user["headers"]).json()
    assert len(u2_apps) == 0
