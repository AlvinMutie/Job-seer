# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and JWT safety gate suite for **Smart Job Hunter**.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location | Remediation Status |
| -- | -------- | -------- | ------------------------- | --------------- | ------------------ |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens was hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` | **REMEDIATED (P0-01)** — Externalized to `app/core/config.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter` lack authentication checks | `backend/app/main.py` | **REMEDIATED (P0-02)** — Protected with `Depends(get_current_user)` |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` | **REMEDIATED (P0-03)** — Protected with 10-layer upload boundary |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` | **REMEDIATED (P0-04)** — Restricted via `settings.ALLOWED_ORIGINS` |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` | **REMEDIATED (P0-05)** — Pinned `passlib==1.7.4` and `bcrypt==4.0.1` |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` | Pending (Phase 3) |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` | Pending (Phase 3) |

---

## JWT Authentication Safety Gate (P1-04)

The backend enforces strict JWT authentication validation across all protected routes via `app/auth.py` (`get_current_user`):

1. **Secret Key Verification**: Signed using externalized `settings.SECRET_KEY`. Tokens signed with unauthorized keys are rejected with `401 Unauthorized`.
2. **Algorithm Restriction**: Strictly specifies `algorithms=[settings.ALGORITHM]` (`HS256`). Arbitrary algorithm claims (e.g. `HS512` or `none`) are rejected.
3. **Signature & Expiration Validation**: Automatically rejects expired (`exp`) or payload-tampered tokens.
4. **Subject Claim Verification**: Requires valid `sub` claim mapping to an active database user.
5. **Scheme Enforcement**: Strictly enforces `Authorization: Bearer <token>`. Invalid schemes (Basic, Token) or empty Bearer tokens are rejected.

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
