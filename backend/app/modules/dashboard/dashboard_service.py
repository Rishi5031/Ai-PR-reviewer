import uuid
from typing import List, Dict, Optional, Any
from datetime import datetime
from collections import defaultdict

from app.modules.dashboard.dashboard_repository import DashboardRepository
from app.modules.dashboard.dashboard_schema import (
    DashboardOverviewResponse, DashboardRepositories, DashboardPullRequests,
    DashboardReviews, DashboardHealth, DashboardRepositoryResponse,
    DashboardAttentionItem, DashboardRecentReview, DashboardActivity,
    DashboardHealthSummary
)

class DashboardService:
    def __init__(self, repository: DashboardRepository):
        self.repository = repository
        
    def _calculate_health_status(self, score: float) -> str:
        if score >= 90: return "Excellent"
        if score >= 80: return "Very Good"
        if score >= 70: return "Good"
        if score >= 60: return "Needs Improvement"
        return "Critical"

    async def get_overview(self, user_id: uuid.UUID) -> DashboardOverviewResponse:
        reviews = await self.repository.get_all_user_reviews(user_id)
        
        # 1. Repositories stats
        repo_names = {f"{r.owner}/{r.repository_name}" for r in reviews}
        
        # 2. PR stats (mapping pending -> open, completed -> closed)
        pending = sum(1 for r in reviews if r.review_status == "pending")
        completed = sum(1 for r in reviews if r.review_status == "completed")
        open_prs = pending
        closed_prs = completed
        
        # 3. Review stats
        total_reviews = len(reviews)
        total_score = sum(r.overall_score for r in reviews if r.overall_score is not None)
        avg_score = (total_score / total_reviews) if total_reviews > 0 else 0.0
        
        critical_findings = 0
        
        # 4. Repo Health calculation
        repo_scores = defaultdict(list)
        for r in reviews:
            if r.overall_score is not None:
                repo_scores[f"{r.owner}/{r.repository_name}"].append(r.overall_score)
            
            # Count critical findings
            if r.review_json:
                for key, items in r.review_json.items():
                    if isinstance(items, list) and len(items) > 0 and isinstance(items[0], dict) and "severity" in items[0]:
                        critical_findings += sum(1 for i in items if str(i.get("severity", "")).lower() == "critical")

        healthy_repos = 0
        needs_attention = 0
        for repo, scores in repo_scores.items():
            avg = sum(scores) / len(scores)
            if avg >= 70:
                healthy_repos += 1
            else:
                needs_attention += 1
                
        # Estimate coverage based on max PR number per repo
        repo_max_pr = defaultdict(int)
        for r in reviews:
            repo_id = f"{r.owner}/{r.repository_name}"
            if r.pull_request_number > repo_max_pr[repo_id]:
                repo_max_pr[repo_id] = r.pull_request_number
        
        reviewed_prs = len({f"{r.owner}/{r.repository_name}/{r.pull_request_number}" for r in reviews})
        total_known_prs = sum(repo_max_pr.values())
        coverage = int((reviewed_prs / total_known_prs) * 100) if total_known_prs > 0 else 0

        return DashboardOverviewResponse(
            repositories=DashboardRepositories(
                total=len(repo_names),
                connected=len(repo_names)
            ),
            pull_requests=DashboardPullRequests(
                open=open_prs,
                closed=closed_prs,
                reviewed=completed,
                pending_review=pending
            ),
            reviews=DashboardReviews(
                total=total_reviews,
                avg_score=round(avg_score, 1),
                critical_findings=critical_findings
            ),
            health=DashboardHealth(
                average_health=round(avg_score, 1),
                healthy_repositories=healthy_repos,
                needs_attention=needs_attention,
                coverage=coverage
            )
        )

    async def get_repositories(self, user_id: uuid.UUID) -> List[DashboardRepositoryResponse]:
        reviews = await self.repository.get_all_user_reviews(user_id)
        
        repos = defaultdict(lambda: {
            "name": "",
            "owner": "",
            "scores": [],
            "open_prs": 0,
            "reviewed_prs": 0,
            "last_review": None
        })
        
        for r in reviews:
            repo_id = f"{r.owner}/{r.repository_name}"
            repos[repo_id]["name"] = r.repository_name
            repos[repo_id]["owner"] = r.owner
            if r.overall_score is not None:
                repos[repo_id]["scores"].append(r.overall_score)
            if r.review_status == "pending":
                repos[repo_id]["open_prs"] += 1
            if r.review_status == "completed":
                repos[repo_id]["reviewed_prs"] += 1
                
            if repos[repo_id]["last_review"] is None or r.created_at > repos[repo_id]["last_review"]:
                repos[repo_id]["last_review"] = r.created_at
                
        response = []
        for repo_id, data in repos.items():
            avg = sum(data["scores"]) / len(data["scores"]) if data["scores"] else 0
            response.append(DashboardRepositoryResponse(
                id=repo_id,
                name=data["name"],
                owner=data["owner"],
                health=round(avg, 1),
                open_prs=data["open_prs"],
                reviewed_prs=data["reviewed_prs"],
                last_review=data["last_review"],
                status=self._calculate_health_status(avg)
            ))
            
        return response

    async def get_attention_items(self, user_id: uuid.UUID) -> List[DashboardAttentionItem]:
        reviews = await self.repository.get_all_user_reviews(user_id)
        items = []
        
        # 1. Pending reviews (Open PRs waiting for AI review)
        for r in reviews:
            if r.review_status == "pending":
                items.append(DashboardAttentionItem(
                    type="Pending Review",
                    repository=f"{r.owner}/{r.repository_name}",
                    pr_number=r.pull_request_number,
                    priority="High"
                ))
                
        # 2. Low health repos
        repo_scores = defaultdict(list)
        for r in reviews:
            if r.overall_score is not None:
                repo_scores[f"{r.owner}/{r.repository_name}"].append(r.overall_score)
                
        for repo, scores in repo_scores.items():
            avg = sum(scores) / len(scores)
            if avg < 70:
                items.append(DashboardAttentionItem(
                    type="Low Health",
                    repository=repo,
                    pr_number=None,
                    priority="Critical" if avg < 60 else "High"
                ))

        # Sort by priority
        priority_map = {"Critical": 1, "High": 2, "Medium": 3, "Low": 4}
        items.sort(key=lambda x: priority_map.get(x.priority, 5))
        
        return items

    async def get_recent_reviews(self, user_id: uuid.UUID) -> List[DashboardRecentReview]:
        reviews = await self.repository.get_latest_reviews(user_id, limit=5)
        response = []
        for r in reviews:
            critical_count = 0
            if r.review_json:
                for key, items in r.review_json.items():
                    if isinstance(items, list) and len(items) > 0 and isinstance(items[0], dict) and "severity" in items[0]:
                        critical_count += sum(1 for i in items if str(i.get("severity", "")).lower() == "critical")
                        
            response.append(DashboardRecentReview(
                id=r.id,
                repository=f"{r.owner}/{r.repository_name}",
                pr_number=r.pull_request_number,
                score=r.overall_score,
                critical_findings=critical_count,
                created_at=r.created_at,
                review_status=r.review_status
            ))
        return response

    async def get_activity(self, user_id: uuid.UUID) -> List[DashboardActivity]:
        reviews = await self.repository.get_all_user_reviews(user_id)
        activities = []
        
        for r in reviews:
            if r.review_status == "completed":
                activities.append(DashboardActivity(
                    activity_type="Review Generated",
                    repository=f"{r.owner}/{r.repository_name}",
                    description=f"AI Review generated for PR #{r.pull_request_number}",
                    created_at=r.updated_at
                ))
            elif r.review_status == "pending":
                activities.append(DashboardActivity(
                    activity_type="Review Requested",
                    repository=f"{r.owner}/{r.repository_name}",
                    description=f"AI Review requested for PR #{r.pull_request_number}",
                    created_at=r.created_at
                ))
                
        # Also include repo settings updates
        repo_ids = list({f"{r.owner}/{r.repository_name}" for r in reviews})
        settings = await self.repository.get_repository_settings_by_ids(repo_ids)
        for s in settings:
            activities.append(DashboardActivity(
                activity_type="Settings Updated",
                repository=s.repository_id,
                description=f"Repository settings updated for {s.repository_id}",
                created_at=s.updated_at
            ))
            
        activities.sort(key=lambda x: x.created_at, reverse=True)
        return activities[:10]

    async def get_health_summary(self, user_id: uuid.UUID) -> DashboardHealthSummary:
        reviews = await self.repository.get_all_user_reviews(user_id)
        
        if not reviews:
            return DashboardHealthSummary(
                average_health=0.0,
                highest_health_repository=None,
                lowest_health_repository=None,
                coverage=0.0,
                confidence="Low",
                last_updated=None
            )
            
        total_score = sum(r.overall_score for r in reviews if r.overall_score is not None)
        valid_reviews = sum(1 for r in reviews if r.overall_score is not None)
        avg_score = (total_score / valid_reviews) if valid_reviews > 0 else 0.0
        
        repo_scores = defaultdict(list)
        repo_max_pr = defaultdict(int)
        latest_update = None
        
        for r in reviews:
            repo_id = f"{r.owner}/{r.repository_name}"
            if r.overall_score is not None:
                repo_scores[repo_id].append(r.overall_score)
            if r.pull_request_number > repo_max_pr[repo_id]:
                repo_max_pr[repo_id] = r.pull_request_number
            if latest_update is None or r.created_at > latest_update:
                latest_update = r.created_at
                
        highest_repo = None
        lowest_repo = None
        highest_score = -1.0
        lowest_score = 101.0
        
        for repo, scores in repo_scores.items():
            avg = sum(scores) / len(scores)
            if avg > highest_score:
                highest_score = avg
                highest_repo = repo
            if avg < lowest_score:
                lowest_score = avg
                lowest_repo = repo
                
        reviewed_prs = len({f"{r.owner}/{r.repository_name}/{r.pull_request_number}" for r in reviews})
        total_known_prs = sum(repo_max_pr.values())
        coverage = (reviewed_prs / total_known_prs) * 100 if total_known_prs > 0 else 0.0
        
        confidence = "Low"
        if coverage >= 80: confidence = "High"
        elif coverage >= 50: confidence = "Medium"
        
        return DashboardHealthSummary(
            average_health=round(avg_score, 1),
            highest_health_repository=highest_repo,
            lowest_health_repository=lowest_repo,
            coverage=round(coverage, 1),
            confidence=confidence,
            last_updated=latest_update
        )
