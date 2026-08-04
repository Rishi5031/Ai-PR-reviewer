import uuid
import httpx
from typing import Dict, Any, List
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.github_repo import GitHubRepository
from app.utils.encryption import encrypt_token, decrypt_token
from app.schemas.github import GitHubStatusResponse, GitHubRepositoryDetails, GitHubRepositoryBase, GitHubLanguageStats

GITHUB_API_BASE = "https://api.github.com"

class GitHubService:
    def __init__(self, db: AsyncSession):
        self.repo = GitHubRepository(db)

    async def _make_github_request(self, method: str, url: str, token: str) -> Dict[str, Any]:
        headers = {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "CodeGuardian-AI"
        }
        async with httpx.AsyncClient() as client:
            response = await client.request(method, url, headers=headers)
            
            if response.status_code == 401:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid or expired GitHub token."
                )
            if response.status_code == 403:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="GitHub API rate limit exceeded or access forbidden."
                )
            if response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="GitHub resource not found."
                )
            if response.status_code >= 400:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"GitHub API error: {response.text}"
                )
            
            return response.json()

    async def connect_account(self, user_id: uuid.UUID, token: str) -> GitHubStatusResponse:
        """Validates the token, fetches GitHub profile, and stores the integration."""
        user_data = await self._make_github_request("GET", f"{GITHUB_API_BASE}/user", token)
        
        # Check if another user already connected this GitHub account
        # (Could add a repo method to check by github_id, but skipping for simplicity since unique constraint will catch it)

        encrypted = encrypt_token(token)
        
        integration = await self.repo.create_or_update(
            user_id=user_id,
            github_id=str(user_data["id"]),
            github_username=user_data["login"],
            encrypted_token=encrypted,
            github_name=user_data.get("name"),
            avatar_url=user_data.get("avatar_url")
        )

        return GitHubStatusResponse(
            is_connected=True,
            github_username=integration.github_username,
            avatar_url=integration.avatar_url,
            connected_at=integration.connected_at
        )

    async def get_status(self, user_id: uuid.UUID) -> GitHubStatusResponse:
        integration = await self.repo.get_by_user_id(user_id)
        if not integration or not integration.is_connected:
            return GitHubStatusResponse(is_connected=False)
        
        return GitHubStatusResponse(
            is_connected=True,
            github_username=integration.github_username,
            avatar_url=integration.avatar_url,
            connected_at=integration.connected_at
        )

    async def disconnect_account(self, user_id: uuid.UUID) -> bool:
        return await self.repo.delete_by_user_id(user_id)

    async def get_decrypted_token(self, user_id: uuid.UUID) -> str:
        integration = await self.repo.get_by_user_id(user_id)
        if not integration or not integration.is_connected:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="GitHub account is not connected."
            )
        return decrypt_token(integration.encrypted_token)

    async def fetch_repositories(self, user_id: uuid.UUID) -> List[GitHubRepositoryBase]:
        token = await self.get_decrypted_token(user_id)
        
        # Fetch repos (pagination could be added later, fetching 100 for now)
        data = await self._make_github_request("GET", f"{GITHUB_API_BASE}/user/repos?per_page=100&sort=updated", token)
        
        repos = []
        for repo in data:
            repos.append(GitHubRepositoryBase(
                id=repo["id"],
                name=repo["name"],
                full_name=repo["full_name"],
                private=repo["private"],
                html_url=repo["html_url"],
                description=repo.get("description"),
                default_branch=repo["default_branch"],
                language=repo.get("language"),
                stargazers_count=repo["stargazers_count"],
                updated_at=repo["updated_at"]
            ))
        return repos

    async def fetch_repository_details(self, user_id: uuid.UUID, owner: str, repo: str) -> GitHubRepositoryDetails:
        token = await self.get_decrypted_token(user_id)
        data = await self._make_github_request("GET", f"{GITHUB_API_BASE}/repos/{owner}/{repo}", token)
        
        return GitHubRepositoryDetails(
            id=data["id"],
            name=data["name"],
            full_name=data["full_name"],
            private=data["private"],
            html_url=data["html_url"],
            description=data.get("description"),
            default_branch=data["default_branch"],
            language=data.get("language"),
            stargazers_count=data["stargazers_count"],
            updated_at=data["updated_at"],
            topics=data.get("topics", []),
            visibility=data.get("visibility", "public"),
            open_issues_count=data["open_issues_count"]
        )

    async def fetch_repository_languages(self, user_id: uuid.UUID, owner: str, repo: str) -> GitHubLanguageStats:
        token = await self.get_decrypted_token(user_id)
        data = await self._make_github_request("GET", f"{GITHUB_API_BASE}/repos/{owner}/{repo}/languages", token)
        
        return GitHubLanguageStats(languages=data)
