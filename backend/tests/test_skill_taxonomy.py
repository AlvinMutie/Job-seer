import pytest
from app.services.matching_engine import MatchingEngine, TECH_SKILLS_DB, SKILL_ALIASES

engine = MatchingEngine()


def test_taxonomy_size_expanded():
    """Verifies that the skill taxonomy contains over 100 comprehensive technical skills."""
    assert len(TECH_SKILLS_DB) >= 100
    assert "fastapi" in TECH_SKILLS_DB
    assert "kubernetes" in TECH_SKILLS_DB
    assert "postgresql" in TECH_SKILLS_DB
    assert "pytorch" in TECH_SKILLS_DB


def test_alias_normalization():
    """Verifies that aliases resolve to their canonical skill names."""
    extracted = engine.extract_skills("Experienced in k8s, postgres, and ts on aws lambda.")
    assert "kubernetes" in extracted
    assert "postgresql" in extracted
    assert "typescript" in extracted
    assert "serverless" in extracted


def test_contextual_disambiguation_go():
    """Verifies that 'go' is only extracted when in a technical programming context."""
    # Negative cases: normal English usage
    negative_texts = [
        "I like to go to the park on weekends.",
        "Let us go through the requirements together.",
        "We decided to go with another vendor."
    ]
    for text in negative_texts:
        extracted = engine.extract_skills(text)
        assert "go" not in extracted, f"False positive 'go' found in: {text}"

    # Positive cases: technical programming context
    positive_texts = [
        "Built microservices in Golang with high concurrency.",
        "Senior Go developer with experience in goroutines and channels.",
        "Developed REST API using Go and PostgreSQL backend."
    ]
    for text in positive_texts:
        extracted = engine.extract_skills(text)
        assert "go" in extracted, f"Expected 'go' in: {text}"


def test_contextual_disambiguation_c():
    """Verifies that 'c' is not matched for letter grades or single letters."""
    negative_texts = [
        "Graduated with a C average in general studies.",
        "Section C of the report.",
        "Option C was chosen."
    ]
    for text in negative_texts:
        extracted = engine.extract_skills(text)
        assert "c" not in extracted, f"False positive 'c' found in: {text}"

    positive_texts = [
        "Firmware development in C and C++ for embedded systems.",
        "Low-level programming in C with manual memory management."
    ]
    for text in positive_texts:
        extracted = engine.extract_skills(text)
        assert "c" in extracted, f"Expected 'c' in: {text}"


def test_contextual_disambiguation_spring():
    """Verifies that 'spring' does not match seasons."""
    negative_text = "Joined the team in spring 2022 to work on customer operations."
    extracted = engine.extract_skills(negative_text)
    assert "spring" not in extracted

    positive_text = "Developed enterprise microservices with Java and Spring Boot."
    extracted = engine.extract_skills(positive_text)
    assert "spring" in extracted


def test_compare_skills_alias_awareness():
    """Verifies that skill comparison handles aliases without false missing reports."""
    resume_skills = ["postgres", "k8s", "react.js", "nodejs"]
    job_skills = ["PostgreSQL", "Kubernetes", "React", "Node.js", "Docker"]

    result = engine.compare_skills(resume_skills, job_skills)
    assert "postgresql" in result["matched_skills"]
    assert "kubernetes" in result["matched_skills"]
    assert "react" in result["matched_skills"]
    assert "node.js" in result["matched_skills"]
    assert "docker" in result["missing_skills"]
    assert result["match_count"] == 4
    assert result["missing_count"] == 1
