# DATABASE.md — Database Architecture & Schema Specification

## Engine & Connection Details
- **Database Engine**: SQLite 3 (Dev default via `job_hunter_v3.db`) / PostgreSQL ready via SQLAlchemy `DATABASE_URL` environment variable.
- **ORM**: SQLAlchemy 2.0 declarative base (`app/models/models.py`).
- **Migration Tool**: None configured (tables are created via `Base.metadata.create_all(bind=engine)` on FastAPI startup).

---

## Entity Relationship Diagram (ASCII)

```text
       ┌────────────────────────┐
       │         User           │
       ├────────────────────────┤
       │ id (PK)                │
       │ email (Unique)         │
       │ hashed_password        │
       │ full_name              │
       │ is_profile_complete    │
       └───────────┬────────────┘
                   │ 1:1
                   ▼
       ┌────────────────────────┐
       │        Profile         │
       ├────────────────────────┤
       │ id (PK)                │
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
       │         User           │         │          Job           │
       └───────────┬────────────┘         └───────────┬────────────┘
                   │ 1:N                              │ 1:N
                   ▼                                  ▼
       ┌───────────────────────────────────────────────────────────┐
       │                    ApplicationTracker                     │
       ├───────────────────────────────────────────────────────────┤
       │ id (PK)                                                   │
       │ user_id (FK -> users.id)                                  │
       │ job_id (FK -> jobs.id)                                    │
       │ status (Enum: Not Applied, Applied, Interview, etc.)      │
       │ match_score (Float)                                       │
       │ applied_at (DateTime)                                     │
       │ notes (Text)                                              │
       └───────────────────────────────────────────────────────────┘

 [ORPHAN / UNUSED TABLE]
       ┌────────────────────────┐
       │         Resume         │
       ├────────────────────────┤
       │ id (PK)                │
       │ user_id (FK -> users)  │
       │ content_text           │
       │ extracted_skills       │
       │ created_at             │
       └────────────────────────┘
```

---

## Detailed Schema Specification

### 1. `users` Table
| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | PK, Indexed | Primary Key |
| `email` | String | Unique, Indexed | User Email Address |
| `hashed_password` | String | Non-null | Bcrypt hashed password |
| `full_name` | String | Nullable | User display name |
| `is_profile_complete` | Integer | Default: 0 | Profile status flag (0 = false, 1 = true) |

### 2. `profiles` Table
| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | PK, Indexed | Primary Key |
| `user_id` | Integer | FK (`users.id`), Unique | Foreign key linking to user |
| `preferred_role` | String | Nullable | Target job title |
| `skills` | Text | Nullable | Comma-separated user technical skills |
| `experience_level` | String | Nullable | Junior, Mid-Level, Senior, etc. |
| `location_preference` | String | Nullable | Remote, NYC, etc. |
| `salary_expectation` | String | Nullable | Annual target salary |
| `resume_path` | String | Nullable | Absolute or relative disk path to uploaded PDF/DOCX |
| `resume_text` | Text | Nullable | Extracted raw text from resume file |

### 3. `jobs` Table
| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | PK, Indexed | Primary Key |
| `title` | String | Indexed | Job Posting Title |
| `company` | String | Indexed | Company Name |
| `location` | String | Nullable | Job Location |
| `description` | Text | Non-null | Job Description content |
| `remote_status` | String | Nullable | Remote, Hybrid, On-site |
| `experience_level` | String | Nullable | Junior, Mid-Level, Senior |
| `skills_required` | Text | Nullable | Required skills list |
| `salary_range` | String | Nullable | Display salary string |
| `posted_at` | DateTime | Default: `utcnow()` | Post timestamp |

### 4. `application_tracker` Table
| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | PK, Indexed | Primary Key |
| `user_id` | Integer | FK (`users.id`) | Foreign key linking to user |
| `job_id` | Integer | FK (`jobs.id`) | Foreign key linking to job |
| `status` | Enum | Enum values (`ApplicationStatus`) | "Not Applied", "Applied", "Interview", "Rejected", "Offer" |
| `match_score` | Float | Nullable | Stored match score percentage |
| `applied_at` | DateTime | Nullable | Application timestamp |
| `notes` | Text | Nullable | User notes |

### 5. `resumes` Table (**DEAD / UNUSED**)
- Table exists in `app/models/models.py#L53-L62` but is never referenced anywhere in `main.py` or service layer.

---

## Schema Anomalies & Recommendations
1. **Unused Table**: Drop or integrate the `resumes` table. Currently, resume file path and text are duplicated directly inside `profiles`.
2. **Missing Database Indexing**: `application_tracker` missing composite index on `(user_id, job_id)`.
3. **No Migration History**: Database schema changes are currently unmanaged. Introduce Alembic migrations.
