# TESTING.md — Testing Strategy & Quality Assurance Framework

## Testing Strategy Overview

The **Smart Job Hunter** application currently has **0 automated unit or integration tests**. To ensure reliability during refactoring and feature additions, we establish a formal testing pyramid.

---

## The Testing Pyramid

```text
               / \
              / E2E \           <- Critical User Journeys (Playwright)
             /-------\
            /   API   \         <- FastAPI Endpoints & Security (pytest + httpx)
           /-----------\
          /  Business   \       <- Service Layer & Matching Engine (pytest)
         /---------------\
        /   Unit Tests    \     <- Utility Functions, Token Auth, Schemas (pytest)
       /-------------------\
```

---

## High-Risk Priority Areas

When establishing automated test coverage, the following high-risk modules **MUST be tested first**:

| Priority | Component | Target Files | Test Objective |
| -------- | --------- | ------------ | -------------- |
| **P0** | Authentication & Token Security | `app/core/security.py`, `app/routers/auth.py` | Verify password hashing, token encoding/decoding, expiration, and invalid token rejection. |
| **P0** | API Authorization & Access Control | `app/routers/*.py` | Assert unauthenticated requests to protected endpoints return `401 Unauthorized`. |
| **P1** | Matching Engine & Similarity | `app/services/matching_engine.py` | Test TF-IDF vectorization, skill extraction precision, alias normalization, and score accuracy. |
| **P1** | Resume Parsing & Validation | `app/services/resume_parser.py` | Test text extraction from valid PDF/DOCX/TXT files and rejection of invalid/corrupt files. |
| **P1** | File Upload Security | `app/routers/profile.py` | Verify extension validation, MIME type checks, and path traversal protection. |
| **P2** | Application Tracker Ownership | `app/routers/applications.py` | Assert users can only read/update their own application tracking records. |

---

## Backend Testing Architecture

### Framework Choice: `pytest` + `httpx`

```text
backend/tests/
├── conftest.py                   # Pytest fixtures (DB session, mock client, auth tokens)
├── unit/
│   ├── test_security.py          # Test password hashing & JWT handling
│   ├── test_matching_engine.py    # Test TF-IDF & skill extraction logic
│   └── test_resume_parser.py     # Test PDF/DOCX text extraction
├── integration/
│   ├── test_auth_api.py          # Test /register, /login, /me routes
│   ├── test_matching_api.py      # Test /match and /tailor-resume routes
│   └── test_applications_api.py  # Test /applications CRUD routes
└── security/
    ├── test_authorization_matrix.py # Assert endpoints enforce security boundaries
    └── test_upload_security.py   # Test malicious file upload rejection
```

---

## Recommended Execution Commands

```bash
# Run full test suite with coverage report
pytest --cov=app tests/

# Run security assertion tests only
pytest tests/security/

# Run matching engine unit tests
pytest tests/unit/test_matching_engine.py
```
