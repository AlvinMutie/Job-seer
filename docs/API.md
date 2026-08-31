# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | Public Job Discovery & Search |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — TF-IDF & Skill Match |
| `/tailor-resume` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Resume Tailoring Advice |
| `/generate-cover-letter` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Cover Letter Generation |
| `/me` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Profile Retrieval |
| `/profile` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Career Preferences Update |
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary (10MB, PDF/DOCX/TXT) |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Tracked Applications |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Standard Error Response Format (P2-01)

All HTTP error responses return a standardized JSON structure:

```json
{
  "detail": "The requested job was not found.",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested job was not found.",
    "details": null
  }
}
```

For validation errors (`422 Unprocessable Entity`), structured field details are returned:

```json
{
  "detail": "Request validation error: invalid fields provided",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation error: invalid fields provided",
    "details": [
      {
        "field": "email",
        "message": "field required"
      }
    ]
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (422) — Missing or invalid request parameters
- `AUTHENTICATION_REQUIRED` (401) — Missing Authorization header
- `INVALID_CREDENTIALS` (401) — Incorrect login username or password
- `TOKEN_INVALID` (401) — Invalid or tampered Bearer token
- `RESOURCE_NOT_FOUND` (404) — Requested database resource not found
- `CONFLICT` (400) — Resource conflict (e.g. email already registered)
- `UNSUPPORTED_FILE_TYPE` (400) — Forbidden upload extension
- `INVALID_FILE_CONTENT` (400) — Invalid MIME magic bytes or non-UTF-8 text
- `UPLOAD_TOO_LARGE` (413) — Upload size exceeds 10MB limit
- `INTERNAL_SERVER_ERROR` (500) — Unhandled server error (sanitized output)

---

## CORS Security Policy (P0-04)

- **Allowed Origins**: Configured via `settings.ALLOWED_ORIGINS` (default: `http://localhost:5173,http://localhost:3000`).
- **Wildcard Prohibition**: Wildcard `allow_origins=["*"]` is eliminated.
- **Credentials Support**: `allow_credentials=True` is enabled strictly for allowed origins.

---

## Detailed Endpoint Specifications

### 1. Public Endpoints

#### `GET /`
- **Description**: Public health check.
- **Request Parameters**: None.
- **Response Format**: `{"status": "running", "version": "1.0.0"}`

#### `POST /register`
- **Description**: Registers a new user account.
- **Request Body**: `{"email": "user@example.com", "password": "...", "full_name": "..."}`
- **Response Format**: `{"access_token": "...", "token_type": "bearer"}`

#### `POST /login`
- **Description**: Authenticates user credentials.
- **Content-Type**: `application/x-www-form-urlencoded`
- **Form Data**: `username=user@example.com&password=...`
- **Response Format**: `{"access_token": "...", "token_type": "bearer"}`

#### `GET /jobs`
- **Description**: Public job discovery search.
- **Query Parameters**: `keywords` (string, optional), `location` (string, optional)
- **Response Format**: List of Job objects.

---

### 2. Authenticated Endpoints

#### `POST /match`
- **Description**: Calculates statistical NLP skill overlap between resume and job description.
- **Header**: `Authorization: Bearer <token>`
- **Form Data**: `resume_text` (string), `job_id` (integer)

#### `POST /tailor-resume`
- **Description**: Generates bullet point tailoring suggestions for target job.
- **Header**: `Authorization: Bearer <token>`
- **Form Data**: `resume_text` (string), `job_id` (integer)

#### `POST /generate-cover-letter`
- **Description**: Generates template cover letter.
- **Header**: `Authorization: Bearer <token>`
- **Form Data**: `job_id` (integer), `candidate_name` (string), `resume_text` (string)
