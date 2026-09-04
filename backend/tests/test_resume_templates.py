import pytest
from app.services.resume_intelligence import resume_intelligence_service
from app.models.models import SavedResumeTemplate

pytestmark = [pytest.mark.integration]


def test_ats_compliance_detection():
    # Healthy, well-rounded resume
    healthy_resume = """
    Jane Doe
    jane.doe@example.com | (555) 123-4567 | San Francisco, CA
    linkedin.com/in/janedoe | github.com/janedoe

    PROFESSIONAL SUMMARY
    Senior Software Engineer with 7 years of experience architecting high-performance web systems and microservices.

    TECHNICAL SKILLS
    Languages: Python, JavaScript, TypeScript, Go, SQL
    Frameworks: FastAPI, React, Node.js, Express, Tailwind CSS
    Infrastructure: Docker, Kubernetes, AWS, PostgreSQL, Redis, CI/CD

    WORK EXPERIENCE
    Lead Backend Engineer | CloudScale Inc.
    2021 - Present | San Francisco, CA
    • Architected scalable RESTful microservices handling 2M requests per day.
    • Improved database query performance by 45% using indexed PostgreSQL schemas and Redis caching.

    Software Engineer | DataFlow Systems
    2018 - 2021 | Austin, TX
    • Developed full-stack features using Python, FastAPI, and React.

    EDUCATION
    Bachelor of Science in Computer Science | University of California, Berkeley
    """
    res = resume_intelligence_service.analyze_resume_health(healthy_resume)
    assert res["health_score"] >= 75.0
    assert res["is_ats_compliant"] is True
    assert res["ats_risk_level"] == "Low"

    # Non-compliant resume (lacks standard headers, very short, noisy layout)
    noisy_resume = "Just some text with >>> random <<< symbols $$$ and no clear sections."
    res_noisy = resume_intelligence_service.analyze_resume_health(noisy_resume)
    assert res_noisy["is_ats_compliant"] is False
    assert res_noisy["ats_risk_level"] in ("Moderate", "High")
    assert any("ATS Format Alert" in rec for rec in res_noisy["recommendations"])


def test_parse_resume_structure():
    sample_text = """
    John Smith
    john.smith@tech.io | (555) 987-6543 | New York, NY
    linkedin.com/in/johnsmith

    Summary
    Full Stack Developer specializing in React, TypeScript, and FastAPI.

    Technical Skills
    React, Python, TypeScript, Docker, SQL

    Experience
    Senior Developer | Alpha Corp
    2020 - Present
    • Built responsive web applications.

    Education
    B.S. in Software Engineering | NYU
    """
    struct = resume_intelligence_service.parse_resume_structure(sample_text)
    assert struct["full_name"] == "John Smith"
    assert "john.smith@tech.io" in struct["email"]
    assert "react" in struct["skills"].lower()
    assert len(struct["summary"]) > 0
    assert len(struct["experience"]) > 0
    assert len(struct["education"]) > 0


def test_template_endpoints_unauthenticated(client):
    assert client.get("/resume/templates").status_code == 401
    assert client.post("/resume/templates", json={"name": "Test"}).status_code == 401
    assert client.post("/resume/format-structure").status_code == 401


def test_template_crud_lifecycle(client, test_user, db_session):
    token = test_user["token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create a template draft
    payload = {
        "name": "Executive Times New Roman 11pt",
        "template_style": "executive_serif",
        "canva_reference_url": "https://www.canva.com/design/DAF12345/view",
        "content_json": '{"full_name": "John Doe", "summary": "Experienced Lead"}',
        "formatted_text": "John Doe\nSummary\nExperienced Lead"
    }
    create_res = client.post("/resume/templates", json=payload, headers=headers)
    assert create_res.status_code == 200
    created = create_res.json()
    template_id = created["id"]
    assert created["name"] == "Executive Times New Roman 11pt"
    assert created["template_style"] == "executive_serif"
    assert created["canva_reference_url"] == "https://www.canva.com/design/DAF12345/view"

    # 2. List templates
    list_res = client.get("/resume/templates", headers=headers)
    assert list_res.status_code == 200
    templates = list_res.json()
    assert len(templates) >= 1
    assert any(t["id"] == template_id for t in templates)

    # 3. Update template
    update_res = client.put(
        f"/resume/templates/{template_id}",
        json={"name": "Executive Times New Roman 11pt (Updated)"},
        headers=headers
    )
    assert update_res.status_code == 200
    assert update_res.json()["name"] == "Executive Times New Roman 11pt (Updated)"

    # 4. Delete template
    del_res = client.delete(f"/resume/templates/{template_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify deleted
    assert db_session.query(SavedResumeTemplate).filter(SavedResumeTemplate.id == template_id).first() is None
