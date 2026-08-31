# TARGET_ARCHITECTURE.md — Target State Modular Monolith Architecture

## Executive Summary
This document specifies the target architecture for **Smart Job Hunter** post-stabilization. The architecture is designed as a **clean, modular monolith** optimized for clarity, testability, security, and developer maintainability without unnecessary enterprise complexity (no microservices, message queues, or Kubernetes overhead).

---

## System Topology Diagram

```text
[ Browser Client ] (React 18 + Vite SPA)
       │
       │ HTTPS / JSON API Requests (Vite Proxy: /api/* -> http://localhost:8000/*)
       ▼
┌─────────────────────────────────────────────────────────────┐
│ FastAPI Modular Monolith (backend/app/main.py)              │
│                                                             │
│  ├── Middleware: CORS (Configured origins), Rate Limiting   │
│  ├── Core: Security (JWT Bearer), Config (Settings), DB     │
│  │                                                          │
│  ├── Routers Layer (app/routers/):                          │
│  │     ├── auth_router (/register, /login, /me)             │
│  │     ├── profile_router (/profile, /upload-resume)        │
│  │     ├── jobs_router (/jobs)                              │
│  │     ├── matching_router (/match, /tailor-resume)         │
│  │     └── applications_router (/applications)              │
│  │                                                          │
│  ├── Services Layer (app/services/):                        │
│  │     ├── matching_engine.py (Skill Overlap + Vector Sim)  │
│  │     ├── resume_parser.py (PDF / DOCX Text Extraction)   │
│  │     ├── tailor_service.py (Pattern Bullet Generator)    │
│  │     └── job_service.py (SQL Query Builder)               │
│  │                                                          │
│  └── Data Access Layer:                                     │
│        ├── Schemas (app/schemas/ Pydantic DTOs)             │
│        └── Models (app/models/ SQLAlchemy ORMs)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐             ┌────────────────────┐
│ Database                │             │ Storage Layer      │
│ (SQLite Dev / Postgres) │             │ (uploads/ dir)     │
│  ├── users              │             │  └── uuid_*.pdf    │
│  ├── profiles           │             └────────────────────┘
│  ├── jobs               │
│  └── application_tracker│
└─────────────────────────┘
```

---

## Target Directory Structure

```text
backend/
└── app/
    ├── main.py                     # App factory, CORS middleware, global exception handlers
    ├── core/                       # Core configuration & infrastructure
    │   ├── config.py               # Pydantic BaseSettings loading from .env
    │   ├── security.py             # Password hashing, JWT encode/decode, bearer dependencies
    │   ├── database.py             # SQLAlchemy engine, sessionmaker, get_db dependency
    │   └── exceptions.py           # Custom API exceptions & error handlers
    ├── models/                     # SQLAlchemy ORM domain models
    │   ├── user.py                 # User & Profile models
    │   ├── job.py                  # Job model
    │   └── application.py          # ApplicationTracker model
    ├── schemas/                    # Pydantic DTO validation schemas
    │   ├── auth.py                 # UserCreate, Token, UserResponse
    │   ├── profile.py              # ProfileUpdate, ProfileResponse
    │   ├── job.py                  # JobResponse, JobFilter
    │   ├── matching.py             # MatchRequest, MatchResponse, TailorResponse
    │   └── application.py          # ApplicationCreate, ApplicationResponse
    ├── routers/                    # FastAPI APIRouter entry points
    │   ├── auth.py                 # /register, /login, /me
    │   ├── profile.py              # /profile, /upload-resume
    │   ├── jobs.py                 # /jobs
    │   ├── matching.py             # /match, /tailor-resume, /generate-cover-letter
    │   └── applications.py         # /applications
    ├── services/                   # Business domain logic
    │   ├── matching_engine.py      # TF-IDF + skill overlap calculation
    │   ├── resume_parser.py        # PyMuPDF & docx2txt text extraction
    │   ├── tailor_service.py       # Resume tailoring suggestions
    │   └── job_service.py          # Job query filtering logic
    └── utils/                      # Helper utilities
        └── file_handling.py        # Filename sanitization & MIME magic validation
```

### Module Responsibilities & File Migration Plan

| Directory | Responsibility | Existing Code to Move |
| --------- | -------------- | --------------------- |
| `app/core/` | Global config, JWT security, DB engine | Config from `auth.py#L12-L14`, `database.py`, `auth.py#L19-L52` |
| `app/models/` | SQLAlchemy DB tables | ORM classes from `app/models/models.py` |
| `app/schemas/` | Pydantic request/response validation | Schemas from `main.py#L39-L64` |
| `app/routers/` | HTTP request routing & status codes | Route handlers from `main.py#L69-L328` |
| `app/services/` | Core business logic & algorithms | `matching_engine.py`, `job_service.py`, `tailor_service.py`, `cover_letter.py`, `extract_text()` from `main.py` |
| `app/utils/` | File validation and helper utilities | File upload sanitization logic |

---

## Subsystem Target Designs

### 1. Authentication & Security Subsystem
- **JWT Storage**: Tokens issued upon `/login` or `/register`.
- **Protected Dependencies**: All endpoints except `/`, `/register`, `/login`, and `/jobs` enforce `current_user: User = Depends(get_current_user)`.
- **Password Hashing**: Direct use of modern `bcrypt` or `argon2-cffi` without runtime monkeypatching.
- **Secrets**: `SECRET_KEY` loaded dynamically from `.env` via `pydantic-settings`.

### 2. Matching Engine Subsystem (Interview-Grade Scoring Architecture)
- **Problem with Current Engine**: Current implementation uses an arbitrary `max(final_score, content_sim * 2)` multiplier to inflate low scores.
- **Target Scoring Architecture**:
  - **Skill Overlap Score ($S_{skill}$)**: Jaccard intersection of candidate skills vs required job skills derived from a standardized tech taxonomy (`TECH_SKILLS_DB` + spaCy PROPN).
  - **Contextual Similarity Score ($S_{context}$)**: Cosine similarity computed over TF-IDF vector matrices (or dense embeddings).
  - **Composite Score Formula**:
    $$\text{Score} = (0.6 \times S_{skill}) + (0.4 \times S_{context})$$
  - Returns mathematically defensible 0–100% percentage without non-linear floor boosts.

### 3. File Processing Subsystem
- **Validation**: Uploaded files validated against extension whitelist (`.pdf`, `.docx`, `.txt`) and magic byte MIME types.
- **Storage**: Binary files saved to `uploads/` with UUID names (`uuid4().hex + ext`).
- **Parsing**: `ResumeParserService` extracts plain text, handles space-normalized lines, and updates `profile.resume_text`.

### 4. Database Subsystem
- **Engine**: SQLite for dev, PostgreSQL for production.
- **Migrations**: Managed via Alembic (`alembic/`).
- **Cleanup**: Remove unused `resumes` ORM class or repurpose for historical resume versions. Add composite index on `application_tracker(user_id, job_id)`.

---

## Target State Security Boundaries

```text
PUBLIC (No Auth)              AUTHENTICATED (Bearer JWT)         RESOURCE_OWNER (Scoped user_id)
─────────────────             ──────────────────────────         ───────────────────────────────
GET /                         POST /match                        GET /me
POST /register                POST /tailor-resume                POST /profile
POST /login                   POST /generate-cover-letter        POST /upload-resume
GET /jobs                                                        GET /applications
                                                                 POST /applications
```
