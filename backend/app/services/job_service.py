from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.models import Job

class JobService:
    async def get_jobs(
        self, 
        db: Session,
        location: Optional[str] = None, 
        remote_status: Optional[str] = None, 
        experience_level: Optional[str] = None,
        keywords: Optional[str] = None,
        search: Optional[str] = None,
        sort_by: str = "posted_at",
        order: str = "desc",
        limit: int = 20,
        offset: int = 0
    ) -> List[Job]:
        """
        Fetch jobs from database with filtering, keyword search, safe sorting, and database-level pagination.
        """
        query = db.query(Job)
        
        # 1. Location filter
        if location and location.strip():
            loc_clean = location.strip()
            if loc_clean.lower() == 'remote':
                query = query.filter(or_(
                    Job.location.ilike(f"%{loc_clean}%"),
                    Job.remote_status == 'Remote'
                ))
            else:
                query = query.filter(Job.location.ilike(f"%{loc_clean}%"))
        
        # 2. Remote Status filter
        if remote_status and remote_status.strip():
            query = query.filter(Job.remote_status.ilike(remote_status.strip()))
            
        # 3. Experience Level filter
        if experience_level and experience_level.strip():
            query = query.filter(Job.experience_level.ilike(experience_level.strip()))
            
        # 4. Keyword / Search filter (unifies 'keywords' and 'search' parameters)
        search_query = search or keywords
        if search_query and search_query.strip():
            keyword_list = [k.strip().lower() for k in search_query.split(",") if k.strip()]
            filters = []
            for kw in keyword_list:
                kw_filter = f"%{kw}%"
                filters.append(Job.title.ilike(kw_filter))
                filters.append(Job.company.ilike(kw_filter))
                filters.append(Job.description.ilike(kw_filter))
                filters.append(Job.skills_required.ilike(kw_filter))
            if filters:
                query = query.filter(or_(*filters))

        # 5. Safe Sorting Validation & Column Mapping
        valid_sort_columns = {
            "posted_at": Job.posted_at,
            "created_at": Job.posted_at,
            "title": Job.title,
            "company": Job.company,
            "location": Job.location,
            "remote_status": Job.remote_status,
            "experience_level": Job.experience_level
        }

        sort_key = (sort_by or "posted_at").strip().lower()
        sort_col = valid_sort_columns.get(sort_key)
        if not sort_col:
            allowed_fields = ", ".join(["posted_at", "created_at", "title", "company", "location", "remote_status", "experience_level"])
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid sort_by field '{sort_by}'. Allowed fields are: {allowed_fields}"
            )

        order_clean = (order or "desc").strip().lower()
        if order_clean not in ("asc", "desc"):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid order '{order}'. Allowed values are: asc, desc"
            )

        if order_clean == "asc":
            query = query.order_by(sort_col.asc(), Job.id.asc())
        else:
            query = query.order_by(sort_col.desc(), Job.id.desc())

        # 6. Database-level limit and offset pagination
        return query.offset(offset).limit(limit).all()

    async def get_job_by_id(self, db: Session, job_id: int) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()

job_service = JobService()
