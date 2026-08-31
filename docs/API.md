# API.md — REST API Contract & Integration Analysis

## Overview
All API endpoints are hosted by FastAPI at `http://localhost:8000`. The React frontend proxies `/api/*` requests to `http://localhost:8000/*`.

---

## Endpoint Inventory

| Method | Endpoint | Purpose | Auth Required | Frontend Usage | Status / Anomalies |
| ------ | -------- | ------- | ------------- | -------------- | ------------------ |
| `GET` | `/` | API Root / Health Check | No | None | WORKING |
| `GET` | `/jobs` | Query job listings with filters | No | `Dashboard.jsx`, `Matches.jsx`, `api.js` | WORKING |
| `POST` | `/match` | Calculate TF-IDF & Skill match score | **No (Missing Auth)** | `Dashboard.jsx`, `Matches.jsx`, `api.js` | WORKING (Unauthenticated) |
| `POST` | `/generate-cover-letter` | Generate formatted cover letter | **No (Missing Auth)** | Defined in `api.js` **(No UI consumer)** | **IMPLEMENTED_BUT_UNUSED** |
| `POST` | `/tailor-resume` | Generate resume improvement bullet points | **No (Missing Auth)** | `Dashboard.jsx`, `api.js` | WORKING (Unauthenticated) |
| `POST` | `/register` | Register new user account | No | `Register.jsx`, `api.js` | WORKING |
| `POST` | `/login` | Authenticate user & receive JWT | No | `Login.jsx`, `api.js` | WORKING (Form-encoded) |
| `GET` | `/me` | Fetch active user profile & CV text | **Yes** (`Bearer JWT`) | `App.jsx`, `Dashboard.jsx`, `ResumeHub.jsx`, `Settings.jsx` | WORKING |
| `POST` | `/profile` | Create/Update user profile fields | **Yes** (`Bearer JWT`) | `ProfileSetup.jsx`, `Settings.jsx` | WORKING |
| `POST` | `/upload-resume` | Upload & extract PDF/DOCX/TXT text | **Yes** (`Bearer JWT`) | `ProfileSetup.jsx`, `ResumeHub.jsx` | WORKING (Security Risk: Unrestricted upload) |
| `GET` | `/applications` | Fetch tracked applications for user | **Yes** (`Bearer JWT`) | `Dashboard.jsx`, `Tracker.jsx` | WORKING |
| `POST` | `/applications` | Upsert tracked job application | **Yes** (`Bearer JWT`) | `Dashboard.jsx` (Quick Apply) | WORKING |

---

## Detailed Endpoint Contracts

### 1. `POST /match`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Form Data**:
  - `resume_text` (string, required)
  - `job_id` (integer, required)
- **Response JSON**:
  ```json
  {
    "match_percentage": 78.5,
    "matched_skills": ["python", "fastapi"],
    "missing_skills": ["aws", "docker"],
    "tailoring_advice": [
      "• Highlight any past projects where you used AWS or similar tools."
    ]
  }
  ```

### 2. `POST /tailor-resume`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Form Data**:
  - `resume_text` (string, required)
  - `job_id` (integer, required)
- **Response JSON**:
  ```json
  {
    "job_title": "Senior Python Developer",
    "company": "TechCorp",
    "suggestions": [
      {
        "section": "Professional Summary",
        "original_context": "Current profile focuses on general experience.",
        "suggestion": "Integrate your knowledge of AWS, DOCKER directly into your summary...",
        "impact": "High - Targets initial screening"
      }
    ]
  }
  ```

### 3. `POST /generate-cover-letter` (Unused Endpoint)
- **Content-Type**: `application/x-www-form-urlencoded`
- **Request Form Data**:
  - `job_id` (integer)
  - `candidate_name` (string)
  - `resume_text` (string)
- **Response JSON**:
  ```json
  {
    "cover_letter": "Dear Hiring Manager at TechCorp...\n..."
  }
  ```

---

## API Discrepancies & Recommendations

1. **Unused Endpoint**: `POST /generate-cover-letter` exists on backend and in `frontend/src/services/api.js`, but no React page invokes it.
2. **Missing Authorization**: `/match`, `/tailor-resume`, `/generate-cover-letter`, and `/jobs` can be queried anonymously. They must be wrapped with `current_user: User = Depends(get_current_user)`.
3. **Inconsistent Request Payloads**: Auth endpoints (`/login`) use URL form encoding, `/register` uses JSON, `/match` uses Form data. Standardize request schemas.
