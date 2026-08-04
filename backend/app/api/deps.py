# pyrefly: ignore [missing-import]
from fastapi import Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from fastapi.security import OAuth2PasswordBearer
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.db.session import AsyncSessionLocal
from app.core.security import verify_token
from app.core.config import settings
from app.models.user import User
from app.repositories.user_repo import UserRepository
from app.repositories.token_repo import TokenRepository
from app.repositories.password_reset_repo import PasswordResetRepository
from app.services.auth_service import AuthService
from app.services.email_service import EmailService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/signin")

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

async def get_user_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(db)

async def get_token_repo(db: AsyncSession = Depends(get_db)) -> TokenRepository:
    return TokenRepository(db)

async def get_password_reset_repo(db: AsyncSession = Depends(get_db)) -> PasswordResetRepository:
    return PasswordResetRepository(db)

def get_email_service() -> EmailService:
    return EmailService()

async def get_auth_service(
    user_repo: UserRepository = Depends(get_user_repo),
    token_repo: TokenRepository = Depends(get_token_repo),
    password_reset_repo: PasswordResetRepository = Depends(get_password_reset_repo),
    email_service: EmailService = Depends(get_email_service)
) -> AuthService:
    return AuthService(user_repo, token_repo, password_reset_repo, email_service)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_repo: UserRepository = Depends(get_user_repo)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token, settings.JWT_SECRET_KEY)
    if not payload or payload.get("type") != "access":
        raise credentials_exception
        
    user_id_str: str = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
        
    try:
        user_id = uuid.UUID(user_id_str)
    except ValueError:
        raise credentials_exception
        
    user = await user_repo.get_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user
