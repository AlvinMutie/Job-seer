# TESTING.md — Testing Strategy & Quality Assurance Framework

## Testing Infrastructure Overview

The **Smart Job Hunter** application now contains a **35-test safety regression suite** executing against an isolated in-memory SQLite database (`sqlite:///:memory:`) configured with SQLAlchemy `StaticPool`.

---

## Test Execution Commands

```bash
cd backend

# Run the complete automated test suite
./venv/bin/pytest tests/ -v

# Run specific test modules
./venv/bin/pytest tests/test_auth.py -v
./venv/bin/pytest tests/test_authorization.py -v
./venv/bin/pytest tests/test_uploads.py -v
./venv/bin/pytest tests/test_matching.py -v
./venv/bin/pytest tests/test_applications.py -v
./venv/bin/pytest tests/test_api_integration.py -v
```

---

## Test Suite Architecture & Results Summary

```text
backend/tests/
├── conftest.py               # Fixtures: in-memory DB (StaticPool), TestClient, test_user, secondary_user, seed_jobs
├── test_auth.py              # 9 PASSED: Registration, Login, and JWT handling
├── test_authorization.py     # 7 PASSED: Security boundaries & SEC-02 vulnerability baseline
├── test_uploads.py           # 3 PASSED: Resume upload behavior & SEC-03 upload vulnerability baseline
├── test_matching.py          # 7 PASSED: MatchingEngine unit tests, aliases, determinism
├── test_applications.py      # 4 PASSED: ApplicationTracker CRUD & resource owner isolation
└── test_api_integration.py   # 5 PASSED: HTTP status codes, job filters, profile update flow
```

- **Total Tests Executed**: **35**
- **Passing Rate**: **100% (35 / 35)**
- **Database Isolation**: **Enforced** (Real database `job_hunter_v3.db` is never opened or modified)
- **Determinism**: **Verified** (Ran 2 consecutive suite executions with identical results)
