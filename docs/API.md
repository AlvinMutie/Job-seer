# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — TF-IDF & Skill Match |
| `/tailor-resume` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Resume Tailoring Advice |
| `/generate-cover-letter` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Cover Letter Generation |
| `/me` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Profile Retrieval |
| `/profile` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Career Preferences Update |
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Endpoint Specifications

### `GET /jobs` (P3-01 Enhanced)

- **Description**: Retrieves job repository listings with optional keyword search, field filters, safe sorting, and database-level limit/offset pagination.
- **Query Parameters**:
  - `search` (string, optional): Keyword search matching job title, company, description, or skills.
  - `location` (string, optional): Location keyword.
  - `remote_status` (string, optional): Work mode (`Remote`, `Hybrid`, `On-site`).
  - `experience_level` (string, optional): Level (`Junior`, `Mid-Level`, `Senior`, `Lead / Architect`).
  - `sort_by` (string, optional, default: `posted_at`): Sort field (`posted_at`, `title`, `company`, `location`, `remote_status`, `experience_level`).
  - `order` (string, optional, default: `desc`): Direction (`asc`, `desc`).
  - `limit` (integer, optional, default: 20, min: 1, max: 100): Maximum records returned.
  - `offset` (integer, optional, default: 0, min: 0): Records to skip.
- **Response Format**: Plain JSON array of Job objects (`Job[]`).
