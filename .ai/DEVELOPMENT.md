# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Resume Tailoring V2 & Persistence (P3-04)

Task **P3-04** introduced the `TailoredResume` ORM model, versioning engine, structured diff comparison, and persistent tailoring endpoints:

### Model Schema (`TailoredResume`)

| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | Primary Key, Index | Unique record ID |
| `user_id` | Integer | ForeignKey("users.id"), Index | Authenticated owner ID |
| `job_id` | Integer | ForeignKey("jobs.id"), Index | Target job listing ID |
| `original_resume_text` | Text | Non-null | Baseline resume content |
| `tailored_resume_text` | Text | Non-null | Generated version text |
| `version` | Integer | Default 1 | Sequential version number per `(user_id, job_id)` |
| `match_score` | Float | Nullable | V2 AI Match Score percentage |
| `job_title` | String | Nullable | Target role title |
| `company` | String | Nullable | Target company name |
| `created_at` | DateTime | Default UTC | Creation timestamp |

### Endpoints Reference

- `POST /resume/tailor`: Generates tailored version, increments version, and persists record.
- `GET /resume/tailored`: Lists all saved tailored resumes for authenticated user.
- `GET /resume/tailored/{id}`: Retrieves single saved tailored resume by ID.
- `GET /resume/tailored/{id}/compare`: Returns structured line-by-line diff (`added`, `removed`, `unchanged`).
- `DELETE /resume/tailored/{id}`: Deletes specified tailored resume version.

---

## 2. Resume Intelligence & ATS Health Check (P3-03)

Task **P3-03** introduced `ResumeIntelligenceService` (`app/services/resume_intelligence.py`) and endpoint `GET /resume/health`.

---

## 3. Matching Engine V2 & Explainable Scoring (P3-02)

Task **P3-02** upgraded `MatchingEngine` (`app/services/matching_engine.py`) to compute an explainable multi-factor match score breakdown (Skills 40%, Content 30%, Experience 15%, Role Title 15%).
