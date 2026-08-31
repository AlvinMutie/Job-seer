import re
import math
import spacy
from typing import List, Dict, Optional, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load NLP model safely
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

# Curated technical skills dictionary for high-precision extraction
TECH_SKILLS_DB = {
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "php", "ruby", "swift", "kotlin",
    "react", "vue", "angular", "next.js", "node.js", "express", "fastapi", "flask", "django", "laravel", "spring",
    "postgresql", "mysql", "mongodb", "redis", "dynamodb", "sqlite", "oracle", "mssql",
    "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins", "ansible", "ci/cd",
    "machine learning", "deep learning", "nlp", "data science", "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy",
    "rest api", "graphql", "grpc", "microservices", "serverless",
    "html", "css", "tailwind", "sass", "bootstrap", "figma", "framer motion",
    "git", "linux", "bash", "agile", "scrum", "jira"
}

LEVEL_MAP = {
    "entry": 1, "junior": 1, "intern": 1,
    "mid": 2, "mid-level": 2, "intermediate": 2,
    "senior": 3, "sr": 3, "lead": 4, "principal": 4, "architect": 4, "head": 4, "vp": 4, "director": 4
}


class MatchingEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def normalize_spaced_text(self, text: str) -> str:
        """Detect and fix text that has been extracted with spaces between every letter."""
        if not text:
            return ""
            
        lines = text.split('\n')
        normalized_lines = []
        
        for line in lines:
            words = line.split()
            if len(words) >= 3:
                single_char_words = [w for w in words if len(w) == 1]
                if len(single_char_words) / len(words) > 0.7:
                    marker = "||"
                    line_with_marker = re.sub(r'\s{2,}', marker, line)
                    segments = line_with_marker.split(marker)
                    norm_segments = ["".join(s.split()) for s in segments]
                    normalized_lines.append(" ".join(norm_segments))
                    continue
            normalized_lines.append(line)
            
        return "\n".join(normalized_lines)

    def preprocess_text(self, text: str) -> str:
        """Basic text cleaning and normalization."""
        if not text:
            return ""
        
        text = self.normalize_spaced_text(text)
        text = text.lower()
        text = re.sub(r'[^a-z0-9\s\#\+]', ' ', text)
        
        if nlp:
            doc = nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_stop]
            return " ".join(tokens)
        return text

    def extract_skills(self, text: str) -> List[str]:
        """Extract tech skills using dictionary matching, alias normalization, and spaCy NLP."""
        if not text:
            return []
        
        text = self.normalize_spaced_text(text)
        text_lower = text.lower()
        found_skills = set()
        
        aliases = {
            "postgres": "postgresql",
            "postgremsql": "postgresql",
            "sql server": "mssql",
            "mongodb": "mongo",
            "react.js": "react",
            "node": "node.js",
            "js": "javascript",
            "ts": "typescript",
            "full stack": "fullstack",
            "frontend": "front-end",
            "backend": "back-end"
        }
        
        extra_skills = {"java", "spring boot", "django", "express", "tailwind css", "bootstrap", "flutter", "react native", "aws s3", "aws lambda", "azure", "google cloud"}
        local_db = TECH_SKILLS_DB.union(extra_skills)
        
        for skill in local_db:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found_skills.add(skill)
        
        for alias, target in aliases.items():
            if re.search(r'\b' + re.escape(alias) + r'\b', text_lower):
                found_skills.add(target)
        
        generic_terms = {"experience", "team", "project", "developer", "engineer", "software", "solution", "customer", "business", "data", "system", "role", "work"}
        
        if nlp:
            doc = nlp(text_lower)
            for token in doc:
                if token.pos_ in ["PROPN"] and len(token.text) > 2:
                    val = token.text.lower()
                    if val not in found_skills and val not in generic_terms:
                        found_skills.add(val)
        
        return sorted(list(found_skills))

    def compare_skills(self, resume_skills: List[str], job_skills: List[str]) -> Dict[str, Any]:
        """Identify matched vs missing skills and provide advice."""
        resume_set = set([s.lower() for s in resume_skills])
        job_set = set([s.lower() for s in job_skills])
        
        matched = resume_set.intersection(job_set)
        missing = job_set - resume_set
        
        tech_missing = [s for s in missing if s in TECH_SKILLS_DB]
        other_missing = [s for s in missing if s not in TECH_SKILLS_DB]
        sorted_missing = tech_missing + other_missing
        
        advice = []
        for skill in sorted_missing[:5]:
            advice.append(f"• Highlight any past projects where you used {skill.upper()} or similar tools.")
        
        if sorted_missing:
            advice.append("• Consider adding a 'Technical Proficiencies' section if you haven't already.")
        
        return {
            "matched": sorted(list(matched)),
            "missing": sorted(list(sorted_missing)),
            "tailoring_advice": advice
        }

    def calculate_experience_score(self, candidate_exp: Optional[str], job_exp: Optional[str]) -> float:
        """
        Calculates experience level alignment score (0.0 to 100.0).
        """
        if not candidate_exp or not job_exp:
            return 75.0  # Neutral non-punitive fallback
            
        cand_level = 0
        job_level = 0
        
        cand_lower = candidate_exp.lower()
        job_lower = job_exp.lower()
        
        for k, v in LEVEL_MAP.items():
            if k in cand_lower:
                cand_level = max(cand_level, v)
            if k in job_lower:
                job_level = max(job_level, v)
                
        if cand_level == 0 or job_level == 0:
            return 75.0
            
        diff = cand_level - job_level
        if diff == 0:
            return 100.0
        elif diff > 0:
            return 90.0  # Candidate over-qualified, still high match
        elif diff == -1:
            return 65.0  # Candidate 1 level below required
        else:
            return 35.0  # Candidate 2+ levels below required

    def calculate_role_title_score(self, candidate_role: Optional[str], job_title: Optional[str]) -> float:
        """
        Calculates role title alignment score (0.0 to 100.0).
        """
        if not candidate_role or not job_title:
            return 75.0  # Neutral fallback
            
        c_words = set(re.findall(r'\w+', candidate_role.lower())) - {"a", "an", "the", "for", "and", "or"}
        j_words = set(re.findall(r'\w+', job_title.lower())) - {"a", "an", "the", "for", "and", "or"}
        
        if not c_words or not j_words:
            return 75.0
            
        overlap = c_words.intersection(j_words)
        if c_words == j_words:
            return 100.0
            
        ratio = len(overlap) / max(len(c_words), len(j_words))
        if ratio > 0.6:
            return 90.0
        elif ratio > 0.3:
            return 70.0
        elif overlap:
            return 50.0
        else:
            return 30.0

    def calculate_v2_match_score(
        self, 
        resume_text: str, 
        job_description: str,
        candidate_role: Optional[str] = None,
        candidate_experience: Optional[str] = None,
        job_title: Optional[str] = None,
        job_experience: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        V2 Explainable Multi-Factor Scoring Engine.
        Weights: Skills 40%, Content 30%, Experience 15%, Role Title 15%.
        """
        processed_resume = self.preprocess_text(resume_text)
        processed_job = self.preprocess_text(job_description)
        
        # Guard for empty or whitespace-only inputs
        if not processed_resume.strip() or not processed_job.strip():
            return {
                "match_percentage": 0.0,
                "breakdown": {
                    "skills": 0.0,
                    "content": 0.0,
                    "experience": 0.0,
                    "role_title": 0.0
                },
                "weights": {
                    "skills": 0.40,
                    "content": 0.30,
                    "experience": 0.15,
                    "role_title": 0.15
                },
                "explanation": "No text content detected for matching analysis (0.0%).",
                "matched_skills": [],
                "missing_skills": [],
                "tailoring_advice": []
            }
        
        # 1. Content Score (TF-IDF Cosine Similarity) - 30%
        try:
            tfidf_matrix = self.vectorizer.fit_transform([processed_resume, processed_job])
            raw_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        except Exception:
            raw_sim = 0.0
            
        content_score = round(min(100.0, max(0.0, raw_sim * 100.0)), 2)
        
        # 2. Skill Overlap Score - 40%
        resume_skills = self.extract_skills(resume_text)
        job_skills = self.extract_skills(job_description)
        comparison = self.compare_skills(resume_skills, job_skills)
        
        if not job_skills:
            skills_score = content_score
        else:
            skill_ratio = len(comparison["matched"]) / len(job_skills)
            skills_score = round(min(100.0, max(0.0, skill_ratio * 100.0)), 2)

        # 3. Experience Score - 15%
        experience_score = round(self.calculate_experience_score(candidate_experience, job_experience), 2)

        # 4. Role Title Score - 15%
        role_title_score = round(self.calculate_role_title_score(candidate_role, job_title), 2)

        # 5. Weighted Overall Score Calculation (40/30/15/15)
        raw_overall = (skills_score * 0.40) + (content_score * 0.30) + (experience_score * 0.15) + (role_title_score * 0.15)
        
        # Non-linear floor boost to reward strong content similarity even with low skill overlap
        if raw_overall > 0 and content_score > 0:
            raw_overall = max(raw_overall, content_score * 1.5)

        overall_score = round(min(100.0, max(0.0, raw_overall)), 2)
        
        # Numerical safety checks against NaN / Infinity
        if math.isnan(overall_score) or math.isinf(overall_score):
            overall_score = 0.0

        # Generate human-readable explanation
        if overall_score >= 80:
            quality = "Strong"
        elif overall_score >= 50:
            quality = "Moderate"
        else:
            quality = "Low"
            
        explanation = f"{quality} overall match ({overall_score}%). Technical skills alignment: {skills_score}%, content similarity: {content_score}%, experience alignment: {experience_score}%."

        return {
            "match_percentage": overall_score,
            "breakdown": {
                "skills": skills_score,
                "content": content_score,
                "experience": experience_score,
                "role_title": role_title_score
            },
            "weights": {
                "skills": 0.40,
                "content": 0.30,
                "experience": 0.15,
                "role_title": 0.15
            },
            "explanation": explanation,
            "matched_skills": comparison["matched"],
            "missing_skills": comparison["missing"],
            "tailoring_advice": comparison["tailoring_advice"]
        }

    def calculate_match_score(self, resume_text: str, job_description: str) -> float:
        """
        Legacy match score method for 100% backward compatibility.
        """
        res = self.calculate_v2_match_score(resume_text, job_description)
        return float(res["match_percentage"])
