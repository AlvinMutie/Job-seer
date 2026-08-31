# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (131 Tests)

- **Total Test Count**: **131 tests** (100% pass rate)
- **Security Safety Gate Tests**: **84 tests** (`pytest -m security`)
- **P3-03 Resume Intelligence Tests**: Added 8 unit, integration, and security tests in `backend/tests/test_resume_intelligence.py`:
  - `test_resume_health_complete_healthy_resume`
  - `test_resume_health_empty_and_whitespace`
  - `test_resume_health_very_short_and_long_resumes`
  - `test_resume_health_numerical_safety_bounds`
  - `test_resume_health_api_endpoint_success`
  - `test_resume_health_api_missing_resume_404`
  - `test_resume_health_unauthenticated_rejected`
  - `test_resume_health_ownership_isolation`

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

## 3. Measured Coverage Baseline (92%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing
```
- **Overall Code Coverage**: **92% Baseline** (888 statements).
- `app/schemas/profile.py`: **100%**
- `app/services/resume_intelligence.py`: **94%**
- `app/routers/profile.py`: **77%**
