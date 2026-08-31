import pytest
import math
from app.services.matching_engine import MatchingEngine

pytestmark = [pytest.mark.unit, pytest.mark.regression]


@pytest.fixture
def engine():
    return MatchingEngine()


def test_v2_scoring_weights_and_breakdown(engine):
    """
    MATCHING ENGINE V2 (P3-02):
    Verify multi-factor scoring breakdown (skills 40%, content 30%, experience 15%, role_title 15%).
    """
    resume = "Senior Python Engineer experienced in FastAPI, SQL, Docker, and AWS."
    job = "Senior Python Developer needed with FastAPI, SQL, Docker, and AWS skills."

    result = engine.calculate_v2_match_score(
        resume_text=resume,
        job_description=job,
        candidate_role="Senior Python Engineer",
        candidate_experience="Senior",
        job_title="Senior Python Developer",
        job_experience="Senior"
    )

    assert "match_percentage" in result
    assert "breakdown" in result
    assert "weights" in result
    assert "explanation" in result

    bd = result["breakdown"]
    assert bd["skills"] >= 0.0 and bd["skills"] <= 100.0
    assert bd["content"] >= 0.0 and bd["content"] <= 100.0
    assert bd["experience"] == 100.0
    assert bd["role_title"] >= 70.0

    w = result["weights"]
    assert w["skills"] == 0.40
    assert w["content"] == 0.30
    assert w["experience"] == 0.15
    assert w["role_title"] == 0.15

    assert "explanation" in result
    assert "%" in result["explanation"]


def test_v2_experience_scoring(engine):
    """
    MATCHING ENGINE V2 (P3-02):
    Verify candidate vs job experience level alignment calculations.
    """
    assert engine.calculate_experience_score("Senior", "Senior") == 100.0
    assert engine.calculate_experience_score("Senior", "Mid-Level") == 90.0
    assert engine.calculate_experience_score("Junior", "Senior") <= 40.0
    assert engine.calculate_experience_score(None, "Senior") == 75.0  # Neutral fallback


def test_v2_role_title_scoring(engine):
    """
    MATCHING ENGINE V2 (P3-02):
    Verify candidate role vs job title alignment calculations.
    """
    assert engine.calculate_role_title_score("Python Developer", "Python Developer") == 100.0
    assert engine.calculate_role_title_score("Python Engineer", "Senior Python Developer") >= 70.0
    assert engine.calculate_role_title_score("Graphic Designer", "Python Developer") <= 40.0
    assert engine.calculate_role_title_score(None, "Python Developer") == 75.0


def test_v2_score_bounds_and_safety(engine):
    """
    MATCHING ENGINE V2 (P3-02):
    Verify scores are strictly bounded 0 <= score <= 100 with zero NaN or Inf.
    """
    test_cases = [
        ("", ""),
        ("   ", "   "),
        ("Python", "Python"),
        ("a" * 5000, "b" * 5000),
        ("!@#$%^&*", "!@#$%^&*")
    ]
    for r, j in test_cases:
        res = engine.calculate_v2_match_score(r, j)
        score = res["match_percentage"]
        assert isinstance(score, float)
        assert not math.isnan(score)
        assert not math.isinf(score)
        assert 0.0 <= score <= 100.0


def test_v2_match_api_endpoint_integration(client, test_user, seed_test_jobs):
    """
    MATCHING ENGINE V2 (P3-02):
    Test POST /match endpoint returns V2 breakdown schema and explanation.
    """
    payload = {
        "job_id": seed_test_jobs[0].id,
        "resume_text": "Senior Python Developer with FastAPI and PostgreSQL expertise."
    }
    response = client.post("/match", data=payload, headers=test_user["headers"])
    assert response.status_code == 200
    data = response.json()

    assert "match_percentage" in data
    assert "breakdown" in data
    assert "weights" in data
    assert "explanation" in data
    assert "matched_skills" in data
    assert "missing_skills" in data
    assert "tailoring_advice" in data

    assert data["breakdown"]["skills"] >= 0.0
    assert data["weights"]["skills"] == 0.40
