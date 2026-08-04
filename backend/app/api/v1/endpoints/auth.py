# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, status
from typing import Any

from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenSchema, RefreshTokenRequest, GoogleLoginRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.api.deps import get_auth_service, get_current_user
from app.services.auth_service import AuthService
from app.models.user import User

router = APIRouter()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_in: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    return await auth_service.signup(user_in)

@router.post("/signin", response_model=TokenSchema)
async def signin(
    user_in: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    return await auth_service.login(user_in)

@router.post("/google", response_model=TokenSchema)
async def google_login(
    request: GoogleLoginRequest,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    return await auth_service.google_login(request.token)

@router.post("/refresh", response_model=TokenSchema)
async def refresh_token(
    request: RefreshTokenRequest,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    return await auth_service.refresh(request.refresh_token)

@router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    await auth_service.logout(current_user.id)
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    await auth_service.forgot_password(request.email)
    return {"message": "If an account exists with that email, a password reset link has been sent."}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    auth_service: AuthService = Depends(get_auth_service)
) -> Any:
    await auth_service.reset_password(request.token, request.new_password)
    return {"message": "Password successfully reset"}

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    return current_user
