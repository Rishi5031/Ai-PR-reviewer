import uuid
from typing import List, Optional
from datetime import datetime
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, Query, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.modules.ai_reviews.review_dashboard_schema import (
    AIReviewSummaryResponse,
    PaginatedAIReviewsResponse,
    DashboardStatisticsResponse
)
from app.modules.ai_reviews.review_dashboard_repository import ReviewDashboardRepository
from app.modules.ai_reviews.review_dashboard_service import ReviewDashboardService

router = APIRouter()

def get_review_dashboard_service(db: AsyncSession = Depends(get_db)) -> ReviewDashboardService:
    repository = ReviewDashboardRepository(db)
    return ReviewDashboardService(repository)

@router.get("", response_model=PaginatedAIReviewsResponse)
async def get_all_reviews(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    repository: Optional[str] = None,
    recommendation: Optional[str] = None,
    min_score: Optional[int] = None,
    max_score: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    sort_by: str = Query("newest", regex="^(newest|oldest|highest_score|lowest_score)$"),
    current_user: User = Depends(get_current_user),
    service: ReviewDashboardService = Depends(get_review_dashboard_service)
):
    """
    Get all AI reviews for the authenticated user with pagination, filtering, search, and sorting.
    """
    return await service.get_reviews(
        user_id=current_user.id,
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


@router.get("/statistics", response_model=DashboardStatisticsResponse)
async def get_dashboard_statistics(
    current_user: User = Depends(get_current_user),
    service: ReviewDashboardService = Depends(get_review_dashboard_service)
):
    """
    Get dashboard statistics for the authenticated user.
    """
    return await service.get_statistics(user_id=current_user.id)


@router.get("/latest", response_model=List[AIReviewSummaryResponse])
async def get_latest_reviews(
    current_user: User = Depends(get_current_user),
    service: ReviewDashboardService = Depends(get_review_dashboard_service)
):
    """
    Get the latest 10 AI reviews for the authenticated user.
    """
    return await service.get_latest_reviews(user_id=current_user.id, limit=10)


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: ReviewDashboardService = Depends(get_review_dashboard_service)
):
    """
    Soft delete a specific AI review. Only the owner can delete it.
    """
    success = await service.delete_review(user_id=current_user.id, review_id=review_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
