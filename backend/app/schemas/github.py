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
