# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (147 Tests)

- **Total Test Count**: **147 tests** (100% pass rate)
- **Security Safety Gate Tests**: **78 tests** (`pytest -m security`)
- **P3-05 Cover Letter Tests**: Added 8 integration and security tests in `backend/tests/test_cover_letter.py`:
  - `test_generate_and_persist_cover_letter`
  - `test_cover_letter_version_increment_same_tone`
  - `test_independent_versions_per_tone`
  - `test_list_and_filter_cover_letters`
  - `test_get_and_delete_cover_letter`
  - `test_invalid_tone_rejected`
  - `test_cover_letter_unauthenticated_rejected`
  - `test_cover_letter_ownership_isolation`

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
- `app/schemas/profile.py`: **100%**
- `app/services/cover_letter.py`: **94%**
- `app/routers/profile.py`: **84%**
