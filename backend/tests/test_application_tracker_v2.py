import pytest

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_create_and_get_application_v2(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify creating application with V2 dates and URL, and retrieving single application.
    """
    job = seed_test_jobs[0]
    payload = {
        "job_id": job.id,
        "status": "Applied",
        "match_score": 88.5,
        "notes": "Applied via corporate portal.",
        "applied_date": "2026-08-30",
        "interview_date": "2026-09-05",
        "follow_up_date": "2026-09-01",
        "application_url": "https://company.com/careers/123"
    }

    create_res = client.post("/applications", json=payload, headers=test_user["headers"])
    assert create_res.status_code == 200

    # Get list
    list_res = client.get("/applications", headers=test_user["headers"])
    assert list_res.status_code == 200
    apps = list_res.json()
    assert len(apps) >= 1
    app_id = apps[0]["id"]

    # Get single
    single_res = client.get(f"/applications/{app_id}", headers=test_user["headers"])
    assert single_res.status_code == 200
    data = single_res.json()

    assert data["job_id"] == job.id
    assert data["status"] == "Applied"
    assert data["applied_date"] == "2026-08-30"
    assert data["interview_date"] == "2026-09-05"
    assert data["follow_up_date"] == "2026-09-01"
    assert data["application_url"] == "https://company.com/careers/123"
    assert data["notes"] == "Applied via corporate portal."


def test_patch_application_status_and_kanban_persistence(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify PATCH /applications/{id} updates status for Kanban drag-and-drop movement.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 75.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    # Drag Applied -> Interview
    patch_res = client.patch(f"/applications/{app_id}", json={"status": "Interview"}, headers=test_user["headers"])
    assert patch_res.status_code == 200

    # Verify persisted status
    updated = client.get(f"/applications/{app_id}", headers=test_user["headers"]).json()
    assert updated["status"] == "Interview"


def test_patch_application_dates_and_url(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify PATCH /applications/{id} updates interview date, follow up date, and safe application URL.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 75.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    patch_res = client.patch(f"/applications/{app_id}", json={
        "interview_date": "2026-09-10",
        "follow_up_date": "2026-09-08",
        "application_url": "https://jobs.example.com/apply/999",
        "notes": "Interview scheduled with Engineering Lead."
    }, headers=test_user["headers"])
    assert patch_res.status_code == 200

    updated = client.get(f"/applications/{app_id}", headers=test_user["headers"]).json()
    assert updated["interview_date"] == "2026-09-10"
    assert updated["follow_up_date"] == "2026-09-08"
    assert updated["application_url"] == "https://jobs.example.com/apply/999"
    assert updated["notes"] == "Interview scheduled with Engineering Lead."


def test_delete_application(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify DELETE /applications/{id} deletes tracked application record cleanly.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    del_res = client.delete(f"/applications/{app_id}", headers=test_user["headers"])
    assert del_res.status_code == 200

    assert client.get(f"/applications/{app_id}", headers=test_user["headers"]).status_code == 404


def test_invalid_status_rejected(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify invalid status string is rejected with 422.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    res = client.patch(f"/applications/{app_id}", json={"status": "Hired"}, headers=test_user["headers"])
    assert res.status_code == 422


def test_invalid_date_format_rejected(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify malformed date string is rejected with 422.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    res = client.patch(f"/applications/{app_id}", json={"interview_date": "not-a-date"}, headers=test_user["headers"])
    assert res.status_code == 422


def test_unsafe_url_scheme_rejected(client, test_user, seed_test_jobs):
    """
    APPLICATION TRACKER V2 (P3-06):
    Verify javascript: URLs are rejected with 422.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    app_id = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    res = client.patch(f"/applications/{app_id}", json={"application_url": "javascript:alert(1)"}, headers=test_user["headers"])
    assert res.status_code == 422


@pytest.mark.security
def test_tracker_unauthenticated_rejected(client):
    """
    SECURITY SAFETY GATE (P3-06):
    Verify unauthenticated users cannot view, update, or delete applications.
    """
    assert client.get("/applications").status_code == 401
    assert client.get("/applications/1").status_code == 401
    assert client.patch("/applications/1", json={"status": "Applied"}).status_code == 401
    assert client.delete("/applications/1").status_code == 401


@pytest.mark.security
def test_tracker_ownership_isolation(client, test_user, secondary_user, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-06):
    Verify User A cannot retrieve, update, or delete User B's tracked application (returns 404).
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])
    app_id1 = client.get("/applications", headers=test_user["headers"]).json()[0]["id"]

    # User 2 attempts to get User 1's application
    assert client.get(f"/applications/{app_id1}", headers=secondary_user["headers"]).status_code == 404
    # User 2 attempts to patch User 1's application
    assert client.patch(f"/applications/{app_id1}", json={"status": "Interview"}, headers=secondary_user["headers"]).status_code == 404
    # User 2 attempts to delete User 1's application
    assert client.delete(f"/applications/{app_id1}", headers=secondary_user["headers"]).status_code == 404
