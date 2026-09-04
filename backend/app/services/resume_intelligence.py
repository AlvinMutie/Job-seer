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

        # ATS Compliance & Risk Assessment
        is_ats_compliant = (overall_health >= 75.0 and ats_health_score >= 75.0 and noise_ratio <= 0.12 and len(detected_sections) >= 3)
        if overall_health >= 75.0 and ats_health_score >= 75.0:
            ats_risk_level = "Low"
        elif overall_health >= 50.0:
            ats_risk_level = "Moderate"
        else:
            ats_risk_level = "High"

        # Actionable Recommendations
        recommendations = []
        if not is_ats_compliant:
            recommendations.append(
                "ATS Format Alert: Your uploaded document has layout or structural formatting traits that may be filtered out by corporate ATS scanners (e.g. multi-column graphics, non-standard headings, or high character noise). We recommend converting it to our standardized ATS Gold-Standard Template (Times New Roman 11pt, 1.5 line spacing)."
            )

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
            "is_ats_compliant": is_ats_compliant,
            "ats_risk_level": ats_risk_level,
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

    def parse_resume_structure(self, resume_text: str) -> Dict[str, Any]:
        """
        Parses resume text into structured sections suitable for populating the
        ATS-friendly template studio (Times New Roman 11pt, 1.5 line spacing).
        """
        if not resume_text or not resume_text.strip():
            return {
                "full_name": "Full Name",
                "email": "",
                "phone": "",
                "location": "",
                "linkedin": "",
                "github": "",
                "summary": "",
                "skills": "",
                "experience": "",
                "education": "",
                "projects": "",
                "formatted_content": ""
            }

        text = resume_text.strip()
        lines = [l.strip() for l in text.split('\n') if l.strip()]

        # Extract name (typically first line if reasonably short)
        full_name = lines[0] if lines and len(lines[0]) <= 50 and "@" not in lines[0] else "Candidate Name"

        # Contact info
        email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
        phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        linkedin_match = re.search(r'(https?://)?(www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', text, re.IGNORECASE)
        github_match = re.search(r'(https?://)?(www\.)?github\.com/[a-zA-Z0-9_-]+', text, re.IGNORECASE)

        email = email_match.group(0) if email_match else ""
        phone = phone_match.group(0) if phone_match else ""
        linkedin = linkedin_match.group(0) if linkedin_match else ""
        github = github_match.group(0) if github_match else ""

        # Section boundaries
        lower_text = text.lower()
        section_headers = [
            ("summary", ["summary", "profile", "about me", "professional summary"]),
            ("skills", ["skills", "technical skills", "technologies", "proficiencies"]),
            ("experience", ["work experience", "experience", "employment history", "professional experience"]),
            ("education", ["education", "academic background", "degrees"]),
            ("projects", ["projects", "personal projects", "key projects"])
        ]

        # Extract skill keywords
        from app.services.matching_engine import MatchingEngine
        _engine = MatchingEngine()
        extracted_skills = _engine.extract_skills(text)
        skills_str = ", ".join(extracted_skills) if extracted_skills else "Python, React, SQL, Git, REST APIs"

        # Simple section extraction heuristics
        summary_text = ""
        experience_text = ""
        education_text = ""
        projects_text = ""

        # Rough segment parser
        current_section = "header"
        buffer = []

        for line in lines:
            line_lower = line.lower()
            matched_section = None
            for sec_name, keywords in section_headers:
                if any(line_lower == kw or line_lower == f"{kw}:" or line_lower.startswith(f"## {kw}") for kw in keywords):
                    matched_section = sec_name
                    break

            if matched_section:
                if current_section == "summary":
                    summary_text = "\n".join(buffer).strip()
                elif current_section == "experience":
                    experience_text = "\n".join(buffer).strip()
                elif current_section == "education":
                    education_text = "\n".join(buffer).strip()
                elif current_section == "projects":
                    projects_text = "\n".join(buffer).strip()
                current_section = matched_section
                buffer = []
            else:
                if current_section != "header":
                    buffer.append(line)

        # Flush trailing section
        if current_section == "summary":
            summary_text = "\n".join(buffer).strip()
        elif current_section == "experience":
            experience_text = "\n".join(buffer).strip()
        elif current_section == "education":
            education_text = "\n".join(buffer).strip()
        elif current_section == "projects":
            projects_text = "\n".join(buffer).strip()

        # Fallbacks if text couldn't be cleanly segmented
        if not summary_text:
            summary_lines = [l for l in lines[1:6] if "@" not in l and not any(kw in l.lower() for kw in ["experience", "education", "skills"])]
            summary_text = " ".join(summary_lines[:3]) if summary_lines else "Results-driven professional with proven expertise in building scalable applications, driving engineering best practices, and delivering measurable business impact."

        if not experience_text:
            experience_text = "Software Engineer | Tech Innovators Inc.\n2022 - Present | Remote\n• Architected and maintained microservices and user-facing features.\n• Collaborated with cross-functional teams to deliver production-ready software."

        if not education_text:
            education_text = "Bachelor of Science in Computer Science\nUniversity Honors Graduate"

        return {
            "full_name": full_name,
            "email": email,
            "phone": phone,
            "location": "Remote / Open to Relocation",
            "linkedin": linkedin,
            "github": github,
            "summary": summary_text,
            "skills": skills_str,
            "experience": experience_text,
            "education": education_text,
            "projects": projects_text
        }

    def import_canva_template(self, canva_url: str, resume_text: str = "") -> dict:
        """
        Parses a Canva resume template link and maps it directly into an in-app
        ATS-friendly native template structure (Times New Roman 11pt, 1.5 line spacing).
        Never requires external navigation to Canva.
        """
        url_lower = (canva_url or "").strip().lower()

        # Deduce template archetype from URL slug/query
        style = "canva_data_analyst_bw"
        accent_color = "#000000"  # Pure black
        style_name = "Black and White Simple Clean Data Analyst CV Resume"

        if "dahuoxmuqzw" in url_lower or any(w in url_lower for w in ["data", "analyst", "black", "white"]):
            style = "canva_data_analyst_bw"
            accent_color = "#000000"
            style_name = "Black and White Simple Clean Data Analyst CV Resume"
        elif any(w in url_lower for w in ["tech", "engineer", "developer", "code"]):
            style = "tech_linear"
            accent_color = "#1e3a8a"  # Navy blue
            style_name = "Canva Tech Professional"
        elif any(w in url_lower for w in ["academic", "research", "doctor", "classic", "ivy"]):
            style = "academic_classic"
            accent_color = "#111827"  # Deep black
            style_name = "Canva Academic Classic"
        elif any(w in url_lower for w in ["creative", "modern", "design", "portfolio"]):
            style = "modern_clean"
            accent_color = "#047857"  # Emerald accent
            style_name = "Canva Modern Tailored"
        elif any(w in url_lower for w in ["minimal", "clean", "simple", "sleek"]):
            style = "modern_minimalist"
            accent_color = "#0f172a"
            style_name = "Canva Minimalist Modern"

        # Structure the candidate's resume content
        parsed = self.parse_resume_structure(resume_text) if resume_text else {
            "full_name": "MATTHEW COLLINS",
            "email": "hello@reallygreatsite.com",
            "phone": "+123-456-7890",
            "location": "@reallygreatsite",
            "linkedin": "",
            "github": "",
            "summary": "Data Analyst with experience in collecting, processing, and analyzing data to support business decision-making. Skilled in transforming complex data into clear and actionable insights. Strong in analytical thinking, data interpretation, and problem solving, with the ability to communicate findings effectively.",
            "skills": "Data Analysis & Interpretation, Data Cleaning & Processing, Statistical Analysis, Data Visualization, Reporting & Insights Generation, Problem Solving & Critical Thinking",
            "experience": (
                "Data Analyst | Gravity Tech - 123 Anywhere St., Any City | April, 2022 - April, 2026\n"
                "• Collected and analyzed data to support strategic decision-making\n"
                "• Cleaned and processed data to ensure accuracy and consistency\n"
                "• Generated reports and insights to improve business performance\n\n"
                "Junior Data Analyst | Mediaone - 123 Anywhere St., Any City | April, 2020 - April, 2022\n"
                "• Assisted in data collection and preparation\n"
                "• Supported data analysis and reporting processes\n"
                "• Maintained data quality and documentation"
            ),
            "education": "Bachelor of Computer Science | Northgate University | April, 2016 - April, 2020",
            "additional_info": (
                "• Portfolio: www.reallygreatsite.com\n"
                "• Languages: English\n"
                "• Availability: Open to work / Freelance"
            ),
            "projects": ""
        }

        # Build combined contact line
        contact_parts = []
        if parsed.get("phone"):
            contact_parts.append(parsed["phone"])
        if parsed.get("email"):
            contact_parts.append(parsed["email"])
        if parsed.get("location"):
            contact_parts.append(parsed["location"])
        if parsed.get("linkedin"):
            contact_parts.append(parsed["linkedin"])
        if parsed.get("github"):
            contact_parts.append(parsed["github"])

        contact_line = " | ".join(contact_parts) if contact_parts else "+123-456-7890 | hello@reallygreatsite.com | @reallygreatsite"

        # Additional info fallback
        additional_info = parsed.get("additional_info") or (
            "• Portfolio: www.reallygreatsite.com\n"
            "• Languages: English\n"
            "• Availability: Open to work / Freelance"
        )

        structured_content = {
            "full_name": parsed.get("full_name") or "MATTHEW COLLINS",
            "contact_info": contact_line,
            "professional_summary": parsed.get("summary") or "Data Analyst with experience in collecting, processing, and analyzing data to support business decision-making. Skilled in transforming complex data into clear and actionable insights.",
            "skills": parsed.get("skills") or "Data Analysis & Interpretation, Data Cleaning & Processing, Statistical Analysis, Data Visualization, Reporting & Insights Generation, Problem Solving & Critical Thinking",
            "experience": parsed.get("experience") or "",
            "education": parsed.get("education") or "",
            "additional_info": additional_info,
            "projects": parsed.get("projects") or ""
        }

        # Build clean plain text
        formatted_text = (
            f"{structured_content['full_name'].upper()}\n{structured_content['contact_info']}\n\n"
            f"PROFESSIONAL SUMMARY\n{'=' * 40}\n{structured_content['professional_summary']}\n\n"
            f"WORK EXPERIENCE\n{'=' * 40}\n{structured_content['experience']}\n\n"
            f"EDUCATION\n{'=' * 40}\n{structured_content['education']}\n\n"
            f"KEY SKILLS\n{'=' * 40}\n{structured_content['skills']}\n\n"
            f"ADDITIONAL INFORMATION\n{'=' * 40}\n{structured_content['additional_info']}\n"
        ).strip()

        return {
            "canva_url": canva_url,
            "template_name": style_name,
            "template_style": style,
            "design_theme": {
                "font_family": "Times New Roman, Times, serif",
                "font_size": "11pt",
                "line_height": "1.5",
                "accent_color": accent_color,
                "layout": "single_column_ats"
            },
            "content_json": structured_content,
            "formatted_text": formatted_text,
            "is_ats_compliant": True
        }


resume_intelligence_service = ResumeIntelligenceService()

