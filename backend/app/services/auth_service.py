# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
from typing import Tuple
from datetime import datetime, timezone, timedelta
import uuid
import secrets
# pyrefly: ignore [missing-import]
from google.oauth2 import id_token
# pyrefly: ignore [missing-import]
from google.auth.transport import requests

from app.schemas.user import UserCreate, UserLogin, TokenSchema
from app.repositories.user_repo import UserRepository
from app.repositories.token_repo import TokenRepository
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token,
    hash_token
)
from app.core.config import settings
from app.models.user import User
from app.repositories.password_reset_repo import PasswordResetRepository
from app.services.email_service import EmailService


class AuthService:
    def __init__(
        self,
        user_repo: UserRepository,
        token_repo: TokenRepository,
        password_reset_repo: PasswordResetRepository,
        email_service: EmailService
    ):
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.password_reset_repo = password_reset_repo
        self.email_service = email_service

    async def signup(self, user_in: UserCreate) -> User:
        user = await self.user_repo.get_by_email(user_in.email)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        hashed_password = get_password_hash(user_in.password)
        return await self.user_repo.create(user_in, hashed_password)

    async def login(self, user_in: UserLogin) -> TokenSchema:
        user = await self.user_repo.get_by_email(user_in.email)
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        access_token, refresh_token, expires_in = await self._generate_tokens(user)
        return TokenSchema(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in
        )

    async def _generate_tokens(self, user: User) -> Tuple[str, str, int]:
        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        
        # Decode to get jti
        payload = verify_token(refresh_token, settings.JWT_REFRESH_SECRET_KEY)
        jti = payload.get("jti") if payload else None
        
        # Hash refresh token before storing
        hashed_rt = get_password_hash(refresh_token)
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        await self.token_repo.create(user.id, hashed_rt, expires_at, jti=jti)
        
        expires_in = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        return access_token, refresh_token, expires_in

    async def refresh(self, refresh_token: str) -> TokenSchema:
        payload = verify_token(refresh_token, settings.JWT_REFRESH_SECRET_KEY)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        jti = payload.get("jti")
        if jti:
            db_token = await self.token_repo.get_by_jti(jti)
            if not db_token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or revoked refresh token"
                )
        
        user_id_str = payload.get("sub")
        if not user_id_str:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token payload"
            )
        try:
            user_id = uuid.UUID(user_id_str)
        except ValueError:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user id in token"
            )

        user = await self.user_repo.get_by_id(user_id)
        if not user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
            
        access_token = create_access_token(subject=user.id)
        new_refresh_token = create_refresh_token(subject=user.id)
        
        hashed_rt = get_password_hash(new_refresh_token)
        expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        await self.token_repo.create(user.id, hashed_rt, expires_at)
        
        return TokenSchema(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )

    async def logout(self, refresh_token: str, user_id: uuid.UUID) -> None:
        if not refresh_token:
            return
            
        payload = verify_token(refresh_token, settings.JWT_REFRESH_SECRET_KEY)
        if not payload or payload.get("type") != "refresh":
            # Idempotent: Ignore invalid or expired tokens on logout
            return
            
        token_user_id_str = payload.get("sub")
        if not token_user_id_str or str(token_user_id_str) != str(user_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to revoke this session"
            )
            
        jti = payload.get("jti")
        if jti:
            await self.token_repo.revoke_token_by_jti(jti)

    async def google_login(self, token: str) -> TokenSchema:
        try:
            # Verify the token with Google
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), settings.GOOGLE_CLIENT_ID
            )

            # Get user info from the verified token
            email = idinfo.get("email")
            full_name = idinfo.get("name", "")
            avatar_url = idinfo.get("picture")

            if not email:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Google token did not provide an email"
                )

            # Check if user exists
            user = await self.user_repo.get_by_email(email)

            if not user:
                # Create a new user with a random, secure password hash
                # since they are authenticating via Google
                random_password = secrets.token_urlsafe(32)
                hashed_password = get_password_hash(random_password)
                
                user_in = UserCreate(
                    email=email,
                    full_name=full_name,
                    avatar_url=avatar_url,
                    password=random_password
                )
                user = await self.user_repo.create(user_in, hashed_password)
                
                # Mark as verified since it's from Google
                user.is_verified = True
                self.user_repo.session.add(user)
                await self.user_repo.session.commit()

            # Generate tokens
            access_token, refresh_token, expires_in = await self._generate_tokens(user)
            
            return TokenSchema(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=expires_in
            )
            
        except ValueError as e:
            # Invalid token
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid Google token: {str(e)}"
            )

    async def forgot_password(self, email: str) -> None:
        user = await self.user_repo.get_by_email(email)
        
        # We always return success to prevent email enumeration
        if not user:
            return
            
        # Invalidate old tokens
        await self.password_reset_repo.invalidate_all_for_user(user.id)
        
        # Generate new token
        raw_token = secrets.token_urlsafe(32)
        hashed_token = hash_token(raw_token)
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
        
        await self.password_reset_repo.create(
            user_id=user.id,
            token_hash=hashed_token,
            expires_at=expires_at
        )
        
        # Send email (currently logs the link)
        await self.email_service.send_reset_password_email(email, raw_token)

    async def reset_password(self, token: str, new_password: str) -> None:
        hashed_token = hash_token(token)
        db_token = await self.password_reset_repo.get_by_hash(hashed_token)
        
        if not db_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
            
        if db_token.used_at is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token has already been used"
            )
            
        if db_token.expires_at < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Reset token has expired"
            )
            
        user = await self.user_repo.get_by_id(db_token.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not found"
            )
            
        # Update user password
        user.password_hash = get_password_hash(new_password)
        self.user_repo.session.add(user)
        await self.user_repo.session.commit()
        
        # Mark token as used
        await self.password_reset_repo.mark_used(db_token)
        
        # Revoke all active sessions
        await self.token_repo.revoke_all_for_user(user.id)
