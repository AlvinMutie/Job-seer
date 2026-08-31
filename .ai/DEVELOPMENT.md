# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Job Seer** (*Your intelligent job search companion*).

---

## 1. UX Architecture & Frontend Polish (UX-01 to UX-05)

UX-01 through UX-05 established a modern, product-grade frontend architecture:

### Navigation & Workflow Organization (UX-05)
- Organized into 4 workflow sections: **Overview** (`/dashboard`), **Discover** (`/jobs`, `/matches`), **Manage** (`/tracker`, `/resume-hub`), and **Account** (`/settings`).
- Mobile slide-down navigation drawer with touch-friendly navigation targets.

### Candidate Onboarding & Guidance (UX-05)
- Automated detection of new candidates (unuploaded CV or 0 applications) triggering a 3-step setup banner on the Dashboard:
  1. Configure Preferences
  2. Upload Base CV
  3. Discover & Match Jobs

### Visual Polish & Surface Hierarchy (UX-04)
- 3-level surface depth scale (`#0b0f19` app background, `glass-card` slate panels, elevated modal overlays).
- Color-independent badges pairing visual status colors with explicit text labels.
- `@media (prefers-reduced-motion: reduce)` accessibility override.

---

## 2. Final QA, Polish & Release Readiness (Phase 6)

Phase 6 performed final quality assurance, branding synchronization, and release verification:

### Product Rebrand: Job Seer
- **Official Identity**: **Job Seer** (*Your intelligent job search companion*).
- Complete user-facing branding alignment across HTML metadata, navigation, landing pages, authentication flows, error states, and documentation.

### Architectural Stability
- **Layered Architecture**: Routers (`app/routers/`), Schemas (`app/schemas/`), Models (`app/models/`), Services (`app/services/`), Core (`app/core/`).
- **Security & Authorization**: Strict `user_id == current_user.id` resource ownership isolation across all user endpoints.
- **Health Probes**: Liveness (`GET /health`) and database readiness (`GET /health/ready`) probes active.
- **Production Containerization**: Multi-stage Docker image and Docker Compose deployment orchestration.

---

## 3. Production Security & Performance (Phase 4 & 5)

- Dual `HttpOnly` `SameSite=Lax` cookies & Bearer token extraction.
- Sliding window rate limiter in `app/core/rate_limiter.py`.
- Security headers middleware (`nosniff`, `DENY`, `strict-origin-when-cross-origin`, `1; mode=block`).
- Single-column and compound database indexes across high-frequency columns.
