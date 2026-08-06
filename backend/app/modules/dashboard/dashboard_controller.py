from typing import List
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User

from app.modules.dashboard.dashboard_repository import DashboardRepository
from app.modules.dashboard.dashboard_service import DashboardService
from app.modules.dashboard.dashboard_schema import (
    DashboardOverviewResponse, DashboardRepositoryResponse,
    DashboardAttentionItem, DashboardRecentReview, DashboardActivity,
    DashboardHealthSummary
)

router = APIRouter()

def get_dashboard_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    repo = DashboardRepository(db)
    return DashboardService(repo)

@router.get("/overview", response_model=DashboardOverviewResponse)
async def get_dashboard_overview(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_overview(current_user.id)

@router.get("/repositories", response_model=List[DashboardRepositoryResponse])
async def get_dashboard_repositories(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_repositories(current_user.id)

@router.get("/attention", response_model=List[DashboardAttentionItem])
async def get_dashboard_attention(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_attention_items(current_user.id)

@router.get("/recent-reviews", response_model=List[DashboardRecentReview])
async def get_dashboard_recent_reviews(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_recent_reviews(current_user.id)

@router.get("/activity", response_model=List[DashboardActivity])
async def get_dashboard_activity(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_activity(current_user.id)

@router.get("/health-summary", response_model=DashboardHealthSummary)
async def get_dashboard_health_summary(
    service: DashboardService = Depends(get_dashboard_service),
    current_user: User = Depends(get_current_user)
):
    return await service.get_health_summary(current_user.id)
