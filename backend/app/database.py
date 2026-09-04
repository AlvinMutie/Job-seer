from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.models import Base

# Database URL loaded from centralized settings
DATABASE_URL = settings.DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Safe SQLite column migration helper for existing local dev databases
    if "sqlite" in DATABASE_URL:
        try:
            inspector = inspect(engine)
            if "application_tracker" in inspector.get_table_names():
                existing_cols = {col["name"] for col in inspector.get_columns("application_tracker")}
                new_cols = {
                    "applied_date": "VARCHAR(20)",
                    "interview_date": "VARCHAR(20)",
                    "follow_up_date": "VARCHAR(20)",
                    "application_url": "VARCHAR(500)",
                    "notes": "TEXT",
                    "updated_at": "DATETIME"
                }
                with engine.connect() as conn:
                    for col_name, col_type in new_cols.items():
                        if col_name not in existing_cols:
                            conn.execute(text(f"ALTER TABLE application_tracker ADD COLUMN {col_name} {col_type}"))
                    conn.commit()
        except Exception:
            pass

    # Auto-seed initial jobs if jobs table is empty
    try:
        from app.models.models import Job
        db = SessionLocal()
        if db.query(Job).count() == 0:
            from seed_jobs import seed_jobs
            seed_jobs()
        db.close()
    except Exception:
        pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
