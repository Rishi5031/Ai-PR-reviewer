import uuid
import re
from datetime import datetime
from typing import Optional
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator, ValidationInfo

class ProfileResponse(BaseModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr
    username: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None
    profile_image: Optional[str] = None
    provider: str
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    bio: Optional[str] = None
    timezone: Optional[str] = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError("Password must contain at least one special character")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info: "ValidationInfo") -> str:
        if "new_password" in info.data and v != info.data["new_password"]:
            raise ValueError("Passwords do not match")
        return v

class AccountInfoResponse(BaseModel):
    account_created: datetime
    last_login: Optional[datetime] = None
    authentication_provider: str
    email_verified: bool

class ConnectionsResponse(BaseModel):
    google: bool
    github: bool
    password_login: bool
    github_pat: bool
