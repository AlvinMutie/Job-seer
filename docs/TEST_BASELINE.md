# TEST_BASELINE.md — Automated Testing Baseline & Regression Report

**Task Reference**: P0-00: Establish Testing Safety Baseline  
**Execution Date**: August 31, 2026  
**Test Engine**: `pytest` 9.1.1 with FastAPI `TestClient`  
**Database Isolation**: SQLite in-memory (`sqlite:///:memory:`) using SQLAlchemy `StaticPool`  
**Determinism Status**: VERIFIED (Ran 2 consecutive executions with identical 100% pass rates)

---

## Test Execution Summary

| Metric | Count | Percentage |
| ------ | ----- | ---------- |
| **Total Tests Executed** | **35** | **100%** |
| **Passing Tests** | **35** | **100%** |
| **Failing Tests** | **0** | **0%** |
| **Skipped Tests** | **0** | **0%** |
| **Database Isolation** | **Enforced** | No modifications to `job_hunter_v3.db` |

---

## Classified Test Baseline Inventory

Each test is classified into one of the following baseline categories:
- `EXPECTED_CURRENT_BEHAVIOR`: Confirms valid, expected application functionality.
- `SECURITY_VULNERABILITY`: Intentionally captures an existing security vulnerability without fixing it (to act as a regression safety gate for future security tasks).
- `BUG`: Captures an existing bug in application code or dependency configuration.

| Test Name | File | Result | Classification | Captured Reason | Remediation Task |
| --------- | ---- | ------ | -------------- | --------------- | ---------------- |
| `test_register_valid_user` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | User registration issues JWT token | N/A |
| `test_register_duplicate_email` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Duplicate email returns 400 error | N/A |
| `test_register_missing_fields` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Missing fields return 422 error | N/A |
| `test_login_valid_credentials` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Valid login returns JWT token | N/A |
| `test_login_incorrect_password` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Wrong password returns 401 | N/A |
| `test_login_nonexistent_user` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Nonexistent user returns 401 | N/A |
| `test_me_valid_jwt` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Bearer token retrieves user profile | N/A |
| `test_me_missing_jwt` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Missing token returns 401 | N/A |
| `test_me_malformed_jwt` | `test_auth.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Invalid token returns 401 | N/A |
| `test_public_root_health_check` | `test_authorization.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | `GET /` is accessible publicly | N/A |
| `test_public_get_jobs` | `test_authorization.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | `GET /jobs` is public discovery | N/A |
| `test_match_unauthenticated_current_vulnerability` | `test_authorization.py` | PASSED | `SECURITY_VULNERABILITY` | `POST /match` accepts unauthenticated requests (SEC-02) | **P0-02** |
| `test_tailor_resume_unauthenticated_current_vulnerability` | `test_authorization.py` | PASSED | `SECURITY_VULNERABILITY` | `POST /tailor-resume` accepts unauthenticated requests (SEC-02) | **P0-02** |
| `test_generate_cover_letter_unauthenticated_current_vulnerability` | `test_authorization.py` | PASSED | `SECURITY_VULNERABILITY` | `POST /generate-cover-letter` accepts unauthenticated requests (SEC-02) | **P0-02** |
| `test_resource_owner_profile_isolation` | `test_authorization.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | User 1 & User 2 profiles isolated | N/A |
| `test_resource_owner_applications_isolation` | `test_authorization.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | User 1 cannot view User 2 applications | N/A |
| `test_upload_txt_resume_valid` | `test_uploads.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Valid TXT file uploads & parses | N/A |
| `test_upload_executable_current_vulnerability` | `test_uploads.py` | PASSED | `SECURITY_VULNERABILITY` | `POST /upload-resume` accepts `.exe` files without rejection (SEC-03) | **P0-03** |
| `test_upload_filename_sanitization_current_behavior` | `test_uploads.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Special characters stripped from safe filename | N/A |
| `test_matching_identical_content` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Identical text returns high score | N/A |
| `test_matching_partial_overlap` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Score returned between 0 and 100 | N/A |
| `test_matching_skill_alias_resolution` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | `"JS"` resolves to `"javascript"` | N/A |
| `test_matching_empty_resume` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Empty resume returns 0.0 cleanly | N/A |
| `test_matching_empty_job_description` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Empty job description returns 0.0 | N/A |
| `test_matching_deterministic_output` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Repeated calls yield identical score | N/A |
| `test_compare_skills_matched_and_missing` | `test_matching.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Returns matched vs missing skills | N/A |
| `test_create_application` | `test_applications.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | App tracking record created | N/A |
| `test_get_applications` | `test_applications.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Fetches user tracking list | N/A |
| `test_update_existing_application` | `test_applications.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Re-posting updates status | N/A |
| `test_applications_user_isolation` | `test_applications.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | User A & User B records isolated | N/A |
| `test_job_search_keyword_filter` | `test_api_integration.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Keyword search filters jobs | N/A |
| `test_job_search_location_filter` | `test_api_integration.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Location search filters jobs | N/A |
| `test_job_search_nonexistent_keyword` | `test_api_integration.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Unknown keyword returns empty list | N/A |
| `test_profile_update_flow` | `test_api_integration.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Updates profile fields for user | N/A |
| `test_profile_update_unauthenticated` | `test_api_integration.py` | PASSED | `EXPECTED_CURRENT_BEHAVIOR` | Unauthenticated profile update rejected (401) | N/A |

---

## Known Environment & Dependency Findings Captured

During test suite setup, two critical dependency configuration gaps were discovered in the existing environment:

1. **Missing Authentication Dependencies in `requirements.txt`**:
   - `passlib`, `bcrypt`, and `python-jose` were imported in `app/auth.py` and `app/main.py`, but missing from `requirements.txt`. They were installed into the test virtual environment (`./venv/`).
2. **`bcrypt` Version Conflict**:
   - `bcrypt` 5.0.0 enforces a strict 72-byte limit on `hashpw()`, which broke `passlib`'s internal bug detection initialization. Pinning `bcrypt==4.0.1` resolved the runtime issue without code modifications.

---

## Test Execution Command

To run the complete safety baseline test suite:

```bash
cd backend
./venv/bin/pytest tests/ -v
```
