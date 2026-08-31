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

# Run full test suite (110 tests)
./venv/bin/pytest tests/ -v

# Run security boundary & error safety gate tests (84 tests)
./venv/bin/pytest tests/ -m security -v

# Run unit tests (50 tests)
./venv/bin/pytest tests/ -m unit -v

# Run integration tests (34 tests)
./venv/bin/pytest tests/ -m integration -v

# Run regression baseline tests (60 tests)
./venv/bin/pytest tests/ -m regression -v
```

---

## 2. Application Tracker Filtering & Pagination Coverage (P2-02)

Task **P2-02** added 7 dedicated application tracker filtering and pagination tests in `backend/tests/test_applications.py`:

| Test Name | Feature / Security Requirement Tested | Expected Outcome | Result |
| --------- | ------------------------------------- | ---------------- | ------ |
| `test_get_applications_status_filter_valid` | Status filter (`?status=Interview`, `?status=applied`) | Case-insensitive filter matching exact status | **PASSED** |
| `test_get_applications_status_filter_invalid` | Invalid status string (`?status=bogus_status`) | HTTP 422 `VALIDATION_ERROR` | **PASSED** |
| `test_get_applications_search_job_title_and_company` | Partial keyword search across title, company, notes | `ilike` partial matching | **PASSED** |
| `test_get_applications_pagination_limit_offset` | `limit` & `offset` page splitting | Page 1 vs Page 2 deterministic offset | **PASSED** |
| `test_get_applications_pagination_invalid_parameters` | Invalid limit/offset (`limit=0`, `limit=101`, `offset=-1`) | HTTP 422 `VALIDATION_ERROR` | **PASSED** |
| `test_get_applications_combined_filters` | Combined `status + search + limit + offset` | All filters applied together safely | **PASSED** |
| `test_get_applications_sql_injection_and_wildcard_safety` | SQL injection payloads (`' OR 1=1; --`, `%%%%%`) | Safe parameterized execution | **PASSED** |

---

## 3. Measured Coverage Baseline (91%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html
```

HTML coverage reports are generated at `backend/htmlcov/index.html`.

### Module Coverage Breakdown

| Module | Statements | Misses | Branch Coverage | Coverage % | Status |
| ------ | ---------- | ------ | --------------- | ---------- | ------ |
| `app/auth.py` | 38 | 0 | 100% | **100%** | Excellent |
| `app/main.py` | 22 | 0 | 100% | **100%** | Excellent |
| `app/models/models.py` | 62 | 0 | 100% | **100%** | Excellent |
| `app/routers/applications.py` | 45 | 0 | 100% | **100%** | Excellent |
| `app/routers/auth.py` | 34 | 0 | 100% | **100%** | Excellent |
| `app/routers/jobs.py` | 10 | 0 | 100% | **100%** | Excellent |
| `app/schemas/*` | 12 | 0 | 100% | **100%** | Excellent |
| `app/services/cover_letter.py` | 5 | 0 | 100% | **100%** | Excellent |
| `app/services/tailor_service.py` | 17 | 0 | 100% | **100%** | Excellent |
| `app/core/config.py` | 33 | 1 | 92% | **92%** | Good |
| `app/routers/matching.py` | 41 | 2 | 91% | **91%** | Good |
| `app/services/matching_engine.py` | 102 | 10 | 90% | **90%** | Good |
| `app/core/errors.py` | 94 | 7 | 89% | **89%** | Good |
| `app/utils/file_handling.py` | 48 | 4 | 89% | **89%** | Good |
| `app/services/job_service.py` | 28 | 3 | 85% | **85%** | Good |
| `app/routers/profile.py` | 66 | 13 | 74% | **74%** | Acceptable |
| `app/database.py` | 14 | 4 | 71% | **71%** | Acceptable |
| **TOTAL** | **671** | **44** | **91%** | **91%** | **Expanded Baseline** |

---

## 4. Test Database Isolation Architecture

- **In-Memory SQLite**: All test sessions execute against `sqlite:///:memory:`.
- **StaticPool Sharing**: Configured with `StaticPool` and `check_same_thread=False` in `tests/conftest.py`.
- **Zero Disk Mutation**: Development database `job_hunter_v3.db` is never created, opened, or modified during test execution.
