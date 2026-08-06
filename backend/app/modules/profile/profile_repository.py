import uuid
from typing import Optional
# pyrefly: ignore [missing-import]
from sqlalchemy import select
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.models.github_integration import GitHubIntegration

class ProfileRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        result = await self.session.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def update_user(self, user: User) -> User:
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def get_github_integration(self, user_id: uuid.UUID) -> Optional[GitHubIntegration]:
        result = await self.session.execute(
            select(GitHubIntegration)
            .where(GitHubIntegration.user_id == user_id, GitHubIntegration.is_connected == True)
        )
        return result.scalar_one_or_none()
