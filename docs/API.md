# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Welcome check (Job Seer API) |
| `/health` | `GET` | **PUBLIC** | None | **NEW (Phase 5)** — Liveness Probe |
| `/health/ready` | `GET` | **PUBLIC** | None | **NEW (Phase 5)** — Readiness Probe (DB Check) |
| `/register` | `POST` | **PUBLIC** | None | User Registration (Rate limited: 15/min, HttpOnly Cookie) |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token & HttpOnly Cookie (Rate limited: 20/min) |
| `/logout` | `POST` | **AUTHENTICATED** | None | Clears HttpOnly Cookie |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **UPGRADED (P3-02)** — V2 Explainable Match (Rate limited: 30/min) |
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
