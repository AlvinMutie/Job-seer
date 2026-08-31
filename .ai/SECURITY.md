# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Application Tracker V2 & Ownership Isolation (P3-06)

`GET /applications`, `GET /applications/{id}`, `POST /applications`, `PATCH /applications/{id}`, and `DELETE /applications/{id}` enforce strict security controls:

1. **Safe URL Scheme Validation**: `application_url` inputs are parsed and validated to enforce `http` or `https` schemes exclusively. Malicious schemes (e.g. `javascript:`) trigger HTTP 422 validation errors.
2. **Resource Ownership Isolation**: All queries enforce `ApplicationTracker.user_id == current_user.id`. User A cannot view, update, or delete User B's tracked application. Unauthorized requests return HTTP 404 `RESOURCE_NOT_FOUND` to prevent resource enumeration.
3. **Strict Input & Date Parsing**: Status inputs must match valid `ApplicationStatus` enum values. Date strings are strictly parsed against ISO format (`YYYY-MM-DD`).
