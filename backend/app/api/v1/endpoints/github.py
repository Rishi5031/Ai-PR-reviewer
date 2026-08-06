from typing import List
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.github import (
    GitHubConnectRequest,
    GitHubStatusResponse,
    GitHubRepositoryBase,
    GitHubRepositoryDetails,
    GitHubLanguageStats,
    GitHubPullRequestSummary,
    GitHubPullRequestDetails,
    GitHubPullRequestFile,
    GitHubPullRequestCommit
)
from app.services.github_service import GitHubService
# pyrefly: ignore [missing-import]
from fastapi.responses import RedirectResponse
from app.services.github_oauth_service import GitHubOAuthService
from app.core.config import settings

router = APIRouter()

@router.post("/connect", response_model=GitHubStatusResponse)
async def connect_github(
    request: GitHubConnectRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.connect_account(current_user.id, request.token)

@router.get("/status", response_model=GitHubStatusResponse)
async def get_github_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.get_status(current_user.id)

@router.delete("/disconnect", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_github(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    success = await service.disconnect_account(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="GitHub account not connected."
        )
    return None


@router.get("/oauth/login")
async def github_oauth_login(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubOAuthService(db)
    auth_url = service.generate_login_url(current_user.id)
    return {"url": auth_url}

@router.get("/oauth/callback")
async def github_oauth_callback(
    code: str,
    state: str,
    db: AsyncSession = Depends(get_db)
):
    service = GitHubOAuthService(db)
    await service.exchange_code(code, state)
    
    # Redirect directly to repositories page, bypassing the intermediate success screen
    frontend_url = settings.FRONTEND_URL.split(",")[0]
    return RedirectResponse(url=f"{frontend_url}/repositories?connected=true")

@router.get("/oauth/status")
async def get_github_oauth_status(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # This can just reuse the standard get_status from GitHubService
    service = GitHubService(db)
    return await service.get_status(current_user.id)

@router.delete("/oauth/disconnect", status_code=status.HTTP_204_NO_CONTENT)
async def disconnect_github_oauth(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    success = await service.disconnect_account(current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="GitHub account not connected."
        )
    return None

@router.get("/repositories", response_model=List[GitHubRepositoryBase])
async def get_github_repositories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.fetch_repositories(current_user.id)

@router.get("/repositories/{owner}/{repo}", response_model=GitHubRepositoryDetails)
async def get_github_repository_details(
    owner: str,
    repo: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.fetch_repository_details(current_user.id, owner, repo)

@router.get("/repositories/{owner}/{repo}/languages", response_model=GitHubLanguageStats)
async def get_github_repository_languages(
    owner: str,
    repo: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.fetch_repository_languages(current_user.id, owner, repo)

@router.get("/repositories/{owner}/{repo}/pulls", response_model=List[GitHubPullRequestSummary])
async def get_github_pull_requests(
    owner: str,
    repo: str,
    state: str = "open",
    page: int = 1,
    per_page: int = 30,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.get_pull_requests(current_user.id, owner, repo, state, page, per_page)

@router.get("/repositories/{owner}/{repo}/pulls/{pull_number}", response_model=GitHubPullRequestDetails)
async def get_github_pull_request_details(
    owner: str,
    repo: str,
    pull_number: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.get_pull_request_details(current_user.id, owner, repo, pull_number)

@router.get("/repositories/{owner}/{repo}/pulls/{pull_number}/files", response_model=List[GitHubPullRequestFile])
async def get_github_pull_request_files(
    owner: str,
    repo: str,
    pull_number: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.get_pull_request_files(current_user.id, owner, repo, pull_number)

@router.get("/repositories/{owner}/{repo}/pulls/{pull_number}/commits", response_model=List[GitHubPullRequestCommit])
async def get_github_pull_request_commits(
    owner: str,
    repo: str,
    pull_number: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = GitHubService(db)
    return await service.get_pull_request_commits(current_user.id, owner, repo, pull_number)
