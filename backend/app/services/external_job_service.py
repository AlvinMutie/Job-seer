import re
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.models import Job
from app.services.matching_engine import MatchingEngine

logger = logging.getLogger(__name__)
matching_engine = MatchingEngine()


class ExternalJobService:
    """Service to query external job board APIs (Adzuna) and normalize postings into the Job Seer repository."""

    ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs"

    def clean_html(self, raw_text: str) -> str:
        """Removes markup and excessive whitespace from external descriptions."""
        if not raw_text:
            return ""
        clean = re.sub(r"<[^>]+>", "", raw_text)
        clean = re.sub(r"\s+", " ", clean).strip()
        return clean

    def infer_remote_status(self, title: str, description: str, location: str) -> str:
        text = f"{title} {description} {location}".lower()
        if "remote" in text or "telecommute" in text or "work from home" in text:
            return "Remote"
        if "hybrid" in text:
            return "Hybrid"
        return "On-site"

    def infer_experience_level(self, title: str, description: str) -> str:
        text = f"{title} {description[:300]}".lower()
        if any(w in text for w in ["senior", "lead", "principal", "staff", "head of", "director"]):
            return "Senior"
        if any(w in text for w in ["junior", "entry level", "intern", "associate", "graduate"]):
            return "Junior"
        return "Mid-Level"

    def format_salary(self, salary_min: Optional[float], salary_max: Optional[float]) -> str:
        if salary_min and salary_max:
            s_min = int(salary_min)
            s_max = int(salary_max)
            if s_min == s_max:
                return f"${s_min:,}"
            return f"${s_min:,} - ${s_max:,}"
        elif salary_min:
            return f"From ${int(salary_min):,}"
        elif salary_max:
            return f"Up to ${int(salary_max):,}"
        return "Competitive"

    def extract_required_skills(self, title: str, description: str, fallback_query: str = "") -> str:
        skills = matching_engine.extract_skills(f"{title} {description}")
        if not skills and fallback_query:
            skills = [k.strip() for k in fallback_query.split(",") if k.strip()]
        return ", ".join(skills[:8]) if skills else "Technical Skills Required"

    async def fetch_adzuna_jobs(
        self,
        keywords: str,
        location: Optional[str] = None,
        country: Optional[str] = None,
        page: int = 1,
        results_per_page: int = 15
    ) -> List[Dict[str, Any]]:
        """Queries the Adzuna Search API for real-time job listings."""
        app_id = settings.ADZUNA_APP_ID
        app_key = settings.ADZUNA_APP_KEY
        target_country = (country or settings.ADZUNA_COUNTRY or "us").lower()

        if not app_id or not app_key:
            raise ValueError(
                "Adzuna API credentials are missing. Please set ADZUNA_APP_ID and ADZUNA_APP_KEY in backend/.env"
            )

        url = f"{self.ADZUNA_BASE_URL}/{target_country}/search/{page}"
        params = {
            "app_id": app_id,
            "app_key": app_key,
            "what": keywords.strip(),
            "results_per_page": min(results_per_page, 50),
            "content-type": "application/json"
        }
        if location and location.strip() and location.strip().lower() != "remote":
            params["where"] = location.strip()

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)

            if response.status_code == 401 or response.status_code == 403:
                raise ValueError("Invalid Adzuna API credentials (HTTP 401/403). Please verify your APP_ID and APP_KEY.")
            elif response.status_code == 429:
                raise ValueError("Adzuna API rate limit reached. Please wait a moment before querying again.")
            elif response.status_code != 200:
                raise ValueError(f"Adzuna API returned unexpected status code {response.status_code}: {response.text[:200]}")

            data = response.json()
            return data.get("results", [])

    async def sync_external_jobs(
        self,
        db: Session,
        keywords: str,
        location: Optional[str] = None,
        country: Optional[str] = None,
        max_results: int = 15
    ) -> Dict[str, Any]:
        """
        Fetches live jobs from Adzuna, normalizes, deduplicates, and commits them to the database.
        Returns the ingestion summary and list of new Job objects.
        """
        raw_results = await self.fetch_adzuna_jobs(
            keywords=keywords,
            location=location,
            country=country,
            page=1,
            results_per_page=max_results
        )

        newly_ingested: List[Job] = []

        for item in raw_results:
            title = self.clean_html(item.get("title") or "Untitled Role")
            company = item.get("company", {}).get("display_name") or "Leading Tech Employer"
            location_name = item.get("location", {}).get("display_name") or (location or "Remote")
            description = self.clean_html(item.get("description") or "")
            
            salary_min = item.get("salary_min")
            salary_max = item.get("salary_max")
            salary_range = self.format_salary(salary_min, salary_max)

            remote_status = self.infer_remote_status(title, description, location_name)
            experience_level = self.infer_experience_level(title, description)
            skills_required = self.extract_required_skills(title, description, fallback_query=keywords)

            # Deduplication: Check by title and company
            existing = db.query(Job).filter(
                Job.title == title,
                Job.company == company
            ).first()

            if not existing:
                posted_at = datetime.now()
                created_str = item.get("created")
                if created_str:
                    try:
                        # Clean ISO format e.g. 2026-09-03T11:27:54Z
                        clean_created = created_str.replace("Z", "+00:00")
                        posted_at = datetime.fromisoformat(clean_created)
                    except Exception:
                        posted_at = datetime.now()

                new_job = Job(
                    title=title,
                    company=company,
                    location=location_name,
                    description=description,
                    remote_status=remote_status,
                    experience_level=experience_level,
                    skills_required=skills_required,
                    salary_range=salary_range,
                    posted_at=posted_at
                )
                db.add(new_job)
                newly_ingested.append(new_job)

        if newly_ingested:
            db.commit()
            for job in newly_ingested:
                db.refresh(job)

        return {
            "query": keywords,
            "location": location or "All Locations",
            "country": country or settings.ADZUNA_COUNTRY,
            "total_found": len(raw_results),
            "new_jobs_added": len(newly_ingested),
            "jobs": newly_ingested
        }


external_job_service = ExternalJobService()
