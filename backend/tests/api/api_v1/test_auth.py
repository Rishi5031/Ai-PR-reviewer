# pyrefly: ignore [missing-import]
import pytest
import uuid
# pyrefly: ignore [missing-import]
from httpx import AsyncClient
from app.models.user import User

pytestmark = pytest.mark.asyncio

async def test_successful_logout(client: AsyncClient, test_user: User, user_token_headers: dict, test_db_session):
    # Get a refresh token by logging in again
    response = await client.post(
        "/api/v1/auth/signin",
        json={"email": test_user.email, "password": "testpassword123"}
    )
    assert response.status_code == 200
    tokens = response.json()
    refresh_token = tokens["refresh_token"]

    # Logout
    logout_response = await client.post(
        "/api/v1/auth/logout",
        headers=user_token_headers,
        json={"refresh_token": refresh_token}
    )
    assert logout_response.status_code == 200
    assert logout_response.json() == {"message": "Successfully logged out"}

    # Attempt to refresh with the revoked token
    refresh_response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert refresh_response.status_code == 401

async def test_logout_with_invalid_token(client: AsyncClient, user_token_headers: dict):
    logout_response = await client.post(
        "/api/v1/auth/logout",
        headers=user_token_headers,
        json={"refresh_token": "invalid_token_string"}
    )
    # The endpoint should be idempotent and return 200 even for invalid tokens on logout
    assert logout_response.status_code == 200

async def test_logout_with_already_revoked_token(client: AsyncClient, test_user: User, user_token_headers: dict, test_db_session):
    response = await client.post(
        "/api/v1/auth/signin",
        json={"email": test_user.email, "password": "testpassword123"}
    )
    tokens = response.json()
    refresh_token = tokens["refresh_token"]

    # First logout
    await client.post(
        "/api/v1/auth/logout",
        headers=user_token_headers,
        json={"refresh_token": refresh_token}
    )

    # Second logout (should be idempotent)
    logout_response = await client.post(
        "/api/v1/auth/logout",
        headers=user_token_headers,
        json={"refresh_token": refresh_token}
    )
    assert logout_response.status_code == 200

async def test_attempt_to_refresh_after_logout(client: AsyncClient, test_user: User, user_token_headers: dict):
    response = await client.post(
        "/api/v1/auth/signin",
        json={"email": test_user.email, "password": "testpassword123"}
    )
    tokens = response.json()
    refresh_token = tokens["refresh_token"]

    await client.post(
        "/api/v1/auth/logout",
        headers=user_token_headers,
        json={"refresh_token": refresh_token}
    )

    refresh_response = await client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token}
    )
    assert refresh_response.status_code == 401

async def test_another_users_session_cannot_be_revoked(
    client: AsyncClient, 
    test_user: User, 
    user_token_headers: dict, 
    other_user: User,
    other_user_token_headers: dict
):
    # User 1 logs in
    response = await client.post(
        "/api/v1/auth/signin",
        json={"email": test_user.email, "password": "testpassword123"}
    )
    tokens1 = response.json()
    refresh_token1 = tokens1["refresh_token"]

    # User 2 tries to logout User 1's session
    logout_response = await client.post(
        "/api/v1/auth/logout",
        headers=other_user_token_headers,
        json={"refresh_token": refresh_token1}
    )
    
    # Should be forbidden
    assert logout_response.status_code == 403
