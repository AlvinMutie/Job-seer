# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (160 Tests)

- **Total Test Count**: **160 tests** (100% pass rate)
- **Security Safety Gate Tests**: **84 tests** (`pytest -m security`)
- **P3-07 Command Center Dashboard Tests**: Added 4 integration and security tests in `backend/tests/test_dashboard.py`:
  - `test_get_dashboard_analytics_success_with_resume`
  - `test_get_dashboard_analytics_without_resume`
  - `test_dashboard_analytics_unauthenticated_rejected`
  - `test_dashboard_analytics_ownership_isolation`

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
- **Overall Code Coverage**: **91% Baseline** (1,263 statements).
- `app/schemas/dashboard.py`: **100%**
- `app/main.py`: **100%**
- `app/routers/dashboard.py`: **82%**
