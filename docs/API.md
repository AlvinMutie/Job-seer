# API.md — REST API Architecture & Security Boundary Matrix

## Endpoint Security Boundary Matrix

| Endpoint | HTTP Method | Access Classification | Auth Dependency | Status |
| -------- | ----------- | --------------------- | --------------- | ------ |
| `/` | `GET` | **PUBLIC** | None | Health check |
| `/register` | `POST` | **PUBLIC** | None | User Registration |
| `/login` | `POST` | **PUBLIC** | OAuth2 Form | Obtains JWT Bearer Token |
| `/jobs` | `GET` | **PUBLIC** | None | **ENHANCED (P3-01)** — Pagination, Sorting, Search, Filtering |
| `/match` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **UPGRADED (P3-02)** — V2 Multi-Factor Explainable Match |
| `/tailor-resume` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Resume Tailoring Advice |
| `/generate-cover-letter` | `POST` | **AUTHENTICATED** | `Depends(get_current_user)` | **REMEDIATED (P0-02)** — Cover Letter Generation |
| `/me` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | User Profile Retrieval |
| `/profile` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Career Preferences Update |
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Endpoint Specifications

### `POST /match` (P3-02 Upgraded)

- **Description**: Calculates V2 multi-factor match percentage (Skills 40%, Content 30%, Experience 15%, Role Title 15%) and provides explainable factor breakdown.
- **Header**: `Authorization: Bearer <token>`
- **Form Data**: `resume_text` (str, required), `job_id` (int, required)
- **Response Format**:
  ```json
  {
    "match_percentage": 82.5,
    "breakdown": {
      "skills": 90.0,
      "content": 80.0,
      "experience": 75.0,
      "role_title": 80.0
    },
    "weights": {
      "skills": 0.40,
      "content": 0.30,
      "experience": 0.15,
      "role_title": 0.15
    },
    "explanation": "Strong overall match (82.5%). Technical skills alignment: 90.0%, content similarity: 80.0%, experience alignment: 75.0%.",
    "matched_skills": ["python", "fastapi"],
    "missing_skills": ["docker"],
    "tailoring_advice": ["• Highlight past projects..."]
  }
  ```
