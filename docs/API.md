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
| `/resume/health` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **NEW (P3-03)** — ATS Readiness Health Report |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Endpoint Specifications

### `GET /resume/health` (P3-03 New)

- **Description**: Generates an ATS readiness health report for the authenticated user's uploaded resume.
- **Header**: `Authorization: Bearer <token>`
- **Response Format**:
  ```json
  {
    "health_score": 84.5,
    "classification": "Strong",
    "breakdown": {
      "completeness": 90.0,
      "ats_health": 82.0,
      "contact_information": 80.0,
      "skills": 85.0
    },
    "sections_detected": ["summary", "skills", "education", "experience", "projects"],
    "contact_checks": {
      "email": true,
      "phone": true,
      "linkedin": true,
      "github": false,
      "portfolio": true
    },
    "skill_domains": {
      "programming_languages": ["python", "javascript"],
      "frontend": ["react"],
      "backend": ["fastapi", "node.js"],
      "databases": ["postgresql"],
      "cloud_devops": ["aws", "docker"],
      "data_ai": [],
      "other": []
    },
    "recommendations": ["Add a GitHub profile link to showcase your code repositories."]
  }
  ```
