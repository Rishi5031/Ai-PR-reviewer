# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.router import api_router

from contextlib import asynccontextmanager
from app.db.session import engine
from app.models import Base

# pyrefly: ignore [missing-import]
from sqlalchemy import text
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Migrate github_integrations safely
        await conn.execute(text("ALTER TABLE github_integrations ADD COLUMN IF NOT EXISTS provider VARCHAR DEFAULT 'github'"))
        await conn.execute(text("ALTER TABLE github_integrations ADD COLUMN IF NOT EXISTS connection_type VARCHAR DEFAULT 'PAT'"))
        
        # Migrate users table safely
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR UNIQUE"))
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS company VARCHAR"))
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title VARCHAR"))
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS bio VARCHAR"))
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR"))
        await conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR DEFAULT 'email'"))
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
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
from app.modules.repository_settings import repository_settings_controller
from app.modules.dashboard import dashboard_controller
from app.modules.profile import profile_controller

app.include_router(api_router, prefix=settings.API_V1_STR)
app.include_router(ai_controller.router, prefix=f"{settings.API_V1_STR}/ai", tags=["ai"])
app.include_router(review_dashboard_controller.router, prefix=f"{settings.API_V1_STR}/ai-reviews", tags=["ai_reviews"])
app.include_router(analytics_controller.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(repository_health_controller.router, prefix=f"{settings.API_V1_STR}/repositories", tags=["repository_health"])
app.include_router(repository_settings_controller.router, prefix=f"{settings.API_V1_STR}/repositories", tags=["repository_settings"])
app.include_router(dashboard_controller.router, prefix=f"{settings.API_V1_STR}/dashboard", tags=["dashboard"])
app.include_router(profile_controller.router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])
@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}

# pyrefly: ignore [missing-import]
from fastapi import Request
# pyrefly: ignore [missing-import]
from fastapi.responses import RedirectResponse

@app.get("/api/github/callback", include_in_schema=False)
async def github_callback_redirect(request: Request):
    """
    Redirects the legacy callback URL configured in GitHub OAuth App 
    to the correct v1 endpoint, preserving query parameters (code, state).
    """
    query_params = request.url.query
    return RedirectResponse(
        url=f"/api/v1/github/oauth/callback?{query_params}", 
        status_code=307
    )
