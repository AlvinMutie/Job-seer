# AGENTS.md — AI Engineering Guidelines & Operational Constraints

Welcome AI Agent. This document governs all automated and assisted code modifications for the **Smart Job Hunter** codebase. You MUST adhere strictly to these instructions.

---

## 1. Core Principles

1. **Inspect Before Modifying**:
   - Never assume file locations, schema attributes, or API signatures.
   - Always view source files completely before attempting code edits.
   - Do not trust `README.md` or obsolete documentation; treat existing application source code as the sole source of truth.

2. **Security-First Development**:
   - Never commit hardcoded secrets, tokens, or fallback API keys.
   - Ensure all new API endpoints are protected with valid JWT bearer authentication (`get_current_user`).
   - Validate and sanitize all user input and file uploads. Sanitization must be enforced at backend entry points.

3. **Minimal & Targeted Changes**:
   - Keep pull requests and edits focused strictly on requested bug fixes or features.
   - Do not perform unrequested refactoring, format rewrites, or aesthetic overhauls.

4. **No Invented Requirements**:
   - Build only what is specified in approved implementation plans.
   - Do not add speculative dependencies or bloated third-party frameworks.

5. **Empirical Verification Required**:
   - Never declare a task resolved without running build, linting, and automated test commands.
   - Verify both frontend compilation (`npm run build`) and backend syntax/imports before completing a turn.

---

## 2. Codebase Conventions

- **Backend**: FastAPI (Python 3.10+), SQLAlchemy ORM, Pydantic v2.
  - Sub-routers should be placed in `backend/app/routers/` when modularizing `main.py`.
  - Database migrations should use Alembic.
  - Dependencies belong in `backend/requirements.txt`.
- **Frontend**: React 18, Vite, Tailwind CSS v3, Framer Motion, Lucide React.
  - Keep styling aligned with the established Dark Glassmorphism palette (`slate-950`, `indigo-600`, `glass-card`).
  - Use `authService`, `jobService`, and `trackerService` inside `frontend/src/services/api.js` for API calls.

---

## 3. Mandatory Workflow

```text
Understand Request -> Inspect Code -> Formulate Implementation Plan -> Get Approval -> Implement -> Verify empirically -> Document Changes
```
