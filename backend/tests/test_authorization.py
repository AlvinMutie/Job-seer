import pytest

def test_public_root_health_check(client):
    """Verify GET / is accessible publicly without authentication."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"


def test_public_get_jobs(client, seed_test_jobs):
    """Verify GET /jobs is accessible publicly without authentication."""
    response = client.get("/jobs")
    assert response.status_code == 200
    jobs = response.json()
    assert len(jobs) == 2


def test_match_unauthenticated_current_vulnerability(client, seed_test_jobs):
    """
    SECURITY VULNERABILITY CAPTURE (SEC-02):
    Verify that POST /match currently allows unauthenticated requests and returns 200 OK.
    DO NOT FIX YET — This test records the baseline vulnerability.
    """
    payload = {
        "resume_text": "I am a Senior Python developer skilled in FastAPI and AWS.",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/match", data=payload)
    # Records current vulnerable behavior (returns 200 without auth)
    assert response.status_code == 200
    assert "match_percentage" in response.json()


def test_tailor_resume_unauthenticated_current_vulnerability(client, seed_test_jobs):
    """
    SECURITY VULNERABILITY CAPTURE (SEC-02):
    Verify that POST /tailor-resume currently allows unauthenticated requests and returns 200 OK.
    DO NOT FIX YET — This test records the baseline vulnerability.
    """
    payload = {
        "resume_text": "Python developer",
        "job_id": seed_test_jobs[0].id
    }
    response = client.post("/tailor-resume", data=payload)
    # Records current vulnerable behavior (returns 200 without auth)
    assert response.status_code == 200
    assert "suggestions" in response.json()


def test_generate_cover_letter_unauthenticated_current_vulnerability(client, seed_test_jobs):
    """
    SECURITY VULNERABILITY CAPTURE (SEC-02):
    Verify that POST /generate-cover-letter currently allows unauthenticated requests and returns 200 OK.
    DO NOT FIX YET — This test records the baseline vulnerability.
    """
    payload = {
        "job_id": seed_test_jobs[0].id,
        "candidate_name": "Anonymous Candidate",
        "resume_text": "Python developer"
    }
    response = client.post("/generate-cover-letter", data=payload)
    # Records current vulnerable behavior (returns 200 without auth)
    assert response.status_code == 200
    assert "cover_letter" in response.json()


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
    # User 1 creates an application
    app_payload = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 85.5
    }
    create_res = client.post("/applications", json=app_payload, headers=test_user["headers"])
    assert create_res.status_code == 200

    # User 1 queries /applications -> sees 1 application
    u1_apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(u1_apps) == 1
    assert u1_apps[0]["title"] == "Senior Python Developer"

    # User 2 queries /applications -> sees 0 applications (Isolation enforced)
    u2_apps = client.get("/applications", headers=secondary_user["headers"]).json()
    assert len(u2_apps) == 0
