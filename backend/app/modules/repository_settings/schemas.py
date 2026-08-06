from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import uuid
from datetime import datetime

class RepositorySettingsBase(BaseModel):
    ai_model: str = Field(default="gemini-2.5-flash")
    review_strictness: str = Field(default="medium", description="Review strictness level (low, medium, high)")
    ignore_files: List[str] = Field(default_factory=list, description="List of file patterns to ignore")
    coverage_threshold: int = Field(default=80, ge=50, le=100, description="Target coverage threshold")
    max_tokens: int = Field(default=5000, ge=1000, le=32000, description="Max input tokens limit for processing files")

    @field_validator("review_strictness")
    @classmethod
    def validate_strictness(cls, v: str) -> str:
        valid = {"low", "medium", "high"}
        if v.lower() not in valid:
            raise ValueError(f"review_strictness must be one of {valid}")
        return v.lower()

class RepositorySettingsCreate(RepositorySettingsBase):
    repository_id: str

class RepositorySettingsUpdate(RepositorySettingsBase):
    pass

class RepositorySettingsResponse(RepositorySettingsBase):
    id: uuid.UUID
    repository_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
