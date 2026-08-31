# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Job Seer**.

---

## Final Security Verification (Phase 6)

- **Product Identity**: **Job Seer** (*Your intelligent job search companion*).
- **Authentication**: Dual `HttpOnly` `SameSite=Lax` cookie and OAuth2 Bearer token extraction in `app/auth.py`.
- **Authorization**: Resource ownership isolation strictly enforced on all user endpoints (`user_id == current_user.id`).
- **Rate Limiting**: Sliding window rate limiting in `app/core/rate_limiter.py` protecting `/login`, `/register`, `/match`, `/resume/tailor`, and `/generate-cover-letter`.
- **Security Headers**: Production HTTP security headers active (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 1; mode=block`).
- **Error Sanitization**: Centralized exception handler in `app/core/errors.py` sanitizes 500 server errors, preventing stack trace or internal implementation leakage.
- **Safety Gate Test Suite**: 90 security pytest cases passing (`pytest -m security`).
