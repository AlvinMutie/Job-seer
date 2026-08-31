# TARGET_ARCHITECTURE.md — Target State Modular Monolith Architecture

## Executive Summary
This document specifies the target architecture for **Smart Job Hunter** post-stabilization. The architecture is designed as a **clean, modular monolith** optimized for clarity, testability, security, and developer maintainability without microservice overhead or enterprise bloat.

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
│  │     ├── jobs_router (/jobs - Public Discovery)           │
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

## Refactoring Boundary: `main.py` Mapping Table

The current monolithic entry point (`backend/app/main.py` — 333 lines) will be split into modular packages as follows:

| `main.py` Source Lines | Current Responsibility | Target Modular Location |
| ---------------------- | ---------------------- | ----------------------- |
| Lines 1–10 | Imports & `bcrypt.__about__` monkeypatch | `app/main.py` (Monkeypatch removed once dependencies updated) |
| Lines 11–16 | FastAPI app initialization & PyMuPDF import | `app/main.py` (App factory) |
| Lines 28–35 | Middleware (CORS configuration) | `app/main.py` (CORS setup using `app.core.config`) |
| Lines 37 | MatchingEngine instantiation | `app/services/matching_engine.py` (Singleton service) |
| Lines 39–64 | Pydantic Request/Response DTOs | `app/schemas/matching.py`, `app/schemas/auth.py`, `app/schemas/profile.py`, `app/schemas/application.py` |
| Lines 65–67 | Startup event (`init_db()`) | `app/main.py` (Lifespan event using `app.core.database`) |
| Lines 69–71 | `GET /` Health Check endpoint | `app/main.py` |
| Lines 73–82 | `GET /jobs` handler | `app/routers/jobs.py` |
| Lines 84–104 | `POST /match` handler | `app/routers/matching.py` |
| Lines 106–121 | `POST /generate-cover-letter` handler | `app/routers/matching.py` |
| Lines 123–147 | `POST /tailor-resume` handler | `app/routers/matching.py` |
| Lines 151–169 | `POST /register` handler | `app/routers/auth.py` |
| Lines 171–182 | `POST /login` handler | `app/routers/auth.py` |
| Lines 184–204 | `GET /me` handler | `app/routers/auth.py` |
| Lines 206–225 | `POST /profile` handler | `app/routers/profile.py` |
| Lines 227–250 | `extract_text()` helper function | `app/services/resume_parser.py` |
| Lines 252–280 | `POST /upload-resume` handler | `app/routers/profile.py` |
| Lines 282–299 | `GET /applications` handler | `app/routers/applications.py` |
| Lines 301–327 | `POST /applications` handler | `app/routers/applications.py` |
| Lines 329–333 | `uvicorn.run()` direct execution block | `backend/app/main.py` |

---

## Matching Engine Technical Analysis & Product Classification

### Product Classification & Terminology
- **Technology Classification**: Rule-based processing (dictionary & alias lookup), classical statistical NLP (TF-IDF vector space modeling), information extraction, POS entity tagging (`spaCy`).
- **Recommended Product Description**: **"Intelligent job matching platform using NLP and statistical similarity"**.

### Current Algorithm Specification
1. Line-by-line whitespace normalization (`normalize_spaced_text()`).
2. Lowercasing, special character preservation (`C++`, `C#`), and `spaCy` token lemmatization + stop word filtering (`preprocess_text()`).
3. Dictionary skill extraction against `TECH_SKILLS_DB` + hardcoded aliases (`"js"` → `"javascript"`) + spaCy `PROPN`/`NOUN` entity extraction (`extract_skills()`).
4. TF-IDF vectorization & cosine similarity computation via `TfidfVectorizer(stop_words='english')`.
5. Skill overlap ratio calculation: $S_{skill} = |R_{skills} \cap J_{skills}| / |J_{skills}|$.
6. Weighted match score calculation: $\text{Weighted Score} = (0.7 \times S_{skill}) + (0.3 \times S_{context})$.
7. Non-linear multiplier score floor boost: $\text{Final Score} = \max(\text{Weighted Score}, S_{context} \times 2)$.

### Problems With Current Algorithm
- **Artificial Score Inflation**: The non-linear multiplier boost distorts true mathematical match precision.
- **Sparse TF-IDF Vector Limitations**: TF-IDF counts word frequencies and misses semantic equivalents not present in the hardcoded alias dictionary.
- **Dictionary Static Limitations**: `TECH_SKILLS_DB` is fixed in memory and requires manual maintenance.
- **Entity Extraction False Positives**: spaCy `PROPN`/`NOUN` tagging extracts non-technical capitalized words.

### Proposed Algorithm Specification
- Remove artificial non-linear score floor boosts.
- Combine technical skill taxonomy overlap ($S_{skill}$) with dense vector embeddings ($S_{context}$).
- **Weighting Note**:
  > "The optimal weighting is currently UNKNOWN and should be determined through evaluation against a representative validation dataset."

---

## Target State Security Boundaries

```text
PUBLIC (No Auth)              AUTHENTICATED (Bearer JWT)         RESOURCE_OWNER (Scoped user_id)
─────────────────             ──────────────────────────         ───────────────────────────────
GET /                         POST /match                        GET /me
POST /register                POST /tailor-resume                POST /profile
POST /login                   POST /generate-cover-letter        POST /upload-resume
GET /jobs (Public Discovery)                                     GET /applications
                                                                 POST /applications
```
