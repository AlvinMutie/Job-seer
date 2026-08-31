import pytest

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_generate_and_persist_tailored_resume(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify POST /resume/tailor generates version 1 tailored resume and persists record.
    """
    # Upload original resume
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nSummary\nPython Developer", "text/plain")}, headers=test_user["headers"])

    job = seed_test_jobs[0]
    payload = {"job_id": job.id}
    res = client.post("/resume/tailor", data=payload, headers=test_user["headers"])
    assert res.status_code == 200
    data = res.json()

    assert data["version"] == 1
    assert data["job_id"] == job.id
    assert "TAILORED RESUME" in data["tailored_resume_text"]
    assert data["job_title"] == job.title
    assert data["company"] == job.company


def test_tailored_resume_version_increment(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify tailoring the same job multiple times increments version deterministically (v1 -> v2 -> v3).
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]

    # Version 1
    r1 = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    assert r1["version"] == 1

    # Version 2
    r2 = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    assert r2["version"] == 2

    # Version 3
    r3 = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    assert r3["version"] == 3


def test_independent_versions_per_job(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify different jobs maintain independent version numbering.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job1 = seed_test_jobs[0]
    job2 = seed_test_jobs[1]

    # Job 1 -> Version 1
    r1 = client.post("/resume/tailor", data={"job_id": job1.id}, headers=test_user["headers"]).json()
    assert r1["version"] == 1

    # Job 2 -> Version 1
    r2 = client.post("/resume/tailor", data={"job_id": job2.id}, headers=test_user["headers"]).json()
    assert r2["version"] == 1


def test_list_and_get_tailored_resumes(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify GET /resume/tailored and GET /resume/tailored/{id} retrieve saved tailored versions.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    tailored = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    t_id = tailored["id"]

    # List all
    list_res = client.get("/resume/tailored", headers=test_user["headers"])
    assert list_res.status_code == 200
    records = list_res.json()
    assert len(records) >= 1
    assert records[0]["id"] == t_id

    # Get single
    single_res = client.get(f"/resume/tailored/{t_id}", headers=test_user["headers"])
    assert single_res.status_code == 200
    assert single_res.json()["id"] == t_id


def test_compare_tailored_resume_diff(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify GET /resume/tailored/{id}/compare produces structured line-by-line diff.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    tailored = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()

    diff_res = client.get(f"/resume/tailored/{tailored['id']}/compare", headers=test_user["headers"])
    assert diff_res.status_code == 200
    diff_data = diff_res.json()

    assert "diff_lines" in diff_data
    assert "added_count" in diff_data
    assert "removed_count" in diff_data
    assert "unchanged_count" in diff_data
    assert diff_data["added_count"] > 0


def test_delete_tailored_resume(client, test_user, seed_test_jobs):
    """
    RESUME TAILORING V2 (P3-04):
    Verify DELETE /resume/tailored/{id} deletes the saved version cleanly.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    tailored = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    t_id = tailored["id"]

    # Delete
    del_res = client.delete(f"/resume/tailored/{t_id}", headers=test_user["headers"])
    assert del_res.status_code == 200

    # Verify deleted
    get_res = client.get(f"/resume/tailored/{t_id}", headers=test_user["headers"])
    assert get_res.status_code == 404
    assert get_res.json()["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_tailoring_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-04):
    Verify unauthenticated users cannot tailor, list, view, compare, or delete tailored resumes.
    """
    assert client.post("/resume/tailor", data={"job_id": 1}).status_code == 401
    assert client.get("/resume/tailored").status_code == 401
    assert client.get("/resume/tailored/1").status_code == 401
    assert client.get("/resume/tailored/1/compare").status_code == 401
    assert client.delete("/resume/tailored/1").status_code == 401


def test_tailoring_ownership_isolation(client, test_user, secondary_user, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-04):
    Verify User A cannot retrieve, compare, or delete User B's tailored resume (returns 404).
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"User 1 John Doe", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    tailored1 = client.post("/resume/tailor", data={"job_id": job.id}, headers=test_user["headers"]).json()
    t_id1 = tailored1["id"]

    # User 2 attempts to view User 1's tailored resume
    assert client.get(f"/resume/tailored/{t_id1}", headers=secondary_user["headers"]).status_code == 404
    # User 2 attempts to compare User 1's tailored resume
    assert client.get(f"/resume/tailored/{t_id1}/compare", headers=secondary_user["headers"]).status_code == 404
    # User 2 attempts to delete User 1's tailored resume
    assert client.delete(f"/resume/tailored/{t_id1}", headers=secondary_user["headers"]).status_code == 404
