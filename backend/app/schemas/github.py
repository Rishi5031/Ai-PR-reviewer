from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class GitHubConnectRequest(BaseModel):
    token: str = Field(..., description="GitHub Personal Access Token (PAT)")

class GitHubStatusResponse(BaseModel):
    is_connected: bool
    github_username: Optional[str] = None
    avatar_url: Optional[str] = None
    connected_at: Optional[datetime] = None

class GitHubRepositoryBase(BaseModel):
    id: int
    name: str
    full_name: str
    private: bool
    html_url: str
    description: Optional[str] = None
    default_branch: str
    language: Optional[str] = None
    stargazers_count: int
    updated_at: str

class GitHubRepositoryDetails(GitHubRepositoryBase):
    topics: List[str] = []
    visibility: str
    open_issues_count: int

class GitHubLanguageStats(BaseModel):
    languages: Dict[str, int]

class GitHubPullRequestSummary(BaseModel):
    pull_number: int
    title: str
    state: str
    author: str
    created_at: str
    updated_at: str
    html_url: str

class GitHubPullRequestDetails(GitHubPullRequestSummary):
    description: Optional[str] = None
    base_branch: str
    head_branch: str
    merge_status: bool
    review_comments_count: int
    additions: int
    deletions: int
    changed_files_count: int
    commits_count: int

class GitHubPullRequestFile(BaseModel):
    filename: str
    status: str
    additions: int
    deletions: int
    changes: int
    patch: Optional[str] = None
    raw_url: str
    blob_url: str

class GitHubPullRequestCommit(BaseModel):
    sha: str
    message: str
    author_name: str
    date: str
