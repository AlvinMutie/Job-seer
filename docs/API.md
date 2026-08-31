# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **UPGRADED (P3-02)** — V2 Multi-Factor Explainable Match |
| `/resume/tailor` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Generate & Persist Tailored Version |
| `/resume/tailored` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — List Saved Tailored Versions |
| `/resume/tailored/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Retrieve Tailored Version |
| `/resume/tailored/{id}/compare` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Compare Text Diff Payload |
| `/resume/tailored/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-04)** — Delete Tailored Version |
| `/cover-letters` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-05)** — Generate & Persist Cover Letter |
| `/cover-letters` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-05)** — List Saved Cover Letters |
| `/cover-letters/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-05)** — Retrieve Cover Letter |
| `/cover-letters/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-05)** — Delete Cover Letter |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-06)** — Status Filter, Search, Pagination, Dates |
| `/applications/{id}` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-06)** — Retrieve Tracked Application |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P3-06)** — Track/Update Job Application |
| `/applications/{id}` | `PATCH` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-06)** — Kanban Status & Details Update |
| `/applications/{id}` | `DELETE` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-06)** — Delete Tracked Application |

---

## Endpoint Specifications

### `PATCH /applications/{id}` (P3-06 New)

- **Description**: Updates application status (for Kanban drag-and-drop), applied date, interview date, follow-up date, application URL, and notes.
- **Request Body**:
  ```json
  {
    "status": "Interview",
    "applied_date": "2026-08-30",
    "interview_date": "2026-09-05",
    "follow_up_date": "2026-09-01",
    "application_url": "https://company.com/careers/123",
    "notes": "Interview scheduled with VP of Engineering."
  }
  ```
- **Response Format**: `{"message": "Application updated successfully"}`
