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

# Run full test suite (71 tests)
./venv/bin/pytest tests/ -v

# Run security boundary & auth safety gate tests only (55 tests)
./venv/bin/pytest tests/ -m security -v

# Run unit tests only
./venv/bin/pytest tests/ -m unit -v

# Run integration tests only
./venv/bin/pytest tests/ -m integration -v

# Run regression baseline tests
./venv/bin/pytest tests/ -m regression -v
```

---

## 2. JWT Authentication Safety Gate Coverage (P1-04)

Task **P1-04** added 13 dedicated authentication safety gate tests verifying JWT rejection properties:

| Test Name | Security Boundary Property | Verification Standard | Result |
| --------- | -------------------------- | --------------------- | ------ |
| `test_me_valid_jwt` | Valid JWT Bearer Token | Resolves identity, status `200 OK` | **PASSED** |
| `test_expired_jwt_rejected` | Expired `exp` claim | Rejected with `401 Unauthorized` | **PASSED** |
| `test_tampered_jwt_payload_rejected` | Tampered payload string | Signature mismatch `401 Unauthorized` | **PASSED** |
| `test_invalid_jwt_signature_rejected` | Wrong signing key | Signature failure `401 Unauthorized` | **PASSED** |
| `test_missing_sub_claim_rejected` | Missing `sub` claim | Identity failure `401 Unauthorized` | **PASSED** |
| `test_nonexistent_user_claim_rejected` | Non-existent user | User lookup failure `401 Unauthorized` | **PASSED** |
| `test_me_malformed_jwt` | Malformed JWT string | Decoding failure `401 Unauthorized` | **PASSED** |
| `test_me_missing_jwt` | Missing Header | Header failure `401 Unauthorized` | **PASSED** |
| `test_invalid_bearer_schemes_rejected` | Scheme != Bearer | Scheme failure `401 Unauthorized` | **PASSED** |
| `test_empty_bearer_token_rejected` | Empty `Bearer` / `Bearer ` | Token failure `401 Unauthorized` | **PASSED** |
| `test_unsupported_jwt_algorithm_rejected` | Algorithm mismatch | Alg failure `401 Unauthorized` | **PASSED** |
| `test_jwt_with_invalid_exp_claim_rejected` | Invalid `exp` data type | Validation failure `401 Unauthorized` | **PASSED** |
| `test_user_identity_resolution_isolation` | Identity resolution | Prevents cross-user impersonation | **PASSED** |

---

## 3. Measured Coverage Baseline (89%)

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
| `app/services/job_service.py` | 28 | 3 | 85% | **85%** | Good |
| `app/utils/file_handling.py` | 48 | 10 | 76% | **76%** | Acceptable |
| `app/routers/profile.py` | 66 | 15 | 72% | **72%** | Acceptable |
| `app/database.py` | 14 | 4 | 71% | **71%** | Acceptable |
| **TOTAL** | **557** | **49** | **89%** | **89%** | **Expanded Baseline** |

---

## 4. Test Database Isolation Architecture

- **In-Memory SQLite**: All test sessions execute against `sqlite:///:memory:`.
- **StaticPool Sharing**: Configured with `StaticPool` and `check_same_thread=False` in `tests/conftest.py` so FastAPI test requests share the exact in-memory schema.
- **Zero Disk Mutation**: The real production/development database `job_hunter_v3.db` is never created, opened, or modified during test execution.
