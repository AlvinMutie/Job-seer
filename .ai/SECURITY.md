# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Multi-Tone Cover Letters & Ownership Isolation (P3-05)

`POST /cover-letters`, `GET /cover-letters`, `GET /cover-letters/{id}`, and `DELETE /cover-letters/{id}` enforce strict security boundaries:

1. **Tone Allowlist Validation**: The backend validates `tone` against an immutable allowlist (`{"Professional", "Enthusiastic", "Executive", "Technical"}`). Invalid values trigger HTTP 422 validation errors and cannot alter execution flow.
2. **Resource Ownership Isolation**: All database queries enforce `CoverLetter.user_id == current_user.id`. User A cannot retrieve or delete User B's cover letters. Unauthorized requests return HTTP 404 `RESOURCE_NOT_FOUND` to prevent resource enumeration.
3. **Factual Integrity Safeguards**: Cover letter generation strictly utilizes candidate skills and profile attributes parsed from the original resume. Zero fabricated degrees, false employers, or false titles are introduced.
