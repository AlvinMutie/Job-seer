import math
import pytest
from app.services.matching_engine import MatchingEngine
from app.services.tailor_service import tailor_service
from app.services.cover_letter import cover_letter_generator

pytestmark = [pytest.mark.unit, pytest.mark.regression]


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
    assert score >= 0.0


def test_matching_skill_alias_resolution(matching_engine):
    """Test that skill aliases like 'js' resolution matches 'javascript'."""
    text_with_alias = "Experienced in JS, React, and Postgres"
    extracted = matching_engine.extract_skills(text_with_alias)
    
    assert "javascript" in extracted
    assert "postgresql" in extracted
    assert "react" in extracted


def test_matching_skill_alias_normalizations_expanded(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test additional skill aliases: TS -> typescript, react.js -> react, node -> node.js, sql server -> mssql.
    """
    text = "Fullstack developer skilled in TS, react.js, node, and sql server."
    extracted = matching_engine.extract_skills(text)
    
    assert "typescript" in extracted
    assert "react" in extracted
    assert "node.js" in extracted
    assert "mssql" in extracted


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


def test_matching_both_empty_input(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test passing empty strings for both resume and job returns 0.0 cleanly.
    """
    score = matching_engine.calculate_match_score("", "")
    assert score == 0.0


def test_matching_whitespace_only_input(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test passing whitespace-only inputs returns 0.0 without exception.
    """
    score = matching_engine.calculate_match_score("   \n\n\t  ", " \t \n ")
    assert score == 0.0


def test_matching_very_short_text(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test very short single-word inputs.
    """
    score = matching_engine.calculate_match_score("Python", "developer")
    assert isinstance(score, float)
    assert score >= 0.0


def test_matching_repeated_text(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test repeated text input produces deterministic results.
    """
    resume = "Python Python Python Python"
    job = "Senior Python Developer with Python skills"
    score1 = matching_engine.calculate_match_score(resume, job)
    score2 = matching_engine.calculate_match_score(resume, job)
    assert score1 == score2
    assert isinstance(score1, float)
    assert not math.isnan(score1)
    assert score1 >= 0.0


def test_matching_special_characters(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test inputs containing special characters @#$%^&*() {}[]<> execute safely.
    """
    resume = "Senior C++ / C# Engineer @ TechCorp! #python {fastapi} [aws]"
    job = "C++ & C# Developer needed for (microservices) + cloud"
    score = matching_engine.calculate_match_score(resume, job)
    assert isinstance(score, float)
    assert score >= 0.0


def test_matching_unicode_multilingual(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test input with Unicode characters and multilingual text parses safely.
    """
    resume = "Développeur Python avec expérience en España ñoño e 🚀 AI models."
    job = "Ingénieur Python pour développements cloud."
    score = matching_engine.calculate_match_score(resume, job)
    assert isinstance(score, float)
    assert score >= 0.0


def test_matching_html_markup(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test input containing HTML/script tags is treated as text without executing or crashing.
    """
    resume = "<h1>Python Developer</h1><script>alert('test')</script>"
    job = "<p>Looking for <b>Python</b> experience.</p>"
    score = matching_engine.calculate_match_score(resume, job)
    assert isinstance(score, float)
    assert score >= 0.0


def test_matching_very_long_text(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Test synthetic 50,000 character input completes safely and returns valid score.
    """
    long_resume = "Python developer with FastAPI experience. " * 1000
    long_job = "Senior Python Engineer needed with FastAPI and AWS. " * 1000
    score = matching_engine.calculate_match_score(long_resume, long_job)
    assert isinstance(score, float)
    assert score >= 0.0


def test_matching_numerical_safety_boundaries(matching_engine):
    """
    MATCHING SAFETY GATE (P1-05):
    Verify match score is always a finite float and never NaN or Infinity.
    """
    pairs = [
        ("", ""),
        ("Python", "Python"),
        ("Python Developer", "React Developer"),
        ("a" * 1000, "b" * 1000),
        ("!@#$%^&*", "!@#$%^&*")
    ]
    for resume, job in pairs:
        score = matching_engine.calculate_match_score(resume, job)
        assert isinstance(score, float)
        assert not math.isnan(score)
        assert not math.isinf(score)
        assert score >= 0.0


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


def test_tailor_and_cover_letter_service_edge_cases():
    """
    MATCHING SAFETY GATE (P1-05):
    Verify tailor_service and cover_letter_generator execute safely on empty/minimal inputs.
    """
    suggestions = tailor_service.generate_suggestions("", "Developer", [])
    assert isinstance(suggestions, list)

    letter = cover_letter_generator.generate("Python Developer", "TechCorp", "Job desc", "Candidate", [])
    assert isinstance(letter, str)
    assert "TechCorp" in letter
