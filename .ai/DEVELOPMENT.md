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

## 2. Environment Configuration

Application configuration is centralized in `backend/app/core/config.py` using `pydantic-settings`:

- **Development**: Reads environment variables from local `backend/.env`.
- **Testing**: Explicit test fixtures in `tests/conftest.py` supply isolated test settings.
- **Production**: `SECRET_KEY` MUST be provided via environment variables (min 32 characters). Missing or default secrets cause startup failure.

---

## 3. Running Automated Tests

```bash
cd backend
./venv/bin/pytest tests/ -v
```

---

## 4. Mandatory Engineering Workflow

All development tasks MUST follow the 10-step engineering lifecycle:

```text
UNDERSTAND ➔ PLAN ➔ SHOW PLAN ➔ APPROVAL ➔ IMPLEMENT ➔ TEST ➔ SECURITY REVIEW ➔ VERIFY ➔ DOCUMENT ➔ REPORT
```
