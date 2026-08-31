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

## Frontend Security & Information Disclosure Prevention (P2-03)

1. **Token Handling**: JWT bearer tokens are attached dynamically via Axios request interceptors. Authorization headers are stripped when no token exists.
2. **Expired Token Cleanup**: On HTTP 401 Unauthorized responses (excluding login credential attempts), the response interceptor automatically removes stale tokens from `localStorage` to prevent infinite auth loops.
3. **Backend as Authoritative Boundary**: Frontend route protection (`ProtectedRoute`) provides UX flow navigation only. Backend API dependencies (`Depends(get_current_user)`) remain the sole authoritative security boundary.
4. **Information Disclosure Prevention**: Error objects are sanitized through `getApiErrorMessage(error)` before display. Stack traces, raw exception objects, or SQL tracebacks are never rendered in the UI or printed to browser logs.

---

## Application Tracker Query Security & User Isolation (P2-02)

`GET /applications` enforces strict query parameter validation and resource-owner isolation:

1. **User Ownership Isolation**: The query condition `ApplicationTracker.user_id == current_user.id` is applied as the base constraint before status filtering, keyword search, or pagination. Filtering or searching can never leak another user's application records.
2. **SQL Injection Prevention**: All search queries use SQLAlchemy parameterized expressions (`Job.title.ilike(term)`). Raw SQL string concatenation is prohibited.
3. **Limit & Offset Boundaries**: `limit` is bounded between `1` and `100`. `offset` is bounded to non-negative integers (`ge=0`). Invalid pagination parameters return HTTP 422 `VALIDATION_ERROR`.
