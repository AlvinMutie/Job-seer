# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (156 Tests)

- **Total Test Count**: **156 tests** (100% pass rate)
- **Security Safety Gate Tests**: **82 tests** (`pytest -m security`)
- **P3-06 Application Tracker V2 Tests**: Added 9 integration and security tests in `backend/tests/test_application_tracker_v2.py`:
  - `test_create_and_get_application_v2`
  - `test_patch_application_status_and_kanban_persistence`
  - `test_patch_application_dates_and_url`
  - `test_delete_application`
  - `test_invalid_status_rejected`
  - `test_invalid_date_format_rejected`
  - `test_unsafe_url_scheme_rejected`
  - `test_tracker_unauthenticated_rejected`
  - `test_tracker_ownership_isolation`

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
- **Overall Code Coverage**: **91% Baseline** (1,096 statements).
- `app/models/models.py`: **100%**
- `app/schemas/applications.py`: **100%**
- `app/routers/applications.py`: **100%**
