# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Job Seer** (*Your intelligent job search companion*).

---

## 1. Deployment & Production Readiness (Phase 5)

Phase 5 prepared Job Seer for production deployment:

### Product Rebrand: Job Seer
- **Tagline**: *Your intelligent job search companion.*
- Updated user-facing titles, navigation, and landing UI while preserving internal technical identifiers and database tables.

### Health Check Probes
- `GET /health`: Liveness probe returning HTTP 200 `{"status": "ok", "app": "Job Seer", "environment": settings.ENVIRONMENT}`.
- `GET /health/ready`: Readiness probe testing live database connectivity (`SELECT 1`). Returns HTTP 200 `{"status": "ready", "database": "connected"}` or HTTP 503 if unavailable.

### Production Environment & Containerization
- Environment variable template `.env.example`.
- Production `COOKIE_SECURE` configuration evaluating `True` in production mode.
- Production `Dockerfile`, `.dockerignore`, and `docker-compose.yml` orchestration.
- Deployment procedures documented in `docs/DEPLOYMENT.md`.

---

## 2. Production Security & Performance (Phase 4)

Phase 4 hardened the application with SEC-06 HttpOnly cookies, SEC-07 sliding window rate limiting, HTTP security headers, and database indexes.
