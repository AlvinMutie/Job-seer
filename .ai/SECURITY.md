# SECURITY.md — Security Boundary & Hardened Architecture Specification

## Executive Overview
This document specifies the security requirements, threat catalog, upload boundary design, authentication architecture, and security safety gate suites for **Job Seer**.

---

## Production Security & Readiness (Phase 5)

- **Product Identity**: **Job Seer** (*Your intelligent job search companion*).
- **Health Probe Security**: `/health` and `/health/ready` expose only high-level status signals (`ok`, `ready`, `connected`) without leaking database connection credentials, internal file paths, or environment secrets.
- **Production Config Safety**: Production settings (`ENVIRONMENT=production`) strictly enforce minimum 32-character secret keys and prohibit wildcard CORS origins.

---

## Resolved Security Items

### SEC-06 — Authentication Storage Hardening (RESOLVED)
- **Status**: **RESOLVED & VERIFIED**. `HttpOnly`, `SameSite=Lax` cookies active alongside Bearer headers.

### SEC-07 — Application-Level Rate Limiting (RESOLVED)
- **Status**: **RESOLVED & VERIFIED**. Sliding window rate limiter active with HTTP 429 response schema.
