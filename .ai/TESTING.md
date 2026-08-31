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

# Run full test suite (103 tests)
./venv/bin/pytest tests/ -v

# Run security boundary & error safety gate tests (77 tests)
./venv/bin/pytest tests/ -m security -v

# Run unit tests (50 tests)
./venv/bin/pytest tests/ -m unit -v

# Run integration tests (27 tests)
./venv/bin/pytest tests/ -m integration -v

# Run regression baseline tests (53 tests)
./venv/bin/pytest tests/ -m regression -v
```

---

## 2. Standardized Error Handling Coverage (P2-01)

Task **P2-01** added 11 dedicated error infrastructure tests in `backend/tests/test_errors.py`:

| Test Name | Error Category Tested | Expected Status & Error Code | Result |
| --------- | --------------------- | ---------------------------- | ------ |
| `test_validation_error_response_schema` | 422 Request validation error | HTTP 422 `VALIDATION_ERROR` + field details | **PASSED** |
| `test_authentication_required_response_schema` | 401 Missing token | HTTP 401 `AUTHENTICATION_REQUIRED` | **PASSED** |
| `test_invalid_credentials_response_schema` | 401 Wrong login credentials | HTTP 401 `INVALID_CREDENTIALS` | **PASSED** |
| `test_token_invalid_response_schema` | 401 Malformed JWT token | HTTP 401 `TOKEN_INVALID` | **PASSED** |
| `test_resource_not_found_response_schema` | 404 Missing job or route | HTTP 404 `RESOURCE_NOT_FOUND` | **PASSED** |
| `test_conflict_error_response_schema` | 400 Duplicate email | HTTP 400 `CONFLICT` | **PASSED** |
| `test_unsupported_file_type_response_schema` | 400 Forbidden file extension | HTTP 400 `UNSUPPORTED_FILE_TYPE` | **PASSED** |
| `test_invalid_file_content_response_schema` | 400 Fake magic bytes | HTTP 400 `INVALID_FILE_CONTENT` | **PASSED** |
| `test_upload_too_large_response_schema` | 413 Oversized upload file | HTTP 413 `UPLOAD_TOO_LARGE` | **PASSED** |
| `test_internal_server_error_security_and_no_leakage` | 500 Unhandled server exception | HTTP 500 `INTERNAL_SERVER_ERROR` (no leakage) | **PASSED** |
| `test_api_exception_direct_raising` | Custom `APIException` raising | Custom HTTP status & schema | **PASSED** |

---

## 3. Measured Coverage Baseline (90%)

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
| `app/routers/auth.py` | 34 | 0 | 100% | **100%** | Excellent |
| `app/routers/jobs.py` | 10 | 0 | 100% | **100%** | Excellent |
| `app/routers/applications.py` | 27 | 0 | 100% | **100%** | Excellent |
| `app/schemas/*` | 12 | 0 | 100% | **100%** | Excellent |
| `app/services/cover_letter.py` | 5 | 0 | 100% | **100%** | Excellent |
| `app/services/tailor_service.py` | 17 | 0 | 100% | **100%** | Excellent |
| `app/core/config.py` | 33 | 1 | 92% | **92%** | Good |
| `app/routers/matching.py` | 41 | 2 | 91% | **91%** | Good |
| `app/services/matching_engine.py` | 102 | 10 | 90% | **90%** | Good |
| `app/utils/file_handling.py` | 48 | 4 | 89% | **89%** | Good |
| `app/core/errors.py` | 94 | 9 | 85% | **85%** | Good |
| `app/services/job_service.py` | 28 | 3 | 85% | **85%** | Good |
| `app/routers/profile.py` | 66 | 13 | 74% | **74%** | Acceptable |
| `app/database.py` | 14 | 4 | 71% | **71%** | Acceptable |
| **TOTAL** | **653** | **46** | **90%** | **90%** | **Expanded Baseline** |

---

## 4. Test Database & Filesystem Isolation Architecture

- **In-Memory SQLite**: All test sessions execute against `sqlite:///:memory:`.
- **StaticPool Sharing**: Configured with `StaticPool` and `check_same_thread=False` in `tests/conftest.py`.
- **Zero Disk Mutation**: Development database `job_hunter_v3.db` is never modified during test execution.
- **Temporary Upload Cleanup**: Temporary test files created in `uploads/` during testing are automatically cleaned up.
