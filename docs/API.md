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
| `/resume/tailor` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Generate & Persist Tailored Version |
| `/resume/tailored` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — List Saved Tailored Versions |
| `/resume/tailored/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Retrieve Tailored Version |
| `/resume/tailored/{id}/compare` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Compare Text Diff Payload |
| `/resume/tailored/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Delete Tailored Version |
| `/cover-letters` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-05)** — Generate & Persist Cover Letter |
| `/cover-letters` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-05)** — List Saved Cover Letters |
| `/cover-letters/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-05)** — Retrieve Cover Letter |
| `/cover-letters/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-05)** — Delete Cover Letter |
| `/generate-cover-letter` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Legacy Cover Letter |
| `/me` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Profile Retrieval |
| `/profile` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Career Preferences Update |
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary |
| `/resume/health` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-03)** — ATS Readiness Health Report |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Endpoint Specifications

### `POST /cover-letters` (P3-05 New)

- **Description**: Generates a cover letter tailored to selected tone, calculates version, and persists record in database.
- **Form Data**: `job_id` (int, required), `tone` (string, optional: `Professional` | `Enthusiastic` | `Executive` | `Technical`), `tailored_resume_id` (int, optional).
- **Response Format**: `CoverLetterResponse` JSON payload.
