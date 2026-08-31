# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **UPGRADED (P3-02)** — V2 Multi-Factor Explainable Match |
| `/tailor-resume` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Legacy Tailoring Advice |
| `/resume/tailor` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-04)** — Generate & Persist Tailored Version |
| `/resume/tailored` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-04)** — List Saved Tailored Versions |
| `/resume/tailored/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-04)** — Retrieve Tailored Version |
| `/resume/tailored/{id}/compare` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-04)** — Compare Text Diff Payload |
| `/resume/tailored/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-04)** — Delete Tailored Version |
| `/generate-cover-letter` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Cover Letter Generation |
| `/me` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Profile Retrieval |
| `/profile` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Career Preferences Update |
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary |
| `/resume/health` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-03)** — ATS Readiness Health Report |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Endpoint Specifications

### `POST /resume/tailor` (P3-04 New)

- **Description**: Generates a tailored resume for target job, computes version, and persists record in database.
- **Form Data**: `job_id` (int, required)
- **Response Format**: `TailoredResumeResponse` JSON payload.

### `GET /resume/tailored/{id}/compare` (P3-04 New)

- **Description**: Generates structured line-by-line diff between original resume and saved tailored version.
- **Response Format**:
  ```json
  {
    "id": 1,
    "job_id": 5,
    "version": 2,
    "job_title": "Senior Python Developer",
    "company": "TechCorp",
    "diff_lines": [
      { "line": "TAILORED RESUME — TARGET ROLE: SENIOR PYTHON DEVELOPER AT TECHCORP", "type": "added" },
      { "line": "John Doe", "type": "unchanged" }
    ],
    "added_count": 5,
    "removed_count": 0,
    "unchanged_count": 20
  }
  ```
