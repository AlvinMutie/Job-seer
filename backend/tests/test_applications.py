import pytest
from app.models.models import ApplicationTracker

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_create_application(client, test_user, seed_test_jobs):
    """Test creating an application tracking record returns success message."""
    payload = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 88.0,
        "notes": "Applied via company portal"
    }
    response = client.post("/applications", json=payload, headers=test_user["headers"])
    assert response.status_code == 200
    assert response.json()["message"] == "Application tracked successfully"


def test_get_applications(client, test_user, seed_test_jobs):
    """Test fetching tracked applications returns correct user list."""
    payload = {
        "job_id": seed_test_jobs[0].id,
        "status": "Interview",
        "match_score": 92.5
    }
    client.post("/applications", json=payload, headers=test_user["headers"])

    response = client.get("/applications", headers=test_user["headers"])
    assert response.status_code == 200
    apps = response.json()
    assert len(apps) == 1
    assert apps[0]["job_id"] == seed_test_jobs[0].id
    assert apps[0]["status"] == "Interview"
    assert apps[0]["score"] == 92.5
    assert apps[0]["title"] == "Senior Python Developer"
    assert apps[0]["company"] == "TechCorp"


def test_update_existing_application(client, test_user, seed_test_jobs):
    """Test re-posting an application for the same job_id updates existing status."""
    payload1 = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 75.0
    }
    client.post("/applications", json=payload1, headers=test_user["headers"])

    payload2 = {
        "job_id": seed_test_jobs[0].id,
        "status": "Interview",
        "match_score": 75.0
    }
    response = client.post("/applications", json=payload2, headers=test_user["headers"])
    assert response.status_code == 200
    assert response.json()["message"] == "Application updated"

    apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(apps) == 1
    assert apps[0]["status"] == "Interview"


def test_applications_user_isolation(client, test_user, secondary_user, seed_test_jobs):
    """Verify that User 1 and User 2 applications remain strictly isolated."""
    client.post(
        "/applications",
        json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0},
        headers=test_user["headers"]
    )

    client.post(
        "/applications",
        json={"job_id": seed_test_jobs[1].id, "status": "Offer", "match_score": 95.0},
        headers=secondary_user["headers"]
    )

    u1_apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(u1_apps) == 1
    assert u1_apps[0]["title"] == "Senior Python Developer"

    u2_apps = client.get("/applications", headers=secondary_user["headers"]).json()
    assert len(u2_apps) == 1
    assert u2_apps[0]["title"] == "React Frontend Engineer"


def test_get_applications_status_filter_valid(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify filtering applications by status parameter (case-insensitive).
    """
    client.post("/applications", json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    client.post("/applications", json={"job_id": seed_test_jobs[1].id, "status": "Interview", "match_score": 90.0}, headers=test_user["headers"])

    res1 = client.get("/applications?status=Interview", headers=test_user["headers"])
    assert res1.status_code == 200
    apps1 = res1.json()
    assert len(apps1) == 1
    assert apps1[0]["status"] == "Interview"

    res2 = client.get("/applications?status=applied", headers=test_user["headers"])
    assert res2.status_code == 200
    apps2 = res2.json()
    assert len(apps2) == 1
    assert apps2[0]["status"] == "Applied"


def test_get_applications_status_filter_invalid(client, test_user):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify passing invalid status returns 422 Unprocessable Entity VALIDATION_ERROR.
    """
    response = client.get("/applications?status=bogus_status", headers=test_user["headers"])
    assert response.status_code == 422
    data = response.json()
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_get_applications_search_job_title_and_company(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify partial keyword search across job title, company, and application notes.
    """
    client.post("/applications", json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0, "notes": "Applied via referral"}, headers=test_user["headers"])
    client.post("/applications", json={"job_id": seed_test_jobs[1].id, "status": "Interview", "match_score": 90.0, "notes": "Direct portal"}, headers=test_user["headers"])

    # Search title
    res1 = client.get("/applications?search=Python", headers=test_user["headers"]).json()
    assert len(res1) == 1
    assert res1[0]["title"] == "Senior Python Developer"

    # Search company
    res2 = client.get("/applications?search=DesignSync", headers=test_user["headers"]).json()
    assert len(res2) == 1
    assert res2[0]["company"] == "DesignSync"

    # Search notes
    res3 = client.get("/applications?search=referral", headers=test_user["headers"]).json()
    assert len(res3) == 1
    assert res3[0]["notes"] == "Applied via referral"

    # Safe empty search
    res4 = client.get("/applications?search=   ", headers=test_user["headers"]).json()
    assert len(res4) == 2


def test_get_applications_pagination_limit_offset(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify limit and offset pagination.
    """
    client.post("/applications", json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    client.post("/applications", json={"job_id": seed_test_jobs[1].id, "status": "Interview", "match_score": 90.0}, headers=test_user["headers"])

    # Page 1: limit 1, offset 0
    p1 = client.get("/applications?limit=1&offset=0", headers=test_user["headers"]).json()
    assert len(p1) == 1

    # Page 2: limit 1, offset 1
    p2 = client.get("/applications?limit=1&offset=1", headers=test_user["headers"]).json()
    assert len(p2) == 1
    assert p1[0]["id"] != p2[0]["id"]

    # Offset out of bounds
    p3 = client.get("/applications?limit=10&offset=10", headers=test_user["headers"]).json()
    assert len(p3) == 0


def test_get_applications_pagination_invalid_parameters(client, test_user):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify invalid limit/offset values return 422 Unprocessable Entity.
    """
    assert client.get("/applications?limit=0", headers=test_user["headers"]).status_code == 422
    assert client.get("/applications?limit=-5", headers=test_user["headers"]).status_code == 422
    assert client.get("/applications?limit=101", headers=test_user["headers"]).status_code == 422
    assert client.get("/applications?offset=-1", headers=test_user["headers"]).status_code == 422


def test_get_applications_combined_filters(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER ENHANCEMENT (P2-02):
    Verify combining status, search, limit, and offset query parameters.
    """
    client.post("/applications", json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    client.post("/applications", json={"job_id": seed_test_jobs[1].id, "status": "Interview", "match_score": 90.0}, headers=test_user["headers"])

    res = client.get("/applications?status=Applied&search=Python&limit=10&offset=0", headers=test_user["headers"])
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) == 1
    assert apps[0]["title"] == "Senior Python Developer"
    assert apps[0]["status"] == "Applied"


def test_get_applications_sql_injection_and_wildcard_safety(client, test_user, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P2-02):
    Verify SQL injection attempts and wildcard-heavy search strings execute safely without database error.
    """
    client.post("/applications", json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])

    injection_strings = [
        "' OR 1=1; --",
        "'; DROP TABLE application_tracker; --",
        "%%%%%",
        "\\\\\\\\\\"
    ]
    for attack in injection_strings:
        res = client.get(f"/applications?search={attack}", headers=test_user["headers"])
        assert res.status_code == 200
        assert isinstance(res.json(), list)
