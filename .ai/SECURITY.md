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
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` | Pending (**P0-04**) |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` | Pending (**P0-05**) |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` | Pending (Phase 3) |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` | Pending (Phase 3) |

---

## Remediated: P0-03 Secure Resume Upload Boundary

`POST /upload-resume` enforces a 10-layer security boundary in `app/utils/file_handling.py`:

1. **Authentication Gate**: Enforces JWT bearer token via `Depends(get_current_user)`. Unauthenticated requests return `401 Unauthorized`.
2. **Extension Whitelist**: Only `.pdf`, `.docx`, and `.txt` extensions are accepted. Unsupported extensions (e.g. `.exe`, `.py`) are rejected with `400 Bad Request`.
3. **MIME Magic Byte Verification**: Validates file content headers (`%PDF-` for PDF, `PK\x03\x04` for DOCX, valid UTF-8 for TXT). Renamed binary executables are rejected with `400 Bad Request`.
4. **File Size Limit**: Maximum file size strictly capped at 10MB (10,485,760 bytes). Oversized files return `400 Bad Request`.
5. **Path Traversal Protection**: Files are saved using server-side UUID filenames (`uploads/resume_{user_id}_{uuid4.hex}{ext}`). User-supplied filenames are never used for disk storage.
6. **Old File Lifecycle Cleanup**: Automatically deletes previous user resume files upon uploading a new one.
7. **Document Parser Protection**: Document text extraction is wrapped in error handling. Corrupted/encrypted files return `400 Bad Request` and clean up transient disk files.
