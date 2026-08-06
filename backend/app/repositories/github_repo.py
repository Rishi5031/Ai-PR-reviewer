import uuid
from typing import Optional
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
# pyrefly: ignore [missing-import]
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
        provider: str = "github",
        connection_type: str = "PAT"
    ) -> GitHubIntegration:
        # Check for existing record by user_id
        result_by_user = await self.db.execute(
            select(GitHubIntegration).where(GitHubIntegration.user_id == user_id)
        )
        existing_by_user = result_by_user.scalar_one_or_none()
        
        # Check for existing record by github_id
        result_by_github = await self.db.execute(
            select(GitHubIntegration).where(GitHubIntegration.github_id == github_id)
        )
        existing_by_github = result_by_github.scalar_one_or_none()

        # If this github account is already connected to another user, delete that old connection 
        # so the current user can claim it (avoids unique constraint violation).
        if existing_by_github and (not existing_by_user or existing_by_github.id != existing_by_user.id):
            await self.db.delete(existing_by_github)
            await self.db.flush()

        integration = existing_by_user
        
        if integration:
            integration.github_id = github_id
            integration.github_username = github_username
            integration.encrypted_token = encrypted_token
            integration.github_name = github_name
            integration.avatar_url = avatar_url
            integration.provider = provider
            integration.connection_type = connection_type
            integration.is_connected = True
        else:
            integration = GitHubIntegration(
                user_id=user_id,
                github_id=github_id,
                github_username=github_username,
                encrypted_token=encrypted_token,
                github_name=github_name,
                avatar_url=avatar_url,
                provider=provider,
                connection_type=connection_type,
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
