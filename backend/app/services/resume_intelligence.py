import re
import math
from typing import List, Dict, Any, Optional
from app.services.matching_engine import MatchingEngine

engine = MatchingEngine()

DOMAIN_MAP = {
    "programming_languages": {
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin"
    },
    "frontend": {
        "react", "vue", "angular", "next.js", "html", "css", "tailwind", "sass", "bootstrap", "figma", "framer motion"
    },
    "backend": {
        "node.js", "express", "fastapi", "flask", "django", "laravel", "spring", "rest api", "graphql", "grpc", "microservices", "serverless"
    },
    "databases": {
        "postgresql", "mysql", "mongodb", "redis", "dynamodb", "sqlite", "oracle", "mssql"
    },
    "cloud_devops": {
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ansible", "ci/cd", "linux", "bash", "git"
    },
    "data_ai": {
        "machine learning", "deep learning", "nlp", "data science", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy"
    }
}


class ResumeIntelligenceService:
    def analyze_resume_health(self, resume_text: Optional[str]) -> Dict[str, Any]:
        """
        Analyze uploaded resume content and generate deterministic ATS health score (0-100),
        section completeness, contact checks, domain skill categorization, and recommendations.
        """
        if not resume_text or not resume_text.strip():
            return {
                "health_score": 0.0,
                "classification": "Poor",
                "breakdown": {
                    "completeness": 0.0,
                    "ats_health": 0.0,
                    "contact_information": 0.0,
                    "skills": 0.0
                },
                "sections_detected": [],
                "contact_checks": {
                    "email": False,
                    "phone": False,
                    "linkedin": False,
                    "github": False,
                    "portfolio": False
                },
                "skill_domains": {
                    "programming_languages": [],
                    "frontend": [],
                    "backend": [],
                    "databases": [],
                    "cloud_devops": [],
                    "data_ai": [],
                    "other": []
                },
                "recommendations": [
                    "Upload a resume file to generate an ATS health check report."
                ]
            }

        text = resume_text.strip()
        text_lower = text.lower()

        # 1. Section Completeness Analysis (35% Weight)
        sections_map = {
            "summary": ["summary", "profile", "about me", "objective", "executive summary"],
            "skills": ["skills", "technologies", "proficiencies", "technical skills", "competencies"],
            "experience": ["experience", "work history", "employment", "work experience", "professional experience"],
            "education": ["education", "academic", "university", "college", "degree"],
            "projects": ["projects", "personal projects", "portfolio projects"],
            "certifications": ["certifications", "licenses", "certificates", "certified"]
        }

        detected_sections = []
        for sec, keywords in sections_map.items():
            if any(re.search(r'\b' + re.escape(kw) + r'\b', text_lower) for kw in keywords):
                detected_sections.append(sec)

        completeness_score = round(min(100.0, (len(detected_sections) / 5.0) * 100.0), 2)

        # 2. ATS & Text Health Analysis (30% Weight)
        char_count = len(text)
        ats_score = 100.0
        ats_penalties = []

        if char_count < 200:
            ats_score -= 50.0
            ats_penalties.append("Resume content is unusually short (under 200 characters).")
        elif char_count < 500:
            ats_score -= 25.0
            ats_penalties.append("Resume is somewhat brief. Consider expanding your work descriptions.")
        elif char_count > 20000:
            ats_score -= 20.0
            ats_penalties.append("Resume is unusually long. ATS systems prefer 1-2 pages.")

        # Check special character noise ratio
        non_alphanumeric = len(re.findall(r'[^a-zA-Z0-9\s]', text))
        noise_ratio = non_alphanumeric / max(1, char_count)
        if noise_ratio > 0.15:
            ats_score -= 20.0
            ats_penalties.append("Resume contains excessive special characters that may confuse ATS parsers.")

        ats_health_score = round(min(100.0, max(0.0, ats_score)), 2)

        # 3. Contact Information Checks (15% Weight)
        has_email = bool(re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text))
        has_phone = bool(re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text))
        has_linkedin = bool(re.search(r'linkedin\.com/in/[a-zA-Z0-9_-]+', text_lower) or "linkedin" in text_lower)
        has_github = bool(re.search(r'github\.com/[a-zA-Z0-9_-]+', text_lower) or "github" in text_lower)
        has_portfolio = bool(re.search(r'(portfolio|website|http|https)', text_lower))

        contact_checks = {
            "email": has_email,
            "phone": has_phone,
            "linkedin": has_linkedin,
            "github": has_github,
            "portfolio": has_portfolio
        }

        contact_points = sum([has_email * 30, has_phone * 30, has_linkedin * 20, (has_github or has_portfolio) * 20])
        contact_health_score = round(min(100.0, max(0.0, float(contact_points))), 2)

        # 4. Technical Skill Intelligence & Categorization (20% Weight)
        extracted_skills = engine.extract_skills(text)
        skill_domains = {
            "programming_languages": [],
            "frontend": [],
            "backend": [],
            "databases": [],
            "cloud_devops": [],
            "data_ai": [],
            "other": []
        }

        for skill in extracted_skills:
            categorized = False
            for dom, skill_set in DOMAIN_MAP.items():
                if skill in skill_set:
                    skill_domains[dom].append(skill)
                    categorized = True
                    break
            if not categorized:
                skill_domains["other"].append(skill)

        if len(extracted_skills) >= 8:
            skills_health_score = 100.0
        elif len(extracted_skills) >= 4:
            skills_health_score = 75.0
        elif len(extracted_skills) >= 1:
            skills_health_score = 50.0
        else:
            skills_health_score = 20.0

        # 5. Weighted Overall Health Score
        raw_health = (completeness_score * 0.35) + (ats_health_score * 0.30) + (contact_health_score * 0.15) + (skills_health_score * 0.20)
        overall_health = round(min(100.0, max(0.0, raw_health)), 1)

        if math.isnan(overall_health) or math.isinf(overall_health):
            overall_health = 0.0

        # Classification
        if overall_health >= 90.0:
            classification = "Excellent"
        elif overall_health >= 75.0:
            classification = "Strong"
        elif overall_health >= 60.0:
            classification = "Fair"
        elif overall_health >= 40.0:
            classification = "Needs Improvement"
        else:
            classification = "Poor"

        # Actionable Recommendations
        recommendations = []
        if "summary" not in detected_sections:
            recommendations.append("Add a professional summary or profile header to outline your career goals.")
        if "experience" not in detected_sections:
            recommendations.append("Add a dedicated Work Experience section with bulleted achievements.")
        if "skills" not in detected_sections:
            recommendations.append("Include an explicit Technical Skills section for better ATS indexing.")
        if not has_email:
            recommendations.append("Ensure your email address is clearly visible at the top of your resume.")
        if not has_linkedin:
            recommendations.append("Include your LinkedIn profile link to improve recruiter verification.")
        if not has_github:
            recommendations.append("Add a GitHub profile link to showcase your code repositories.")
        if len(extracted_skills) < 5:
            recommendations.append("List relevant tools, frameworks, and programming languages to boost skill matching.")

        recommendations.extend(ats_penalties)

        if not recommendations:
            recommendations.append("Your resume text structure is healthy, complete, and ATS-friendly!")

        return {
            "health_score": overall_health,
            "classification": classification,
            "breakdown": {
                "completeness": completeness_score,
                "ats_health": ats_health_score,
                "contact_information": contact_health_score,
                "skills": skills_health_score
            },
            "sections_detected": detected_sections,
            "contact_checks": contact_checks,
            "skill_domains": skill_domains,
            "recommendations": recommendations
        }


resume_intelligence_service = ResumeIntelligenceService()
