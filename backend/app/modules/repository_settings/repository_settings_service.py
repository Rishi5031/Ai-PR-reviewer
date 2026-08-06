from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
import logging

from app.modules.repository_settings.repository_settings_repository import RepositorySettingsRepository
from app.modules.repository_settings.schemas import RepositorySettingsCreate, RepositorySettingsUpdate, RepositorySettingsResponse
from app.modules.repository_settings.models import RepositorySettings

logger = logging.getLogger(__name__)

class RepositorySettingsService:
    def __init__(self, db: AsyncSession):
        self.repository = RepositorySettingsRepository(db)

    async def get_settings(self, owner: str, repo: str) -> RepositorySettingsResponse:
        repository_id = f"{owner}/{repo}"
        settings = await self.repository.get_by_repository_id(repository_id)
        
        if not settings:
            logger.info(f"Settings for {repository_id} not found, generating defaults.")
            settings = await self.create_default_settings(repository_id)
            
        return RepositorySettingsResponse.model_validate(settings)

    async def update_settings(self, owner: str, repo: str, settings_in: RepositorySettingsUpdate) -> RepositorySettingsResponse:
        repository_id = f"{owner}/{repo}"
        settings = await self.repository.get_by_repository_id(repository_id)
        
        if not settings:
            # Create first then update, or just create with the update payload
            logger.info(f"Creating settings for {repository_id} from update payload.")
            create_payload = RepositorySettingsCreate(
                repository_id=repository_id,
                **settings_in.model_dump()
            )
            settings = await self.repository.create(create_payload)
        else:
            settings = await self.repository.update(settings, settings_in)
            
        return RepositorySettingsResponse.model_validate(settings)

    async def create_default_settings(self, repository_id: str) -> RepositorySettings:
        default_settings = RepositorySettingsCreate(
            repository_id=repository_id,
            ai_model="gemini-2.5-flash",
            review_strictness="medium",
            ignore_files=["package-lock.json", "node_modules/", "dist/", "*.lock", "*.min.js", "coverage/"],
            coverage_threshold=80,
            max_tokens=5000
        )
        return await self.repository.create(default_settings)
