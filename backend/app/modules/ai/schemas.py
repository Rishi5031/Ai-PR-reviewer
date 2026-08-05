from typing import List, Optional, Any
# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class AIReviewRequest(BaseModel):
    owner: str
    repository: str
    pull_number: int

class AIReviewIssue(BaseModel):
    title: str = Field(..., description="Short title of the issue")
    description: str = Field(..., description="Detailed description of the issue")
    severity: str = Field(..., description="Severity of the issue, e.g., low, medium, high, critical")
    file: Optional[str] = Field(None, description="The file path where the issue was found")
    line: Optional[int] = Field(None, description="The line number where the issue was found, if applicable")

class AIReviewGeminiOutput(BaseModel):
    overall_score: int = Field(..., ge=0, le=100, description="Overall score out of 100")
    summary: str = Field(..., description="A short summary of the review")
    recommendation: str = Field(..., description="Recommendation, e.g., 'Approve', 'Request Changes', 'Comment'")
    security: List[AIReviewIssue] = Field(default_factory=list)
    performance: List[AIReviewIssue] = Field(default_factory=list)
    bugs: List[AIReviewIssue] = Field(default_factory=list)
    code_quality: List[AIReviewIssue] = Field(default_factory=list)
    readability: List[AIReviewIssue] = Field(default_factory=list)
    testing: List[AIReviewIssue] = Field(default_factory=list)
    best_practices: List[AIReviewIssue] = Field(default_factory=list)

class AIReviewDB(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    repository_name: str
    owner: str
    pull_request_number: int
    review_status: str
    overall_score: Optional[int] = None
    summary: Optional[str] = None
    review_json: Optional[Any] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AIReviewViewerResponse(BaseModel):
    exists: bool
    review: Optional[AIReviewDB] = None
