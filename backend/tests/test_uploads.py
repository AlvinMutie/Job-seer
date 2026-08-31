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


def test_upload_pdf_resume_valid(client, test_user):
    """Test uploading a valid PDF file with %PDF- header is accepted."""
    # Fake minimal valid PDF structure with %PDF- header
    pdf_content = b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    file_obj = io.BytesIO(pdf_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("my_resume.pdf", file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200
    assert response.json()["message"] == "Resume uploaded and parsed successfully"


def test_upload_executable_rejected(client, test_user):
    """
    SECURITY BOUNDARY VERIFICATION (P0-03):
    Verify that POST /upload-resume rejects executable files (.exe) with 400 Bad Request.
    """
    fake_exe_content = b"MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff"
    file_obj = io.BytesIO(fake_exe_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("payload.exe", file_obj, "application/x-msdownload")},
        headers=test_user["headers"]
    )
    assert response.status_code == 400
    assert "Unsupported file extension" in response.json()["detail"]


def test_upload_renamed_exe_as_pdf_rejected(client, test_user):
    """
    SECURITY BOUNDARY VERIFICATION (P0-03):
    Verify that an executable file renamed to .pdf fails MIME magic byte validation.
    """
    fake_exe_content = b"MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff"
    file_obj = io.BytesIO(fake_exe_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("disguised_payload.pdf", file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code == 400
    assert "MIME magic bytes" in response.json()["detail"]


def test_upload_oversized_file_rejected(client, test_user):
    """
    SECURITY BOUNDARY VERIFICATION (P0-03):
    Verify that files exceeding the 10MB limit are rejected with 400 Bad Request.
    """
    # 10.5 MB fake PDF file
    oversized_content = b"%PDF-1.4\n" + (b"0" * (10 * 1024 * 1024 + 500))
    file_obj = io.BytesIO(oversized_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("large_resume.pdf", file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code == 413
    assert "File size exceeds maximum allowed limit of 10MB" in response.json()["detail"]


def test_upload_empty_file_rejected(client, test_user):
    """Verify that empty (0 bytes) files are rejected with 400 Bad Request."""
    empty_content = b""
    file_obj = io.BytesIO(empty_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("empty.txt", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 400
    assert "file is empty" in response.json()["detail"]


def test_upload_unauthenticated_rejected(client):
    """Verify that uploading a resume without authentication returns 401 Unauthorized."""
    file_content = b"Valid text content"
    file_obj = io.BytesIO(file_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("resume.txt", file_obj, "text/plain")}
    )
    assert response.status_code == 401
