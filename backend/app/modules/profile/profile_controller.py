# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.modules.profile.profile_repository import ProfileRepository
from app.modules.profile.profile_service import ProfileService
from app.modules.profile.profile_schema import (
    ProfileResponse, ProfileUpdate, ChangePasswordRequest, AccountInfoResponse, ConnectionsResponse
)

router = APIRouter()

def get_profile_service(db: AsyncSession = Depends(get_db)) -> ProfileService:
    repository = ProfileRepository(db)
    return ProfileService(repository)

@router.get("", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service)
):
    """
    Get the authenticated user's profile information.
    """
    return await service.get_profile(current_user.id)

@router.put("", response_model=ProfileResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service)
):
    """
    Update the authenticated user's profile information.
    """
    return await service.update_profile(current_user.id, profile_update)

@router.put("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service)
):
    """
    Change the user's password.
    """
    return await service.change_password(current_user.id, password_data)

@router.get("/account", response_model=AccountInfoResponse)
async def get_account_info(
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service)
):
    """
    Get the user's account creation and authentication provider info.
    """
    return await service.get_account_info(current_user.id)

@router.get("/connections", response_model=ConnectionsResponse)
async def get_connections(
    current_user: User = Depends(get_current_user),
    service: ProfileService = Depends(get_profile_service)
):
    """
    Get the active authentication connections (Google, GitHub, PAT, Email).
    """
    return await service.get_connections(current_user.id)
