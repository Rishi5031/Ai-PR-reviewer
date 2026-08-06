import uuid
import json
import base64
import os
# pyrefly: ignore [missing-import]
import httpx
from datetime import datetime, timedelta, timezone
from typing import Dict, Any

# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.repositories.github_repo import GitHubRepository
from app.utils.encryption import encrypt_token

# For generating a secure CSRF state token
# We will use the existing JWT_SECRET_KEY to sign the state payload.
import hmac
import hashlib

class GitHubOAuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = GitHubRepository(db)
        
    def _generate_state(self, user_id: uuid.UUID) -> str:
        """
        Generate a stateless, tamper-proof state string.
        Contains user_id, nonce, and expiration.
        """
        nonce = os.urandom(16).hex()
        # Expire in 15 minutes
        exp = int((datetime.now(timezone.utc) + timedelta(minutes=15)).timestamp())
        
        payload = f"{user_id}::{nonce}::{exp}"
        signature = hmac.new(
            settings.JWT_SECRET_KEY.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        state_string = f"{payload}::{signature}"
        return base64.urlsafe_b64encode(state_string.encode()).decode()

    def _validate_state(self, state: str) -> uuid.UUID:
        """
        Validates the state string and returns the user_id.
        Raises HTTPException if invalid or expired.
        """
        try:
            decoded = base64.urlsafe_b64decode(state.encode()).decode()
            user_id_str, nonce, exp_str, signature = decoded.split("::")
            
            # Recompute signature
            payload = f"{user_id_str}::{nonce}::{exp_str}"
            expected_signature = hmac.new(
                settings.JWT_SECRET_KEY.encode(),
                payload.encode(),
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                raise ValueError("Invalid signature")
                
            if int(exp_str) < datetime.now(timezone.utc).timestamp():
                raise ValueError("State expired")
                
            return uuid.UUID(user_id_str)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid or expired OAuth state: {str(e)}"
            )

    def generate_login_url(self, user_id: uuid.UUID) -> str:
        state = self._generate_state(user_id)
        # Requesting repo and user scope
        scope = "repo read:user"
        # Using prompt=consent forces GitHub to show the authorization screen every time,
        # preventing automatic silent logins if the user previously disconnected.
        return f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&redirect_uri={settings.GITHUB_CALLBACK_URL}&scope={scope}&state={state}&prompt=consent"

    async def exchange_code(self, code: str, state: str) -> None:
        user_id = self._validate_state(state)
        
        token_url = "https://github.com/login/oauth/access_token"
        headers = {"Accept": "application/json"}
        data = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.GITHUB_CALLBACK_URL
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=data, headers=headers)
            if response.status_code != 200:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to exchange code for token with GitHub.")
            
            token_data = response.json()
            if "error" in token_data:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=token_data["error_description"])
                
            access_token = token_data.get("access_token")
            if not access_token:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="No access token returned from GitHub.")
                
            # Fetch user profile using the new token
            user_profile_url = "https://api.github.com/user"
            user_headers = {
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "CodeGuardian-AI"
            }
            user_response = await client.get(user_profile_url, headers=user_headers)
            if user_response.status_code != 200:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to fetch GitHub user profile.")
                
            user_info = user_response.json()
            
            # Encrypt the token and save connection
            encrypted = encrypt_token(access_token)
            
            await self.repo.create_or_update(
                user_id=user_id,
                github_id=str(user_info["id"]),
                github_username=user_info["login"],
                encrypted_token=encrypted,
                github_name=user_info.get("name"),
                avatar_url=user_info.get("avatar_url"),
                provider="github",
                connection_type="OAuth"
            )
