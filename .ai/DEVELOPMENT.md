# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Intelligent Cover Letters & Multi-Tone Persistence (P3-05)

Task **P3-05** introduced the `CoverLetter` ORM model, multi-tone versioning engine, and persistent cover letter management:

### Model Schema (`CoverLetter`)

| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | Primary Key, Index | Unique record ID |
| `user_id` | Integer | ForeignKey("users.id"), Index | Authenticated owner ID |
| `job_id` | Integer | ForeignKey("jobs.id"), Index | Target job listing ID |
| `tailored_resume_id` | Integer | ForeignKey("tailored_resumes.id"), Nullable | Optional tailored resume link |
| `content` | Text | Non-null | Formatted cover letter body |
| `tone` | String | Index, Default "Professional" | Communication tone (`Professional`, `Enthusiastic`, `Executive`, `Technical`) |
| `version` | Integer | Default 1 | Sequential version number per `(user_id, job_id, tone)` |
| `job_title` | String | Nullable | Target role title |
| `company` | String | Nullable | Target company name |
| `created_at` | DateTime | Default UTC | Creation timestamp |

### Supported Communication Tones

- **`Professional`**: Conventional, polished business communication style.
- **`Enthusiastic`**: Energetic, passionate, optimistic style.
- **`Executive`**: Strategic, outcome-oriented leadership style highlighting business ROI.
- **`Technical`**: Engineering principles, architecture, and technology stack focus.

### Endpoints Reference

- `POST /cover-letters`: Generates multi-tone cover letter, calculates version number, and persists record.
- `GET /cover-letters`: Lists saved cover letters for authenticated user (supports optional `job_id` & `tone` filters).
- `GET /cover-letters/{id}`: Retrieves single saved cover letter by ID.
- `DELETE /cover-letters/{id}`: Deletes specified cover letter version.

---

## 2. Resume Tailoring V2 & Persistence (P3-04)

Task **P3-04** introduced `TailoredResume` model, versioning engine, structured diff comparison, and persistent tailoring endpoints.

---

## 3. Resume Intelligence & ATS Health Check (P3-03)

Task **P3-03** introduced `ResumeIntelligenceService` (`app/services/resume_intelligence.py`) and endpoint `GET /resume/health`.
