# DEVELOPMENT.md — Local Development & Engineering Standards

## Setup Instructions

### Environment Requirements
- Python 3.10+
- Node.js 18+
- npm 9+

---

## 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download required spaCy NLP model
python -m spacy download en_core_web_sm

# Copy environment template to .env (do NOT commit .env to Git)
cp .env.example .env

# Seed database with sample jobs
python seed_jobs.py

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

The API server will run at `http://localhost:8000`. Direct API docs available at `http://localhost:8000/docs`.

---

## 2. Architecture & Layer Responsibilities

The backend follows a modular monolith architecture with clear layer separations:

- `app/routers/` → API Transport & Routing Layer (`auth.py`, `jobs.py`, `matching.py`, `profile.py`, `applications.py`).
- `app/schemas/` → Pydantic Data Transfer Objects (DTOs) & Request/Response Validation (`auth.py`, `jobs.py`, `matching.py`, `profile.py`, `applications.py`).
- `app/models/` → SQLAlchemy ORM Persistent Database Entities (`models.py`).
- `app/services/` → Core Business Logic & Matching Engines (`matching_engine.py`, `job_service.py`, `tailor_service.py`, `cover_letter.py`).
- `app/utils/` → Infrastructure utilities and security boundary helpers (`file_handling.py`).
- `app/core/` → Centralized configuration (`config.py`).

---

## 3. Testing Infrastructure & Coverage

Automated testing is configured in `backend/pyproject.toml`:

```bash
cd backend

# Run full test suite (58 tests)
./venv/bin/pytest tests/ -v

# Run with test coverage (88% baseline)
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html

# Run specific test markers
./venv/bin/pytest tests/ -m security -v
./venv/bin/pytest tests/ -m unit -v
./venv/bin/pytest tests/ -m integration -v
./venv/bin/pytest tests/ -m regression -v
```

HTML coverage reports are generated at `backend/htmlcov/index.html`.

---

## 4. Environment Configuration

Application configuration is centralized in `backend/app/core/config.py` using `pydantic-settings`:

- **Development**: Reads environment variables from local `backend/.env`.
- **Testing**: Explicit test fixtures in `tests/conftest.py` supply isolated test settings.
- **Production**: `SECRET_KEY` MUST be provided via environment variables (min 32 characters). Wildcard `*` in `CORS_ORIGINS` is prohibited in production.

---

## 5. Mandatory Engineering Workflow

All development tasks MUST follow the 10-step engineering lifecycle:

```text
UNDERSTAND ➔ PLAN ➔ SHOW PLAN ➔ APPROVAL ➔ IMPLEMENT ➔ TEST ➔ SECURITY REVIEW ➔ VERIFY ➔ DOCUMENT ➔ REPORT
```
