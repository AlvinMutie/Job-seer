import pytest

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_get_dashboard_analytics_success_with_resume(client, test_user, seed_test_jobs):
    """
    COMMAND CENTER DASHBOARD (P3-07):
    Verify GET /dashboard/analytics computes complete analytics for user with uploaded resume.
    """
    # 1. Upload resume
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nSummary\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job1 = seed_test_jobs[0]
    job2 = seed_test_jobs[1]

    # 2. Track application
    client.post("/applications", json={"job_id": job1.id, "status": "Applied", "match_score": 85.0}, headers=test_user["headers"])
    client.post("/applications", json={"job_id": job2.id, "status": "Interview", "match_score": 95.0}, headers=test_user["headers"])

    # 3. Create tailored resume
    client.post("/resume/tailor", data={"job_id": job1.id}, headers=test_user["headers"])

    # 4. Create cover letter
    client.post("/cover-letters", data={"job_id": job1.id, "tone": "Professional"}, headers=test_user["headers"])

    # 5. Fetch dashboard analytics
    res = client.get("/dashboard/analytics", headers=test_user["headers"])
    assert res.status_code == 200
    data = res.json()

    assert data["total_applications"] == 2
    assert data["status_counts"]["applied"] == 1
    assert data["status_counts"]["interview"] == 1
    assert data["average_match_score"] == 90.0
    assert data["ats_health_score"] is not None
    assert data["ats_classification"] != "No Resume Uploaded"
    assert data["tailored_resumes_count"] >= 1
    assert data["cover_letters_count"] >= 1
    assert len(data["recent_applications"]) == 2
    assert len(data["recent_tailored_resumes"]) >= 1
    assert len(data["recent_cover_letters"]) >= 1


def test_get_dashboard_analytics_without_resume(client, test_user):
    """
    COMMAND CENTER DASHBOARD (P3-07):
    Verify GET /dashboard/analytics handles users without an uploaded resume gracefully.
    """
    res = client.get("/dashboard/analytics", headers=test_user["headers"])
    assert res.status_code == 200
    data = res.json()

    assert data["total_applications"] == 0
    assert data["ats_health_score"] is None
    assert data["ats_classification"] == "No Resume Uploaded"


@pytest.mark.security
def test_dashboard_analytics_unauthenticated_rejected(client):
    """
    SECURITY SAFETY GATE (P3-07):
    Verify unauthenticated users cannot access dashboard analytics.
    """
    res = client.get("/dashboard/analytics")
    assert res.status_code == 401


@pytest.mark.security
def test_dashboard_analytics_ownership_isolation(client, test_user, secondary_user, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-07):
    Verify User A's analytics do not include User B's applications, tailored resumes, or cover letters.
    """
    job = seed_test_jobs[0]
    client.post("/applications", json={"job_id": job.id, "status": "Applied", "match_score": 80.0}, headers=test_user["headers"])

    # User 2 checks analytics
    res2 = client.get("/dashboard/analytics", headers=secondary_user["headers"])
    assert res2.status_code == 200
    data2 = res2.json()

    assert data2["total_applications"] == 0
    assert data2["tailored_resumes_count"] == 0
    assert data2["cover_letters_count"] == 0
