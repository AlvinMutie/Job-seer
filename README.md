# Smart Job Hunter

**Smart Job Hunter** is an intelligent job matching platform that uses Natural Language Processing (NLP) and statistical similarity algorithms to analyze resume fit against job descriptions, generate resume tailoring recommendations, format cover letters, and track job applications.

---

## Overview

Applying for jobs without understanding how well your resume matches a job description leads to low response rates and wasted effort. Standard job search tools rely on simple string keyword matching that misses skill synonyms and contextual fit.

Smart Job Hunter addresses this problem by parsing candidate resumes, normalizing technical skill variations, performing TF-IDF statistical vectorization, and computing exact skill overlap metrics. Candidates gain clear visibility into missing requirements, tailored bullet point recommendations, and a centralized application tracking pipeline.

---

## Key Features

- **Authentication & User Profiles**: User registration, JWT bearer token authentication, bcrypt password hashing (`passlib==1.7.4`, `bcrypt==4.0.1`), and career preference management.
- **Intelligent Command Center Dashboard**: Real-time aggregated intelligence workspace (`Dashboard.jsx`) featuring 4 KPI Stat Cards (Average V2 Match %, Active Application Pipeline, ATS Health Score & Status Badge, Saved Tailored Assets Count), pipeline stage breakdown, action launchpad, and job recommendations.
- **Resume Upload & Parsing**: Multi-format document parser supporting PDF, DOCX, and TXT files with text extraction and 10-layer security boundary.
- **Resume Intelligence & ATS Health Check**: Automated ATS readiness scoring (0-100), section completeness detection, contact info presence checks, technical skill categorization across 7 domains (`languages`, `frontend`, `backend`, `databases`, `cloud_devops`, `data_ai`, `other`), and targeted recommendations.
- **Resume Tailoring V2 & Persistence**: Persistent versioned resume tailoring (`v1`, `v2`, `v3`) with factual candidate integrity guarantees, `difflib` line-by-line diff comparison modal (`ResumeDiffViewer.jsx`), and version history management.
- **Intelligent Cover Letters & Multi-Tone Persistence**: Multi-tone cover letter generator (`Professional`, `Enthusiastic`, `Executive`, `Technical`) with per-tone versioning, copy-to-clipboard modal (`CoverLetterViewer.jsx`), and user ownership isolation.
- **Application Tracker V2 & Kanban Board Workspace**: Complete Kanban pipeline board (`Tracker.jsx`) with HTML5 drag-and-drop status movements across 5 stages (`Not Applied`, `Applied`, `Interview`, `Offer`, `Rejected`), optimistic UI updates with server rollback, date tracking (`applied_date`, `interview_date`, `follow_up_date`), safe URL link handling, detail modal (`ApplicationDetailModal.jsx`), and view switcher (Board/List).
- **Job Discovery & Repository Hub**: Dedicated job repository (`JobsHub.jsx`) with keyword search, location filtering, work mode filters (`Remote`, `Hybrid`, `On-site`), experience level filters, column sorting (`Newest`, `Oldest`, `Title`, `Company`), and database-level limit/offset pagination.
- **Matching Engine V2 & Explainable Scoring**: Multi-factor explainable scoring breakdown (Skills 40%, Content 30%, Experience 15%, Role Title 15%) with human-readable score rationale, score weights, matched/missing skill chips, and interactive analytics modal (`MatchBreakdownModal.jsx`).
- **Centralized Error Handling**: Standardized API error responses (`ErrorCode` taxonomy) with safe 500 error sanitization and zero detail leakage.
- **Hardened React Client**: Centralized Axios API client with `getApiErrorMessage` error parser, dynamic Bearer request interceptors, 401 token cleanup response interceptors, non-blocking notification banners, and robust loading state handling.

---

## Technology Stack

### Backend
- **Framework**: FastAPI 0.141+
- **Architecture**: Layered Modular Monolith (Routers, Schemas, Models, Services)
- **Database / ORM**: SQLAlchemy 2.0+ with SQLite
- **NLP & Statistics**: `spacy` 3.8+ (`en_core_web_sm`), `scikit-learn` 1.9+ (`TfidfVectorizer`)
- **Document Parsers**: PyMuPDF (`fitz`), `docx2txt`
- **Authentication**: `python-jose` 3.5.0 (JWT), `passlib` 1.7.4 / `bcrypt` 4.0.1
- **Settings**: `pydantic-settings`

### Frontend
- **Framework**: React 18.2 (Vite)
- **HTTP Client**: Axios with request & response error interceptors
- **Icons & UI**: Lucide React, Vanilla CSS

### Testing Infrastructure
- **Backend Tests**: `pytest` 9.1+ with `pytest-cov` and FastAPI `TestClient` (160 tests, 91% coverage)
- **Frontend Tests**: Node native test runner (`node --test src/services/api.test.js`, 6 unit tests passing)
- **Database Isolation**: In-memory SQLite (`sqlite:///:memory:`) with SQLAlchemy `StaticPool`

---

## Automated Test Suites

```bash
# Backend (160 tests passing)
cd backend
./venv/bin/pytest tests/ -v

# Frontend (6 unit tests passing)
cd frontend
npm test
```

- **Backend Tests**: **160 tests (100% pass rate, 91% code coverage)**
- **Frontend Tests**: **6 unit tests (100% pass rate)**
- **Production Build**: **Succeeded cleanly (`dist/index.html`)**
