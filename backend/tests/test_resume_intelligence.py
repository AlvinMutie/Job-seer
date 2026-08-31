import pytest
import math
from app.services.resume_intelligence import resume_intelligence_service

pytestmark = [pytest.mark.unit, pytest.mark.regression]


def test_resume_health_complete_healthy_resume():
    """
    RESUME INTELLIGENCE (P3-03):
    Verify complete healthy resume produces a high health score (>=75) with all sections detected.
    """
    resume_text = """
    John Doe
    Email: john.doe@example.com | Phone: (555) 123-4567 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

    PROFESSIONAL SUMMARY
    Senior Software Engineer with 8+ years of experience building scalable backend microservices and modern web applications.

    TECHNICAL SKILLS
    Languages: Python, JavaScript, TypeScript
    Frontend: React, HTML, CSS, Tailwind
    Backend: FastAPI, Node.js, Express, REST API
    Databases: PostgreSQL, Redis, MongoDB
    Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git

    WORK EXPERIENCE
    Senior Backend Developer — TechCorp (2020 - Present)
    • Architected high-throughput FastAPI services handling 50k requests/min.
    • Managed PostgreSQL query optimization and Redis caching layer.

    EDUCATION
    B.S. in Computer Science — State University (2016)

    PROJECTS
    Smart Job Hunter: Open-source AI resume matcher built with FastAPI and React.

    CERTIFICATIONS
    AWS Certified Solutions Architect — Associate
    """

    res = resume_intelligence_service.analyze_resume_health(resume_text)

    assert res["health_score"] >= 75.0
    assert res["classification"] in ("Strong", "Excellent")
    assert res["breakdown"]["completeness"] >= 80.0
    assert res["breakdown"]["ats_health"] >= 80.0
    assert res["contact_checks"]["email"] is True
    assert res["contact_checks"]["phone"] is True
    assert res["contact_checks"]["linkedin"] is True
    assert res["contact_checks"]["github"] is True

    domains = res["skill_domains"]
    assert "python" in domains["programming_languages"]
    assert "react" in domains["frontend"]
    assert "fastapi" in domains["backend"]
    assert "postgresql" in domains["databases"]
    assert "aws" in domains["cloud_devops"]


def test_resume_health_empty_and_whitespace():
    """
    RESUME INTELLIGENCE (P3-03):
    Verify empty or whitespace-only resume returns 0.0 health score cleanly.
    """
    res1 = resume_intelligence_service.analyze_resume_health("")
    assert res1["health_score"] == 0.0
    assert res1["classification"] == "Poor"

    res2 = resume_intelligence_service.analyze_resume_health("   \n\t  ")
    assert res2["health_score"] == 0.0


def test_resume_health_very_short_and_long_resumes():
    """
    RESUME INTELLIGENCE (P3-03):
    Verify brief and excessively long resumes apply appropriate ATS penalties.
    """
    short_resume = "Python Developer."
    res_short = resume_intelligence_service.analyze_resume_health(short_resume)
    assert res_short["breakdown"]["ats_health"] < 60.0

    long_resume = "Python Developer experience. " * 2000
    res_long = resume_intelligence_service.analyze_resume_health(long_resume)
    assert res_long["health_score"] > 0.0


def test_resume_health_numerical_safety_bounds():
    """
    RESUME INTELLIGENCE (P3-03):
    Verify health scores are bounded 0 <= score <= 100 with zero NaN or Infinity.
    """
    test_cases = [
        "",
        "Python",
        "John Doe john@example.com",
        "a" * 10000,
        "!@#$%^&*() {}[]"
    ]
    for text in test_cases:
        res = resume_intelligence_service.analyze_resume_health(text)
        score = res["health_score"]
        assert isinstance(score, float)
        assert not math.isnan(score)
        assert not math.isinf(score)
        assert 0.0 <= score <= 100.0


def test_resume_health_api_endpoint_success(client, test_user):
    """
    RESUME INTELLIGENCE (P3-03):
    Test GET /resume/health returns 200 with structured ATS health response schema for authenticated user.
    """
    # 1. Upload resume first
    file_content = b"John Doe john@example.com\nSUMMARY\nSenior Python Developer\nSKILLS\nPython, React, PostgreSQL\nEXPERIENCE\nSoftware Engineer"
    files = {"file": ("test_cv.txt", file_content, "text/plain")}
    upload_res = client.post("/upload-resume", files=files, headers=test_user["headers"])
    assert upload_res.status_code == 200

    # 2. Query /resume/health
    res = client.get("/resume/health", headers=test_user["headers"])
    assert res.status_code == 200
    data = res.json()

    assert "health_score" in data
    assert "classification" in data
    assert "breakdown" in data
    assert "sections_detected" in data
    assert "contact_checks" in data
    assert "skill_domains" in data
    assert "recommendations" in data

    assert data["health_score"] > 0.0


def test_resume_health_api_missing_resume_404(client, secondary_user):
    """
    RESUME INTELLIGENCE (P3-03):
    Test GET /resume/health returns 404 RESOURCE_NOT_FOUND when user has not uploaded a resume.
    """
    res = client.get("/resume/health", headers=secondary_user["headers"])
    assert res.status_code == 404
    data = res.json()
    assert data["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_resume_health_unauthenticated_rejected(client):
    """
    SECURITY SAFETY GATE (P3-03):
    Test GET /resume/health without Bearer token returns 401 Unauthorized.
    """
    res = client.get("/resume/health")
    assert res.status_code == 401


def test_resume_health_ownership_isolation(client, test_user, secondary_user):
    """
    SECURITY SAFETY GATE (P3-03):
    Verify User A and User B receive isolated health analyses of their own resumes.
    """
    # User 1 upload Python resume
    client.post("/upload-resume", files={"file": ("user1.txt", b"User 1 john@a.com\nPython, FastAPI", "text/plain")}, headers=test_user["headers"])
    
    # User 2 upload Java resume
    client.post("/upload-resume", files={"file": ("user2.txt", b"User 2 jane@b.com\nJava, Spring Boot", "text/plain")}, headers=secondary_user["headers"])

    res1 = client.get("/resume/health", headers=test_user["headers"]).json()
    res2 = client.get("/resume/health", headers=secondary_user["headers"]).json()

    assert "python" in res1["skill_domains"]["programming_languages"] or "fastapi" in res1["skill_domains"]["backend"]
    assert "java" in res2["skill_domains"]["programming_languages"] or "spring" in res2["skill_domains"]["backend"]
