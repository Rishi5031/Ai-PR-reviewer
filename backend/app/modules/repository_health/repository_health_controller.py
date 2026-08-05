# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.modules.repository_health.repository_health_schema import RepositoryHealthResponse
from app.modules.repository_health.repository_health_repository import RepositoryHealthRepository
from app.modules.repository_health.repository_health_service import RepositoryHealthService

router = APIRouter()

def get_repository_health_service(db: AsyncSession = Depends(get_db)) -> RepositoryHealthService:
    repository = RepositoryHealthRepository(db)
    return RepositoryHealthService(repository)

@router.get("/{owner}/{repo}/health", response_model=RepositoryHealthResponse)
async def get_repository_health(
    owner: str,
    repo: str,
    current_user: User = Depends(get_current_user),
    service: RepositoryHealthService = Depends(get_repository_health_service)
):
    return await service.get_repository_health(
        user_id=current_user.id,
        owner=owner,
        repo=repo
    )
