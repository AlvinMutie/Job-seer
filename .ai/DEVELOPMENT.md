# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Intelligent Command Center Dashboard (P3-07)

Task **P3-07** introduced the aggregated Intelligent Command Center Dashboard:

### Endpoints Reference

- `GET /dashboard/analytics`: Computes and retrieves real-time aggregated user analytics:
  - `total_applications`: Integer count of user's tracked applications.
  - `status_counts`: Breakdown for `not_applied`, `applied`, `interview`, `offer`, `rejected`.
  - `average_match_score`: Average V2 AI match score.
  - `ats_health_score`: Score evaluated via `resume_intelligence_service` if user has resume text, else `None`.
  - `ats_classification`: Classification string if user has resume text, else `"No Resume Uploaded"`.
  - `tailored_resumes_count`: Count of saved `TailoredResume` records for user.
  - `cover_letters_count`: Count of saved `CoverLetter` records for user.
  - `recent_applications`: Latest 5 tracked applications with title, company, status, score, dates.
  - `recent_tailored_resumes`: Latest 3 saved tailored resumes.
  - `recent_cover_letters`: Latest 3 saved cover letters.

### Frontend Command Center Architecture (`Dashboard.jsx`)

- **Hero Greeting Banner**: User greeting, preferred role target, CV status badge & ATS score.
- **Command Intelligence KPI Grid**: 4 KPI Stat Cards (Average Match %, Active Applications, ATS Health Score & Badge, Saved Assets Count).
- **Action Center Launchpad**: Quick launch buttons ("Upload CV", "Tailor CV", "Format Cover Letter", "Kanban Board", "Jobs Hub").
- **Pipeline Stage Breakdown & Asset History**: Visual stage count cards + recent tailored versions and cover letters.
- **AI Recommendation Hub**: Keyword search, location filter, job cards with explainable match scores, missing skills, advice, tailoring, and quick tracking.

---

## 2. Application Tracker V2 & Kanban Board (P3-06)

Task **P3-06** upgraded the application tracking pipeline to a complete Kanban board workspace with HTML5 drag-and-drop.
