# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging

from app.api.deps import get_db, get_current_user
from app.modules.repository_settings.schemas import RepositorySettingsResponse, RepositorySettingsUpdate
from app.modules.repository_settings.repository_settings_service import RepositorySettingsService
from app.models.user import User

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/{owner}/{repo}/settings", response_model=RepositorySettingsResponse)
async def get_repository_settings(
    owner: str,
    repo: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get settings for a repository. Creates default if none exist.
    """
    service = RepositorySettingsService(db)
    return await service.get_settings(owner, repo)


@router.put("/{owner}/{repo}/settings", response_model=RepositorySettingsResponse)
async def update_repository_settings(
    owner: str,
    repo: str,
    settings_in: RepositorySettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update settings for a repository.
    """
    service = RepositorySettingsService(db)
    return await service.update_settings(owner, repo, settings_in)
