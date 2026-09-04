from sqlalchemy.orm import Session
from app.database import SessionLocal, init_db
from app.models.models import Job
from datetime import datetime

def seed_jobs():
    init_db()
    db = SessionLocal()
    
    # Mock data from job_service.py
    mock_jobs = [
        {
            "title": "Senior Python Developer",
            "company": "TechCorp",
            "location": "New York, NY",
            "description": "We are seeking a Senior Python Developer with strong backend architecture expertise. You will design, build, and optimize high-throughput REST APIs and microservices using FastAPI, SQLAlchemy, PostgreSQL, Redis, and AWS cloud infrastructure. Experience with Docker and CI/CD pipelines is highly valued.",
            "remote_status": "Remote",
            "experience_level": "Senior",
            "skills_required": "Python, FastAPI, PostgreSQL, AWS, Docker, Redis",
            "salary_range": "$140k - $180k",
            "posted_at": datetime.now()
        },
        {
            "title": "Full Stack Engineer",
            "company": "ScaleVanguard",
            "location": "San Francisco, CA",
            "description": "Join our product engineering team building high-performance web applications. You will deliver responsive user interfaces using React, TypeScript, and Tailwind CSS while building reliable backend endpoints with Node.js, Express, and PostgreSQL.",
            "remote_status": "Hybrid",
            "experience_level": "Mid-Level",
            "skills_required": "React, TypeScript, Node.js, PostgreSQL, Tailwind CSS, REST APIs",
            "salary_range": "$125k - $160k",
            "posted_at": datetime.now()
        },
        {
            "title": "React Frontend Engineer",
            "company": "DesignSync",
            "location": "San Francisco, CA",
            "description": "Join our design engineering team to craft delightful user interfaces with React, modern JavaScript, Tailwind CSS, and Framer Motion. You will collaborate closely with product designers to implement pixel-perfect design systems and optimize web performance.",
            "remote_status": "Hybrid",
            "experience_level": "Mid-Level",
            "skills_required": "React, Tailwind, CSS, JavaScript, HTML, TypeScript",
            "salary_range": "$115k - $145k",
            "posted_at": datetime.now()
        },
        {
            "title": "Data Scientist & Machine Learning Engineer",
            "company": "DataInsights AI",
            "location": "Boston, MA",
            "description": "Looking for a Data Scientist to build, evaluate, and deploy NLP and predictive machine learning models. You will leverage Python, scikit-learn, PyTorch, pandas, and spaCy to turn unstructured text and telemetry into actionable product intelligence.",
            "remote_status": "Remote",
            "experience_level": "Senior",
            "skills_required": "Python, scikit-learn, PyTorch, NLP, pandas, SQL, spaCy",
            "salary_range": "$135k - $175k",
            "posted_at": datetime.now()
        },
        {
            "title": "DevOps & Cloud Infrastructure Engineer",
            "company": "CloudNative Solutions",
            "location": "Austin, TX",
            "description": "Lead our cloud infrastructure automation and deployment reliability. You will manage Kubernetes clusters, automate infrastructure with Terraform, maintain AWS services, and configure GitLab CI/CD pipelines with Prometheus monitoring.",
            "remote_status": "Remote",
            "experience_level": "Senior",
            "skills_required": "Kubernetes, Docker, Terraform, AWS, Linux, CI/CD, Python",
            "salary_range": "$130k - $170k",
            "posted_at": datetime.now()
        },
        {
            "title": "Junior Software Developer",
            "company": "NextGen Labs",
            "location": "Chicago, IL",
            "description": "Excellent entry-level opportunity for a passionate junior developer. You will collaborate on core features, write unit tests, debug issues, and learn modern full-stack development using Python, JavaScript, Git, and SQL databases.",
            "remote_status": "Hybrid",
            "experience_level": "Junior",
            "skills_required": "Python, JavaScript, Git, SQL, HTML, CSS",
            "salary_range": "$75k - $95k",
            "posted_at": datetime.now()
        },
        {
            "title": "Backend Go Developer",
            "company": "StreamHub Systems",
            "location": "Seattle, WA",
            "description": "Build high-concurrency microservices and real-time streaming backends in Go. You will work with Kafka, gRPC, PostgreSQL, Docker, and distributed caching to power low-latency data pipelines.",
            "remote_status": "Remote",
            "experience_level": "Mid-Level",
            "skills_required": "Go, Docker, Linux, PostgreSQL, Kafka, gRPC",
            "salary_range": "$120k - $155k",
            "posted_at": datetime.now()
        },
        {
            "title": "Mobile App Developer (React Native / iOS)",
            "company": "AppFlow Media",
            "location": "Los Angeles, CA",
            "description": "Create cross-platform mobile apps using React Native and TypeScript. You will implement native modules, optimize animations, integrate RESTful APIs, and manage Apple App Store and Google Play deployments.",
            "remote_status": "Remote",
            "experience_level": "Mid-Level",
            "skills_required": "React Native, TypeScript, JavaScript, iOS, Android, REST APIs",
            "salary_range": "$110k - $145k",
            "posted_at": datetime.now()
        },
        {
            "title": "Data Engineer",
            "company": "OmniMetrics",
            "location": "Denver, CO",
            "description": "Architect scalable data pipelines, ETL workflows, and data warehouse models using Apache Spark, Snowflake, Airflow, and Python. Experience with SQL query optimization and cloud storage is required.",
            "remote_status": "Remote",
            "experience_level": "Senior",
            "skills_required": "Python, SQL, Apache Spark, Snowflake, Airflow, AWS",
            "salary_range": "$130k - $165k",
            "posted_at": datetime.now()
        },
        {
            "title": "Cybersecurity & AppSec Engineer",
            "company": "ShieldGuard Security",
            "location": "Washington, DC",
            "description": "Protect our cloud applications and infrastructure against vulnerabilities. You will perform threat modeling, vulnerability scanning, code security audits (OWASP Top 10), and automate security monitoring in AWS.",
            "remote_status": "Hybrid",
            "experience_level": "Senior",
            "skills_required": "Security, Linux, Python, AWS, OWASP, Docker, Network Security",
            "salary_range": "$140k - $185k",
            "posted_at": datetime.now()
        },
        {
            "title": "Frontend UI/UX Engineer",
            "company": "PixelCraft Studio",
            "location": "New York, NY",
            "description": "Bridge the gap between design and engineering. You will develop component libraries in React and TypeScript, ensure accessibility (WCAG AA), and translate Figma prototypes into polished web interfaces.",
            "remote_status": "On-site",
            "experience_level": "Mid-Level",
            "skills_required": "React, TypeScript, CSS, HTML, Figma, UI/UX, Accessibility",
            "salary_range": "$105k - $135k",
            "posted_at": datetime.now()
        },
        {
            "title": "Junior QA Automation Engineer",
            "company": "QualityFirst",
            "location": "Atlanta, GA",
            "description": "Join our quality assurance team to write automated end-to-end and regression tests. You will learn and use Python, Playwright/Selenium, Postman API testing, and Git.",
            "remote_status": "Hybrid",
            "experience_level": "Junior",
            "skills_required": "Python, Selenium, Git, REST APIs, QA, Testing",
            "salary_range": "$70k - $90k",
            "posted_at": datetime.now()
        }
    ]

    for job_data in mock_jobs:
        # Check if already exists to avoid duplicates
        existing = db.query(Job).filter(Job.title == job_data["title"], Job.company == job_data["company"]).first()
        if not existing:
            job = Job(**job_data)
            db.add(job)
    
    db.commit()
    db.close()
    print("Database seeded with mock jobs!")

if __name__ == "__main__":
    seed_jobs()
