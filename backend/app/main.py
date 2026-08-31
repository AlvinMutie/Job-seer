from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.errors import register_exception_handlers
from app.database import init_db
from app.routers import auth, jobs, matching, profile, applications, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Smart Job Hunter API", lifespan=lifespan)

# Register Centralized Global Exception Handlers
register_exception_handlers(app)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(matching.router)
app.include_router(profile.router)
app.include_router(applications.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Smart Job Hunter API", "status": "running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
