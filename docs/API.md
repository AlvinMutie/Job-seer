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
