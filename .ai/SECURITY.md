# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Job Discovery Query Security & SQL Injection Prevention (P3-01)

`GET /jobs` enforces strict query parameter validation and parameterized execution:

1. **Safe Column Mapping**: `sort_by` parameters are mapped strictly against an internal dictionary of allowed model attributes (`posted_at`, `title`, `company`, `location`, `remote_status`, `experience_level`). Dynamic string interpolation into SQL `ORDER BY` clauses is prohibited.
2. **Order Direction Validation**: `order` values are sanitized and restricted to `asc` or `desc`. Unrecognized values return HTTP 422 `VALIDATION_ERROR`.
3. **Parameterized Search**: Keyword search across job title, company, description, and required skills uses SQLAlchemy parameterized `ilike` expressions. Payloads containing SQL injection syntax (`' OR 1=1; --`, `DROP TABLE`) are safely escaped.
4. **Pagination Boundaries**: Enforces `limit` between 1 and 100 (`ge=1, le=100`) and non-negative `offset` (`ge=0`).
