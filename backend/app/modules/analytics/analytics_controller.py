# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, Query
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.modules.analytics.analytics_schema import AnalyticsDashboardResponse
from app.modules.analytics.analytics_repository import AnalyticsRepository
from app.modules.analytics.analytics_service import AnalyticsService

router = APIRouter()

def get_analytics_service(db: AsyncSession = Depends(get_db)) -> AnalyticsService:
    repository = AnalyticsRepository(db)
    return AnalyticsService(repository)

@router.get("/dashboard", response_model=AnalyticsDashboardResponse)
async def get_analytics_dashboard(
    repository: Optional[str] = Query(None, description="Filter by repository name"),
    date_range: Optional[str] = Query(None, description="Filter by date range (today, week, month)"),
    recommendation: Optional[str] = Query(None, description="Filter by recommendation"),
    minimum_score: Optional[int] = Query(None, description="Minimum overall score"),
    maximum_score: Optional[int] = Query(None, description="Maximum overall score"),
    current_user: User = Depends(get_current_user),
    service: AnalyticsService = Depends(get_analytics_service)
):
    return await service.get_dashboard_data(
        user_id=current_user.id,
        repository=repository,
        date_range=date_range,
        recommendation=recommendation,
        min_score=minimum_score,
        max_score=maximum_score
    )
