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

# Seed database with sample jobs
python seed_jobs.py

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```

The API server will run at `http://localhost:8000`. Direct API docs available at `http://localhost:8000/docs`.

---

## 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```

The React SPA will run at `http://localhost:5173` (or `http://localhost:3000` per `vite.config.js` default port setting). Requests to `/api/*` are proxied to `http://localhost:8000/*`.

---

## 3. Mandatory Engineering Workflow

All development tasks MUST follow the 8-step engineering lifecycle:

```text
ANALYSE ➔ PLAN ➔ APPROVE ➔ IMPLEMENT ➔ TEST ➔ SECURITY REVIEW ➔ DOCUMENT ➔ REPORT
```

### Standards Summary
- **Backend**: FastAPI, SQLAlchemy ORM, Pydantic v2 schemas. Routes MUST be placed in `backend/app/routers/` when refactoring `main.py`.
- **Frontend**: React 18, Vite, Tailwind CSS v3 dark glassmorphism system.
- **Testing**: Run `pytest` before requesting completion.
