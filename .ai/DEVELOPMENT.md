# DEVELOPMENT.md — Developer & Architectural Guide

## Executive Overview
This document outlines the architecture, coding guidelines, error handling framework, and development practices for **Smart Job Hunter**.

---

## 1. Centralized Error Infrastructure

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
| `TOKEN_EXPIRED` | 401 | Expired JWT `exp` claim |
| `FORBIDDEN` | 403 | Insufficient permissions for resource |
| `RESOURCE_NOT_FOUND` | 404 | Requested database entity or route not found |
| `CONFLICT` | 400 / 409 | Entity conflict (e.g. duplicate email) |
| `UNSUPPORTED_FILE_TYPE` | 400 | Forbidden file extension (.exe, .py, etc.) |
| `INVALID_FILE_CONTENT` | 400 | File header signature / MIME magic byte mismatch |
| `UPLOAD_TOO_LARGE` | 413 | File size exceeds 10MB limit |
| `UPLOAD_INVALID` | 400 | General file upload validation failure |
| `PROCESSING_ERROR` | 400 / 500 | Business logic processing error |
| `DATABASE_ERROR` | 500 | Database query or connection error |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception (sanitized output) |

---

## 2. Standardized Error Response Structure

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

For validation errors (HTTP 422), structured field-level details are provided:

```json
{
  "detail": "Request validation error: invalid fields provided",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation error: invalid fields provided",
    "details": [
      {
        "field": "email",
        "message": "field required"
      }
    ]
  }
}
```

*Note: The top-level `detail` string is retained for 100% backward compatibility with standard Axios/React frontend components.*

---

## 3. How to Raise Errors in Routers & Services

### Method A: Raise `APIException` (Recommended for custom structured errors)

```python
from app.core.errors import APIException, ErrorCode, ErrorDetail

raise APIException(
    status_code=409,
    code=ErrorCode.CONFLICT,
    message="Resource conflict detected",
    details=[ErrorDetail(field="email", message="Email already exists")]
)
```

### Method B: Raise Standard `HTTPException`

Standard FastAPI `HTTPException` calls are automatically captured by the global `http_exception_handler` and converted into the standardized error format:

```python
from fastapi import HTTPException, status

raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Job not found"
)
```

---

## 4. Exception Handling & Logging Safety

- Global fallback handler catches all unhandled Python `Exception` types, logs the full exception and traceback server-side via `logger.exception(...)`, and returns a sanitized HTTP 500 response.
- **Security Rule**: Never expose raw stack traces, SQL queries, database credentials, JWT secrets, or filesystem paths to the client.
