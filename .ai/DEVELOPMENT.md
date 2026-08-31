# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Production Security & Performance (Phase 4)

Phase 4 hardened the application for production delivery:

### SEC-06 — Authentication Storage Hardening
- Implemented dual token extraction in `app/auth.py` (`get_current_user`): checks Authorization Bearer header first, and falls back to `access_token` HttpOnly cookie.
- Updated `POST /login` and `POST /register` in `app/routers/auth.py` to issue an `HttpOnly`, `SameSite=Lax` cookie alongside token response.
- Added `POST /logout` endpoint to clear access cookies.
- Configured Axios client with `withCredentials: true` in `frontend/src/services/api.js`.

### SEC-07 — Application-Level Rate Limiting
- Built in-memory sliding window rate limiter in `app/core/rate_limiter.py`.
- Enforces rate limits on sensitive endpoints: `/login`, `/register` (15-20 req/min), `/match`, `/resume/tailor`, `/generate-cover-letter` (30 req/min).
- Exceeding limit raises `APIException` HTTP 429 `TOO_MANY_REQUESTS`.

### HTTP Security Headers & Database Indexing
- Configured security middleware in `app/main.py` adding `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-XSS-Protection: 1; mode=block`.
- Added database indexes and compound indexes in `app/models/models.py` (`idx_app_tracker_user_status`, `idx_app_tracker_user_job`, `idx_tailored_resumes_user_job`, `idx_cover_letters_user_job`, `idx_cover_letters_user_tone`).

---

## 2. Intelligent Command Center Dashboard (P3-07)

Task **P3-07** introduced the aggregated Intelligent Command Center Dashboard with `GET /dashboard/analytics`.

---

## 3. Application Tracker V2 & Kanban Board (P3-06)

Task **P3-06** upgraded the application tracking pipeline to a complete Kanban board workspace with HTML5 drag-and-drop.
