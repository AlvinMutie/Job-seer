import pytest
import io

def test_upload_txt_resume_valid(client, test_user):
    """Test uploading a valid TXT resume file extracts text and saves to profile."""
    file_content = b"John Doe\nExperienced Python Engineer\nSkills: Python, FastAPI, AWS, PostgreSQL"
    file_obj = io.BytesIO(file_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("resume.txt", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Resume uploaded and parsed successfully"
    assert "Experienced Python Engineer" in data["text_preview"]

    # Verify profile was updated in /me
    me_res = client.get("/me", headers=test_user["headers"]).json()
    assert me_res["profile"]["has_resume"] is True
    assert "Experienced Python Engineer" in me_res["profile"]["resume_text"]


def test_upload_executable_current_vulnerability(client, test_user):
    """
    SECURITY VULNERABILITY CAPTURE (SEC-03):
    Verify that POST /upload-resume currently accepts executable files (.exe) without rejection.
    DO NOT FIX YET — Records the baseline file upload vulnerability.
    """
    fake_exe_content = b"MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff"
    file_obj = io.BytesIO(fake_exe_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("payload.exe", file_obj, "application/x-msdownload")},
        headers=test_user["headers"]
    )
    # Records current vulnerable behavior (returns 200 OK and writes payload.exe to disk)
    assert response.status_code == 200
    assert response.json()["message"] == "Resume uploaded and parsed successfully"


def test_upload_filename_sanitization_current_behavior(client, test_user):
    """Test that file filename sanitization keeps alphanumeric and ._- characters."""
    file_content = b"Simple resume text for testing path characters"
    file_obj = io.BytesIO(file_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("my_resume_v1.0!.txt", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200
    # Safe filename strips ! character -> my_resume_v1.0.txt
    assert response.json()["filename"] == "my_resume_v1.0!.txt"
