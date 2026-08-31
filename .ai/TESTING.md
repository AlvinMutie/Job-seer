# TESTING.md — Pytest Safety & Observability Framework Specification

## Executive Overview
This document specifies the testing strategy, test markers, coverage reporting baseline, warning audit, and database isolation architecture for **Smart Job Hunter**.

---

## 1. Pytest Configuration & Test Markers

Pytest configuration is centralized in `backend/pyproject.toml`:

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
addopts = "-v --strict-markers"
markers = [
    "unit: Unit tests for isolated functions, services, and utility helpers",
    "integration: API integration tests across HTTP endpoints and components",
    "security: Security boundary tests for auth, authorization, CORS, and file uploads",
    "regression: Core regression safety gate tests"
]
```

### Execution Commands by Marker

```bash
cd backend

# Run full test suite (92 tests)
./venv/bin/pytest tests/ -v

# Run security boundary & upload safety gate tests (66 tests)
./venv/bin/pytest tests/ -m security -v

# Run unit tests (50 tests)
./venv/bin/pytest tests/ -m unit -v

# Run integration tests (16 tests)
./venv/bin/pytest tests/ -m integration -v

# Run regression baseline tests (53 tests)
./venv/bin/pytest tests/ -m regression -v
```

---

## 2. File Upload & Matching Safety Gate Coverage (P1-05)

Task **P1-05** expanded the test suite to **92 tests** by adding 21 dedicated upload and matching safety gate tests:

### A. Resume File Upload Security

| Test Name | Security / Reliability Property Tested | Expected | Result |
| --------- | ------------------------------------- | -------- | ------ |
| `test_upload_rejected_extensions` | Rejects forbidden extensions (.py, .sh, .js, .html, .php, .jpg, .png, .zip, .doc) | HTTP 400 Bad Request | **PASSED** |
| `test_upload_case_insensitive_extensions` | Accepts uppercase extensions (.PDF, .Pdf, .TxT, .DOCX) | HTTP 200 OK | **PASSED** |
| `test_upload_renamed_exe_as_pdf_rejected` | Disguised executable renamed as .pdf fails MIME magic bytes | HTTP 400 Bad Request | **PASSED** |
| `test_upload_non_zip_as_docx_rejected` | Disguised text renamed as .docx fails PK zip header check | HTTP 400 Bad Request | **PASSED** |
| `test_upload_invalid_utf8_as_txt_rejected` | Binary bytes disguised as .txt fails UTF-8 decoding | HTTP 400 Bad Request | **PASSED** |
| `test_upload_size_boundary_below_and_at_limit` | Boundary checks at 10MB - 1, 10MB (200) vs 10MB + 1 (413) | HTTP 200 vs 413 | **PASSED** |
| `test_upload_empty_file_rejected` | Empty 0-byte file | HTTP 400 Bad Request | **PASSED** |
| `test_path_traversal_filenames_safely_handled` | Traversal names (`../../evil.txt`, `/etc/passwd.txt`) cannot escape storage | Server UUID in `uploads/` | **PASSED** |
| `test_server_generated_uuid_filename` | Special/malformed names assigned server UUID | `uploads/resume_1_uuid.ext` | **PASSED** |
| `test_resume_replacement_and_old_file_cleanup` | Uploading new resume deletes old resume file from disk | Disk cleanup verified | **PASSED** |
| `test_user_resume_storage_isolation` | User A upload does not overwrite or delete User B resume | Disk isolation verified | **PASSED** |
| `test_corrupted_pdf_parsing_failure_handled` | Corrupted PDF header handles parsing failure gracefully | Safe failure, no 500 | **PASSED** |

### B. Matching Engine & NLP Safety

| Test Name | Edge Case / Input Scenario Tested | Expected Behavior | Result |
| --------- | --------------------------------- | ----------------- | ------ |
| `test_matching_both_empty_input` | Both resume and job description empty `""` | Score 0.0, no crash | **PASSED** |
| `test_matching_whitespace_only_input` | Whitespace-only strings (`" \n\t "`) | Score 0.0, no crash | **PASSED** |
| `test_matching_very_short_text` | Single word inputs (`"Python"`, `"developer"`) | Finite score >= 0.0 | **PASSED** |
| `test_matching_repeated_text` | Repeated text inputs | Deterministic result | **PASSED** |
| `test_matching_special_characters` | Text with `@#$%^&*() {}[]<>` | Safe NLP parsing | **PASSED** |
| `test_matching_unicode_multilingual` | Multilingual Unicode text (`"Développeur España"`) | Safe NLP parsing | **PASSED** |
| `test_matching_html_markup` | Inputs containing `<h1>` or `<script>` tags | Treated as text, no execution | **PASSED** |
| `test_matching_very_long_text` | 50,000 character synthetic document | Executes in <1s, score >= 0.0 | **PASSED** |
| `test_matching_numerical_safety_boundaries` | Numerical boundaries across inputs | Non-negative, no NaN/Inf | **PASSED** |
| `test_matching_skill_alias_normalizations_expanded` | Expanded aliases (TS, react.js, node, sql server) | Correct target mapping | **PASSED** |
| `test_tailor_and_cover_letter_service_edge_cases` | Tailor & cover letter generators with empty inputs | Safe execution, no 500 | **PASSED** |

---

## 3. Measured Coverage Baseline (91%)

Coverage is measured using `pytest-cov` against the `app/` package:

```bash
cd backend
./venv/bin/pytest tests/ --cov=app --cov-report=term-missing --cov-report=html
```

HTML coverage reports are generated at `backend/htmlcov/index.html`.

### Module Coverage Breakdown

| Module | Statements | Misses | Branch Coverage | Coverage % | Status |
| ------ | ---------- | ------ | --------------- | ---------- | ------ |
| `app/auth.py` | 38 | 0 | 100% | **100%** | Excellent |
| `app/main.py` | 20 | 0 | 100% | **100%** | Excellent |
| `app/models/models.py` | 62 | 0 | 100% | **100%** | Excellent |
| `app/routers/auth.py` | 34 | 0 | 100% | **100%** | Excellent |
| `app/routers/jobs.py` | 10 | 0 | 100% | **100%** | Excellent |
| `app/routers/applications.py` | 27 | 0 | 100% | **100%** | Excellent |
| `app/schemas/*` | 12 | 0 | 100% | **100%** | Excellent |
| `app/services/cover_letter.py` | 5 | 0 | 100% | **100%** | Excellent |
| `app/services/tailor_service.py` | 17 | 0 | 100% | **100%** | Excellent |
| `app/core/config.py` | 33 | 1 | 92% | **92%** | Good |
| `app/services/matching_engine.py` | 102 | 10 | 90% | **90%** | Good |
| `app/utils/file_handling.py` | 48 | 4 | 89% | **89%** | Good |
| `app/routers/matching.py` | 41 | 3 | 87% | **87%** | Good |
| `app/services/job_service.py` | 28 | 3 | 85% | **85%** | Good |
| `app/routers/profile.py` | 66 | 13 | 74% | **74%** | Acceptable |
| `app/database.py` | 14 | 4 | 71% | **71%** | Acceptable |
| **TOTAL** | **557** | **38** | **91%** | **91%** | **Expanded Baseline** |

---

## 4. Test Database & Filesystem Isolation Architecture

- **In-Memory SQLite**: All test sessions execute against `sqlite:///:memory:`.
- **StaticPool Sharing**: Configured with `StaticPool` and `check_same_thread=False` in `tests/conftest.py` so FastAPI test requests share the exact in-memory schema.
- **Zero Disk Mutation**: The real production/development database `job_hunter_v3.db` is never created, opened, or modified during test execution.
- **Temporary Upload Cleanup**: Temporary test files created in `uploads/` during testing are automatically cleaned up.
