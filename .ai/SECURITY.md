# SECURITY.md — Security Discovery Audit & Threat Analysis

## Overview
This document contains the preliminary security audit findings for **Smart Job Hunter**.

> [!CAUTION]
> Several **CRITICAL** and **HIGH** severity vulnerabilities exist in the repository that must be remediated before any production deployment or multi-user staging test.

---

## Findings Summary Matrix

| ID | Severity | Category | Flaw Description | Target Location |
| -- | -------- | -------- | ---------------- | --------------- |
| SEC-01 | **CRITICAL** | Hardcoded Secrets | Secret key for signing JWT tokens is hardcoded in source code | `backend/app/auth.py` |
| SEC-02 | **HIGH** | Missing Auth | `/match`, `/tailor-resume`, `/generate-cover-letter`, `/jobs` lack authentication | `backend/app/main.py` |
| SEC-03 | **HIGH** | Unrestricted Upload | `/upload-resume` allows arbitrary file extensions to be written to disk | `backend/app/main.py` |
| SEC-04 | **HIGH** | Insecure CORS | Wildcard origin `allow_origins=["*"]` configured with `allow_credentials=True` | `backend/app/main.py` |
| SEC-05 | **MEDIUM** | Password Package | `bcrypt.__about__` runtime monkeypatch used due to `passlib` version mismatch | `backend/app/main.py` |
| SEC-06 | **MEDIUM** | Storage Security | JWT tokens stored unencrypted in browser `localStorage` | `frontend/src/services/api.js` |
| SEC-07 | **MEDIUM** | Denial of Service | No API rate limiting on authentication or CPU-intensive TF-IDF/spaCy parsing | `backend/app/main.py` |
| SEC-08 | **LOW** | Verbose Logging | Information logging outputs user ID details to standard output | `backend/app/main.py` |

---

## Detailed Vulnerability Analysis

### SEC-01: Hardcoded JWT Secret Key (CRITICAL)
- **Location**: `backend/app/auth.py#L12`
- **Impact**: Attacker can forge valid JWT tokens for any user email and completely bypass authentication.
- **Evidence**:
  ```python
  SECRET_KEY = "super-secret-key-change-me-in-production"
  ```
- **Remediation**: Load `SECRET_KEY` from environment variables (`os.getenv("SECRET_KEY")`) and fail application startup if not configured.

---

### SEC-02: Missing Authorization Checks on Computational Endpoints (HIGH)
- **Location**: `backend/app/main.py#L84-L147`
- **Impact**: Anonymous users can invoke `/match`, `/tailor-resume`, `/generate-cover-letter`, and `/jobs`, leading to server resource exhaustion or data harvesting.
- **Evidence**: Endpoints do not include `Depends(get_current_user)` parameter.

---

### SEC-03: Unrestricted File Upload & Local Disk Storage (HIGH)
- **Location**: `backend/app/main.py#L252-L280`
- **Impact**: Any user can upload executable scripts or arbitrary binary files into the `uploads/` directory. If the directory is ever served statically, remote code execution (RCE) is possible.
- **Evidence**:
  ```python
  file_path = os.path.join(UPLOAD_DIR, f"resume_{current_user.id}_{safe_filename}")
  with open(file_path, "wb") as buffer:
      shutil.copyfileobj(file.file, buffer)
  ```
- **Remediation**: Validate mime-types and file extensions (`.pdf`, `.docx`, `.txt` only) BEFORE writing to disk. Store files outside web server root or use UUID filenames.

---

### SEC-04: Insecure CORS Configuration (HIGH)
- **Location**: `backend/app/main.py#L29-L35`
- **Impact**: Allowing all origins (`*`) while enabling credentials (`allow_credentials=True`) exposes the API to cross-site request forgery and data leakages.
- **Evidence**:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],
      allow_credentials=True,
      ...
  )
  ```

---

### SEC-05: Runtime Monkeypatching for Password Hashing (MEDIUM)
- **Location**: `backend/app/main.py#L7-L9`
- **Impact**: Indicates underlying dependency incompatibility between `passlib` and newer `bcrypt` library releases. Fragile at runtime.
- **Evidence**:
  ```python
  import bcrypt
  if not hasattr(bcrypt, "__about__"):
      bcrypt.__about__ = type("about", (object,), {"__version__": bcrypt.__version__})
  ```
- **Remediation**: Migrate to standard `argon2-cffi` or update passlib / bcrypt to compatible versions.
