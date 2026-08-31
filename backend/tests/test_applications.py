import pytest

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
    # First post: Applied
    payload1 = {
        "job_id": seed_test_jobs[0].id,
        "status": "Applied",
        "match_score": 75.0
    }
    client.post("/applications", json=payload1, headers=test_user["headers"])

    # Second post: Interview
    payload2 = {
        "job_id": seed_test_jobs[0].id,
        "status": "Interview",
        "match_score": 75.0
    }
    response = client.post("/applications", json=payload2, headers=test_user["headers"])
    assert response.status_code == 200
    assert response.json()["message"] == "Application updated"

    # Verify status changed to Interview
    apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(apps) == 1
    assert apps[0]["status"] == "Interview"


def test_applications_user_isolation(client, test_user, secondary_user, seed_test_jobs):
    """Verify that User 1 and User 2 applications remain strictly isolated."""
    # User 1 applies to Job 0
    client.post(
        "/applications",
        json={"job_id": seed_test_jobs[0].id, "status": "Applied", "match_score": 80.0},
        headers=test_user["headers"]
    )

    # User 2 applies to Job 1
    client.post(
        "/applications",
        json={"job_id": seed_test_jobs[1].id, "status": "Offer", "match_score": 95.0},
        headers=secondary_user["headers"]
    )

    # User 1 list
    u1_apps = client.get("/applications", headers=test_user["headers"]).json()
    assert len(u1_apps) == 1
    assert u1_apps[0]["title"] == "Senior Python Developer"

    # User 2 list
    u2_apps = client.get("/applications", headers=secondary_user["headers"]).json()
    assert len(u2_apps) == 1
    assert u2_apps[0]["title"] == "React Frontend Engineer"
