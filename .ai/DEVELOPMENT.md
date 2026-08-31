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

## 3. Engineering Guidelines

### Backend Standards
- All database queries must be scoped to `SessionLocal` DB sessions via `Depends(get_db)`.
- Enforce explicit Pydantic response models for all endpoints.
- Modularize routes out of `main.py` into `app/routers/` when adding new domains.

### Frontend Standards
- Component styling must strictly utilize Tailwind utility classes following the existing dark glassmorphism system (`glass-card`, `btn-primary`, `input-field`).
- Do not introduce UI frameworks (e.g. Material UI, Chakra UI, Tailwind UI components) without prior approval.
