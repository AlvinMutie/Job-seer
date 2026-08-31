# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Resume Intelligence & Ownership Isolation (P3-03)

`GET /resume/health` enforces strict security boundaries and privacy protections:

1. **Strict Ownership Isolation**: The endpoint retrieves and analyzes `current_user.profile.resume_text` exclusively using `Depends(get_current_user)`. User A cannot access or trigger ATS analysis on User B's resume data.
2. **Zero Sensitive Contact Leakage**: Contact information checks detect presence/absence of emails, phone numbers, and URLs via boolean flags (`has_email`, `has_phone`). Private contact values are never dumped, logged, or returned in API responses.
3. **In-Memory Non-Executable Analysis**: ATS text analysis operates strictly in-memory on extracted plain text. Document text is never evaluated via `eval` or executed as code.
