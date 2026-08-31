import os
import io
import pytest
from app.models.models import Profile

pytestmark = [pytest.mark.security, pytest.mark.unit]


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


def test_upload_rejected_extensions(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that files with forbidden extensions (.py, .sh, .js, .html, .php, .jpg, .png, .zip, .doc) are rejected.
    """
    forbidden_extensions = [".py", ".sh", ".js", ".html", ".php", ".jpg", ".png", ".zip", ".doc"]
    for ext in forbidden_extensions:
        file_obj = io.BytesIO(b"Sample file content for testing")
        filename = f"file{ext}"
        response = client.post(
            "/upload-resume",
            files={"file": (filename, file_obj, "application/octet-stream")},
            headers=test_user["headers"]
        )
        assert response.status_code == 400, f"Extension {ext} was not rejected with 400"
        assert "Unsupported file extension" in response.json()["detail"]


def test_upload_case_insensitive_extensions(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that valid extensions in uppercase/mixed case (.PDF, .Pdf, .TxT, .DOCX) are accepted.
    """
    txt_content = b"John Doe\nPython Developer"
    file_obj = io.BytesIO(txt_content)
    response = client.post(
        "/upload-resume",
        files={"file": ("resume.TxT", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200

    pdf_content = b"%PDF-1.4\nSample content"
    file_obj2 = io.BytesIO(pdf_content)
    response2 = client.post(
        "/upload-resume",
        files={"file": ("resume.PDF", file_obj2, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response2.status_code == 200


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


def test_upload_non_zip_as_docx_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that plain text content disguised as .docx (missing PK zip header) is rejected.
    """
    fake_docx_content = b"This is plain text and not a PK zip format"
    file_obj = io.BytesIO(fake_docx_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("resume.docx", file_obj, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=test_user["headers"]
    )
    assert response.status_code == 400
    assert "MIME magic bytes" in response.json()["detail"]


def test_upload_invalid_utf8_as_txt_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that binary content containing invalid UTF-8 bytes disguised as .txt is rejected.
    """
    invalid_utf8 = b"\x80\x81\x82\xff\xfe"
    file_obj = io.BytesIO(invalid_utf8)

    response = client.post(
        "/upload-resume",
        files={"file": ("resume.txt", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 400
    assert "valid text/UTF-8 encoding" in response.json()["detail"]


def test_upload_oversized_file_rejected(client, test_user):
    """
    SECURITY BOUNDARY VERIFICATION (P0-03):
    Verify that files exceeding the 10MB limit (10,485,760 bytes) are rejected with 413.
    """
    oversized_content = b"%PDF-1.4\n" + (b"0" * (10 * 1024 * 1024 + 500))
    file_obj = io.BytesIO(oversized_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("large_resume.pdf", file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code == 413
    assert "File size exceeds maximum allowed limit of 10MB" in response.json()["detail"]


def test_upload_size_boundary_below_and_at_limit(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Test exact file size boundaries (below limit vs above limit).
    """
    limit = 10 * 1024 * 1024  # 10 MB
    below_limit_content = b"A" * (limit - 1)
    file_obj = io.BytesIO(below_limit_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("valid_boundary.txt", file_obj, "text/plain")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200

    above_limit_content = b"A" * (limit + 1)
    file_obj2 = io.BytesIO(above_limit_content)

    response2 = client.post(
        "/upload-resume",
        files={"file": ("invalid_boundary.txt", file_obj2, "text/plain")},
        headers=test_user["headers"]
    )
    assert response2.status_code == 413


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


def test_path_traversal_filenames_safely_handled(client, test_user, db_session):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that path traversal attempts in client filenames cannot escape upload storage.
    """
    traversal_cases = [
        ("../../evil.txt", b"Valid TXT content for path traversal test", "text/plain"),
        ("../../../evil.pdf", b"%PDF-1.4\nValid PDF content", "application/pdf"),
        ("..\\..\\evil.txt", b"Valid TXT content for path traversal test", "text/plain"),
        ("/etc/passwd.txt", b"Valid TXT content for path traversal test", "text/plain"),
        ("C:\\Windows\\System32\\evil.txt", b"Valid TXT content for path traversal test", "text/plain")
    ]
    for filename, content, mime in traversal_cases:
        file_obj = io.BytesIO(content)

        response = client.post(
            "/upload-resume",
            files={"file": (filename, file_obj, mime)},
            headers=test_user["headers"]
        )
        assert response.status_code == 200

        # Query database profile to inspect stored path
        profile = db_session.query(Profile).filter(Profile.user_id == test_user["user"].id).first()
        assert profile is not None
        assert "evil" not in profile.resume_path
        assert "passwd" not in profile.resume_path
        assert profile.resume_path.startswith("uploads/resume_")
        assert os.path.dirname(profile.resume_path) == "uploads"


def test_server_generated_uuid_filename(client, test_user, db_session):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that special/malformed filenames are assigned a secure server-generated UUID filename.
    """
    special_name = "../../my_resume<script>alert(1)</script>.pdf"
    pdf_content = b"%PDF-1.4\nSample resume content"
    file_obj = io.BytesIO(pdf_content)

    response = client.post(
        "/upload-resume",
        files={"file": (special_name, file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code == 200

    profile = db_session.query(Profile).filter(Profile.user_id == test_user["user"].id).first()
    assert profile is not None
    stored_file = os.path.basename(profile.resume_path)
    assert stored_file.startswith(f"resume_{test_user['user'].id}_")
    assert stored_file.endswith(".pdf")
    assert "<script>" not in stored_file


def test_resume_replacement_and_old_file_cleanup(client, test_user, db_session):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify uploading a second resume replaces the old file and deletes old file from disk.
    """
    # First upload
    file1 = io.BytesIO(b"Resume Version 1 Text Content")
    res1 = client.post(
        "/upload-resume",
        files={"file": ("resume_v1.txt", file1, "text/plain")},
        headers=test_user["headers"]
    )
    assert res1.status_code == 200
    profile1 = db_session.query(Profile).filter(Profile.user_id == test_user["user"].id).first()
    path1 = profile1.resume_path
    assert os.path.isfile(path1)

    # Second upload
    file2 = io.BytesIO(b"Resume Version 2 Text Content")
    res2 = client.post(
        "/upload-resume",
        files={"file": ("resume_v2.txt", file2, "text/plain")},
        headers=test_user["headers"]
    )
    assert res2.status_code == 200
    db_session.refresh(profile1)
    path2 = profile1.resume_path

    assert path1 != path2
    assert os.path.isfile(path2)
    assert not os.path.exists(path1), f"Old resume file {path1} was not cleaned up"


def test_user_resume_storage_isolation(client, test_user, secondary_user, db_session):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify User 1 and User 2 uploads are stored independently without overwriting or deleting each other.
    """
    # User 1 upload
    f1 = io.BytesIO(b"User 1 Resume Text")
    client.post("/upload-resume", files={"file": ("u1.txt", f1, "text/plain")}, headers=test_user["headers"])
    p1 = db_session.query(Profile).filter(Profile.user_id == test_user["user"].id).first().resume_path

    # User 2 upload
    f2 = io.BytesIO(b"User 2 Resume Text")
    client.post("/upload-resume", files={"file": ("u2.txt", f2, "text/plain")}, headers=secondary_user["headers"])
    p2 = db_session.query(Profile).filter(Profile.user_id == secondary_user["user"].id).first().resume_path

    assert p1 != p2
    assert os.path.isfile(p1)
    assert os.path.isfile(p2)


def test_corrupted_pdf_parsing_failure_handled(client, test_user):
    """
    SECURITY SAFETY GATE (P1-05):
    Verify that a corrupted PDF header passes signature checks but fails parsing gracefully (400 Bad Request, no 500).
    """
    corrupted_pdf = b"%PDF-1.4\nCorrupted binary junk without PDF structure \xff\xfe\xfd"
    file_obj = io.BytesIO(corrupted_pdf)

    response = client.post(
        "/upload-resume",
        files={"file": ("corrupt.pdf", file_obj, "application/pdf")},
        headers=test_user["headers"]
    )
    assert response.status_code in [200, 400]
    assert response.status_code != 500


def test_upload_unauthenticated_rejected(client):
    """Verify that uploading a resume without authentication returns 401 Unauthorized."""
    file_content = b"Valid text content"
    file_obj = io.BytesIO(file_content)

    response = client.post(
        "/upload-resume",
        files={"file": ("resume.txt", file_obj, "text/plain")}
    )
    assert response.status_code == 401
