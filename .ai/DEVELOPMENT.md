# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Resume Intelligence & ATS Health Check (P3-03)

Task **P3-03** introduced `ResumeIntelligenceService` (`app/services/resume_intelligence.py`) and endpoint `GET /resume/health`:

$$\text{health\_score} = (\text{completeness} \times 0.35) + (\text{ats\_health} \times 0.30) + (\text{contact\_health} \times 0.15) + (\text{skills\_health} \times 0.20)$$

### Factor Breakdown Reference

| Component | Weight | Analysis Method | Classification Scale |
| --------- | ------ | --------------- | -------------------- |
| **Completeness** | **35%** | Detects presence of 6 core sections (`summary`, `experience`, `skills`, `education`, `projects`, `certifications`) | **90-100**: Excellent |
| **ATS Health** | **30%** | Checks character bounds (200-20k), non-alphanumeric noise ratio, and formatting artifacts | **75-89**: Strong |
| **Contact Checks** | **15%** | Regex presence checks for `email`, `phone`, `linkedin`, `github`, and `portfolio` | **60-74**: Fair |
| **Skills Intelligence** | **20%** | Categorizes extracted skills into 7 domains (`languages`, `frontend`, `backend`, `databases`, `cloud_devops`, `data_ai`, `other`) | **40-59**: Needs Improvement |
| | | | **0-39**: Poor |

---

## 2. Matching Engine V2 & Explainable Scoring (P3-02)

Task **P3-02** upgraded `MatchingEngine` (`app/services/matching_engine.py`) to compute an explainable multi-factor match score breakdown (Skills 40%, Content 30%, Experience 15%, Role Title 15%).

---

## 3. Job Discovery & Repository Hub Architecture (P3-01)

Task **P3-01** enhanced `GET /jobs` with database-level limit/offset pagination, safe column sorting, and keyword search.
