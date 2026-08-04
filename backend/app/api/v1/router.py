# pyrefly: ignore [missing-import]
from fastapi import APIRouter

from app.api.v1.endpoints import auth, github

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(github.router, prefix="/github", tags=["github"])
