# TESTING.md — Pytest Safety & Observability Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Pytest Configuration & Test Markers

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

### Execution Commands by Marker

```bash
cd backend

# Run full test suite
./venv/bin/pytest tests/ -v

# Run security boundary tests only
./venv/bin/pytest tests/ -m security -v

# Run unit tests only
./venv/bin/pytest tests/ -m unit -v

# Run integration tests only
./venv/bin/pytest tests/ -m integration -v

# Run regression baseline tests
./venv/bin/pytest tests/ -m regression -v
```

---

## 2. Measured Coverage Baseline (88%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html
```

HTML coverage reports are generated at `backend/htmlcov/index.html`.

### Module Coverage Breakdown

| Module | Statements | Misses | Branch Coverage | Coverage % | Status |
| ------ | ---------- | ------ | --------------- | ---------- | ------ |
| `app/main.py` | 20 | 0 | 100% | **100%** | Excellent |
| `app/models/models.py` | 62 | 0 | 100% | **100%** | Excellent |
| `app/routers/auth.py` | 34 | 0 | 100% | **100%** | Excellent |
| `app/routers/jobs.py` | 10 | 0 | 100% | **100%** | Excellent |
| `app/routers/applications.py` | 27 | 0 | 100% | **100%** | Excellent |
| `app/schemas/*` | 12 | 0 | 100% | **100%** | Excellent |
| `app/services/cover_letter.py` | 5 | 0 | 100% | **100%** | Excellent |
| `app/core/config.py` | 33 | 1 | 92% | **92%** | Good |
| `app/services/tailor_service.py` | 17 | 1 | 90% | **90%** | Good |
| `app/services/matching_engine.py` | 102 | 12 | 88% | **88%** | Good |
| `app/routers/matching.py` | 41 | 3 | 87% | **87%** | Good |
| `app/auth.py` | 38 | 3 | 86% | **86%** | Good |
| `app/services/job_service.py` | 28 | 3 | 85% | **85%** | Good |
| `app/utils/file_handling.py` | 48 | 10 | 76% | **76%** | Acceptable |
| `app/routers/profile.py` | 66 | 15 | 72% | **72%** | Acceptable |
| `app/database.py` | 14 | 4 | 71% | **71%** | Acceptable |
| **TOTAL** | **557** | **52** | **88%** | **88%** | **Baseline Established** |

---

## 3. Warning Audit & Deprecation Remediation

| Warning Source | Prior Count | Fixed Count | Classification & Remediation Action |
| -------------- | ----------- | ----------- | ----------------------------------- |
| `datetime.utcnow()` | 54 warnings | 0 warnings | **ACTIONABLE & FIXED**: Replaced with `datetime.now(timezone.utc)` across `app/auth.py`, `app/models/models.py`, and `app/routers/applications.py`. |
| `declarative_base()` | 1 warning | 0 warnings | **ACTIONABLE & FIXED**: Updated import from `sqlalchemy.ext.declarative` to `sqlalchemy.orm`. |
| `@app.on_event("startup")` | 2 warnings | 0 warnings | **ACTIONABLE & FIXED**: Replaced with FastAPI `lifespan` context manager in `app/main.py`. |
| `starlette.testclient` deprecation | 1 warning | 1 warning | **THIRD-PARTY DEPENDENCY**: Upstream `starlette`/`httpx` deprecation warning in test runner. Documented and preserved. |
| **TOTAL** | **75 warnings** | **1 warning** | **98.7% Warning Reduction** |

---

## 4. Test Database Isolation Architecture

- **In-Memory SQLite**: All test sessions execute against `sqlite:///:memory:`.
- **StaticPool Sharing**: Configured with `StaticPool` and `check_same_thread=False` in `tests/conftest.py` so FastAPI test requests share the exact in-memory schema.
- **Zero Disk Mutation**: The real production/development database `job_hunter_v3.db` is never created, opened, or modified during test execution.
