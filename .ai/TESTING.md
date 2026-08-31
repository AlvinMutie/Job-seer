# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (118 Tests)

- **Total Test Count**: **118 tests** (100% pass rate)
- **Security Safety Gate Tests**: **84 tests** (`pytest -m security`)
- **P3-01 Job Discovery Tests**: Added 8 integration/security tests in `backend/tests/test_jobs_enhanced.py`:
  - `test_get_jobs_default_pagination_and_sorting`
  - `test_get_jobs_custom_limit_and_offset`
  - `test_get_jobs_invalid_limit_and_offset_boundaries`
  - `test_get_jobs_sorting_by_title_and_company`
  - `test_get_jobs_invalid_sort_by_and_order`
  - `test_get_jobs_search_and_keyword_matching`
  - `test_get_jobs_combined_query_parameters`
  - `test_get_jobs_sql_injection_and_wildcard_safety`

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
- **Overall Code Coverage**: **91% Baseline** (688 statements).
- `app/routers/jobs.py`: **100%**
- `app/services/job_service.py`: **89%**
