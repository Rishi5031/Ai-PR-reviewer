import uuid
from datetime import datetime
from typing import List, Optional
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

class AIReviewSummaryResponse(BaseModel):
    id: uuid.UUID
    repository_name: str
    owner: str
    pull_request_number: int
    review_status: str
    overall_score: Optional[int] = None
    recommendation: Optional[str] = None
    created_at: datetime
    # We won't return the full review_json in the list view to save bandwidth
    
    class Config:
        from_attributes = True

class PaginatedAIReviewsResponse(BaseModel):
    total: int
    page: int
    limit: int
    reviews: List[AIReviewSummaryResponse]

class DashboardStatisticsResponse(BaseModel):
    total_reviews: int
    average_score: Optional[float] = None
    repositories_reviewed: int
    high_risk_reviews: int
