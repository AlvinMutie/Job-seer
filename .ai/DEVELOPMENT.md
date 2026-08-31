# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Frontend Client Architecture & Error Handling (P2-03)

The React frontend client relies on a centralized Axios API client in `frontend/src/services/api.js`.

### Key Features
1. **Centralized Error Extraction (`getApiErrorMessage(error)`)**:
   - Parses standardized backend P2-01 error payloads (`error.response.data.error.message`).
   - Extracts structured field-level validation details (`error.response.data.error.details`).
   - Falls back to legacy detail strings (`error.response.data.detail`).
   - Handles server offline / network connection failures (`"Unable to connect to the server. Please check your connection and try again."`).
   - Maps status codes (400, 401, 403, 404, 413, 422, 500) to safe user-friendly fallbacks.
2. **Request Interceptor**: Dynamically retrieves JWT from `localStorage` and attaches `Authorization: Bearer <token>` to outgoing HTTP requests.
3. **Response Interceptor**: Intercepts HTTP 401 Unauthorized responses (except during login attempts) to clear stale local storage tokens and attach standardized `.userMessage` properties onto error exceptions.
4. **Loading & Button State Safety**: All asynchronous UI operations utilize `try / catch / finally` blocks to ensure loading spinners always reset and submit buttons are disabled during active requests to prevent double submissions.

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
