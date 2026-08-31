import pytest
from app.services.matching_engine import MatchingEngine

@pytest.fixture
def matching_engine():
    return MatchingEngine()


def test_matching_identical_content(matching_engine):
    """Test matching identical resume and job text yields high match score."""
    text = "Senior Python Developer experienced in FastAPI, PostgreSQL, AWS, and Docker."
    score = matching_engine.calculate_match_score(text, text)
    assert score > 80.0
    assert isinstance(score, float)


def test_matching_partial_overlap(matching_engine):
    """Test partial skill overlap produces a valid score between 0 and 100."""
    resume = "Python developer with experience in Django and PostgreSQL."
    job = "Senior Python Developer with FastAPI, AWS, Docker, and PostgreSQL."
    score = matching_engine.calculate_match_score(resume, job)
    assert 0.0 <= score <= 100.0


def test_matching_skill_alias_resolution(matching_engine):
    """Test that skill aliases like 'js' resolution matches 'javascript'."""
    text_with_alias = "Experienced in JS, React, and Postgres"
    extracted = matching_engine.extract_skills(text_with_alias)
    
    assert "javascript" in extracted
    assert "postgresql" in extracted
    assert "react" in extracted


def test_matching_empty_resume(matching_engine):
    """Test passing empty resume text returns 0 score cleanly without raising exception."""
    job = "Looking for a Python Developer."
    score = matching_engine.calculate_match_score("", job)
    assert score == 0.0


def test_matching_empty_job_description(matching_engine):
    """Test passing empty job description returns 0 score cleanly."""
    resume = "Senior Python Developer"
    score = matching_engine.calculate_match_score(resume, "")
    assert score == 0.0


def test_matching_deterministic_output(matching_engine):
    """Test that calculating match score multiple times produces exact deterministic results."""
    resume = "Senior Fullstack Engineer proficient in TypeScript, React, Node.js, and Docker."
    job = "Frontend Developer needed with strong React and TypeScript experience."
    
    score1 = matching_engine.calculate_match_score(resume, job)
    score2 = matching_engine.calculate_match_score(resume, job)
    assert score1 == score2


def test_compare_skills_matched_and_missing(matching_engine):
    """Test compare_skills returns correct matched, missing, and advice lists."""
    resume_skills = ["python", "fastapi"]
    job_skills = ["python", "fastapi", "aws", "docker"]
    
    comparison = matching_engine.compare_skills(resume_skills, job_skills)
    assert set(comparison["matched"]) == {"python", "fastapi"}
    assert set(comparison["missing"]) == {"aws", "docker"}
    assert len(comparison["tailoring_advice"]) > 0
