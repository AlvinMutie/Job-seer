# API.md — REST API Contract & Security Boundary Specification

## Overview
All API endpoints are hosted by FastAPI at `http://localhost:8000`. The React frontend proxies `/api/*` requests to `http://localhost:8000/*`.

---

## Endpoint Access Control & Security Boundaries

Each API endpoint is classified according to its intended access control boundary:

- **PUBLIC**: Accessible by any client without authentication.
- **AUTHENTICATED**: Requires a valid logged-in user JWT bearer token (`Depends(get_current_user)`).
- **RESOURCE_OWNER**: Requires authentication AND verifies that the logged-in user owns the requested target resource.
- **ROLE_RESTRICTED**: Requires specific administrative roles or permissions.

---

## Authoritative Endpoint Access Control Matrix

| Method | Endpoint | Access Boundary | Current Auth Status | Required Security Enforcement | Frontend Usage | Status |
| ------ | -------- | --------------- | ------------------- | ----------------------------- | -------------- | ------ |
| `GET` | `/` | **PUBLIC** | Unauthenticated | None (System health check) | None | WORKING |
| `POST` | `/register` | **PUBLIC** | Unauthenticated | Rate limiting on registration attempts | `Register.jsx`, `api.js` | WORKING |
| `POST` | `/login` | **PUBLIC** | Unauthenticated | Rate limiting on failed login attempts | `Login.jsx`, `api.js` | WORKING |
| `GET` | `/jobs` | **PUBLIC** | Unauthenticated | Sanitized search query parameters | `Dashboard.jsx`, `Matches.jsx` | WORKING |
| `POST` | `/match` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | `Dashboard.jsx`, `Matches.jsx` | WORKING (Security Gap) |
| `POST` | `/tailor-resume` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | `Dashboard.jsx` | WORKING (Security Gap) |
| `POST` | `/generate-cover-letter` | **AUTHENTICATED** | **Unauthenticated (Vulnerable)** | Enforce `Depends(get_current_user)` | Defined in `api.js` | IMPLEMENTED_BUT_UNUSED |
| `GET` | `/me` | **RESOURCE_OWNER** | Authenticated | Verified via `get_current_user` | `App.jsx`, `Dashboard.jsx` | WORKING |
| `POST` | `/profile` | **RESOURCE_OWNER** | Authenticated | Scoped to `current_user.id` | `ProfileSetup.jsx`, `Settings.jsx` | WORKING |
| `POST` | `/upload-resume` | **RESOURCE_OWNER** | Authenticated | Add extension whitelist & MIME magic verification | `ProfileSetup.jsx`, `ResumeHub.jsx` | WORKING (Upload Vulnerability) |
| `GET` | `/applications` | **RESOURCE_OWNER** | Authenticated | Query filtered to `user_id == current_user.id` | `Dashboard.jsx`, `Tracker.jsx` | WORKING |
| `POST` | `/applications` | **RESOURCE_OWNER** | Authenticated | Assert `user_id == current_user.id` on upsert | `Dashboard.jsx` | WORKING |

---

## Architectural Resolution of `GET /jobs` Authentication

### Decision: Option C — Public Discovery + Authenticated Personalization

- **Rationale**:
  - `GET /jobs` returns public job postings stored in the `jobs` database table. It contains no user-specific or sensitive data.
  - Allowing public job discovery enables unauthenticated prospective applicants to search listings and explore the platform before creating an account.
  - However, personalized operations such as calculating a match score (`POST /match`), receiving tailoring advice (`POST /tailor-resume`), uploading CVs (`POST /upload-resume`), or tracking applications (`POST /applications`) strictly require user authentication (`AUTHENTICATED` / `RESOURCE_OWNER`).

---

## Detailed Endpoint Specifications

### 1. Public Discovery & Authentication Endpoints

#### `GET /jobs`
- **Boundary**: `PUBLIC`
- **Query Parameters**: `keywords` (string), `location` (string), `remote_status` (string), `experience_level` (string)
- **Response** (`200 OK`): Array of Job JSON objects.

#### `POST /register`
- **Boundary**: `PUBLIC`
- **Request Body** (`application/json`): `{ "full_name": "...", "email": "...", "password": "..." }`
- **Response** (`200 OK`): `{ "access_token": "...", "token_type": "bearer" }`

#### `POST /login`
- **Boundary**: `PUBLIC`
- **Request Body** (`application/x-www-form-urlencoded`): `username=...&password=...`
- **Response** (`200 OK`): `{ "access_token": "...", "token_type": "bearer" }`

---

### 2. Computational & AI Services Endpoints

#### `POST /match`
- **Boundary**: `AUTHENTICATED` (Must enforce `Depends(get_current_user)`)
- **Request Form Data**: `resume_text` (string), `job_id` (integer)
- **Response** (`200 OK`): `{ "match_percentage": 78.5, "matched_skills": [...], "missing_skills": [...], "tailoring_advice": [...] }`

#### `POST /tailor-resume`
- **Boundary**: `AUTHENTICATED` (Must enforce `Depends(get_current_user)`)
- **Request Form Data**: `resume_text` (string), `job_id` (integer)
- **Response** (`200 OK`): `{ "job_title": "...", "company": "...", "suggestions": [...] }`

---

### 3. Resource-Owner Protected Endpoints

#### `GET /me`
- **Boundary**: `RESOURCE_OWNER`
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): User profile object.

#### `POST /upload-resume`
- **Boundary**: `RESOURCE_OWNER`
- **Headers**: `Authorization: Bearer <token>`
- **Request Form Data**: `file` (Multipart file upload)
- **Response** (`200 OK`): Upload and text extraction result preview.
