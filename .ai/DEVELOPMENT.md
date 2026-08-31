# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Application Tracker V2 & Kanban Board (P3-06)

Task **P3-06** upgraded the application tracking pipeline to a complete Kanban board workspace with HTML5 drag-and-drop:

### Extended Model Schema (`ApplicationTracker`)

| Column | Type | Constraints | Description |
| ------ | ---- | ----------- | ----------- |
| `id` | Integer | Primary Key, Index | Unique tracking record ID |
| `user_id` | Integer | ForeignKey("users.id"), Index | Authenticated owner ID |
| `job_id` | Integer | ForeignKey("jobs.id"), Index | Target job listing ID |
| `status` | Enum | Values: `Not Applied`, `Applied`, `Interview`, `Offer`, `Rejected` | Pipeline column stage |
| `match_score` | Float | Nullable | AI Match Score |
| `applied_at` | DateTime | Nullable | Creation timestamp |
| `applied_date` | DateTime | Nullable | Formal application date |
| `interview_date` | DateTime | Nullable | Scheduled interview date |
| `follow_up_date` | DateTime | Nullable | Scheduled follow-up date |
| `application_url` | String | Nullable | Job portal link (`http://` or `https://` only) |
| `notes` | Text | Nullable | Custom application notes |
| `updated_at` | DateTime | Default UTC | Update timestamp |

### Kanban Drag & Drop Architecture

- **Frontend (`Tracker.jsx`)**: Native HTML5 Drag and Drop (`onDragStart`, `onDragOver`, `onDrop`). Optimistically updates UI state and sends `PATCH /applications/{id}` status payload. Automatically rolls back UI state if server request fails.
- **Detail View (`ApplicationDetailModal.jsx`)**: Comprehensive modal for editing status, dates, application URLs, notes, and deletion.

### Endpoints Reference

- `GET /applications`: Lists tracked applications (supports search, status filter, limit, offset pagination).
- `GET /applications/{id}`: Retrieves single tracked application by ID.
- `POST /applications`: Tracks new application or updates existing job status.
- `PATCH /applications/{id}`: Updates status, dates, application URL, and notes.
- `DELETE /applications/{id}`: Deletes tracked application.

---

## 2. Intelligent Cover Letters & Multi-Tone Persistence (P3-05)

Task **P3-05** introduced `CoverLetter` model, multi-tone versioning engine, and persistent cover letter management.

---

## 3. Resume Tailoring V2 & Persistence (P3-04)

Task **P3-04** introduced `TailoredResume` model, versioning engine, structured diff comparison, and persistent tailoring endpoints.
