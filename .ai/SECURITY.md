# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Smart Job Hunter**.

---

## Resolved Security Items (Phase 4)

### SEC-06 — Authentication Storage Hardening (RESOLVED)
- **Status**: **RESOLVED & VERIFIED**.
- **Implementation**: `/login` and `/register` issue `HttpOnly`, `SameSite=Lax` cookies named `access_token` alongside Bearer token response. `get_current_user` extracts token from HttpOnly cookie if Bearer header is missing. `POST /logout` clears the cookie. Axios API client is configured with `withCredentials: true`.

### SEC-07 — Application-Level Rate Limiting (RESOLVED)
- **Status**: **RESOLVED & VERIFIED**.
- **Implementation**: Implemented in-memory sliding window rate limiter in `app/core/rate_limiter.py`. Rate limits enforced on `/login`, `/register` (15-20 req/min), `/match`, `/resume/tailor`, `/generate-cover-letter` (30 req/min). Returns standardized HTTP 429 `TOO_MANY_REQUESTS`.

---

## Security Headers & Isolation
- HTTP Security Headers added in `app/main.py`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`.
- Resource ownership isolation strictly enforced across all user endpoints (`user_id == current_user.id`).
