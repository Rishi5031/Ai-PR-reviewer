import uuid
# pyrefly: ignore [missing-import]
import httpx
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from fastapi import HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.github_repo import GitHubRepository
from app.utils.encryption import encrypt_token, decrypt_token
from app.schemas.github import (
    GitHubStatusResponse, 
    GitHubRepositoryDetails, 
    GitHubRepositoryBase, 
    GitHubLanguageStats,
    GitHubPullRequestSummary,
    GitHubPullRequestDetails,
    GitHubPullRequestFile,
    GitHubPullRequestCommit
)

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
            connected_at=integration.connected_at,
            provider=integration.provider,
            connection_type=integration.connection_type
        )

    async def get_status(self, user_id: uuid.UUID) -> GitHubStatusResponse:
        integration = await self.repo.get_by_user_id(user_id)
        if not integration or not integration.is_connected:
            return GitHubStatusResponse(is_connected=False)
        
        return GitHubStatusResponse(
            is_connected=True,
            github_username=integration.github_username,
            avatar_url=integration.avatar_url,
            connected_at=integration.connected_at,
            provider=integration.provider,
            connection_type=integration.connection_type
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

    async def get_pull_requests(self, user_id: uuid.UUID, owner: str, repo: str, state: str = "open", page: int = 1, per_page: int = 30) -> List[GitHubPullRequestSummary]:
        token = await self.get_decrypted_token(user_id)
        url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls?state={state}&page={page}&per_page={per_page}"
        data = await self._make_github_request("GET", url, token)
        
        return [
            GitHubPullRequestSummary(
                pull_number=pr["number"],
                title=pr["title"],
                state=pr["state"],
                author=pr["user"]["login"],
                created_at=pr["created_at"],
                updated_at=pr["updated_at"],
                html_url=pr["html_url"]
            )
            for pr in data
        ]

    async def get_pull_request_details(self, user_id: uuid.UUID, owner: str, repo: str, pull_number: int) -> GitHubPullRequestDetails:
        token = await self.get_decrypted_token(user_id)
        url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls/{pull_number}"
        data = await self._make_github_request("GET", url, token)
        
        return GitHubPullRequestDetails(
            pull_number=data["number"],
            title=data["title"],
            state=data["state"],
            author=data["user"]["login"],
            created_at=data["created_at"],
            updated_at=data["updated_at"],
            html_url=data["html_url"],
            description=data.get("body"),
            base_branch=data["base"]["ref"],
            head_branch=data["head"]["ref"],
            merge_status=data.get("merged", False),
            review_comments_count=data.get("review_comments", 0),
            additions=data.get("additions", 0),
            deletions=data.get("deletions", 0),
            changed_files_count=data.get("changed_files", 0),
            commits_count=data.get("commits", 0)
        )

    async def get_pull_request_files(self, user_id: uuid.UUID, owner: str, repo: str, pull_number: int) -> List[GitHubPullRequestFile]:
        token = await self.get_decrypted_token(user_id)
        url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls/{pull_number}/files?per_page=100"
        data = await self._make_github_request("GET", url, token)
        
        return [
            GitHubPullRequestFile(
                filename=f["filename"],
                status=f["status"],
                additions=f["additions"],
                deletions=f["deletions"],
                changes=f["changes"],
                patch=f.get("patch"),
                raw_url=f["raw_url"],
                blob_url=f["blob_url"]
            )
            for f in data
        ]

    async def get_pull_request_commits(self, user_id: uuid.UUID, owner: str, repo: str, pull_number: int) -> List[GitHubPullRequestCommit]:
        token = await self.get_decrypted_token(user_id)
        url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/pulls/{pull_number}/commits?per_page=100"
        data = await self._make_github_request("GET", url, token)
        
        return [
            GitHubPullRequestCommit(
                sha=c["sha"],
                message=c["commit"]["message"],
                author_name=c["commit"]["author"]["name"],
                date=c["commit"]["author"]["date"]
            )
            for c in data
        ]
