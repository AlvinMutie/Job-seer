# ARCHITECTURE.md — System Architecture & Data Flows

## System Topology Diagram (ASCII)

```text
[ Browser Client ] (React 18 + Vite SPA)
       │
       │ HTTP / JSON API Requests
       │ (Vite Proxy: /api/* -> http://localhost:8000/*)
       ▼
┌─────────────────────────────────────────────────────────────┐
│ Fast API Backend Service (app/main.py)                      │
│                                                             │
│  ├── Middleware: CORS (Wildcard allow_origins=["*"])       │
│  ├── Security: JWT Verification (app/auth.py)               │
│  │                                                          │
│  ├── API Handlers:                                          │
│  │     ├── Auth: /register, /login, /me                    │
│  │     ├── Profile: /profile, /upload-resume                │
│  │     ├── Jobs: /jobs                                      │
│  │     ├── Matching: /match, /tailor-resume                 │
│  │     └── Tracker: /applications                           │
│  │                                                          │
│  └── Services Layer:                                        │
│        ├── MatchingEngine (TF-IDF + spaCy NLP)              │
│        ├── JobService (SQLAlchemy Query Builder)            │
│        ├── TailorService (Pattern-based Generator)          │
│        └── CoverLetterGenerator (Template Formatter)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌─────────────────────────┐             ┌────────────────────┐
│ SQLite Database         │             │ Local File Storage │
│ (job_hunter_v3.db)      │             │ (backend/uploads/) │
│  ├── users              │             │  └── resume_*.pdf  │
│  ├── profiles           │             └────────────────────┘
│  ├── jobs               │
│  ├── application_tracker│
│  └── resumes (Unused)   │
└─────────────────────────┘
```

---

## Detailed Component Breakdown

### 1. Frontend Architecture

- **Router Hierarchy** (`src/App.jsx`):
  - Unprotected Routes: `/` (`Landing`), `/login` (`Login`), `/register` (`Register`), `/profile-setup` (`ProfileSetup`).
  - Protected Routes (wrapped in `<ProtectedRoute>` and `<DashboardLayout>`):
    - `/dashboard` (`Dashboard`): Job feed, search, live matching, and stats.
    - `/matches` (`Matches`): Top 3 recommendation highlights.
    - `/tracker` (`Tracker`): Table-based job application pipeline tracking.
    - `/resume-hub` (`ResumeHub`): File uploader and live text extraction preview.
    - `/settings` (`Settings`): Profile fields and skill tags editor.

- **State & Storage**:
  - Auth token persisted in `localStorage.getItem('token')`.
  - Axios instance in `src/services/api.js` automatically injects `Authorization: Bearer <token>` header into all outgoing requests.

### 2. Backend Architecture

- **Monolithic Entry Point** (`backend/app/main.py`):
  - All API routes are defined directly on `app = FastAPI()`.
  - Database initialization (`init_db()`) runs on `startup` event.
  - Text extraction helper `extract_text(file_path)` supports `.pdf`, `.docx`, `.doc`, `.txt`, `.md`.

- **Service Layer**:
  - `MatchingEngine` (`app/services/matching_engine.py`): Singleton instance initialized on startup.
  - `JobService` (`app/services/job_service.py`): Handles filtered ORM queries against `jobs` table.
  - `TailorService` (`app/services/tailor_service.py`): Generates resume improvement bullet points.
  - `CoverLetterGenerator` (`app/services/cover_letter.py`): Formats basic cover letter template string.

---

## Processing Flows

### Flow 1: Resume Upload & Extraction

```text
User uploads file on Frontend (/resume-hub or /profile-setup)
       │
       ▼
POST /upload-resume (Multipart form)
       │
       ├─► Saves binary to backend/uploads/resume_{user_id}_{filename}
       ├─► Executes extract_text() via PyMuPDF / docx2txt
       └─► Updates profiles.resume_path & profiles.resume_text in SQLite DB
       │
       ▼
Returns success response with text preview
```

### Flow 2: Hybrid AI Matching

```text
Dashboard / Matches triggers match calculation
       │
       ▼
POST /match (resume_text, job_id)
       │
       ├─► Fetch job record from SQLite DB (title, skills_required, description)
       ├─► Normalize spaced text & preprocess via spaCy (lemmatization)
       ├─► Compute Content Similarity via TF-IDF Vectorizer + Cosine Similarity
       ├─► Extract skills from Resume & Job via TECH_SKILLS_DB dictionary + spaCy PROPN
       ├─► Compute Skill Overlap Score = |Resume_Skills ∩ Job_Skills| / |Job_Skills|
       ├─► Compute Weighted Score = (Skill Score * 0.7) + (Content Similarity * 0.3)
       ├─► Apply Non-linear Floor Boost: final_score = max(final_score, content_similarity * 2)
       └─► Calculate missing skills and tailoring recommendations
       │
       ▼
Return JSON { match_percentage, matched_skills, missing_skills, tailoring_advice }
```
