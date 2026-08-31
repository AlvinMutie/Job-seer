# TESTING.md — Pytest & Frontend Safety Testing Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Backend Pytest Metrics (123 Tests)

- **Total Test Count**: **123 tests** (100% pass rate)
- **Security Safety Gate Tests**: **84 tests** (`pytest -m security`)
- **P3-02 V2 Matching Tests**: Added 5 dedicated unit and integration tests in `backend/tests/test_matching_v2.py`:
  - `test_v2_scoring_weights_and_breakdown`
  - `test_v2_experience_scoring`
  - `test_v2_role_title_scoring`
  - `test_v2_score_bounds_and_safety`
  - `test_v2_match_api_endpoint_integration`

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
- **Overall Code Coverage**: **91% Baseline** (758 statements).
- `app/schemas/matching.py`: **100%**
- `app/routers/matching.py`: **91%**
- `app/services/matching_engine.py`: **89%**
