# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from app.modules.ai import ai_controller
from app.modules.ai_reviews import review_dashboard_controller
from app.modules.analytics import analytics_controller
from app.modules.repository_health import repository_health_controller

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ai_controller.router, prefix="/api/ai", tags=["ai"])
app.include_router(review_dashboard_controller.router, prefix="/api/ai-reviews", tags=["ai_reviews"])
app.include_router(analytics_controller.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(repository_health_controller.router, prefix="/api/repositories", tags=["repository_health"])

@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
