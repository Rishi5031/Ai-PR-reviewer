# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

# 1. Overview API
class DashboardRepositories(BaseModel):
    total: int
    connected: int

class DashboardPullRequests(BaseModel):
    open: int
    closed: int
    reviewed: int
    pending_review: int

class DashboardReviews(BaseModel):
    total: int
    avg_score: float
    critical_findings: int

class DashboardHealth(BaseModel):
    average_health: float
    healthy_repositories: int
    needs_attention: int
    coverage: int

class DashboardOverviewResponse(BaseModel):
    repositories: DashboardRepositories
    pull_requests: DashboardPullRequests
    reviews: DashboardReviews
    health: DashboardHealth

# 2. Repositories API
class DashboardRepositoryResponse(BaseModel):
    id: str
    name: str
    owner: str
    health: float
    open_prs: int
    reviewed_prs: int
    last_review: Optional[datetime] = None
    status: str

# 3. Attention API
class DashboardAttentionItem(BaseModel):
    type: str
    repository: str
    pr_number: Optional[int] = None
    priority: str

# 4. Recent Reviews API
class DashboardRecentReview(BaseModel):
    id: uuid.UUID
    repository: str
    pr_number: int
    score: Optional[int] = None
    critical_findings: int
    created_at: datetime
    review_status: str

# 5. Activity API
class DashboardActivity(BaseModel):
    activity_type: str
    repository: str
    description: str
    created_at: datetime

# 6. Health Summary API
class DashboardHealthSummary(BaseModel):
    average_health: float
    highest_health_repository: Optional[str] = None
    lowest_health_repository: Optional[str] = None
    coverage: float
    confidence: str
    last_updated: Optional[datetime] = None
