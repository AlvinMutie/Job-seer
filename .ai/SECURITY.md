# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

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

## Application Tracker Query Security & User Isolation (P2-02)

`GET /applications` enforces strict query parameter validation and resource-owner isolation:

1. **User Ownership Isolation**: The query condition `ApplicationTracker.user_id == current_user.id` is applied as the base constraint before status filtering, keyword search, or pagination. Filtering or searching can never leak another user's application records.
2. **SQL Injection Prevention**: All search queries use SQLAlchemy parameterized expressions (`Job.title.ilike(term)`). Raw SQL string concatenation is prohibited. Attacks using `' OR 1=1; --` or wildcard characters are safely escaped and parameterized.
3. **Limit & Offset Boundaries**: `limit` is bounded between `1` and `100` (`Query(default=50, ge=1, le=100)`). `offset` is bounded to non-negative integers (`ge=0`). Invalid or negative pagination parameters return HTTP 422 `VALIDATION_ERROR`.
4. **Status Filter Validation**: Unrecognized status strings are rejected with HTTP 422 `VALIDATION_ERROR`, preventing arbitrary parameter injection.

---

## Error Handling & Information Disclosure Prevention (P2-01)

The backend enforces centralized exception handling (`app/core/errors.py`) to prevent sensitive implementation detail leakage:

1. **Sanitized 500 Responses**: Unhandled internal exceptions return a generic safe message `"An unexpected server error occurred."` with zero raw tracebacks or exception internals exposed to the client.
2. **Secrets Protection**: Exception responses never reveal database connection strings, passwords, JWT secrets, or filesystem paths.
3. **Structured Error Codes**: Standardizes error codes (`VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `TOKEN_INVALID`, `UPLOAD_TOO_LARGE`) while preserving backward-compatible top-level `detail` fields.
