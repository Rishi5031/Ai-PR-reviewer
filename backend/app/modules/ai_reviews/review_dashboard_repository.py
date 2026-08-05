import uuid
from typing import List, Tuple, Optional
from datetime import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import select, func, and_, or_, desc, asc
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.ai.models import AIReview

class ReviewDashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_reviews(
        self,
        user_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        repository: Optional[str] = None,
        recommendation: Optional[str] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        sort_by: str = "newest",
    ) -> Tuple[int, List[AIReview]]:
        
        # Base filter: Only user's reviews, not deleted, and completed status
        filters = [
            AIReview.user_id == user_id,
            AIReview.is_deleted == False,
            AIReview.review_status == "completed"
        ]

        if repository:
            filters.append(AIReview.repository_name.ilike(f"%{repository}%"))
            
        if recommendation:
            # We assume recommendation is part of summary or stored in review_json.
            # Assuming review_json -> 'recommendation'
            filters.append(
                func.jsonb_extract_path_text(AIReview.review_json, 'recommendation').ilike(f"%{recommendation}%")
            )
            
        if min_score is not None:
            filters.append(AIReview.overall_score >= min_score)
            
        if max_score is not None:
            filters.append(AIReview.overall_score <= max_score)
            
        if start_date:
            filters.append(AIReview.created_at >= start_date)
            
        if end_date:
            filters.append(AIReview.created_at <= end_date)

        # Count total
        count_stmt = select(func.count(AIReview.id)).where(and_(*filters))
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Build data query
        stmt = select(AIReview).where(and_(*filters))
        
        if sort_by == "newest":
            stmt = stmt.order_by(desc(AIReview.created_at))
        elif sort_by == "oldest":
            stmt = stmt.order_by(asc(AIReview.created_at))
        elif sort_by == "highest_score":
            stmt = stmt.order_by(desc(AIReview.overall_score))
        elif sort_by == "lowest_score":
            stmt = stmt.order_by(asc(AIReview.overall_score))
        else:
            stmt = stmt.order_by(desc(AIReview.created_at))

        stmt = stmt.offset((page - 1) * limit).limit(limit)
        
        result = await self.db.execute(stmt)
        reviews = result.scalars().all()
        
        return total, list(reviews)

    async def get_latest_reviews(self, user_id: uuid.UUID, limit: int = 10) -> List[AIReview]:
        stmt = select(AIReview).where(
            and_(
                AIReview.user_id == user_id,
                AIReview.is_deleted == False,
                AIReview.review_status == "completed"
            )
        ).order_by(desc(AIReview.created_at)).limit(limit)
        
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_statistics(self, user_id: uuid.UUID) -> dict:
        base_filters = and_(
            AIReview.user_id == user_id,
            AIReview.is_deleted == False,
            AIReview.review_status == "completed"
        )
        
        # Total Reviews
        total_stmt = select(func.count(AIReview.id)).where(base_filters)
        total_result = await self.db.execute(total_stmt)
        total = total_result.scalar() or 0
        
        # Average Score
        avg_stmt = select(func.avg(AIReview.overall_score)).where(base_filters)
        avg_result = await self.db.execute(avg_stmt)
        avg = avg_result.scalar()
        average_score = float(avg) if avg is not None else None
        
        # Repositories Reviewed
        repo_stmt = select(func.count(func.distinct(AIReview.repository_name))).where(base_filters)
        repo_result = await self.db.execute(repo_stmt)
        repositories_reviewed = repo_result.scalar() or 0
        
        # High Risk Reviews (score < 70)
        high_risk_filters = and_(
            base_filters,
            AIReview.overall_score < 70
        )
        high_risk_stmt = select(func.count(AIReview.id)).where(high_risk_filters)
        high_risk_result = await self.db.execute(high_risk_stmt)
        high_risk = high_risk_result.scalar() or 0
        
        return {
            "total_reviews": total,
            "average_score": average_score,
            "repositories_reviewed": repositories_reviewed,
            "high_risk_reviews": high_risk
        }
        
    async def get_review_by_id(self, user_id: uuid.UUID, review_id: uuid.UUID) -> Optional[AIReview]:
        stmt = select(AIReview).where(
            and_(
                AIReview.id == review_id,
                AIReview.user_id == user_id,
                AIReview.is_deleted == False
            )
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def delete_review(self, review: AIReview) -> None:
        review.is_deleted = True
        await self.db.commit()
