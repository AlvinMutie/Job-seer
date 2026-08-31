# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Intelligent Command Center Dashboard & Ownership Isolation (P3-07)

`GET /dashboard/analytics` enforces strict security controls:

1. **Authentication Gate**: Endpoint requires valid JWT token via `Depends(get_current_user)`. Unauthenticated requests return HTTP 401.
2. **Resource Ownership Isolation**: All queries (applications, profile resume, tailored resumes, cover letters) enforce `user_id == current_user.id`. User A's analytics metrics do not include User B's resources.
3. **Safe Aggregation**: Aggregations handle empty lists and null resume texts gracefully without throwing unhandled internal server exceptions.
