import uuid
from typing import List, Optional
from datetime import datetime, timedelta, timezone
# pyrefly: ignore [missing-import]
from sqlalchemy import select, and_
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.ai.models import AIReview

class AnalyticsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_filtered_reviews(
        self,
        user_id: uuid.UUID,
        repository: Optional[str] = None,
        date_range: Optional[str] = None,
        recommendation: Optional[str] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
    ) -> List[AIReview]:
        
        filters = [
            AIReview.user_id == user_id,
            AIReview.is_deleted == False,
            AIReview.review_status == "completed",
            AIReview.review_json.is_not(None)
        ]

        if repository:
            filters.append(AIReview.repository_name.ilike(f"%{repository}%"))
            
        if min_score is not None:
            filters.append(AIReview.overall_score >= min_score)
            
        if max_score is not None:
            filters.append(AIReview.overall_score <= max_score)
            
        if date_range:
            now = datetime.now(timezone.utc)
            if date_range == "today":
                start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
                filters.append(AIReview.created_at >= start_date)
            elif date_range == "week":
                start_date = now - timedelta(days=7)
                filters.append(AIReview.created_at >= start_date)
            elif date_range == "month":
                start_date = now - timedelta(days=30)
                filters.append(AIReview.created_at >= start_date)

        stmt = select(AIReview).where(and_(*filters))
        result = await self.db.execute(stmt)
        reviews = result.scalars().all()
        
        # Post-filter for recommendation since it's inside JSONB and easier to match exactly in Python
        if recommendation:
            rec_lower = recommendation.lower()
            reviews = [
                r for r in reviews 
                if r.review_json.get("recommendation", "").lower() == rec_lower
            ]
            
        return list(reviews)
