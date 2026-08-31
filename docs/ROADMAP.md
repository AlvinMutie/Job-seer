# ROADMAP.md — Implementation-Ready Engineering Task Plan

This document contains the implementation-ready task breakdown for **Smart Job Hunter**. All tasks are prioritized using **P0 (Critical Security & Configuration)**, **P1 (High Stabilization & Refactoring)**, **P2 (Medium Feature & Schema Polish)**, and **P3 (Low Production Hardening)**.

---

## Task Priority Overview

```mermaid
flowchart TD
    subgraph P0 [P0: Critical Security & Configuration - COMPLETED]
        P0-00[P0-00: Establish Testing Safety Baseline ✓ COMPLETED]
        P0-01[P0-01: Externalize JWT Secret ✓ COMPLETED]
        P0-02[P0-02: Endpoint Authorization Boundaries ✓ COMPLETED]
        P0-03[P0-03: Secure Resume Uploads ✓ COMPLETED]
        P0-04[P0-04: Restrict CORS Origins ✓ COMPLETED]
        P0-05[P0-05: Resolve Password Hashing Conflict ✓ COMPLETED]
    end

    subgraph P1 [P1: High Stabilization & Testing - COMPLETED]
        P1-01[P1-01: Modularize main.py into Routers ✓ COMPLETED]
        P1-02[P1-02: Separate Schemas & Models ✓ COMPLETED]
        P1-03[P1-03: Setup pytest Safety Testing Framework ✓ COMPLETED]
        P1-04[P1-04: Add Auth Security Safety Gate Tests ✓ COMPLETED]
        P1-05[P1-05: Add File Upload & Matching Safety Gate Tests ✓ COMPLETED]
    end

    subgraph P2 [P2: Feature & Schema Polish]
        P2-01[P2-01: Enhanced Error Handling & Standardized API Responses ✓ COMPLETED]
        P2-02[P2-02: Application Tracker Filtering & Pagination]
        P2-03[P2-03: Frontend Client Hardening & State Management]
    end

    P0-00 --> P0-01 --> P0-02 --> P0-03 --> P0-04 --> P0-05 --> P1-01 --> P1-02 --> P1-03 --> P1-04 --> P1-05 --> P2-01 --> P2-02 --> P2-03
```

---

## Completed Tasks

### P0-00 — Establish Testing Safety Baseline (✓ COMPLETED)
- **Result**: **35 / 35 tests passing**.

### P0-01 — Externalize JWT Secret (✓ COMPLETED)
- **Result**: Hardcoded secret string completely purged. 39 / 39 tests passing.

### P0-02 — Endpoint Authorization Boundaries (✓ COMPLETED)
- **Result**: Protected all three computational endpoints with JWT authentication dependencies. 46 / 46 tests passing.

### P0-03 — Secure Resume Upload Boundary (✓ COMPLETED)
- **Result**: Implemented `app/utils/file_handling.py` and updated `upload_resume`. 50 / 50 tests passing.

### P0-04 — Restrict CORS Origins (✓ COMPLETED)
- **Result**: Restricted allowed origins to environment-configurable `settings.ALLOWED_ORIGINS`. Added `backend/tests/test_cors.py`. 55 / 55 tests passing.

### P0-05 — Resolve Password Hashing Conflict (✓ COMPLETED)
- **Result**: Removed monkeypatch completely from `app/main.py`. Pinned `passlib==1.7.4` and `bcrypt==4.0.1`. 58 / 58 tests passing.

### P1-01 — Modularize main.py into Routers (✓ COMPLETED)
- **Result**: Structural refactoring of monolithic `main.py` into 5 APIRouters. 58 / 58 tests passing.

### P1-02 — Separate Schemas & Models (✓ COMPLETED)
- **Result**: Extracted Pydantic DTO models into `app/schemas/`. 58 / 58 tests passing.

### P1-03 — Setup pytest Safety Testing Framework (✓ COMPLETED)
- **Result**: Configured `pyproject.toml` with `pytest-cov` (88% code coverage baseline), strict test markers, and 1 warning. 58 / 58 tests passing.

### P1-04 — Add Auth Security Safety Gate Tests (✓ COMPLETED)
- **Result**: Added 13 JWT security safety gate tests. 71 / 71 tests passing (89% coverage).

### P1-05 — Add File Upload & Matching Safety Gate Tests (✓ COMPLETED)
- **Result**: Added 21 file upload and matching safety gate tests. 92 / 92 tests passing (91% coverage).

### P2-01 — Enhanced Error Handling & Standardized API Responses (✓ COMPLETED)
- **Result**: Created `app/core/errors.py` providing `ErrorCode` taxonomy, custom `APIException`, and global exception handlers for validation (422), auth (401), resource (404), upload (400/413), and unhandled server (500) errors. Added `backend/tests/test_errors.py` verifying sanitized output with zero information disclosure. **103 / 103 tests passing** (90% coverage).

---

## Pending Task Breakdown (Phase 2)

### P2-02 — Application Tracker Filtering & Pagination
- **Objective**: Add status filters, search capabilities, and offset/limit pagination to `GET /applications`.
- **Files Likely Affected**: `backend/app/routers/applications.py`, `backend/tests/test_applications.py`.
