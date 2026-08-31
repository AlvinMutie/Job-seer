# Smart Job Hunter

**Smart Job Hunter** is an intelligent job matching platform that uses Natural Language Processing (NLP) and statistical similarity algorithms to analyze resume fit against job descriptions, generate resume tailoring recommendations, format cover letters, and track job applications.

---

## Overview

Applying for jobs without understanding how well your resume matches a job description leads to low response rates and wasted effort. Standard job search tools rely on simple string keyword matching that misses skill synonyms and contextual fit.

Smart Job Hunter addresses this problem by parsing candidate resumes, normalizing technical skill variations, performing TF-IDF statistical vectorization, and computing exact skill overlap metrics. Candidates gain clear visibility into missing requirements, tailored bullet point recommendations, and a centralized application tracking pipeline.

---

## Key Features

- **Authentication & User Profiles**: User registration, JWT bearer token authentication, bcrypt password hashing (`passlib==1.7.4`, `bcrypt==4.0.1`), and career preference management.
- **Resume Upload & Parsing**: Multi-format document parser supporting PDF, DOCX, and TXT files with text extraction.
- **Job Discovery & Search**: Job listing repository with keyword and location filter capabilities.
- **Resume-to-Job Matching**: Statistical NLP matching engine evaluating technical skill overlap and content similarity.
- **Resume Tailoring**: Rule-based suggestion engine identifying missing skill requirements for specific job listings.
- **Cover Letter Generation**: Dynamic cover letter template formatting tailored to specific roles and extracted skills.
- **Application Pipeline Tracker**: Application status tracking (Not Applied, Applied, Interview, Offer, Rejected).

---

## User Journey & Workflow

```text
User Registration / Login
           │
           ▼
Profile Setup & Resume Upload (.pdf, .docx, .txt)
           │
           ▼
Job Discovery & Keyword Search
           │
           ▼
Match Calculation & Skill Overlap Analysis
           │
           ├─────────────────────────┐
           ▼                         ▼
Resume Bullet Tailoring    Cover Letter Generation
           │                         │
           └────────────┬────────────┘
                        ▼
           Application Status Tracking
```

---

## Matching Engine & NLP Architecture

The matching engine uses a hybrid statistical NLP scoring model rather than generative AI or deep learning:

1. **Text Preprocessing & Lemmatization**: Text is cleaned and processed using **spaCy** (`en_core_web_sm`) to extract noun chunks and proper nouns.
2. **Skill Extraction & Alias Normalization**: Extracts technical skills by comparing against a curated skill dictionary while normalizing aliases (e.g., `"JS"` → `"JavaScript"`, `"Postgres"` → `"PostgreSQL"`).
3. **TF-IDF Statistical Vectorization**: Computes term frequency-inverse document frequency (`scikit-learn` `TfidfVectorizer`) across the resume and job description to calculate cosine content similarity (`content_sim`).
4. **Weighted Scoring Model**:
   $$\text{Final Score} = (\text{Skill Overlap Ratio} \times 0.70) + (\text{Content Similarity} \times 0.30)$$
   *Note: Applies a non-linear floor multiplier $\max(\text{Final Score}, \text{Content Similarity} \times 2)$ to reward high general content alignment.*

---

## Architecture Topology

```text
┌────────────────────────────────────────────────────────┐
│                   React 18 + Vite                      │
│            Axios (JWT Bearer Interceptor)              │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON
┌──────────────────────────▼─────────────────────────────┐
│                 FastAPI REST Backend                   │
│  ┌───────────────────┐        ┌─────────────────────┐  │
│  │   app.core.config │        │    app/schemas/     │  │
│  └─────────┬─────────┘        │   (Pydantic DTOs)   │  │
│            │                  └──────────┬──────────┘  │
│  ┌─────────▼─────────┐                   │             │
│  │   app/routers/    │                    │             │
│  │ (auth,jobs,match) │                    │             │
│  └─────────┬─────────┘                    │             │
│            └──────────────────────────────┘             │
└──────────────────────────┬─────────────────────────────┘
                           │ SQLAlchemy ORM
┌──────────────────────────▼─────────────────────────────┐
│              app/models/ (SQLite DB)                   │
└────────────────────────────────────────────────────────┘
```

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
- **HTTP Client**: Axios with request interceptors
- **Icons & UI**: Lucide React, Vanilla CSS

### Testing Infrastructure
- **Framework**: `pytest` 9.1+ with `pytest-cov` and FastAPI `TestClient`
- **Database Isolation**: In-memory SQLite (`sqlite:///:memory:`) with SQLAlchemy `StaticPool`
- **Coverage Baseline**: **88% Overall Code Coverage**

---

## Project Structure

```text
Smart-Job-Hunter/
├── backend/
│   ├── app/
│   │   ├── core/           # Centralized configuration (config.py)
│   │   ├── models/         # SQLAlchemy ORM database models (models.py)
│   │   ├── routers/        # APIRouter modules (auth, jobs, matching, profile, applications)
│   │   ├── schemas/        # Pydantic DTO schemas (auth, profile, matching, applications)
│   │   ├── services/       # MatchingEngine, JobService, TailorService, CoverLetter
│   │   ├── utils/          # Upload validation and file handling (file_handling.py)
│   │   ├── auth.py         # JWT generation and verification
│   │   ├── database.py     # Database engine and session management
│   │   └── main.py         # App entry point & router registration (36 lines)
│   ├── tests/              # Automated test suite (58 tests)
│   ├── pyproject.toml      # Pytest configuration, markers, coverage settings
│   ├── requirements.txt    # Backend dependencies
│   └── seed_jobs.py        # Seed dataset script
├── frontend/
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── pages/          # App pages (Dashboard, Matches, Tracker)
│   │   └── services/       # Axios API client definition
│   └── package.json
├── .ai/                    # Internal engineering documentation
├── docs/                   # Architectural decisions and task specifications
├── README.md
└── .env.example            # Environment configuration template
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment (Linux/Mac)
source venv/bin/activate
# Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download required spaCy NLP model
python -m spacy download en_core_web_sm

# Copy environment settings template
cp .env.example .env

# Seed initial job data
python seed_jobs.py

# Start backend server
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000`. Interactive API documentation available at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```
Frontend client will be running at `http://localhost:5173`.

---

## Environment Variables

Environment configuration is managed centrally via `backend/app/core/config.py` using `pydantic-settings`.

Copy `backend/.env.example` to `backend/.env`:

```env
# Security Configuration
SECRET_KEY=dev-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Application Environment (development, testing, production)
ENVIRONMENT=development

# Database Connection
DATABASE_URL=sqlite:///./job_hunter_v3.db

# CORS Configuration (Comma-separated allowed origins)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## API Overview & Security Boundaries

For full endpoint definitions and payload contracts, consult [docs/API.md](file:///home/blueberyy/Documents/SJ/Smart-Job-Hunter/docs/API.md).

- **Public Endpoints**: `GET /`, `POST /register`, `POST /login`, `GET /jobs`
- **Authenticated Endpoints**: `POST /match`, `POST /tailor-resume`, `POST /generate-cover-letter` (Protected by `Depends(get_current_user)`)
- **Resource Owner Endpoints**: `GET /me`, `POST /profile`, `POST /upload-resume`, `GET /applications`, `POST /applications`

---

## Automated Test Suite

```bash
cd backend

# Run full test suite
./venv/bin/pytest tests/ -v

# Run with test coverage (88% baseline)
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html

# Run specific test markers
./venv/bin/pytest tests/ -m security -v
./venv/bin/pytest tests/ -m unit -v
./venv/bin/pytest tests/ -m integration -v
./venv/bin/pytest tests/ -m regression -v
```

- **Total Test Count**: **58 tests**
- **Pass Rate**: **100% (58 / 58)**
- **Measured Code Coverage**: **88% Baseline**
- **Test Database**: In-memory SQLite (`sqlite:///:memory:`) using `StaticPool` (zero side-effects on development database).

---

## Engineering Roadmap & Status

- **Phase 0 (Security & Baseline — COMPLETED)**: P0-00 through P0-05 completed.
- **Phase 1 (Modular Monolith Refactoring)**:
  - `P1-01`: Modularize main.py into Routers (**Completed — 58 tests**)
  - `P1-02`: Separate Schemas & Models (**Completed — 58 tests**)
  - `P1-03`: Setup pytest Safety Testing Framework (**Completed — 88% coverage**)
  - `P1-04`: Add Auth Security Safety Gate Tests (*Pending*)
