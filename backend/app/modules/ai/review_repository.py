from typing import Optional
import uuid
# pyrefly: ignore [missing-import]
from sqlalchemy import select, desc
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.ai.models import AIReview

class AIReviewRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_review(
        self,
        user_id: uuid.UUID,
        owner: str,
        repository_name: str,
        pull_request_number: int,
        review_status: str = "pending",
        overall_score: Optional[int] = None,
        summary: Optional[str] = None,
        review_json: Optional[dict] = None
    ) -> AIReview:
        db_review = AIReview(
            user_id=user_id,
            owner=owner,
            repository_name=repository_name,
            pull_request_number=pull_request_number,
            review_status=review_status,
            overall_score=overall_score,
            summary=summary,
            review_json=review_json
        )
        self.db.add(db_review)
        await self.db.commit()
        await self.db.refresh(db_review)
        return db_review

    async def update_review(
        self,
        review: AIReview,
        review_status: str,
        overall_score: Optional[int] = None,
        summary: Optional[str] = None,
        review_json: Optional[dict] = None
    ) -> AIReview:
        review.review_status = review_status
        if overall_score is not None:
            review.overall_score = overall_score
        if summary is not None:
            review.summary = summary
        if review_json is not None:
            review.review_json = review_json
            
        await self.db.commit()
        await self.db.refresh(review)
        return review

    async def get_review_by_id(self, review_id: uuid.UUID) -> Optional[AIReview]:
        result = await self.db.execute(select(AIReview).filter(AIReview.id == review_id))
        return result.scalars().first()

    async def get_latest_review_for_pr(
        self,
        owner: str,
        repository_name: str,
        pull_request_number: int
    ) -> Optional[AIReview]:
        stmt = (
            select(AIReview)
            .filter(
                AIReview.owner == owner,
                AIReview.repository_name == repository_name,
                AIReview.pull_request_number == pull_request_number
            )
            .order_by(desc(AIReview.created_at))
            .limit(1)
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()
