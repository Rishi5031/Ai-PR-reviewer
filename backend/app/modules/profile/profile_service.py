import uuid
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
from app.modules.profile.profile_repository import ProfileRepository
from app.modules.profile.profile_schema import (
    ProfileResponse, ProfileUpdate, ChangePasswordRequest, AccountInfoResponse, ConnectionsResponse
)
from app.core.security import verify_password, get_password_hash

class ProfileService:
    def __init__(self, repository: ProfileRepository):
        self.repository = repository

    async def get_profile(self, user_id: uuid.UUID) -> ProfileResponse:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        return ProfileResponse(
            id=user.id,
            full_name=user.full_name,
            email=user.email,
            username=user.username,
            company=user.company,
            job_title=user.job_title,
            bio=user.bio,
            timezone=user.timezone,
            profile_image=user.avatar_url,
            provider=user.auth_provider or "email",
            email_verified=user.is_verified,
            created_at=user.created_at,
            updated_at=user.updated_at
        )

    async def update_profile(self, user_id: uuid.UUID, profile_update: ProfileUpdate) -> ProfileResponse:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        update_data = profile_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        updated_user = await self.repository.update_user(user)
        
        return ProfileResponse(
            id=updated_user.id,
            full_name=updated_user.full_name,
            email=updated_user.email,
            username=updated_user.username,
            company=updated_user.company,
            job_title=updated_user.job_title,
            bio=updated_user.bio,
            timezone=updated_user.timezone,
            profile_image=updated_user.avatar_url,
            provider=updated_user.auth_provider or "email",
            email_verified=updated_user.is_verified,
            created_at=updated_user.created_at,
            updated_at=updated_user.updated_at
        )

    async def change_password(self, user_id: uuid.UUID, password_data: ChangePasswordRequest) -> dict:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        if not verify_password(password_data.current_password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

        if password_data.current_password == password_data.new_password:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="New password cannot be the same as current password")

        user.password_hash = get_password_hash(password_data.new_password)
        await self.repository.update_user(user)

        return {"message": "Password changed successfully"}

    async def get_account_info(self, user_id: uuid.UUID) -> AccountInfoResponse:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        return AccountInfoResponse(
            account_created=user.created_at,
            last_login=user.updated_at,  # Fallback as requested
            authentication_provider=user.auth_provider or "email",
            email_verified=user.is_verified
        )

    async def get_connections(self, user_id: uuid.UUID) -> ConnectionsResponse:
        user = await self.repository.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        github_integration = await self.repository.get_github_integration(user_id)
        
        provider = user.auth_provider or "email"
        
        return ConnectionsResponse(
            google=(provider == "google"),
            password_login=(provider == "email" or provider == "password_login"),
            github=(github_integration is not None and github_integration.connection_type == "OAUTH"),
            github_pat=(github_integration is not None and github_integration.connection_type == "PAT")
        )
