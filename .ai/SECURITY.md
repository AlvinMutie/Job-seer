# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, and authentication architecture for **Smart Job Hunter**.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location | Remediation Status |
| -- | -------- | -------- | ------------------------- | --------------- | ------------------ |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens was hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` | **REMEDIATED (P0-01)** — Externalized to `app/core/config.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter` lack authentication checks | `backend/app/main.py` | **REMEDIATED (P0-02)** — Protected with `Depends(get_current_user)` |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` | Pending (**P0-03**) |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` | Pending (**P0-04**) |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` | Pending (**P0-05**) |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` | Pending (Phase 3) |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` | Pending (Phase 3) |

---

## Remediated: P0-02 Endpoint Authorization Boundaries

- **Boundary Protection**: Added `current_user: User = Depends(get_current_user)` to computational endpoints `POST /match`, `POST /tailor-resume`, and `POST /generate-cover-letter`.
- **Public Access Protection**: Retained `GET /jobs` as an unauthenticated `PUBLIC` endpoint for job discovery.
- **Unauthenticated Protection**: Unauthenticated requests to computational endpoints are rejected with `401 Unauthorized` (`"Not authenticated"`). Malformed/expired JWTs return `401 Unauthorized` (`"Could not validate credentials"`). Valid Bearer tokens execute endpoint logic normally (`200 OK`).

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
