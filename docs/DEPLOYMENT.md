# DEPLOYMENT.md — Production Deployment & Readiness Guide

## Product Identity: Job Seer
> **Tagline**: *Your intelligent job search companion.*

---

## 1. Production Architecture Overview

Job Seer features a production-ready layered architecture:
- **Backend**: FastAPI running with Uvicorn worker processes.
- **Frontend**: React (Vite) compiled to static production assets (`dist/`).
- **Database**: SQLAlchemy ORM with support for SQLite, PostgreSQL, or MySQL via `DATABASE_URL`.
- **Security & Session Layer**: Dual `HttpOnly` `SameSite=Lax` cookies & Bearer tokens, sliding-window rate limiting, and production HTTP security headers.

---

## 2. Environment Variables Matrix

| Variable | Environment | Required | Default / Description |
| -------- | ----------- | -------- | --------------------- |
| `ENVIRONMENT` | All | Yes | `development` \| `testing` \| `production` |
| `SECRET_KEY` | Production | **YES** | Must be >= 32 chars and not use default placeholders. |
| `DATABASE_URL` | All | Yes | Database URI (e.g. `sqlite:///./job_hunter_v3.db` or `postgresql://user:pass@host/db`) |
| `CORS_ORIGINS` | All | Yes | Comma-separated list of allowed frontend origins (no wildcards in production) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Optional | No | Default `1440` (24 hours) |

---

## 3. Health & Readiness Probes

Job Seer includes dedicated health check probes for container orchestrators (Docker, Kubernetes, Render, Railway):

- **Liveness Probe**: `GET /health`
  - Returns HTTP 200: `{"status": "ok", "app": "Job Seer", "environment": "production"}`
- **Readiness Probe**: `GET /health/ready`
  - Tests live database connection (`SELECT 1`). Returns HTTP 200 `{"status": "ready", "database": "connected"}` or HTTP 503 if unavailable.

---

## 4. Containerized Deployment (Docker)

To build and run Job Seer in production via Docker:

```bash
docker-compose up -d --build
```

Verify backend health:
```bash
curl http://localhost:8000/health/ready
```

---

## 5. Database Backup & Recovery Procedure

### SQLite Backup Procedure
1. Create a point-in-time copy of the SQLite database file:
   ```bash
   sqlite3 job_hunter_v3.db ".backup 'job_seer_backup_$(date +%Y%m%d_%H%M%S).sqlite'"
   ```
2. Verify backup integrity:
   ```bash
   sqlite3 job_seer_backup_*.sqlite "PRAGMA quick_check;"
   ```

### PostgreSQL Backup Procedure
```bash
pg_dump -U job_seer_user -h localhost job_seer_db > job_seer_backup_$(date +%Y%m%d).sql
```

---

## 6. Migration Strategy
Schema changes in Job Seer are managed via SQLAlchemy metadata reflection. When deploying new columns or indexes, schema reflection automatically updates tables without dropping existing data. Never run `drop_all()` in production.
