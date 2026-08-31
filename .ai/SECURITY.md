# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, and authentication architecture for **Smart Job Hunter**.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location | Remediation Status |
| -- | -------- | -------- | ------------------------- | --------------- | ------------------ |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens was hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` | **REMEDIATED (P0-01)** — Externalized to `app/core/config.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter` lack authentication checks | `backend/app/main.py` | **REMEDIATED (P0-02)** — Protected with `Depends(get_current_user)` |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` | **REMEDIATED (P0-03)** — Protected with 10-layer upload boundary |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` | **REMEDIATED (P0-04)** — Restricted via `settings.ALLOWED_ORIGINS` |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` | Pending (**P0-05**) |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` | Pending (Phase 3) |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` | Pending (Phase 3) |

---

## Remediated: P0-04 CORS Origin Restrictions

- **Origin Limitation**: Wildcard CORS origin `allow_origins=["*"]` completely removed from application middleware.
- **Centralized Configuration**: Allowed origins are managed by `settings.CORS_ORIGINS` (defaulting to `"http://localhost:5173,http://localhost:3000"` for local development).
- **Wildcard Prohibition**: `Settings.validate_cors_origins` prohibits configuring wildcard `*` in `ENVIRONMENT="production"`.
- **Header Verification**: Trusted origins receive `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials: true`. Untrusted origins do not receive permission headers.

---

## Complete File Upload Security Boundary Design

To prevent arbitrary code execution, disk exhaustion, path traversal, and document parsing exploits, `POST /upload-resume` MUST enforce the following 10-layer upload boundary:

```text
Incoming File Upload -> Size Check (<=10MB) -> Extension Whitelist (.pdf,.docx,.txt)
        │
        ▼
Format Check (%PDF-, PK\x03\x04, UTF-8 text) -> Path Traversal Check (No slashes/null bytes)
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
