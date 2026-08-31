# ROADMAP.md — Implementation-Ready Engineering Task Plan

This document contains the implementation-ready task breakdown for **Smart Job Hunter**. All tasks are prioritized using **P0 (Critical Security & Configuration)**, **P1 (High Stabilization & Refactoring)**, **P2 (Medium Feature & Schema Polish)**, **P3 (Product Intelligence & UX)**, and **Phase 4 (Production Security & Performance)**.

---

## Task Priority Overview

```mermaid
flowchart TD
    subgraph P0 [P0: Critical Security & Configuration - COMPLETED]
        P0-00[P0-00: Establish Testing Safety Baseline ✓ COMPLETED]
        P0-01[P0-01: Externalize JWT Secret ✓ COMPLETED]
        P0-02[P0-02: Endpoint Authorization Boundaries ✓ COMPLETED]
        P0-03[P0-03: Secure Resume Uploads ✓ COMPLETED]
        P0-04[P0-04: Restrict CORS Origins ✓ COMPLETED]
        P0-05[P0-05: Resolve Password Hashing Conflict ✓ COMPLETED]
    end

    subgraph P1 [P1: High Stabilization & Testing - COMPLETED]
        P1-01[P1-01: Modularize main.py into Routers ✓ COMPLETED]
        P1-02[P1-02: Separate Schemas & Models ✓ COMPLETED]
        P1-03[P1-03: Setup pytest Safety Testing Framework ✓ COMPLETED]
        P1-04[P1-04: Add Auth Security Safety Gate Tests ✓ COMPLETED]
        P1-05[P1-05: Add File Upload & Matching Safety Gate Tests ✓ COMPLETED]
    end

    subgraph P2 [P2: Feature & Schema Polish - COMPLETED]
        P2-01[P2-01: Enhanced Error Handling & Standardized API Responses ✓ COMPLETED]
        P2-02[P2-02: Application Tracker Filtering & Pagination ✓ COMPLETED]
        P2-03[P2-03: Frontend Client Hardening & State Management ✓ COMPLETED]
    end

    subgraph P3 [P3: Product Intelligence & UX - COMPLETED]
        P3-01[P3-01: Enhanced Job Discovery & Repository Hub ✓ COMPLETED]
        P3-02[P3-02: Matching Engine V2 & Explainable Scoring ✓ COMPLETED]
        P3-03[P3-03: Resume Intelligence & ATS Health Check ✓ COMPLETED]
        P3-04[P3-04: Resume Tailoring V2 & Persistence ✓ COMPLETED]
        P3-05[P3-05: Multi-Tone Cover Letters & Management ✓ COMPLETED]
        P3-06[P3-06: Application Tracker V2 & Kanban Board ✓ COMPLETED]
        P3-07[P3-07: Intelligent Command Center Dashboard ✓ COMPLETED]
    end

    subgraph P4 [Phase 4: Production Security & Performance - COMPLETED]
        P4-SEC06[SEC-06: Authentication Storage Hardening - HttpOnly Cookies ✓ COMPLETED]
        P4-SEC07[SEC-07: Application-Level Rate Limiting ✓ COMPLETED]
        P4-PERF[Database Indexing & HTTP Security Headers ✓ COMPLETED]
    end

    P0-00 --> P1-01 --> P2-01 --> P3-01 --> P4-SEC06 --> P4-SEC07 --> P4-PERF
```

---

## Completed Phases

### Phase 0 through Phase 3 (✓ ALL COMPLETED)

### Phase 4 — Production Security & Performance (✓ COMPLETED)
- **Result**: Resolved SEC-06 (HttpOnly cookie authentication alongside Bearer tokens, `POST /logout`, `withCredentials: true`), resolved SEC-07 (sliding window rate limiter in `app/core/rate_limiter.py` enforcing request limits on auth and AI endpoints with HTTP 429 response), added HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection`), added database indexes and compound indexes in `app/models/models.py`. Added 6 integration and security tests in `backend/tests/test_phase4_security_performance.py`. **166 / 166 backend pytest cases passing** (91% coverage), **90 security tests passing**, **6 / 6 frontend unit tests passing**, production Vite build succeeded cleanly.
