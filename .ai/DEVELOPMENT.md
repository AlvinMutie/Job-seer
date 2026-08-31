# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Job Discovery & Repository Hub Architecture (P3-01)

Task **P3-01** enhanced `GET /jobs` and introduced the dedicated frontend `JobsHub.jsx` page:

```text
GET /jobs?search=Python&location=Remote&remote_status=Remote&experience_level=Senior&sort_by=posted_at&order=desc&limit=20&offset=0
```

### Parameter Reference

| Parameter | Type | Default | Description | Validation Constraints |
| --------- | ---- | ------- | ----------- | ---------------------- |
| `search` | string | `None` | Keyword search matching title, company, description, or skills | Parameterized `ilike` search |
| `location` | string | `None` | Location search (matches 'Remote' in remote_status if specified) | Case-insensitive filter |
| `remote_status` | string | `None` | Work mode filter (`Remote`, `Hybrid`, `On-site`) | Case-insensitive filter |
| `experience_level` | string | `None` | Level filter (`Junior`, `Mid-Level`, `Senior`, `Lead / Architect`) | Case-insensitive filter |
| `sort_by` | string | `posted_at` | Field sorting (`posted_at`, `title`, `company`, `location`, `remote_status`, `experience_level`) | Validated dictionary mapping or HTTP 422 |
| `order` | string | `desc` | Direction (`asc`, `desc`) | `asc` / `desc` or HTTP 422 |
| `limit` | integer | `20` | Maximum records returned per page | `ge=1, le=100` |
| `offset` | integer | `0` | Number of records to skip | `ge=0` |

---

## 2. Application Tracker Parameters (`GET /applications`)

Task **P2-02** enhanced `GET /applications` with optional query parameters:

```text
GET /applications?status=Interview&search=Python&limit=20&offset=0
```

### Parameter Reference

| Parameter | Type | Default | Description | Validation Constraints |
| --------- | ---- | ------- | ----------- | ---------------------- |
| `status` | string | `None` | Filter by application status (case-insensitive: `Applied`, `Interview`, `Rejected`, `Offer`, `Not Applied`) | Valid enum string or HTTP 422 |
| `search` | string | `None` | Partial keyword search matching job title, company name, or application notes | Sanitized & parameterized `ilike` search |
| `limit` | integer | `50` | Maximum records returned per page | `ge=1, le=100` |
| `offset` | integer | `0` | Number of records to skip | `ge=0` |

---

## 3. Centralized Backend Error Infrastructure

Error handling is centralized in `backend/app/core/errors.py`. The framework provides standardized API error structures, error code taxonomies, custom exceptions, and global exception handlers.
