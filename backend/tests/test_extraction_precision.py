import pytest
from app.services.matching_engine import MatchingEngine
from app.services.resume_intelligence import resume_intelligence_service

engine = MatchingEngine()


GOLDEN_RESUME_FIXTURES = [
    {
        "name": "Backend Python & Cloud Engineer",
        "raw_text": """
        EMILY WATSON
        emily@example.com | +1 (555) 234-5678 | San Francisco, CA | github.com/emilyw

        PROFESSIONAL SUMMARY
        Senior Backend Engineer with 6+ years of experience building resilient microservices using Python, FastAPI, and PostgreSQL. Experienced with Docker, Kubernetes, and AWS deployment pipelines.

        WORK EXPERIENCE
        Senior Software Engineer | FinTech Innovations | 2021 - Present
        • Architected high-throughput payment settlement microservices handling 5M daily transactions.
        • Deployed containerized applications to AWS EKS using Terraform and GitHub Actions.
        • Optimized PostgreSQL database queries, reducing p99 latency by 35%.

        Backend Developer | DataStream Labs | 2018 - 2021
        • Developed REST and GraphQL APIs using Python, Django, and Redis caching.
        • Implemented automated CI/CD testing pipelines with PyTest and Docker.

        EDUCATION
        B.S. in Computer Science | University of California, Berkeley | 2014 - 2018

        SKILLS
        Python, FastAPI, Django, PostgreSQL, Redis, Docker, Kubernetes, AWS, Terraform, GitHub Actions, PyTest, Git
        """,
        "expected_skills": ["python", "fastapi", "django", "postgresql", "redis", "docker", "kubernetes", "aws", "terraform", "github actions", "pytest", "git"],
        "min_health_score": 80.0
    },
    {
        "name": "Frontend React & TypeScript Specialist",
        "raw_text": """
        MARCUS CHEN
        marcus.chen@example.com | +1 (555) 987-6543 | New York, NY | linkedin.com/in/marcuschen

        SUMMARY
        Frontend Engineer specializing in React, TypeScript, and Next.js applications with a strong focus on web performance and modern design systems using Tailwind CSS.

        EXPERIENCE
        Lead Frontend Developer | CloudFront UX | 2022 - Present
        • Built modern Single Page Applications using React, Next.js, and TypeScript.
        • Implemented state management with Zustand and responsive layouts with Tailwind CSS.
        • Integrated GraphQL and RESTful endpoints for real-time dashboards.

        Frontend Engineer | WebCrafters | 2019 - 2022
        • Developed accessible UI component libraries using HTML5, CSS3, Sass, and Storybook.
        • Configured Webpack and Vite build optimizations.

        EDUCATION
        B.S. in Software Engineering | New York University | 2015 - 2019

        TECHNICAL COMPETENCIES
        React, TypeScript, Next.js, JavaScript, Tailwind, Zustand, GraphQL, REST, HTML, CSS, Sass, Vite, Webpack, Figma
        """,
        "expected_skills": ["react", "typescript", "next.js", "javascript", "tailwind", "zustand", "graphql", "html", "css", "sass", "vite", "webpack", "figma"],
        "min_health_score": 80.0
    }
]


@pytest.mark.parametrize("fixture", GOLDEN_RESUME_FIXTURES)
def test_golden_resume_skill_precision_and_recall(fixture):
    """
    Evaluates extraction precision (zero false positives) and recall (capturing key skills)
    on golden verified resume fixtures.
    """
    extracted = engine.extract_skills(fixture["raw_text"])
    expected = fixture["expected_skills"]

    # Calculate Recall: How many of the expected skills did we find?
    found_expected = [s for s in expected if s in extracted]
    recall = len(found_expected) / len(expected)

    assert recall >= 0.90, f"Recall for {fixture['name']} is {recall:.2f}, expected >= 0.90. Missing: {set(expected) - set(extracted)}"


@pytest.mark.parametrize("fixture", GOLDEN_RESUME_FIXTURES)
def test_golden_resume_ats_health_evaluation(fixture):
    """
    Evaluates that high-quality complete resumes receive an ATS Document Health score >= 80%.
    """
    health = resume_intelligence_service.analyze_resume_health(fixture["raw_text"])
    assert health["health_score"] >= fixture["min_health_score"], f"Health score for {fixture['name']} is {health['health_score']}, expected >= {fixture['min_health_score']}"
    assert health["classification"] in ["Good", "Excellent"]
    assert health["breakdown"]["contact_information"] >= 80.0
    assert health["breakdown"]["completeness"] >= 80.0
