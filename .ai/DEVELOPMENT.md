# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Job Seer** (*Your intelligent job search companion*).

---

## 1. UX Architecture & Product Intelligence (UX-01 to UX-08)

UX-01 through UX-08 established a modern, product-grade frontend architecture:

### Next Best Action & Product Intelligence (UX-08)
- `NextBestAction.jsx` evaluates candidate state (Profile setup, Base CV upload, Job discovery, High match review, Interview preparation) and surfaces a high-priority "Next Move" action card.
- Career readiness progress signals (Profile ➔ Base CV ➔ Job Search ➔ Applications) rendered on the Dashboard.

### Candidate Workflow & Context Preservation (UX-07)
- Continuous candidate workflow (**Discover → Match → Prepare → Apply → Track**).
- Target opportunity context preserved across Jobs Hub, Matches, and Resume Hub via URL query parameters (`?jobId=...`).

### Navigation & Workflow Organization (UX-05)
- Organized into 4 workflow sections: **Overview** (`/dashboard`), **Discover** (`/jobs`, `/matches`), **Manage** (`/tracker`, `/resume-hub`), and **Account** (`/settings`).
- Mobile slide-down navigation drawer with touch-friendly navigation targets.

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
