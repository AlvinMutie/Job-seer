# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, and authentication architecture for **Smart Job Hunter**.

---

## Preliminary Threat Catalog

| ID | Severity | Category | Vulnerability Description | Target Location |
| -- | -------- | -------- | ------------------------- | --------------- |
| SEC-01 | **CRITICAL** | Secrets Management | Secret key for signing JWT tokens is hardcoded in source code (`"super-secret-key-change-me-in-production"`) | `backend/app/auth.py` |
| SEC-02 | **HIGH** | Authorization | `/match`, `/tailor-resume`, `/generate-cover-letter` lack authentication checks | `backend/app/main.py` |
| SEC-03 | **HIGH** | File Upload | `/upload-resume` writes uploaded files directly to disk without extension whitelist or mime verification | `backend/app/main.py` |
| SEC-04 | **HIGH** | CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` |

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

1. **Extension Whitelist**: Enforce strict checking against `.pdf`, `.docx`, `.txt` extensions ONLY.
2. **MIME Magic Byte Validation**: Inspect header bytes using buffer inspection (`%PDF-` for PDF, `PK\x03\x04` for DOCX, UTF-8 text validation for TXT) to prevent executable scripts disguised with `.pdf` extensions.
3. **Maximum File Size**: Enforce a strict 10 MB file size limit before reading the full file buffer into memory.
4. **Filename Sanitization**: Strip original client-provided filenames (`file.filename`). Never use user input as disk filenames.
5. **Server-Side Filename Generation**: Save files using a random UUID string: `uploads/resume_{user_id}_{uuid.uuid4().hex}{ext}`.
6. **Path Traversal Protection**: Enforce canonicalized path resolution (`os.path.abspath`) to guarantee files cannot be written outside `backend/uploads/`.
7. **Document Parser Error Handling**: Wrap `extract_text()` in explicit `try...except` handling. If PyMuPDF or `docx2txt` fails to parse a malformed or password-protected document, return a structured `400 Bad Request` ("Malformed or encrypted document") instead of throwing an unhandled `500 Internal Server Error`.
8. **File Lifecycle & Cleanup**: Automatically remove older resume files associated with `user_id` when a new CV is uploaded, preventing server disk space exhaustion.
9. **No Direct Web Execution**: The `backend/uploads/` directory MUST NOT be exposed via static file serving middleware.
10. **Sanitized Text Storage**: Sanitize extracted resume text before persisting in `profiles.resume_text` or returning in JSON responses.

---

## Authentication Architecture Review & Storage Evaluation

### Current Architecture
- **Login**: `POST /login` verifies credentials against bcrypt hash and returns an HS256 signed JWT token valid for 24 hours.
- **Storage**: Token saved in `localStorage.setItem('token', access_token)`.
- **API Requests**: Axios interceptor attaches `Authorization: Bearer <token>` header to all requests.

### Trade-Off Analysis: `localStorage` vs. `HttpOnly` Cookie

| Architectural Metric | Bearer Token + `localStorage` (Current) | `HttpOnly` `SameSite=Strict` Cookie (Alternative) |
| -------------------- | --------------------------------------- | ------------------------------------------------ |
| **XSS Token Theft Risk** | High (Any XSS vulnerability exposes JWT) | Zero (JavaScript cannot access `HttpOnly` cookies) |
| **CSRF Vulnerability** | Immune (Browser does not send token automatically) | Vulnerable if `SameSite` or anti-CSRF tokens missing |
| **Implementation Complexity** | Simple for local SPA development | Requires CORS credentials setup & CSRF token header |
| **Mobile / Native Client Ready** | High | Requires custom cookie jar handling |

### Final Decision: Bearer Tokens for Local MVP; Cookie Upgrade for Production
- **Local Dev Phase**: Maintain `Bearer token + localStorage` to keep SPA local dev simple.
- **Production Requirement**: Migrate to `HttpOnly`, `SameSite=Strict`, `Secure` cookies with anti-CSRF double-submit tokens prior to multi-tenant deployment.

---

## Categorized Security Requirements (MUST / SHOULD / OPTIONAL)

### 1. Secrets & Configuration
- **MUST**: Load `SECRET_KEY` from environment variables via `pydantic-settings`. Fail startup if missing or under 32 characters.
- **MUST**: Include `.env` in `.gitignore`.

### 2. Authorization & Boundaries
- **MUST**: Add `Depends(get_current_user)` to `/match`, `/tailor-resume`, `/generate-cover-letter`. Retain `GET /jobs` as `PUBLIC`.
- **MUST**: Assert `user_id == current_user.id` on all `profiles` and `applications` queries to prevent IDOR attacks.

### 3. Rate Limiting & DoS
- **MUST**: Implement IP-based rate limiting on `/register` and `/login` (max 5 attempts/minute) via `slowapi`.
