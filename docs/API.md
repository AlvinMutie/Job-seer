# API.md — REST API Contract & Security Boundary Specification

## Overview
All API endpoints are hosted by FastAPI at `http://localhost:8000`. The React frontend proxies `/api/*` requests to `http://localhost:8000/*`.

---

## Access Control & Security Boundaries

Each API endpoint is classified according to its intended access control boundary:

- **PUBLIC**: Accessible by any unauthenticated client.
- **AUTHENTICATED**: Requires a valid logged-in user JWT bearer token.
- **RESOURCE_OWNER**: Requires authentication AND verifies that the user owns the specific target resource.
- **ROLE_RESTRICTED**: Requires specific user roles or permissions (e.g. Admin).

---

## Endpoint Access Control Table

| Method | Endpoint | Access Boundary | Current Auth Status | Required Security Enforcement | Frontend Usage | Status |
| ------ | -------- | --------------- | ------------------- | ----------------------------- | -------------- | ------ |
| `GET` | `/` | **PUBLIC** | Unauthenticated | None (System health check) | None | WORKING |
| `POST` | `/register` | **PUBLIC** | Unauthenticated | Input validation & rate limiting | `Register.jsx`, `api.js` | WORKING |
| `POST` | `/login` | **PUBLIC** | Unauthenticated | Rate limiting on failed attempts | `Login.jsx`, `api.js` | WORKING |
| `GET` | `/jobs` | **PUBLIC** | Unauthenticated | Sanitized search parameters | `Dashboard.jsx`, `Matches.jsx` | WORKING |
| `POST` | `/match` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | `Dashboard.jsx`, `Matches.jsx` | WORKING (Security Gap) |
| `POST` | `/tailor-resume` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | `Dashboard.jsx` | WORKING (Security Gap) |
| `POST` | `/generate-cover-letter` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | Defined in `api.js` | IMPLEMENTED_BUT_UNUSED |
| `GET` | `/me` | **RESOURCE_OWNER** | Authenticated | Verified via `get_current_user` | `App.jsx`, `Dashboard.jsx` | WORKING |
| `POST` | `/profile` | **RESOURCE_OWNER** | Authenticated | Scoped to `current_user.id` | `ProfileSetup.jsx`, `Settings.jsx` | WORKING |
| `POST` | `/upload-resume` | **RESOURCE_OWNER** | Authenticated | Add file extension & mime validation | `ProfileSetup.jsx`, `ResumeHub.jsx` | WORKING (Upload Vulnerability) |
| `GET` | `/applications` | **RESOURCE_OWNER** | Authenticated | Query filtered to `user_id == current_user.id` | `Dashboard.jsx`, `Tracker.jsx` | WORKING |
| `POST` | `/applications` | **RESOURCE_OWNER** | Authenticated | Assert `user_id == current_user.id` on upsert | `Dashboard.jsx` | WORKING |

---

## Detailed Endpoint Specifications

### 1. Public Authentication Endpoints

#### `POST /register`
- **Boundary**: `PUBLIC`
- **Request Body** (`application/json`):
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer"
  }
  ```

#### `POST /login`
- **Boundary**: `PUBLIC`
- **Request Body** (`application/x-www-form-urlencoded`):
  - `username`: `john@example.com`
  - `password`: `SecurePassword123!`
- **Response** (`200 OK`):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer"
  }
  ```

---

### 2. Computational & AI Services Endpoints

#### `POST /match`
- **Boundary**: `AUTHENTICATED` (Currently unauthenticated in code — MUST fix)
- **Request Form Data**:
  - `resume_text` (string, required)
  - `job_id` (integer, required)
- **Response** (`200 OK`):
  ```json
  {
    "match_percentage": 78.5,
    "matched_skills": ["python", "fastapi"],
    "missing_skills": ["aws", "docker"],
    "tailoring_advice": [
      "• Highlight any past projects where you used AWS or similar tools."
    ]
  }
  ```

#### `POST /tailor-resume`
- **Boundary**: `AUTHENTICATED` (Currently unauthenticated in code — MUST fix)
- **Request Form Data**:
  - `resume_text` (string, required)
  - `job_id` (integer, required)
- **Response** (`200 OK`):
  ```json
  {
    "job_title": "Senior Python Developer",
    "company": "TechCorp",
    "suggestions": [
      {
        "section": "Professional Summary",
        "suggestion": "Integrate your knowledge of AWS, DOCKER directly into your summary...",
        "impact": "High - Targets initial screening"
      }
    ]
  }
  ```

---

### 3. Resource-Owner Protected Endpoints

#### `GET /me`
- **Boundary**: `RESOURCE_OWNER`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`):
  ```json
  {
    "id": 1,
    "email": "john@example.com",
    "full_name": "John Doe",
    "is_profile_complete": true,
    "profile": {
      "preferred_role": "Senior Python Developer",
      "skills": "Python, FastAPI, AWS",
      "experience_level": "Senior",
      "has_resume": true,
      "resume_text": "Experienced Python Developer..."
    }
  }
  ```

#### `POST /upload-resume`
- **Boundary**: `RESOURCE_OWNER`
- **Headers**: `Authorization: Bearer <token>`
- **Request Form Data**: `file` (Multipart file upload)
- **Response** (`200 OK`):
  ```json
  {
    "message": "Resume uploaded and parsed successfully",
    "filename": "resume.pdf",
    "text_preview": "Experienced Python Developer..."
  }
  ```

---

## Endpoint Anomalies & Security Gaps

1. **Unauthenticated Computational Endpoints**: `/match`, `/tailor-resume`, `/generate-cover-letter`, and `/jobs` accept requests without a JWT token. An anonymous user or script can consume server CPU (TF-IDF vectorization and spaCy parsing) without logging in.
2. **Orphan Endpoint**: `POST /generate-cover-letter` is fully defined in backend and API wrapper (`src/services/api.js`), but no React UI component invokes it.
3. **Payload Inconsistency**: Authentication uses OAuth2 form encoding (`username`/`password`), registration uses JSON, matching uses multipart form data. Request validation schemas should be unified.
