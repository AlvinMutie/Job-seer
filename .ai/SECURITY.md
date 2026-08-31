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

## Error Handling & Information Disclosure Prevention (P2-01)

The backend enforces centralized exception handling (`app/core/errors.py`) to prevent sensitive implementation detail leakage:

1. **Sanitized 500 Responses**: Unhandled internal exceptions return a generic safe message `"An unexpected server error occurred."` with zero raw tracebacks or exception internals exposed to the client.
2. **Secrets Protection**: Exception responses never reveal database connection strings, passwords, JWT secrets, or filesystem paths.
3. **Structured Error Codes**: Standardizes error codes (`VALIDATION_ERROR`, `RESOURCE_NOT_FOUND`, `TOKEN_INVALID`, `UPLOAD_TOO_LARGE`) while preserving backward-compatible top-level `detail` fields for frontend rendering.
4. **Server-Side Logging**: Full tracebacks are logged server-side via `logging.exception` for developer diagnosis without client exposure.

---

## Resume Upload Security & Safety Gate (P0-03 / P1-05)

`POST /upload-resume` enforces a 10-layer security boundary verified by automated safety tests:

1. **Extension Whitelisting**: Strictly permits `.pdf`, `.docx`, `.txt` (case-insensitive). Rejects executable scripts (`.exe`, `.py`, `.sh`, `.js`, `.php`, `.html`, `.jpg`, `.png`, `.zip`, `.doc`) with `400 Bad Request`.
2. **MIME Magic Byte Verification**: Validates PDF header (`%PDF-`), DOCX header (`PK\x03\x04`), and TXT UTF-8 decodability.
3. **File Size Boundaries**: Enforces 10MB (`10,485,760 bytes`) maximum file size limit. Oversized uploads return `413 Content Too Large`.
4. **Path Traversal Protection**: Client-supplied filenames (e.g. `../../evil.txt`, `/etc/passwd.txt`) are discarded for storage purposes.
5. **Server UUID Filenames**: Files are saved strictly in `uploads/` using server-generated UUIDs (`resume_{user_id}_{uuid.hex}{ext}`).
6. **Old File Lifecycle Cleanup**: Uploading a new resume automatically deletes the previous stored resume from disk.
7. **User Storage Isolation**: User uploads are stored independently without cross-user deletion or file collision.

---

## JWT Authentication Safety Gate (P1-04)

The backend enforces strict JWT authentication validation across all protected routes via `app/auth.py` (`get_current_user`):

1. **Secret Key Verification**: Signed using externalized `settings.SECRET_KEY`. Tokens signed with unauthorized keys are rejected with `401 Unauthorized`.
2. **Algorithm Restriction**: Strictly specifies `algorithms=[settings.ALGORITHM]` (`HS256`).
3. **Signature & Expiration Validation**: Automatically rejects expired (`exp`) or payload-tampered tokens.
4. **Subject Claim Verification**: Requires valid `sub` claim mapping to an active database user.
5. **Scheme Enforcement**: Strictly enforces `Authorization: Bearer <token>`.
