# ROADMAP.md — Prioritized Engineering Roadmap

This document outlines the prioritized, phased execution plan for stabilizing, securing, refactoring, and enhancing **Smart Job Hunter**.

---

## Priority Classifications

- **P0 (Critical)**: Blockers, security vulnerabilities, or major architectural flaws that must be fixed before any deployment or feature development.
- **P1 (High)**: Core quality, stability, testing, and essential refactoring tasks.
- **P2 (Medium)**: Feature completion, database improvements, and UX enhancements.
- **P3 (Low)**: Production hardening, performance optimizations, and speculative enhancements.

---

## Phased Execution Roadmap

### Phase 1 — Security & Configuration (P0)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P0** | Security | Externalize hardcoded `SECRET_KEY` into `.env` file via `pydantic-settings` | `app/core/config.py`, `app/auth.py` | Low |
| **P0** | Security | Protect computational endpoints (`/match`, `/tailor-resume`, `/jobs`) with JWT auth | `app/routers/matching.py`, `app/routers/jobs.py` | Low |
| **P0** | Security | Enforce extension & MIME magic validation on `/upload-resume` | `app/routers/profile.py`, `app/utils/file_handling.py` | Low |
| **P0** | Security | Replace wildcard CORS (`allow_origins=["*"]`) with explicitly whitelisted frontend origins | `app/main.py` | Low |

---

### Phase 2 — Backend Modular Refactoring (P1)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P1** | Architecture | Split monolithic `main.py` into modular FastAPI routers (`auth`, `profile`, `jobs`, `matching`, `applications`) | `app/routers/*.py`, `app/main.py` | Medium |
| **P1** | Architecture | Separate Pydantic schemas, SQLAlchemy models, and service layer into dedicated directories | `app/schemas/`, `app/models/`, `app/services/` | Medium |
| **P1** | Dependencies | Fix `passlib` / `bcrypt` dependency conflict to eliminate runtime monkeypatching | `app/main.py`, `requirements.txt` | Low |
| **P1** | Code Quality | Extract `extract_text()` into dedicated `ResumeParserService` | `app/services/resume_parser.py` | Low |

---

### Phase 3 — Automated Testing Framework (P1)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P1** | Testing | Setup `pytest` + `httpx` testing environment with database fixtures | `tests/conftest.py` | Low |
| **P1** | Testing | Add unit tests for password hashing, JWT token handling, and security dependencies | `tests/unit/test_security.py` | Low |
| **P1** | Testing | Add unit tests for `MatchingEngine` (TF-IDF, skill extraction, alias normalization) | `tests/unit/test_matching_engine.py` | Low |
| **P1** | Testing | Add API integration tests for authentication and authorization security boundaries | `tests/integration/test_security_boundaries.py` | Low |

---

### Phase 4 — Database Cleanup & Schema Evolution (P2)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P2** | Database | Initialize Alembic database migration environment | `backend/alembic/`, `backend/alembic.ini` | Low |
| **P2** | Database | Clean up dead ORM table `resumes` or repurpose for resume version history | `app/models/user.py` | Low |
| **P2** | Database | Add composite index on `application_tracker(user_id, job_id)` and unique constraint | `app/models/application.py` | Low |

---

### Phase 5 — Feature Completion & UX Enhancements (P2)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P2** | Features | Implement a drag-and-drop Kanban board view option on the Application Tracker page | `frontend/src/pages/Tracker.jsx` | Medium |
| **P2** | Features | Connect the orphaned Cover Letter Generator service (`POST /generate-cover-letter`) to a UI Modal | `frontend/src/components/CoverLetterModal.jsx` | Low |
| **P2** | Matching | Refactor `MatchingEngine` scoring formula to be mathematically defensible without non-linear floor boosts | `app/services/matching_engine.py` | Low |

---

### Phase 6 — Production Hardening & Performance (P3)

| Priority | Category | Task Description | Target Files / Scope | Risk |
| -------- | -------- | ---------------- | -------------------- | ---- |
| **P3** | Production | Implement rate limiting (`slowapi`) on authentication & upload endpoints | `app/main.py`, `app/routers/auth.py` | Low |
| **P3** | Production | Create multi-stage `Dockerfile` and `docker-compose.yml` for local & staging deployment | `Dockerfile`, `docker-compose.yml` | Low |
| **P3** | Production | Configure PostgreSQL production environment settings and database connection pooling | `app/core/config.py` | Medium |
