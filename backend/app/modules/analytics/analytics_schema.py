# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional

class ScoreTrend(BaseModel):
    date: str
    average_score: float

class CategoryCount(BaseModel):
    category: str
    count: int

class SeverityCount(BaseModel):
    severity: str
    count: int

class RecommendationCount(BaseModel):
    recommendation: str
    count: int

class RepositoryRanking(BaseModel):
    repository: str
    average_score: float
    reviews: int
    critical_findings: int

class RepositoryHealth(BaseModel):
    repository: str
    average_score: float
    recommendation: str
    review_count: int

class HealthOverview(BaseModel):
    best_repository: Optional[RepositoryHealth] = None
    worst_repository: Optional[RepositoryHealth] = None

class CommonFinding(BaseModel):
    issue: str
    count: int

class ReviewActivity(BaseModel):
    date: str
    count: int

class AnalyticsOverview(BaseModel):
    total_reviews: int
    average_score: float
    repositories_reviewed: int
    files_reviewed: int
    lines_reviewed: int
    critical_findings: int
    high_findings: int
    medium_findings: int
    low_findings: int

class AnalyticsDashboardResponse(BaseModel):
    overview: AnalyticsOverview
    score_trend: List[ScoreTrend]
    recommendation_distribution: List[RecommendationCount]
    issue_category_distribution: List[CategoryCount]
    severity_distribution: List[SeverityCount]
    repository_rankings: List[RepositoryRanking]
    repository_health: HealthOverview
    most_common_findings: List[CommonFinding]
    review_activity: List[ReviewActivity]
    actionable_insights: List[str]
