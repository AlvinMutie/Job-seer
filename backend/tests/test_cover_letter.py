import pytest

pytestmark = [pytest.mark.integration, pytest.mark.regression]


def test_generate_and_persist_cover_letter(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify POST /cover-letters generates Professional version 1 cover letter and persists record.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]

    payload = {"job_id": job.id, "tone": "Professional"}
    res = client.post("/cover-letters", data=payload, headers=test_user["headers"])
    assert res.status_code == 200
    data = res.json()

    assert data["version"] == 1
    assert data["tone"] == "Professional"
    assert data["job_id"] == job.id
    assert "Dear Hiring Manager" in data["content"]
    assert job.company in data["content"]


def test_cover_letter_version_increment_same_tone(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify generating for same user + job + tone increments version (v1 -> v2 -> v3).
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]

    r1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Professional"}, headers=test_user["headers"]).json()
    assert r1["version"] == 1

    r2 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Professional"}, headers=test_user["headers"]).json()
    assert r2["version"] == 2


def test_independent_versions_per_tone(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify different tones maintain independent version counts (Professional v1, Enthusiastic v1, Executive v1, Technical v1).
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]

    prof1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Professional"}, headers=test_user["headers"]).json()
    assert prof1["version"] == 1

    enth1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Enthusiastic"}, headers=test_user["headers"]).json()
    assert enth1["version"] == 1

    exec1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Executive"}, headers=test_user["headers"]).json()
    assert exec1["version"] == 1

    tech1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Technical"}, headers=test_user["headers"]).json()
    assert tech1["version"] == 1


def test_list_and_filter_cover_letters(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify GET /cover-letters list and query filtering by job_id and tone.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job1 = seed_test_jobs[0]
    job2 = seed_test_jobs[1]

    client.post("/cover-letters", data={"job_id": job1.id, "tone": "Professional"}, headers=test_user["headers"])
    client.post("/cover-letters", data={"job_id": job1.id, "tone": "Technical"}, headers=test_user["headers"])
    client.post("/cover-letters", data={"job_id": job2.id, "tone": "Professional"}, headers=test_user["headers"])

    # List all
    all_res = client.get("/cover-letters", headers=test_user["headers"])
    assert len(all_res.json()) >= 3

    # Filter by job1
    job1_res = client.get(f"/cover-letters?job_id={job1.id}", headers=test_user["headers"])
    assert len(job1_res.json()) == 2

    # Filter by tone
    tech_res = client.get("/cover-letters?tone=Technical", headers=test_user["headers"])
    assert len(tech_res.json()) == 1
    assert tech_res.json()[0]["tone"] == "Technical"


def test_get_and_delete_cover_letter(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify GET /cover-letters/{id} and DELETE /cover-letters/{id}.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    letter = client.post("/cover-letters", data={"job_id": job.id, "tone": "Professional"}, headers=test_user["headers"]).json()
    l_id = letter["id"]

    # Get single
    get_res = client.get(f"/cover-letters/{l_id}", headers=test_user["headers"])
    assert get_res.status_code == 200
    assert get_res.json()["id"] == l_id

    # Delete
    del_res = client.delete(f"/cover-letters/{l_id}", headers=test_user["headers"])
    assert del_res.status_code == 200

    # Verify 404 after delete
    assert client.get(f"/cover-letters/{l_id}", headers=test_user["headers"]).status_code == 404


def test_invalid_tone_rejected(client, test_user, seed_test_jobs):
    """
    INTELLIGENT COVER LETTERS V2 (P3-05):
    Verify invalid tone values are rejected with 422 Unprocessable Entity.
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"John Doe\nPython Developer", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]

    payload = {"job_id": job.id, "tone": "Sarcastic"}
    res = client.post("/cover-letters", data=payload, headers=test_user["headers"])
    assert res.status_code == 422


@pytest.mark.security
def test_cover_letter_unauthenticated_rejected(client, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-05):
    Verify unauthenticated users cannot generate, list, view, or delete cover letters.
    """
    assert client.post("/cover-letters", data={"job_id": 1, "tone": "Professional"}).status_code == 401
    assert client.get("/cover-letters").status_code == 401
    assert client.get("/cover-letters/1").status_code == 401
    assert client.delete("/cover-letters/1").status_code == 401


@pytest.mark.security
def test_cover_letter_ownership_isolation(client, test_user, secondary_user, seed_test_jobs):
    """
    SECURITY SAFETY GATE (P3-05):
    Verify User A cannot retrieve or delete User B's cover letter (returns 404).
    """
    client.post("/upload-resume", files={"file": ("cv.txt", b"User 1 John Doe", "text/plain")}, headers=test_user["headers"])
    job = seed_test_jobs[0]
    letter1 = client.post("/cover-letters", data={"job_id": job.id, "tone": "Professional"}, headers=test_user["headers"]).json()
    l_id1 = letter1["id"]

    # User 2 attempts to view User 1's cover letter
    assert client.get(f"/cover-letters/{l_id1}", headers=secondary_user["headers"]).status_code == 404
    # User 2 attempts to delete User 1's cover letter
    assert client.delete(f"/cover-letters/{l_id1}", headers=secondary_user["headers"]).status_code == 404
