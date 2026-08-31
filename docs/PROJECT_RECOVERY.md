# PROJECT_RECOVERY.md — Master Codebase Recovery & Engineering Audit Report

**Project Name**: Smart Job Hunter (Hunter.io)  
**Audit Date**: August 31, 2026  
**Auditor**: Antigravity AI Engineering Team  
**Status**: Recovery & Baseline Audit Complete (No application code modified)

---

## Executive Summary

Smart Job Hunter is an application designed to assist job seekers by extracting resume skills, calculating job matching similarity, providing resume tailoring suggestions, and tracking job applications. It features a **React 18 (Vite)** SPA frontend and a **FastAPI (Python)** backend service.

This audit establishes the true baseline implementation state of the codebase, separating verified code facts from README marketing claims, resolving documented contradictions, establishing endpoint security access control boundaries, and defining an implementation-ready task plan.

---

## 1. Actual System Architecture

### Frontend (React 18 + Vite)
- **Routing**: `react-router-dom` (v7) with client-side SPA routes: `/` (Landing), `/login`, `/register`, `/profile-setup`, `/dashboard`, `/matches`, `/tracker`, `/resume-hub`, `/settings`.
- **State & Auth**: `localStorage.getItem('token')` evaluated by `<ProtectedRoute>` HOC. Axios interceptor (`src/services/api.js`) appends Bearer header.
- **UI & UX**: Custom Tailwind CSS v3 dark mode with glassmorphism design system (`glass-card`, `btn-primary`), Framer Motion scroll animations, Lenis smooth scrolling, Lucide icons, and Spotlight hover cards (`SpotlightCard.jsx`).

### Backend (FastAPI + SQLAlchemy)
- **Framework**: FastAPI (Python 3.10+). Single entry point file (`backend/app/main.py`).
- **Database**: SQLite default (`job_hunter_v3.db`) via SQLAlchemy ORM.
- **Auth**: JWT HS256 algorithm using `python-jose` and `passlib` bcrypt hashing (with runtime monkeypatch for `bcrypt.__about__`).

### Technology Classification & Matching Engine
- **Technology Classification**: Rule-based processing (dictionary & alias lookup), classical statistical NLP (TF-IDF vector space modeling), information extraction, POS entity tagging (`spaCy`).
- **Recommended Product Description**: **"Intelligent job matching platform using NLP and statistical similarity"**.
- **Matching Engine Flow**: Combines PyMuPDF/docx2txt text parsing, `TfidfVectorizer` cosine similarity, dictionary lookup (`TECH_SKILLS_DB`), and `spaCy` (`en_core_web_sm`) PROPN/NOUN entity extraction. Applies a score boost `max(final_score, content_sim * 2)` over raw weighted scores.
- **Optimal Weighting**: The optimal weighting ratio between skill overlap and contextual similarity is currently **UNKNOWN** and should be determined through empirical evaluation against a representative validation dataset.

---

## 2. Authoritative API Endpoint Security Matrix

| Method | Endpoint | Security Access Boundary | Authentication Enforcement Requirement | Frontend Usage | Status |
| ------ | -------- | ------------------------ | --------------------------------------- | -------------- | ------ |
| `GET` | `/` | **PUBLIC** | None (System health check) | None | WORKING |
| `POST` | `/register` | **PUBLIC** | Rate limiting on registration attempts | `Register.jsx`, `api.js` | WORKING |
| `POST` | `/login` | **PUBLIC** | Rate limiting on failed login attempts | `Login.jsx`, `api.js` | WORKING |
| `GET` | `/jobs` | **PUBLIC** | None (Public job discovery) | `Dashboard.jsx`, `Matches.jsx` | WORKING |
| `POST` | `/match` | **AUTHENTICATED** | Enforce `Depends(get_current_user)` | `Dashboard.jsx`, `Matches.jsx` | WORKING (Security Gap) |
| `POST` | `/tailor-resume` | **AUTHENTICATED** | Enforce `Depends(get_current_user)` | `Dashboard.jsx` | WORKING (Security Gap) |
| `POST` | `/generate-cover-letter` | **AUTHENTICATED** | Enforce `Depends(get_current_user)` | Defined in `api.js` | IMPLEMENTED_BUT_UNUSED |
| `GET` | `/me` | **RESOURCE_OWNER** | Verified via `get_current_user` | `App.jsx`, `Dashboard.jsx` | WORKING |
| `POST` | `/profile` | **RESOURCE_OWNER** | Scoped to `current_user.id` | `ProfileSetup.jsx`, `Settings.jsx` | WORKING |
| `POST` | `/upload-resume` | **RESOURCE_OWNER** | Extension whitelist, MIME magic check, 10MB limit | `ProfileSetup.jsx`, `ResumeHub.jsx` | WORKING (Upload Vulnerability) |
| `GET` | `/applications` | **RESOURCE_OWNER** | Query filtered to `user_id == current_user.id` | `Dashboard.jsx`, `Tracker.jsx` | WORKING |
| `POST` | `/applications` | **RESOURCE_OWNER** | Assert `user_id == current_user.id` on upsert | `Dashboard.jsx` | WORKING |

---

## 3. P0 Security Task Verification Table

| Task ID | Task Name | Files Likely Affected | Current Problem | Required Change | Risk | Verification |
| ------- | --------- | --------------------- | --------------- | --------------- | ---- | ------------ |
| **P0-01** | Externalize JWT Secret | `backend/app/auth.py`, `backend/app/core/config.py`, `.env.example` | Secret key is hardcoded in source code (`"super-secret-key-change-me-in-production"`). | Load `SECRET_KEY` via `pydantic-settings` from `.env`. Fail startup if missing/weak in prod. | Low | Test startup behavior with missing/valid `.env`; verify JWT token verification. |
| **P0-02** | Endpoint Authorization Boundaries | `backend/app/routers/matching.py`, `backend/app/routers/jobs.py` | Computational endpoints `/match`, `/tailor-resume`, `/generate-cover-letter` lack auth checks. | Add `Depends(get_current_user)` to computational endpoints. Retain `GET /jobs` as `PUBLIC`. | Low | HTTP integration test asserting 401 for unauthenticated calls to `/match`. |
| **P0-03** | Secure Resume Uploads | `backend/app/routers/profile.py`, `backend/app/utils/file_handling.py` | `POST /upload-resume` writes files directly to disk without extension whitelist or MIME verification. | Enforce `.pdf`, `.docx`, `.txt` extension check, magic byte validation, 10MB limit, and server UUID filenames. | Low | Upload test scripts attempting `.exe`, oversized, and malformed files. |
| **P0-04** | Restrict CORS Origins | `backend/app/main.py` | `allow_origins=["*"]` configured with `allow_credentials=True`. | Replace wildcard `*` with explicitly configured allowed frontend origins (`http://localhost:5173`). | Low | Verify preflight OPTIONS requests from authorized vs unauthorized origins. |
| **P0-05** | Resolve Password Hashing Dependency Conflict | `backend/app/main.py`, `backend/requirements.txt` | Runtime monkeypatch `bcrypt.__about__` used due to `passlib` version mismatch. | Pin compatible `passlib` and `bcrypt` versions or update to `argon2-cffi`. Remove monkeypatch. | Low | Verify `/register` and `/login` password hashing and verification without monkeypatch. |

---

## 4. Summary of Resolved Contradictions & Audit Decisions

1. **`GET /jobs` Authentication Resolution**: Classified as **PUBLIC discovery**. Job searching returns public listings and does not require authentication, but personalized matching (`POST /match`) and tracking (`POST /applications`) require authentication.
2. **Matching Score Weights**: Retained true implementation analysis without proposing arbitrary 60/40 shifts. Stated explicitly that optimal weighting is UNKNOWN pending empirical evaluation.
3. **AI Product Terminology**: Updated product description from misleading "AI-powered" claim to technically accurate **"Intelligent job matching platform using NLP and statistical similarity"**.
4. **JWT Storage**: Retained Bearer tokens + `localStorage` for local dev; documented `HttpOnly` cookies + CSRF protection as the production requirement.
