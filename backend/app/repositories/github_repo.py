import uuid
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.models.github_integration import GitHubIntegration

class GitHubRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[GitHubIntegration]:
        result = await self.db.execute(
            select(GitHubIntegration).where(GitHubIntegration.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def create_or_update(
        self,
        user_id: uuid.UUID,
        github_id: str,
        github_username: str,
        encrypted_token: str,
        github_name: Optional[str] = None,
        avatar_url: Optional[str] = None,
    ) -> GitHubIntegration:
        integration = await self.get_by_user_id(user_id)
        
        if integration:
            integration.github_id = github_id
            integration.github_username = github_username
            integration.encrypted_token = encrypted_token
            integration.github_name = github_name
            integration.avatar_url = avatar_url
            integration.is_connected = True
        else:
            integration = GitHubIntegration(
                user_id=user_id,
                github_id=github_id,
                github_username=github_username,
                encrypted_token=encrypted_token,
                github_name=github_name,
                avatar_url=avatar_url,
                is_connected=True
            )
            self.db.add(integration)
            
        await self.db.commit()
        await self.db.refresh(integration)
        return integration

    async def delete_by_user_id(self, user_id: uuid.UUID) -> bool:
        result = await self.db.execute(
            delete(GitHubIntegration).where(GitHubIntegration.user_id == user_id)
        )
        await self.db.commit()
        return result.rowcount > 0
