# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, and authentication architecture for **Smart Job Hunter**.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location | Remediation Status |
| -- | -------- | -------- | ------------------------- | --------------- | ------------------ |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens was hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` | **REMEDIATED (P0-01)** — Externalized to `app/core/config.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter` lack authentication checks | `backend/app/main.py` | Pending (**P0-02**) |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` | Pending (**P0-03**) |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` | Pending (**P0-04**) |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` | Pending (**P0-05**) |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` | Pending (Phase 3) |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` | Pending (Phase 3) |

---

## Remediated: P0-01 Centralized Configuration & JWT Secret Externalization

- **Secret Externalization**: Hardcoded `"super-secret-key-change-me-in-production"` string completely purged from application source code.
- **Centralized Settings**: All authentication and database settings are managed by `app.core.config.Settings` (built with `pydantic-settings`).
- **Fail-Safe Security Validation**: In `ENVIRONMENT="production"`, `Settings.validate_secret_key` enforces minimum 32-character secret length and rejects default placeholder strings, raising `ValueError` on startup.
- **Version Control Safety**: `.gitignore` excludes `.env` and `.env.*`. `.env.example` provides non-secret template configuration for developers.

---

## Complete File Upload Security Boundary Design

To prevent arbitrary code execution, disk exhaustion, path traversal, and document parsing exploits, `POST /upload-resume` MUST enforce the following 10-layer upload boundary:

```text
Incoming File Upload -> Size Check (<=10MB) -> Extension Whitelist (.pdf,.docx,.txt)
        │
        ▼
MIME Magic Byte Validation (%PDF-, PK\x03\x04) -> Path Traversal Check (No slashes/null bytes)
        │
        ▼
Server UUID Filename Generation (uploads/uuid4.pdf) -> Disk Write Outside Web Root
        │
        ▼
Try/Except Document Text Extraction (PyMuPDF/docx2txt) -> Malformed Document Fallback
        │
        ▼
Old Resume Lifecycle Cleanup -> Sanitized Response Preview
```

---

## Categorized Security Requirements (MUST / SHOULD / OPTIONAL)

### 1. Secrets & Configuration
- **MUST (REMEDIATED)**: Load `SECRET_KEY` from environment variables via `pydantic-settings`. Fail startup if missing or under 32 characters in production.
- **MUST (REMEDIATED)**: Include `.env` in `.gitignore`.

### 2. Authorization & Boundaries
- **MUST**: Add `Depends(get_current_user)` to `/match`, `/tailor-resume`, `/generate-cover-letter`. Retain `GET /jobs` as `PUBLIC`.
- **MUST**: Assert `user_id == current_user.id` on all `profiles` and `applications` queries to prevent IDOR attacks.
