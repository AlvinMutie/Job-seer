# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Application Tracker Parameters (`GET /applications`)

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

## 2. Centralized Error Infrastructure

Error handling is centralized in `backend/app/core/errors.py`. The framework provides standardized API error structures, error code taxonomies, custom exceptions, and global exception handlers.

### Error Code Taxonomy (`ErrorCode`)

```python
from app.core.errors import ErrorCode
```

| Error Code | HTTP Status | Description |
| ---------- | ----------- | ----------- |
| `VALIDATION_ERROR` | 422 | Request body or parameter validation failure |
| `AUTHENTICATION_REQUIRED` | 401 | Missing Authorization header |
| `INVALID_CREDENTIALS` | 401 | Wrong username or password |
| `TOKEN_INVALID` | 401 | Invalid or tampered JWT signature |
| `FORBIDDEN` | 403 | Insufficient permissions for resource |
| `RESOURCE_NOT_FOUND` | 404 | Requested database entity or route not found |
| `CONFLICT` | 400 / 409 | Entity conflict (e.g. duplicate email) |
| `UNSUPPORTED_FILE_TYPE` | 400 | Forbidden file extension (.exe, .py, etc.) |
| `INVALID_FILE_CONTENT` | 400 | File header signature / MIME magic byte mismatch |
| `UPLOAD_TOO_LARGE` | 413 | File size exceeds 10MB limit |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception (sanitized output) |

---

## 3. Standardized Error Response Structure

All error responses returned by the API adhere to the dual-compatible JSON format:

```json
{
  "detail": "The requested job was not found.",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested job was not found.",
    "details": null
  }
}
```
