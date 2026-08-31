import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.errors import APIException, ErrorCode

pytestmark = [pytest.mark.security, pytest.mark.integration]


def test_validation_error_response_schema(client):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 422 RequestValidationError returns standardized schema with field details.
    """
    payload = {"email": "invalid_registration_missing_fields"}
    response = client.post("/register", json=payload)
    assert response.status_code == 422
    
    data = response.json()
    assert "detail" in data
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"
    assert data["error"]["message"] == "Request validation error: invalid fields provided"
    assert isinstance(data["error"]["details"], list)
    assert len(data["error"]["details"]) > 0
    assert "field" in data["error"]["details"][0]
    assert "message" in data["error"]["details"][0]


def test_authentication_required_response_schema(client):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 401 unauthenticated request returns standardized schema.
    """
    response = client.get("/me")
    assert response.status_code == 401
    
    data = response.json()
    assert data["detail"] == "Not authenticated"
    assert data["error"]["code"] == "AUTHENTICATION_REQUIRED"
    assert data["error"]["message"] == "Not authenticated"
    assert data["error"]["details"] is None


def test_invalid_credentials_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 401 incorrect login credentials returns INVALID_CREDENTIALS code.
    """
    login_data = {"username": test_user["email"], "password": "WrongPassword123!"}
    response = client.post("/login", data=login_data)
    assert response.status_code == 401
    
    data = response.json()
    assert data["detail"] == "Incorrect email or password"
    assert data["error"]["code"] == "INVALID_CREDENTIALS"
    assert data["error"]["message"] == "Incorrect email or password"


def test_token_invalid_response_schema(client):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 401 malformed Bearer token returns TOKEN_INVALID code.
    """
    headers = {"Authorization": "Bearer malformed.invalid.token"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    
    data = response.json()
    assert data["detail"] == "Could not validate credentials"
    assert data["error"]["code"] == "TOKEN_INVALID"


def test_resource_not_found_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 404 missing resource returns RESOURCE_NOT_FOUND code.
    """
    payload = {"resume_text": "Python developer", "job_id": 999999}
    response = client.post("/match", data=payload, headers=test_user["headers"])
    assert response.status_code == 404
    
    data = response.json()
    assert data["detail"] == "Job not found"
    assert data["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_conflict_error_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 400 duplicate registration returns CONFLICT code.
    """
    payload = {"full_name": "Dup User", "email": test_user["email"], "password": "Password123!"}
    response = client.post("/register", json=payload)
    assert response.status_code == 400
    
    data = response.json()
    assert data["detail"] == "Email already registered"
    assert data["error"]["code"] == "CONFLICT"


def test_unsupported_file_type_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 400 invalid extension returns UNSUPPORTED_FILE_TYPE code.
    """
    file_obj = io.BytesIO(b"content")
    response = client.post("/upload-resume", files={"file": ("test.exe", file_obj, "application/exe")}, headers=test_user["headers"])
    assert response.status_code == 400
    
    data = response.json()
    assert data["error"]["code"] == "UNSUPPORTED_FILE_TYPE"


def test_invalid_file_content_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 400 fake mime bytes returns INVALID_FILE_CONTENT code.
    """
    file_obj = io.BytesIO(b"MZfake_exe_bytes")
    response = client.post("/upload-resume", files={"file": ("fake.pdf", file_obj, "application/pdf")}, headers=test_user["headers"])
    assert response.status_code == 400
    
    data = response.json()
    assert data["error"]["code"] == "INVALID_FILE_CONTENT"


def test_upload_too_large_response_schema(client, test_user):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify 413 oversized upload returns UPLOAD_TOO_LARGE code.
    """
    oversized = b"%PDF-1.4\n" + (b"0" * (10 * 1024 * 1024 + 500))
    file_obj = io.BytesIO(oversized)
    response = client.post("/upload-resume", files={"file": ("large.pdf", file_obj, "application/pdf")}, headers=test_user["headers"])
    assert response.status_code == 413
    
    data = response.json()
    assert data["error"]["code"] == "UPLOAD_TOO_LARGE"


def test_internal_server_error_security_and_no_leakage(monkeypatch):
    """
    SECURITY & ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify that an unhandled internal exception generates HTTP 500 with safe response and zero detail leakage.
    """
    async def mock_crash(*args, **kwargs):
        raise RuntimeError("Sensitive internal database connection failed: postgresql://admin:secret_pass@127.0.0.1:5432/db")

    from app.services.job_service import job_service
    monkeypatch.setattr(job_service, "get_jobs", mock_crash)

    with TestClient(app, raise_server_exceptions=False) as safe_client:
        response = safe_client.get("/jobs")
        assert response.status_code == 500
        
        data = response.json()
        assert data["detail"] == "An unexpected server error occurred."
        assert data["error"]["code"] == "INTERNAL_SERVER_ERROR"
        assert data["error"]["message"] == "An unexpected server error occurred."
        assert data["error"]["details"] is None
        
        # CRITICAL SECURITY CHECK: Ensure sensitive details are not leaked in body or raw string
        raw_str = response.text
        assert "postgresql" not in raw_str
        assert "secret_pass" not in raw_str
        assert "RuntimeError" not in raw_str
        assert "Traceback" not in raw_str


def test_api_exception_direct_raising(client):
    """
    ERROR INFRASTRUCTURE VERIFICATION (P2-01):
    Verify custom APIException renders standardized schema correctly.
    """
    @app.get("/test-custom-api-exception")
    async def custom_exception_route():
        raise APIException(
            status_code=409,
            code=ErrorCode.CONFLICT,
            message="Resource conflict detected",
            details=[{"field": "resource_id", "message": "Duplicate key violation"}]
        )

    response = client.get("/test-custom-api-exception")
    assert response.status_code == 409
    
    data = response.json()
    assert data["detail"] == "Resource conflict detected"
    assert data["error"]["code"] == "CONFLICT"
    assert data["error"]["details"][0]["field"] == "resource_id"
