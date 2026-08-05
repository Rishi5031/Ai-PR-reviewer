import uuid
from typing import List, Optional
from collections import defaultdict
from datetime import datetime, timezone
# pyrefly: ignore [missing-import]
from fastapi import HTTPException
from app.modules.repository_health.repository_health_repository import RepositoryHealthRepository
from app.modules.repository_health.repository_health_schema import (
    RepositoryHealthResponse, RepositoryInfo, OverallHealth, AnalysisCoverage,
    ConfidenceLevel, MostCommonFinding,
    RepositoryExecutiveSummary
)

class RepositoryHealthService:
    def __init__(self, repository: RepositoryHealthRepository):
        self.repository = repository

    def _calculate_health_status(self, score: float) -> str:
        if score >= 90: return "Excellent"
        if score >= 80: return "Very Good"
        if score >= 70: return "Good"
        if score >= 60: return "Needs Improvement"
        return "Critical"

    async def get_repository_health(self, user_id: uuid.UUID, owner: str, repo: str) -> RepositoryHealthResponse:
        reviews = await self.repository.get_reviews_for_repository(user_id, owner, repo)
        
        if not reviews:
            raise HTTPException(status_code=404, detail="No AI Reviews found for this repository. Generate reviews to calculate health.")

        # Data collection
        total_reviews = len(reviews)
        total_score_sum = 0
        pr_numbers = set()
        max_pr_number = 0
        
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        finding_counts = defaultdict(lambda: {"count": 0, "severity": "Medium"})
        
        date_score_sum = defaultdict(int)
        date_score_count = defaultdict(int)
        
        # Common categories from Gemini schema
        issue_categories = [
            "security", "code_quality", "performance", "testing", 
            "architecture", "maintainability", "best_practices"
        ]
        
        category_issues = {cat: 0 for cat in issue_categories}
        
        latest_timestamp = None

        for r in reviews:
            r_json = r.review_json or {}
            
            # Dates
            if latest_timestamp is None or r.created_at > latest_timestamp:
                latest_timestamp = r.created_at
                
            date_str = r.created_at.strftime("%Y-%m-%d")
            
            # Basic stats
            score = r.overall_score or 0
            total_score_sum += score
            pr_num = r.pull_request_number
            pr_numbers.add(pr_num)
            if pr_num > max_pr_number:
                max_pr_number = pr_num
                
            # Trends
            date_score_sum[date_str] += score
            date_score_count[date_str] += 1
            
            # Categories and Findings
            # The gemini output might have 'bugs' instead of 'code_quality' or 'readability' instead of 'maintainability'
            # Let's map all possible arrays dynamically
            for key, items in r_json.items():
                if isinstance(items, list) and items and isinstance(items[0], dict) and "issue" in items[0]:
                    # Match to our explicit categories if possible, else default to 'code_quality'
                    matched_cat = "code_quality"
                    for cat in issue_categories:
                        if cat in key:
                            matched_cat = cat
                            break
                    if "bug" in key: matched_cat = "code_quality"
                    if "readability" in key: matched_cat = "maintainability"
                    
                    category_issues[matched_cat] += len(items)
                    
                    for issue in items:
                        sev = str(issue.get("severity", "Medium")).title()
                        if sev in severity_counts:
                            severity_counts[sev] += 1
                        else:
                            severity_counts["Medium"] += 1
                            
                        issue_text = issue.get("issue", "").strip()
                        if issue_text:
                            finding_counts[issue_text]["count"] += 1
                            finding_counts[issue_text]["severity"] = sev

        # Calculate Averages
        avg_score = total_score_sum / total_reviews if total_reviews > 0 else 0
        
        # Coverage
        reviewed_prs = len(pr_numbers)
        coverage_pct = (reviewed_prs / max_pr_number * 100) if max_pr_number > 0 else 0
        
        if coverage_pct >= 80:
            confidence = "High"
        elif coverage_pct >= 50:
            confidence = "Medium"
        else:
            confidence = "Low"
            
        # Findings
        sorted_findings = sorted(finding_counts.items(), key=lambda x: x[1]["count"], reverse=True)[:10]
        most_common = [
            MostCommonFinding(finding=k, occurrences=v["count"], severity=v["severity"])
            for k, v in sorted_findings
        ]
        

        # Category Scores
        # We invert the issue count to a score out of 10. (e.g. 0 issues = 10, >10 issues = 0)
        def calc_cat_score(issue_count: int, total: int) -> float:
            if total == 0: return 10.0
            avg_issues = issue_count / total
            score = max(0.0, 10.0 - avg_issues)
            return round(score, 1)

        cat_scores_dict = {cat: calc_cat_score(category_issues[cat], total_reviews) for cat in issue_categories}
        
        # Strengths and Weaknesses
        sorted_cats = sorted(cat_scores_dict.items(), key=lambda x: x[1])
        weaknesses = [k.replace("_", " ").title() for k, v in sorted_cats[:3]]
        strengths = [k.replace("_", " ").title() for k, v in sorted_cats[-3:]]
        strengths.reverse() # Highest scores first
        
        # Executive Summary
        status = self._calculate_health_status(avg_score)
        summary = f"The overall health of {repo} is {status}. It demonstrates strong engineering practices in {', '.join(strengths)}, but requires immediate attention in {', '.join(weaknesses)}."
        next_step = f"Focus on addressing {severity_counts['Critical']} critical and {severity_counts['High']} high severity findings in the upcoming sprint." if (severity_counts['Critical'] + severity_counts['High']) > 0 else "Continue maintaining current quality standards and improve review coverage."
        
        exec_summary = RepositoryExecutiveSummary(
            overall_health=status,
            summary=summary,
            strengths=strengths,
            weaknesses=weaknesses,
            recommended_next_step=next_step
        )
        
        # Disclaimer
        disclaimer = "This Repository Health score is calculated only from Pull Requests that have been reviewed by CodeGuardian AI. Reviewing more Pull Requests will improve the accuracy of repository insights."
        
        return RepositoryHealthResponse(
            repository_information=RepositoryInfo(
                repository_name=repo,
                owner=owner,
                default_branch="main", # Cannot infer from DB alone accurately
                repository_id=f"{owner}/{repo}"
            ),
            overall_health=OverallHealth(
                overall_health_score=round(avg_score/10, 1),
                health_status=status,
                total_reviews=total_reviews,
                average_review_score=round(avg_score, 1)
            ),
            analysis_coverage=AnalysisCoverage(
                reviewed_pull_requests=reviewed_prs,
                total_pull_requests=max_pr_number,
                coverage_percentage=round(coverage_pct, 1)
            ),
            confidence_level=ConfidenceLevel(
                confidence=confidence,
                confidence_percentage=round(coverage_pct, 1)
            ),
            last_updated=latest_timestamp,
            most_common_findings=most_common,
            strengths=strengths,
            weaknesses=weaknesses,
            repository_executive_summary=exec_summary,
            health_disclaimer=disclaimer
        )
