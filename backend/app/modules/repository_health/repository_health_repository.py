import uuid
from typing import List, Optional
# pyrefly: ignore [missing-import]
from sqlalchemy import select, and_
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.ai.models import AIReview

class RepositoryHealthRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_reviews_for_repository(self, user_id: uuid.UUID, owner: str, repo: str) -> List[AIReview]:
        stmt = select(AIReview).where(
            and_(
                AIReview.user_id == user_id,
                AIReview.owner == owner,
                AIReview.repository_name == repo,
                AIReview.is_deleted == False,
                AIReview.review_status == "completed",
                AIReview.review_json.is_not(None)
            )
        ).order_by(AIReview.created_at.desc())
        
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
