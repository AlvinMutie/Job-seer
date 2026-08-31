# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Persistent Tailoring & Resource Ownership Isolation (P3-04)

`POST /resume/tailor`, `GET /resume/tailored`, `GET /resume/tailored/{id}`, `GET /resume/tailored/{id}/compare`, and `DELETE /resume/tailored/{id}` enforce strict security controls:

1. **Strict Resource Ownership Isolation**: Every query filters by `TailoredResume.user_id == current_user.id`. User A cannot view, compare, list, or delete User B's tailored resume versions. Attempting unauthorized access returns HTTP 404 `RESOURCE_NOT_FOUND` to prevent resource enumeration.
2. **Parameterized ORM Execution**: Version lookup and database persistence execute via SQLAlchemy parameterized ORM queries. Raw SQL string interpolation is prohibited.
3. **Non-Executable Diffing**: `difflib.ndiff` comparison treats resume texts strictly as inert data. Zero code or template evaluation occurs.
