import pytest

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
