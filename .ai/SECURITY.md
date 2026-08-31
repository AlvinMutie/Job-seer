# SECURITY.md — Security Discovery Audit & Hardened Requirements Specification

## Executive Overview
This document outlines the security audit findings for **Smart Job Hunter** and establishes mandatory security specifications for all future code modifications.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location |
| -- | -------- | -------- | ------------------------- | --------------- |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens is hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter`, `/jobs` lack authentication checks | `backend/app/main.py` |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` |
| SEC-08 | **LOW** | Verbose Logging | Info logs print user ID details to stdout | `backend/app/main.py` |

---

## Categorized Security Requirements

Requirements are classified as **MUST** (Mandatory for release), **SHOULD** (Recommended best practice), or **OPTIONAL** (Defense-in-depth enhancement).

### 1. Secrets & Environment Configuration
- **MUST**: Remove hardcoded `SECRET_KEY` from `backend/app/auth.py`. Load `SECRET_KEY` from environment variables via `pydantic-settings`. Fail application startup if `SECRET_KEY` is missing or less than 32 characters.
- **MUST**: Ensure `.env` files are included in `.gitignore` and never committed to source control.

### 2. Authentication & JWT Handling
- **MUST**: Set JWT expiration to a reasonable duration (e.g. 60 minutes) and require re-authentication or refresh tokens.
- **SHOULD**: Migrate JWT storage from client `localStorage` to `HttpOnly`, `SameSite=Strict`, `Secure` cookies to prevent XSS token theft.
- **MUST**: Fix the `passlib` / `bcrypt` dependency mismatch to eliminate runtime monkeypatching in `main.py`.

### 3. Authorization & IDOR Prevention
- **MUST**: Require valid JWT bearer authentication (`Depends(get_current_user)`) on `/match`, `/tailor-resume`, `/generate-cover-letter`, and `/jobs`.
- **MUST**: Enforce Resource-Owner checks on all user-scoped data (`profiles`, `applications`, `resumes`). Ensure `user_id == current_user.id` is explicitly checked on every database query and mutation.

### 4. File Upload & Document Parsing Security
- **MUST**: Validate uploaded file extensions against an explicit whitelist (`.pdf`, `.docx`, `.txt` only) BEFORE writing files to disk.
- **MUST**: Check MIME types using magic bytes (`magic` library) to prevent executable files renamed with `.pdf` extensions.
- **MUST**: Restrict maximum file upload size to 10 MB.
- **SHOULD**: Store uploaded files using randomly generated UUID filenames rather than original user filenames to prevent path traversal and file overwriting attacks.

### 5. CORS & Network Security
- **MUST**: Replace wildcard CORS `allow_origins=["*"]` with an explicit list of allowed frontend origins loaded from configuration (e.g. `http://localhost:5173`).

### 6. Rate Limiting & DoS Protection
- **MUST**: Implement IP-based and user-based rate limiting on `/login` and `/register` endpoints (e.g., max 5 failed attempts per minute) using `slowapi` or Redis.
- **SHOULD**: Implement rate limiting on computationally expensive endpoints (`/match`, `/upload-resume`).

### 7. Input Validation & XSS/SQL Injection Defense
- **MUST**: Use Pydantic schemas for all API inputs to enforce strict type checking and string length limits.
- **MUST**: Ensure all database queries use SQLAlchemy ORM parameter binding to prevent SQL injection.
- **SHOULD**: Sanitize all text extracted from uploaded resumes before rendering in React frontend to prevent stored XSS attacks.

### 8. Logging & Error Handling
- **MUST**: Sanitize logs to ensure passwords, full JWT tokens, or raw resume text are never written to stdout or log files.
- **MUST**: Return generic, uninformative error messages to clients for authentication failures (e.g., "Invalid credentials") while logging detailed errors internally.
