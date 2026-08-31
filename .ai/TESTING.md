# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (139 Tests)

- **Total Test Count**: **139 tests** (100% pass rate)
- **Security Safety Gate Tests**: **84 tests** (`pytest -m security`)
- **P3-04 Tailoring V2 Tests**: Added 8 integration and security tests in `backend/tests/test_tailored_resume.py`:
  - `test_generate_and_persist_tailored_resume`
  - `test_tailored_resume_version_increment`
  - `test_independent_versions_per_job`
  - `test_list_and_get_tailored_resumes`
  - `test_compare_tailored_resume_diff`
  - `test_delete_tailored_resume`
  - `test_tailoring_unauthenticated_rejected`
  - `test_tailoring_ownership_isolation`

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
- **Overall Code Coverage**: **91% Baseline** (1,005 statements).
- `app/models/models.py`: **100%**
- `app/schemas/profile.py`: **100%**
- `app/services/tailor_service.py`: **84%**
- `app/routers/profile.py`: **84%**
