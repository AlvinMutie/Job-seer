# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **UPGRADED (P3-02)** — V2 Multi-Factor Explainable Match |
| `/dashboard/analytics` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-07)** — Aggregated Command Center Analytics |
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

### `GET /dashboard/analytics` (P3-07 New)

- **Description**: Computes and retrieves real-time aggregated Command Center intelligence analytics for the authenticated user.
- **Response Format**:
  ```json
  {
    "total_applications": 5,
    "status_counts": {
      "not_applied": 1,
      "applied": 2,
      "interview": 1,
      "offer": 1,
      "rejected": 0
    },
    "average_match_score": 88.5,
    "ats_health_score": 92.0,
    "ats_classification": "Excellent (ATS Ready)",
    "tailored_resumes_count": 3,
    "cover_letters_count": 2,
    "recent_applications": [],
    "recent_tailored_resumes": [],
    "recent_cover_letters": []
  }
  ```
