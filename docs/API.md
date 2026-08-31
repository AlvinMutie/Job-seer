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
| `/upload-resume` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **REMEDIATED (P0-03)** — File Upload Boundary |
| `/applications` | `GET` | **RESOURCE_OWNER** | `Depends(get_current_user)` | **ENHANCED (P2-02)** — Status Filter, Search, Pagination |
| `/applications` | `POST` | **RESOURCE_OWNER** | `Depends(get_current_user)` | Track/Update Job Application |

---

## Detailed Endpoint Specifications

### `GET /applications` (P2-02 Enhanced)

- **Description**: Retrieves tracked job applications for the authenticated user with status filtering, keyword search, and limit/offset pagination.
- **Header**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `status` (string, optional): Filter by status (`Not Applied`, `Applied`, `Interview`, `Rejected`, `Offer`). Case-insensitive.
  - `search` (string, optional): Partial keyword search matching job title, company name, or application notes.
  - `limit` (integer, optional, default: 50, min: 1, max: 100): Maximum records returned.
  - `offset` (integer, optional, default: 0, min: 0): Records to skip.
- **Response Format**: Plain JSON array of Application objects:
  ```json
  [
    {
      "id": 1,
      "job_id": 10,
      "title": "Senior Python Developer",
      "company": "TechCorp",
      "status": "Applied",
      "score": 88.5,
      "date": "2026-08-31",
      "notes": "Applied via referral"
    }
  ]
  ```

---

## Standard Error Response Format (P2-01)

All HTTP error responses return a standardized JSON structure:

```json
{
  "detail": "The requested job was not found.",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested job was not found.",
    "details": null
  }
}
```
