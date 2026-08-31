import os
import base64
from datetime import datetime, timedelta, timezone
import pytest
from jose import jwt

from app.auth import get_password_hash, verify_password, create_access_token
from app.core.config import settings
from app.models.models import User

pytestmark = [pytest.mark.security, pytest.mark.unit]


def test_register_valid_user(client):
    """Test registering a new user returns 200 OK and Bearer access token."""
    payload = {
        "full_name": "Alice Smith",
        "email": "alice@example.com",
        "password": "Password123!"
    }
    response = client.post("/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    # Ensure sensitive data is not returned in response
    assert "hashed_password" not in data
    assert "password" not in data


def test_register_duplicate_email(client, test_user):
    """Test registering with an existing email returns 400 Bad Request."""
    payload = {
        "full_name": "Duplicate User",
        "email": test_user["email"],
        "password": "AnotherPassword123!"
    }
    response = client.post("/register", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_register_missing_fields(client):
    """Test registering without required fields returns 422 Unprocessable Entity."""
    payload = {
        "email": "incomplete@example.com"
    }
    response = client.post("/register", json=payload)
    assert response.status_code == 422


def test_login_valid_credentials(client, test_user):
    """Test login with valid form-encoded credentials returns Bearer access token."""
    login_data = {
        "username": test_user["email"],
        "password": test_user["password"]
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "hashed_password" not in data


def test_login_incorrect_password(client, test_user):
    """Test login with wrong password returns 401 Unauthorized."""
    login_data = {
        "username": test_user["email"],
        "password": "WrongPassword123!"
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_login_nonexistent_user(client):
    """Test login with nonexistent email returns 401 Unauthorized."""
    login_data = {
        "username": "nobody@example.com",
        "password": "SomePassword123!"
    }
    response = client.post("/login", data=login_data)
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"


def test_me_valid_jwt(client, test_user):
    """Test GET /me with valid JWT Bearer header returns user info."""
    response = client.get("/me", headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["full_name"] == "Test User"
    assert data["is_profile_complete"] is True
    assert data["profile"]["preferred_role"] == "Senior Python Developer"


def test_me_missing_jwt(client):
    """Test GET /me without Authorization header returns 401 Unauthorized."""
    response = client.get("/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_me_malformed_jwt(client):
    """Test GET /me with invalid JWT token returns 401 Unauthorized."""
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_expired_jwt_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that a JWT whose 'exp' claim is in the past is rejected with 401 Unauthorized.
    """
    past_exp = datetime.now(timezone.utc) - timedelta(minutes=10)
    expired_token = create_access_token(
        data={"sub": test_user["email"]},
        expires_delta=-timedelta(minutes=10)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_tampered_jwt_payload_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that modifying the payload of a valid JWT invalidates signature and returns 401.
    """
    valid_token = test_user["token"]
    parts = valid_token.split(".")
    assert len(parts) == 3
    
    # Tamper with the middle payload string
    tampered_payload = base64.b64encode(b'{"sub":"attacker@evil.com"}').decode("utf-8").rstrip("=")
    tampered_token = f"{parts[0]}.{tampered_payload}.{parts[2]}"
    
    headers = {"Authorization": f"Bearer {tampered_token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_invalid_jwt_signature_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that a JWT signed with an untrusted key is rejected with 401 Unauthorized.
    """
    untrusted_secret = "untrusted-secret-key-1234567890123"
    token = jwt.encode(
        {"sub": test_user["email"], "exp": datetime.now(timezone.utc) + timedelta(minutes=10)},
        untrusted_secret,
        algorithm=settings.ALGORITHM
    )
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_missing_sub_claim_rejected(client):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that a JWT lacking the required 'sub' identity claim is rejected with 401 Unauthorized.
    """
    token = jwt.encode(
        {"user_id": 123, "role": "admin", "exp": datetime.now(timezone.utc) + timedelta(minutes=10)},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_nonexistent_user_claim_rejected(client):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that a signed JWT referencing a non-existent database user is rejected with 401 Unauthorized.
    """
    token = create_access_token(data={"sub": "ghost.user@nonexistent-domain.com"})
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_invalid_bearer_schemes_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that authorization schemes other than 'Bearer' (e.g. Basic, Token) are rejected with 401.
    """
    token = test_user["token"]
    for scheme in ["Basic", "Token", "Digest"]:
        response = client.get("/me", headers={"Authorization": f"{scheme} {token}"})
        assert response.status_code == 401
        assert response.json()["detail"] == "Not authenticated"


def test_empty_bearer_token_rejected(client):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that empty Bearer headers return 401 Unauthorized.
    """
    response1 = client.get("/me", headers={"Authorization": "Bearer"})
    assert response1.status_code == 401
    
    response2 = client.get("/me", headers={"Authorization": "Bearer "})
    assert response2.status_code == 401


def test_unsupported_jwt_algorithm_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that tokens signed with unauthorized algorithms (e.g. HS512) are rejected with 401.
    """
    unsupported_token = jwt.encode(
        {"sub": test_user["email"], "exp": datetime.now(timezone.utc) + timedelta(minutes=10)},
        settings.SECRET_KEY,
        algorithm="HS512"
    )
    headers = {"Authorization": f"Bearer {unsupported_token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_jwt_with_invalid_exp_claim_rejected(client, test_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify that tokens with malformed expiration claims return 401 Unauthorized.
    """
    invalid_exp_token = jwt.encode(
        {"sub": test_user["email"], "exp": "invalid-exp-timestamp"},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    headers = {"Authorization": f"Bearer {invalid_exp_token}"}
    response = client.get("/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"


def test_user_identity_resolution_isolation(client, test_user, secondary_user):
    """
    SECURITY SAFETY GATE (P1-04):
    Verify valid JWT resolves the exact matching user identity and prevents cross-user resolution.
    """
    res1 = client.get("/me", headers=test_user["headers"])
    assert res1.status_code == 200
    assert res1.json()["email"] == test_user["email"]

    res2 = client.get("/me", headers=secondary_user["headers"])
    assert res2.status_code == 200
    assert res2.json()["email"] == secondary_user["email"]


def test_password_stored_as_hash_not_plaintext(db_session, test_user):
    """Verify user password stored in database is a valid bcrypt hash and not plaintext."""
    user = db_session.query(User).filter(User.email == test_user["email"]).first()
    assert user is not None
    assert user.hashed_password != test_user["password"]
    assert user.hashed_password.startswith("$2b$") or user.hashed_password.startswith("$2a$")


def test_password_hashing_without_monkeypatch():
    """Verify password hashing and verification APIs function cleanly."""
    plain = "MySecurePassword123!"
    hashed = get_password_hash(plain)
    assert hashed != plain
    assert verify_password(plain, hashed) is True
    assert verify_password("WrongPassword!", hashed) is False


def test_source_code_contains_no_bcrypt_monkeypatch():
    """
    SECURITY BOUNDARY VERIFICATION (P0-05):
    Programmatically verify that the fragile bcrypt.__about__ monkeypatch is absent from app source code.
    """
    app_dir = os.path.join(os.path.dirname(__file__), "..", "app")
    for root, _, files in os.walk(app_dir):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    assert "__about__" not in content, f"Monkeypatch string found in {file_path}"
