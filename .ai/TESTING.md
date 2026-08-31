# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Frontend Test Suite (P2-03)

Frontend unit testing is executed via Node's native test runner against `frontend/src/services/api.test.js`:

```bash
cd frontend
npm test
```

### Verified Frontend Test Coverage
- `getApiErrorMessage` parses P2-01 standardized error objects (`error.message`).
- `getApiErrorMessage` extracts structured field-level validation details.
- `getApiErrorMessage` falls back to legacy detail strings.
- `getApiErrorMessage` handles network offline connection failures (`ERR_NETWORK`).
- `getApiErrorMessage` handles HTTP 413 file size limit responses cleanly.
- `getApiErrorMessage` handles null/undefined inputs safely.

---

## 2. Backend Pytest Configuration & Test Markers

Pytest configuration is centralized in `backend/pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
addopts = "-v --strict-markers"
markers = [
    "unit: Unit tests for isolated functions, services, and utility helpers",
    "integration: API integration tests across HTTP endpoints and components",
    "security: Security boundary tests for auth, authorization, CORS, and file uploads",
    "regression: Core regression safety gate tests"
]
```

### Execution Commands

```bash
cd backend

# Run full backend test suite (110 tests)
./venv/bin/pytest tests/ -v

# Run security boundary & error safety gate tests (84 tests)
./venv/bin/pytest tests/ -m security -v
```

---

## 3. Measured Coverage Baseline (91%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html
```

HTML coverage reports are generated at `backend/htmlcov/index.html`. Total statements: 671, Code coverage: **91%**.
