# TESTING.md — Testing Strategy & Verification Gaps

## Current Testing State

The project currently contains **NO formal unit test framework** (e.g. `pytest`, `unittest`, or `Jest`).

Instead, verification is handled via ad-hoc standalone Python scripts in the `backend/` root directory:

1. `backend/seed_jobs.py`:
   - Seeds 4 mock job postings into `job_hunter_v3.db`.
2. `backend/test_search.py`:
   - Fires HTTP GET requests to `http://localhost:8000/jobs` with keyword and location params using `requests`.
3. `backend/verify_matches.py`:
   - Direct SQLite query reading User 1's resume text and printing calculated match scores for all database jobs.
4. `backend/verify_system.py`:
   - Asynchronous script calling `JobService` and `MatchingEngine` directly in Python memory.

---

## Testing Gaps & Recommendations

### Backend Gaps
- No automated unit tests for `MatchingEngine.calculate_match_score()`, `extract_skills()`, or `normalize_spaced_text()`.
- No API contract testing (HTTP status codes, authorization header validation, error schemas).
- No regression test suite for database transactions.

### Frontend Gaps
- No component unit tests (`vitest` / `@testing-library/react`).
- No End-to-End (E2E) testing framework (Cypress / Playwright).

---

## Recommended Testing Architecture

```text
tests/
├── unit/
│   ├── test_matching_engine.py    # Test TF-IDF and skill extraction logic
│   ├── test_auth.py               # Test JWT creation & bcrypt verification
│   └── test_job_service.py        # Test SQL filtering logic
└── integration/
    ├── test_api_auth.py           # Test /register, /login, /me endpoints
    └── test_api_matching.py       # Test /match and /tailor-resume endpoints
```
