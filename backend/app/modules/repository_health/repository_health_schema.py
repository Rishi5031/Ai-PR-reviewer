# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class RepositoryInfo(BaseModel):
    repository_name: str
    owner: str
    default_branch: str
    repository_id: str

class OverallHealth(BaseModel):
    overall_health_score: float
    health_status: str
    total_reviews: int
    average_review_score: float

class AnalysisCoverage(BaseModel):
    reviewed_pull_requests: int
    total_pull_requests: int
    coverage_percentage: float

class ConfidenceLevel(BaseModel):
    confidence: str
    confidence_percentage: float



class MostCommonFinding(BaseModel):
    finding: str
    occurrences: int
    severity: str

class RepositoryExecutiveSummary(BaseModel):
    overall_health: str
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    recommended_next_step: str

class RepositoryHealthResponse(BaseModel):
    repository_information: RepositoryInfo
    overall_health: OverallHealth
    analysis_coverage: AnalysisCoverage
    confidence_level: ConfidenceLevel
    last_updated: Optional[datetime]
    most_common_findings: List[MostCommonFinding]
    strengths: List[str]
    weaknesses: List[str]
    repository_executive_summary: RepositoryExecutiveSummary
    health_disclaimer: str
