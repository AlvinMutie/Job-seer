import pytest
from unittest.mock import patch, AsyncMock
from app.services.external_job_service import external_job_service
from app.models.models import Job

pytestmark = [pytest.mark.integration]


def test_clean_html():
    raw = "<strong>Staff Python Developer</strong> with <p>FastAPI &amp; AWS</p>"
    clean = external_job_service.clean_html(raw)
    assert "<strong>" not in clean
    assert "<p>" not in clean
    assert "Staff Python Developer with FastAPI &amp; AWS" in clean


def test_infer_remote_and_experience_levels():
    assert external_job_service.infer_remote_status("Remote Python Lead", "Fully remote work", "Anywhere") == "Remote"
    assert external_job_service.infer_remote_status("React Developer", "Hybrid schedule 2 days office", "NYC") == "Hybrid"
    assert external_job_service.infer_remote_status("Systems Engineer", "On site hardware management", "Austin") == "On-site"

    assert external_job_service.infer_experience_level("Senior Python Architect", "Lead a team") == "Senior"
    assert external_job_service.infer_experience_level("Junior Associate Engineer", "Entry level role") == "Junior"
    assert external_job_service.infer_experience_level("Full Stack Developer", "Mid-level position") == "Mid-Level"


def test_format_salary():
    assert external_job_service.format_salary(120000, 150000) == "$120,000 - $150,000"
    assert external_job_service.format_salary(130000, 130000) == "$130,000"
    assert external_job_service.format_salary(90000, None) == "From $90,000"
    assert external_job_service.format_salary(None, 140000) == "Up to $140,000"
    assert external_job_service.format_salary(None, None) == "Competitive"


def test_extract_required_skills():
    skills = external_job_service.extract_required_skills(
        "Senior React Engineer", 
        "Must have experience with React, TypeScript, Tailwind, and Node."
    )
    assert "react" in skills.lower() or "typescript" in skills.lower()


def test_sync_external_jobs_endpoint_unauthenticated(client):
    res = client.post("/jobs/sync-external?keywords=Python")
    assert res.status_code == 401


def test_sync_external_jobs_mocked_ingestion(db_session):
    import asyncio

    mock_results = [
        {
            "id": "mock-101",
            "title": "Mock Lead Engineer",
            "company": {"display_name": "MockCo Inc"},
            "location": {"display_name": "San Francisco, CA"},
            "description": "We need a Senior engineer proficient in Python, Docker, Kubernetes, and PostgreSQL.",
            "salary_min": 150000,
            "salary_max": 180000,
            "created": "2026-09-01T12:00:00Z"
        }
    ]

    with patch.object(external_job_service, "fetch_adzuna_jobs", new_callable=AsyncMock) as mock_fetch:
        mock_fetch.return_value = mock_results

        result = asyncio.run(external_job_service.sync_external_jobs(
            db=db_session,
            keywords="Python Engineer",
            location="San Francisco",
            max_results=5
        ))

        assert result["new_jobs_added"] == 1
        assert result["total_found"] == 1
        assert len(result["jobs"]) == 1
        job = result["jobs"][0]
        assert job.title == "Mock Lead Engineer"
        assert job.company == "MockCo Inc"
        assert job.experience_level == "Senior"

        # Deduplication test: running same sync again should add 0 new jobs
        result_dup = asyncio.run(external_job_service.sync_external_jobs(
            db=db_session,
            keywords="Python Engineer",
            location="San Francisco",
            max_results=5
        ))
        assert result_dup["new_jobs_added"] == 0
