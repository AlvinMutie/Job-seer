# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (166 Tests)

- **Total Test Count**: **166 tests** (100% pass rate)
- **Security Safety Gate Tests**: **90 tests** (`pytest -m security`)
- **Phase 4 Production Security & Performance Tests**: Added 6 integration and security tests in `backend/tests/test_phase4_security_performance.py`:
  - `test_sec_06_httponly_cookie_set_on_login`
  - `test_sec_06_cookie_authenticated_access`
  - `test_sec_06_logout_clears_cookie`
  - `test_sec_07_rate_limiter_login`
  - `test_http_security_headers_present`
  - `test_database_indexes_query_performance`

---

## 2. Frontend Test Suite

Frontend unit testing is executed via Node's native test runner against `frontend/src/services/api.test.js`:

```bash
cd frontend
npm test
```
- **Result**: **6 unit tests passing**
- **Production Build**: **Succeeded cleanly (`npm run build`)**

---

## 3. Measured Coverage Baseline (91%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing
```
- **Overall Code Coverage**: **91% Baseline** (1,323 statements).
- `app/auth.py`: **100%**
- `app/main.py`: **100%**
- `app/models/models.py`: **100%**
- `app/routers/auth.py`: **100%**
- `app/schemas/dashboard.py`: **100%**
