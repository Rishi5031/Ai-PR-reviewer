import uuid
from typing import List
# pyrefly: ignore [missing-import]
from sqlalchemy import select, desc, and_
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.ai.models import AIReview
from app.modules.repository_settings.models import RepositorySettings

class DashboardRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_user_reviews(self, user_id: uuid.UUID) -> List[AIReview]:
        stmt = select(AIReview).where(
            and_(
                AIReview.user_id == user_id,
                AIReview.is_deleted == False
            )
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_repository_settings_by_ids(self, repository_ids: List[str]) -> List[RepositorySettings]:
        if not repository_ids:
            return []
        stmt = select(RepositorySettings).where(
            RepositorySettings.repository_id.in_(repository_ids)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_latest_reviews(self, user_id: uuid.UUID, limit: int = 5) -> List[AIReview]:
        stmt = select(AIReview).where(
            and_(
                AIReview.user_id == user_id,
                AIReview.is_deleted == False
            )
        ).order_by(desc(AIReview.created_at)).limit(limit)
        
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
