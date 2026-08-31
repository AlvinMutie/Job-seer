import pytest
import os
import io
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.models.models import Base, User, Profile, Job
from app.database import get_db
from app.main import app
from app.auth import get_password_hash, create_access_token

# In-memory SQLite with StaticPool ensures the same single connection is shared across all sessions
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Override FastAPI DB dependency globally for tests
app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function", autouse=True)
def setup_test_database():
    """Create all tables before each test and drop them after, ensuring complete test isolation."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def db_session():
    """Provides a direct database session for test setup and verification."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client():
    """Provides FastAPI TestClient connected to the in-memory test database."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user(db_session):
    """Creates primary test user and returns user model, plain password, and JWT token."""
    email = "testuser@example.com"
    password = "TestPassword123!"
    full_name = "Test User"
    
    hashed_pwd = get_password_hash(password)
    user = User(
        email=email,
        hashed_password=hashed_pwd,
        full_name=full_name,
        is_profile_complete=1
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    # Create profile
    profile = Profile(
        user_id=user.id,
        preferred_role="Senior Python Developer",
        skills="python, fastapi, aws",
        experience_level="Senior",
        location_preference="Remote",
        salary_expectation="$120k"
    )
    db_session.add(profile)
    db_session.commit()

    token = create_access_token(data={"sub": user.email})
    return {
        "user": user,
        "email": email,
        "password": password,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }


@pytest.fixture
def secondary_user(db_session):
    """Creates a second test user for testing resource isolation between users."""
    email = "secondary@example.com"
    password = "SecondaryPassword123!"
    full_name = "Secondary User"
    
    hashed_pwd = get_password_hash(password)
    user = User(
        email=email,
        hashed_password=hashed_pwd,
        full_name=full_name,
        is_profile_complete=1
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    profile = Profile(
        user_id=user.id,
        preferred_role="React Engineer",
        skills="react, javascript, tailwind",
        experience_level="Mid-Level",
        location_preference="NYC",
        salary_expectation="$100k"
    )
    db_session.add(profile)
    db_session.commit()

    token = create_access_token(data={"sub": user.email})
    return {
        "user": user,
        "email": email,
        "password": password,
        "token": token,
        "headers": {"Authorization": f"Bearer {token}"}
    }


@pytest.fixture
def seed_test_jobs(db_session):
    """Seeds sample jobs into test database for search and matching tests."""
    job1 = Job(
        title="Senior Python Developer",
        company="TechCorp",
        location="New York, NY",
        description="We are looking for a Senior Python Developer with experience in FastAPI, PostgreSQL, and AWS.",
        remote_status="Remote",
        experience_level="Senior",
        skills_required="Python, FastAPI, PostgreSQL, AWS",
        salary_range="$120k - $160k"
    )
    job2 = Job(
        title="React Frontend Engineer",
        company="DesignSync",
        location="San Francisco, CA",
        description="Join our team to build user interfaces with React, Tailwind CSS, and Framer Motion.",
        remote_status="Hybrid",
        experience_level="Mid-Level",
        skills_required="React, Tailwind, CSS, JavaScript",
        salary_range="$100k - $140k"
    )
    db_session.add_all([job1, job2])
    db_session.commit()
    db_session.refresh(job1)
    db_session.refresh(job2)
    return [job1, job2]
