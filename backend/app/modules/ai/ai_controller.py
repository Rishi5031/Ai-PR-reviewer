import uuid
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.modules.ai.schemas import AIReviewRequest, AIReviewDB, AIReviewViewerResponse
from app.modules.ai.ai_service import AIService

router = APIRouter()

@router.post("/review", response_model=AIReviewDB)
async def generate_review(
    request: AIReviewRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AIService(db)
    return await service.generate_pr_review(current_user.id, request)

@router.get("/reviews/{review_id}", response_model=AIReviewDB)
async def get_review(
    review_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AIService(db)
    return await service.get_review(review_id, current_user.id)

@router.get("/repositories/{owner}/{repo}/pulls/{number}/latest-review", response_model=AIReviewDB)
async def get_latest_review(
    owner: str,
    repo: str,
    number: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AIService(db)
    return await service.get_latest_review(owner, repo, number, current_user.id)

@router.get("/repositories/{owner}/{repo}/pulls/{number}/review", response_model=AIReviewViewerResponse)
async def get_review_status(
    owner: str,
    repo: str,
    number: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AIService(db)
    return await service.get_review_status(owner, repo, number, current_user.id)
