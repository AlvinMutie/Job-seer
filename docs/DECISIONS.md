# DECISIONS.md — Architectural Decision Log

This document records the technical and architectural decisions verified within the **Smart Job Hunter** codebase.

---

## Verified Historical Decisions

### ADR-01: FastAPI + SQLAlchemy Backend Framework
- **Status**: Implemented
- **Context**: The backend was constructed using FastAPI with SQLAlchemy ORM and SQLite (`job_hunter_v3.db`).
- **Rationale**: High performance async Python API framework with automatic OpenAPI documentation generation. SQLite chosen for zero-config local development with easy PostgreSQL migration path.

### ADR-02: Dictionary + TF-IDF Hybrid Matching Strategy
- **Status**: Implemented with deviations
- **Context**: Resume-to-job matching combines a keyword skill dictionary (`TECH_SKILLS_DB`), spaCy NLP entity detection, and scikit-learn TF-IDF cosine similarity.
- **Rationale**: Pure TF-IDF struggles with technical acronyms and short skill tokens (e.g. "Go", "C", "JS"). Combining hardcoded skill sets with TF-IDF provides higher precision for technical resume analysis without requiring expensive LLM API calls.
- **Historical Note**: Original codebase author added a non-linear score booster (`max(final_score, content_similarity * 2)`) to prevent low match scores from demotivating users.

### ADR-03: Single Page Application Architecture with Vite & React
- **Status**: Implemented
- **Context**: The frontend uses React 18 built with Vite (`@vitejs/plugin-react-swc`) and styled using Tailwind CSS v3 dark glassmorphism palette.
- **Rationale**: Fast developer hot-reload experience and lightweight production build.

### ADR-04: Stateless JWT Authentication with Client-side LocalStorage
- **Status**: Implemented (Requires security upgrade)
- **Context**: User authorization utilizes HS256 signed JSON Web Tokens saved in browser `localStorage`.
- **Rationale**: Simplifies stateless authentication between client SPA and FastAPI server.
- **Historical Note**: Key was hardcoded as `"super-secret-key-change-me-in-production"` for local prototyping. Must be migrated to HTTP-only cookies or environment-based keys before release.

### ADR-05: Direct Storage of Parsed Resume Text in Profile Model
- **Status**: Implemented
- **Context**: Parsed resume text is saved directly on the `Profile` record (`profile.resume_text`) rather than creating separate records in the `resumes` table.
- **Rationale**: Simplifies query joins when checking user resume state during dashboard load.
- **Historical Note**: Left the `Resume` model orphan in `models.py`.
