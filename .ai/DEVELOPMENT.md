# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Matching Engine V2 & Explainable Scoring (P3-02)

Task **P3-02** upgraded `MatchingEngine` (`app/services/matching_engine.py`) to compute an explainable multi-factor match score breakdown:

$$\text{Overall Score} = (\text{Skills Score} \times 0.40) + (\text{Content Score} \times 0.30) + (\text{Experience Score} \times 0.15) + (\text{Role Title Score} \times 0.15)$$

### Factor Breakdown Reference

| Factor | Weight | Calculation Method | Normalized Range |
| ------ | ------ | ------------------ | ---------------- |
| **Skills Score** | **40%** | Matched required tech skills / Total job required tech skills | `0.0` – `100.0` |
| **Content Score** | **30%** | TF-IDF term frequency-inverse document frequency cosine similarity | `0.0` – `100.0` |
| **Experience Score** | **15%** | Candidate experience level vs job experience level comparison | `0.0` – `100.0` |
| **Role Title Score** | **15%** | Target candidate role title vs job title token overlap & match ratio | `0.0` – `100.0` |

### Response Schema (`POST /match`)

```json
{
  "match_percentage": 82.5,
  "breakdown": {
    "skills": 90.0,
    "content": 80.0,
    "experience": 75.0,
    "role_title": 80.0
  },
  "weights": {
    "skills": 0.40,
    "content": 0.30,
    "experience": 0.15,
    "role_title": 0.15
  },
  "explanation": "Strong overall match (82.5%). Technical skills alignment: 90.0%, content similarity: 80.0%, experience alignment: 75.0%.",
  "matched_skills": ["python", "fastapi"],
  "missing_skills": ["docker"],
  "tailoring_advice": ["• Highlight past projects..."]
}
```

---

## 2. Job Discovery & Repository Hub Architecture (P3-01)

Task **P3-01** enhanced `GET /jobs` and introduced the dedicated frontend `JobsHub.jsx` page:

```text
GET /jobs?search=Python&location=Remote&remote_status=Remote&experience_level=Senior&sort_by=posted_at&order=desc&limit=20&offset=0
```
