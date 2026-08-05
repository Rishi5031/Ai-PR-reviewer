import uuid
from typing import List, Tuple, Optional
from datetime import datetime

from app.modules.ai_reviews.review_dashboard_repository import ReviewDashboardRepository
from app.modules.ai_reviews.review_dashboard_schema import (
    AIReviewSummaryResponse,
    PaginatedAIReviewsResponse,
    DashboardStatisticsResponse
)
from app.modules.ai.models import AIReview

class ReviewDashboardService:
    def __init__(self, repository: ReviewDashboardRepository):
        self.repository = repository

    def _format_review(self, r: AIReview) -> AIReviewSummaryResponse:
        rec = None
        if r.review_json:
            rec = r.review_json.get("recommendation")
        
        return AIReviewSummaryResponse(
            id=r.id,
            repository_name=r.repository_name,
            owner=r.owner,
            pull_request_number=r.pull_request_number,
            review_status=r.review_status,
            overall_score=r.overall_score,
            recommendation=rec,
            created_at=r.created_at
        )

    async def get_reviews(
        self,
        user_id: uuid.UUID,
        page: int = 1,
        limit: int = 10,
        repository: Optional[str] = None,
        recommendation: Optional[str] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        sort_by: str = "newest",
    ) -> PaginatedAIReviewsResponse:
        
        total, reviews = await self.repository.get_reviews(
            user_id=user_id,
            page=page,
            limit=limit,
            repository=repository,
            recommendation=recommendation,
            min_score=min_score,
            max_score=max_score,
            start_date=start_date,
            end_date=end_date,
            sort_by=sort_by
        )
        
        summary_reviews = [self._format_review(r) for r in reviews]
        
        return PaginatedAIReviewsResponse(
            total=total,
            page=page,
            limit=limit,
            reviews=summary_reviews
        )

    async def get_latest_reviews(self, user_id: uuid.UUID, limit: int = 10) -> List[AIReviewSummaryResponse]:
        reviews = await self.repository.get_latest_reviews(user_id=user_id, limit=limit)
        return [self._format_review(r) for r in reviews]

    async def get_statistics(self, user_id: uuid.UUID) -> DashboardStatisticsResponse:
        stats_dict = await self.repository.get_statistics(user_id=user_id)
        return DashboardStatisticsResponse(**stats_dict)

    async def delete_review(self, user_id: uuid.UUID, review_id: uuid.UUID) -> bool:
        review = await self.repository.get_review_by_id(user_id=user_id, review_id=review_id)
        if not review:
            return False
            
        await self.repository.delete_review(review)
        return True
