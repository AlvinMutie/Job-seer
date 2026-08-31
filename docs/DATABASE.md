# DATABASE.md — Database Architecture & Evolution Specification

## Engine & Infrastructure Strategy

- **Development Engine**: **SQLite 3** (`job_hunter_v3.db`) is retained for zero-configuration local development.
- **Production Engine**: **PostgreSQL 15+** is designated as the target production database. SQLAlchemy ORM abstractions guarantee compatibility across both engines.
- **Migration Tooling**: **Alembic** must be introduced to manage schema migrations deterministically.

---

## Entity Relationship Diagram (ASCII)

```text
       ┌────────────────────────┐
       │         users          │
       ├────────────────────────┤
       │ id (PK, Integer)       │
       │ email (Unique, String) │
       │ hashed_password        │
       │ full_name              │
       │ is_profile_complete    │
       └───────────┬────────────┘
                   │ 1:1
                   ▼
       ┌────────────────────────┐
       │        profiles        │
       ├────────────────────────┤
       │ id (PK, Integer)       │
       │ user_id (FK -> users)  │
       │ preferred_role         │
       │ skills                 │
       │ experience_level       │
       │ location_preference    │
       │ salary_expectation     │
       │ resume_path            │
       │ resume_text            │
       └────────────────────────┘

       ┌────────────────────────┐         ┌────────────────────────┐
       │         users          │         │          jobs          │
       └───────────┬────────────┘         └───────────┬────────────┘
                   │ 1:N                              │ 1:N
                   ▼                                  ▼
       ┌───────────────────────────────────────────────────────────┐
       │                    application_tracker                    │
       ├───────────────────────────────────────────────────────────┤
       │ id (PK, Integer)                                          │
       │ user_id (FK -> users.id, Index)                           │
       │ job_id (FK -> jobs.id, Index)                             │
       │ status (Enum: Not Applied, Applied, Interview, etc.)      │
       │ match_score (Float)                                       │
       │ applied_at (DateTime)                                     │
       │ notes (Text)                                              │
       └───────────────────────────────────────────────────────────┘

 [ORPHAN / UNUSED TABLE]
       ┌────────────────────────┐
       │        resumes         │  <- Currently unused in code.
       └────────────────────────┘     Targeted for removal or versioning.
```

---

## Database Anomalies & Recommended Schema Refactorings

### 1. Orphan Table Removal / Integration (`resumes`)
- **Current State**: `resumes` table exists in `app/models/models.py#L53-L62` with fields (`id`, `user_id`, `content_text`, `extracted_skills`, `created_at`), but no application route or service queries or inserts into it. Parsed text is stored directly on `profiles.resume_text`.
- **Target Recommendation**: Remove the dead `resumes` ORM model, OR repurpose it as a `resume_versions` table to support historical CV uploads.

### 2. Missing Indexes & Constraints
- **Missing Index**: `application_tracker` requires a composite index on `(user_id, job_id)` for high-performance lookup in `GET /applications` and `POST /applications`.
- **Missing Constraint**: `application_tracker` should enforce a unique constraint `UniqueConstraint('user_id', 'job_id', name='uix_user_job')` to prevent duplicate tracking rows.

---

## Alembic Migration Setup Strategy

```bash
# Initialize Alembic in backend/
cd backend
alembic init alembic

# Configure alembic.ini and env.py to import SQLAlchemy Base
# Generate initial migration snapshot from existing models
alembic revision --autogenerate -m "initial_schema_snapshot"

# Upgrade database
alembic upgrade head
```
