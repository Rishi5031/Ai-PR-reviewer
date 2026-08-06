from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from sqlalchemy import select
from typing import Optional
import uuid

from app.modules.repository_settings.models import RepositorySettings
from app.modules.repository_settings.schemas import RepositorySettingsCreate, RepositorySettingsUpdate

class RepositorySettingsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_repository_id(self, repository_id: str) -> Optional[RepositorySettings]:
        stmt = select(RepositorySettings).where(RepositorySettings.repository_id == repository_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, settings_in: RepositorySettingsCreate) -> RepositorySettings:
        db_settings = RepositorySettings(
            repository_id=settings_in.repository_id,
            ai_model=settings_in.ai_model,
            review_strictness=settings_in.review_strictness,
            ignore_files=settings_in.ignore_files,
            coverage_threshold=settings_in.coverage_threshold,
            max_tokens=settings_in.max_tokens
        )
        self.db.add(db_settings)
        await self.db.commit()
        await self.db.refresh(db_settings)
        return db_settings

    async def update(self, db_settings: RepositorySettings, settings_in: RepositorySettingsUpdate) -> RepositorySettings:
        update_data = settings_in.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(db_settings, field, value)
            
        await self.db.commit()
        await self.db.refresh(db_settings)
        return db_settings
