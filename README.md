# Job Seer

**Job Seer** is an intelligent job search companion designed to help candidates evaluate job opportunities, analyze ATS resume health, generate tailored CV versions, format multi-tone cover letters, and manage job application pipelines.

> **Tagline**: *Your intelligent job search companion.*

---

## Executive Summary

Applying for jobs without understanding how well your resume matches a job description leads to low response rates and wasted effort. Standard job search portals rely on simple keyword string matching that misses skill synonyms and contextual fit.

Job Seer addresses this problem by parsing candidate resumes, normalizing technical skill variations, performing TF-IDF statistical vectorization, computing multi-factor V2 explainable match scores, and organizing application tracking into a Kanban board workspace.

---

## Core Capabilities

- **Intelligent Command Center Dashboard**: Real-time aggregated workspace (`Dashboard.jsx`) featuring Proactive Next Best Action recommendations (`NextBestAction.jsx`), Career Readiness signals, KPI stat cards, application status breakdown, ATS health indicators, action launchpad, and job recommendations.
- **Continuous Candidate Workflow**: Seamless 5-stage candidate journey (**DISCOVER → MATCH → PREPARE → APPLY → TRACK**) preserving target opportunity context across Jobs Hub, Matches, and Resume Hub.
- **Real-World Product UX & Accessibility**: Tested and validated across 8 viewports (360px up to 1440px) with 0 horizontal overflow, focus-visible rings, reduced motion support, and transparent AI scoring rationale.
- **ATS Health & Resume Intelligence**: Automated ATS readiness scoring (0-100), section completeness detection, contact presence checks, technical skill categorization across 7 domains (`languages`, `frontend`, `backend`, `databases`, `cloud_devops`, `data_ai`, `other`), and targeted improvements.
- **Matching Engine V2 & Explainable Scoring**: Multi-factor explainable scoring breakdown (Skills 40%, Content 30%, Experience 15%, Role Title 15%) with human-readable score rationale, score weights, matched/missing skill chips, and interactive analytics modal (`MatchBreakdownModal.jsx`).
- **Resume Tailoring V2 & Persistence**: Persistent versioned resume tailoring (`v1`, `v2`, `v3`) with factual candidate integrity guarantees, `difflib` line-by-line diff comparison modal (`ResumeDiffViewer.jsx`), and version history management.
- **Intelligent Cover Letters & Multi-Tone Persistence**: Multi-tone cover letter generator (`Professional`, `Enthusiastic`, `Executive`, `Technical`) with per-tone versioning, copy-to-clipboard modal (`CoverLetterViewer.jsx`), and user ownership isolation.
- **Application Tracker V2 & Kanban Board Workspace**: Complete Kanban pipeline board (`Tracker.jsx`) with HTML5 drag-and-drop status movements across 5 stages (`Not Applied`, `Applied`, `Interview`, `Offer`, `Rejected`), optimistic UI updates with server rollback, date tracking (`applied_date`, `interview_date`, `follow_up_date`), stage-specific action guidance hints, detail modal (`ApplicationDetailModal.jsx`), and view switcher (Board/List).
- **Job Discovery & Repository Hub**: Dedicated job repository (`JobsHub.jsx`) with keyword search, location filtering, work mode filters (`Remote`, `Hybrid`, `On-site`), experience level filters, column sorting (`Newest`, `Oldest`, `Title`, `Company`), and database-level limit/offset pagination.
- **Production Security & Performance**: Dual `HttpOnly` `SameSite=Lax` cookies & Bearer tokens, sliding window rate limiting (`RateLimiter`), HTTP security headers (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `1; mode=block`), and compound database indexes.
- **Deployment & Production Readiness**: Containerized Docker image (`Dockerfile`, `docker-compose.yml`), liveness (`GET /health`) and readiness (`GET /health/ready`) probes, environment template (`.env.example`), and complete deployment procedures.

---

## Technology Stack

### Backend
- **Framework**: FastAPI 0.141+
- **Architecture**: Layered Modular Monolith (Routers, Schemas, Models, Services)
- **Database / ORM**: SQLAlchemy 2.0+ with SQLite / PostgreSQL support
- **NLP & Statistics**: `spacy` 3.8+ (`en_core_web_sm`), `scikit-learn` 1.9+ (`TfidfVectorizer`)
- **Document Parsers**: PyMuPDF (`fitz`), `docx2txt`
- **Authentication**: `python-jose` 3.5.0 (JWT), `passlib` 1.7.4 / `bcrypt` 4.0.1
- **Settings**: `pydantic-settings`

### Frontend
- **Framework**: React 18.2 (Vite)
- **HTTP Client**: Axios with request & response error interceptors (`withCredentials: true`)
- **Icons & UI**: Lucide React, Vanilla CSS

---

## Verification & Test Metrics

```bash
# Backend Automated Suite (171 tests passing)
cd backend
./venv/bin/pytest tests/ -v

# Backend Security Suite (90 tests passing)
cd backend
./venv/bin/pytest tests/ -m security -v

# Frontend Unit Tests (6 tests passing)
cd frontend
npm test

# Production Build
cd frontend
npm run build
```

- **Backend Pytest Suite**: **171 tests passing (100% pass rate, 91% code coverage)**
- **Security Safety Tests**: **90 tests passing (100% pass rate)**
- **Frontend Unit Tests**: **6 unit tests passing (100% pass rate)**
- **Production Vite Build**: **Succeeded cleanly (`dist/index.html`)**

---

## Deployment & Documentation

Refer to [docs/DEPLOYMENT.md](file:///home/blueberyy/Documents/SJ/Smart-Job-Hunter/docs/DEPLOYMENT.md) for production deployment procedures, environment variable configuration, Docker container setup, and database backup strategies.
