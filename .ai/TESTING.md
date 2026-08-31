# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Job Seer**.

---

## 1. Backend Pytest Metrics (171 Tests)

- **Total Test Count**: **171 tests** (100% pass rate)
- **Security Safety Gate Tests**: **90 tests** (`pytest -m security`)
- **Phase 5 & 6 Production & QA Tests**: Added integration tests in `backend/tests/test_phase5_production_readiness.py`:
  - `test_health_liveness_endpoint`
  - `test_health_readiness_endpoint`
  - `test_root_endpoint_job_seer_branding`
  - `test_cookie_secure_property_in_production`
  - `test_production_config_rejects_weak_secret_key`

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
- **Overall Code Coverage**: **91% Baseline** (1,353 statements).
- `app/auth.py`: **100%**
- `app/main.py`: **100%**
- `app/routers/auth.py`: **100%**
- `app/routers/health.py`: **88%**
- `app/core/config.py`: **93%**
