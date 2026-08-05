import uuid
from typing import List, Optional
from collections import defaultdict
from datetime import datetime
from app.modules.analytics.analytics_repository import AnalyticsRepository
from app.modules.analytics.analytics_schema import (
    AnalyticsDashboardResponse,
    AnalyticsOverview,
    ScoreTrend,
    CategoryCount,
    SeverityCount,
    RecommendationCount,
    RepositoryRanking,
    RepositoryHealth,
    HealthOverview,
    CommonFinding,
    ReviewActivity
)

class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository):
        self.repository = repository

    async def get_dashboard_data(
        self,
        user_id: uuid.UUID,
        repository: Optional[str] = None,
        date_range: Optional[str] = None,
        recommendation: Optional[str] = None,
        min_score: Optional[int] = None,
        max_score: Optional[int] = None,
    ) -> AnalyticsDashboardResponse:
        
        reviews = await self.repository.get_filtered_reviews(
            user_id=user_id,
            repository=repository,
            date_range=date_range,
            recommendation=recommendation,
            min_score=min_score,
            max_score=max_score
        )

        # 1. Initialize accumulators
        total_reviews = len(reviews)
        total_score_sum = 0
        repo_set = set()
        total_files = 0
        total_lines = 0
        
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        category_counts = defaultdict(int)
        recommendation_counts = defaultdict(int)
        finding_counts = defaultdict(int)
        
        # Trends and Activities
        date_score_sum = defaultdict(int)
        date_score_count = defaultdict(int)
        date_activity_count = defaultdict(int)
        
        # Repository Aggregation
        repo_data = defaultdict(lambda: {"score_sum": 0, "count": 0, "critical": 0, "recommendations": []})
        
        issue_categories = [
            "security", "performance", "bugs", "code_quality", 
            "readability", "maintainability", "testing", "best_practices"
        ]

        # 2. Single Pass Iteration (O(N))
        for r in reviews:
            r_json = r.review_json or {}
            
            # Basic info
            score = r.overall_score or 0
            repo_name = r.repository_name
            date_str = r.created_at.strftime("%Y-%m-%d")
            
            # Aggregates
            total_score_sum += score
            repo_set.add(repo_name)
            total_files += int(r_json.get("files_reviewed", 0) or 0)
            total_lines += int(r_json.get("lines_reviewed", 0) or 0)
            
            # Recommendation
            rec = r_json.get("recommendation", "Unknown")
            recommendation_counts[rec] += 1
            
            # Dates
            date_score_sum[date_str] += score
            date_score_count[date_str] += 1
            date_activity_count[date_str] += 1
            
            # Repo stats
            repo_data[repo_name]["score_sum"] += score
            repo_data[repo_name]["count"] += 1
            repo_data[repo_name]["recommendations"].append(rec)
            
            # Iterate issues
            for category in issue_categories:
                issues = r_json.get(category, [])
                if issues:
                    category_counts[category.replace("_", " ").title()] += len(issues)
                    for issue in issues:
                        sev = str(issue.get("severity", "Medium")).title()
                        if sev in severity_counts:
                            severity_counts[sev] += 1
                        else:
                            severity_counts["Medium"] += 1
                            
                        # Repo critical
                        if sev == "Critical":
                            repo_data[repo_name]["critical"] += 1
                            
                        # Common finding
                        issue_text = issue.get("issue", "").strip()
                        if issue_text:
                            finding_counts[issue_text] += 1

        # 3. Finalize Aggregations
        avg_score = (total_score_sum / total_reviews) if total_reviews > 0 else 0
        
        # Trends
        score_trend = [
            ScoreTrend(date=d, average_score=round(date_score_sum[d] / date_score_count[d], 1))
            for d in sorted(date_score_sum.keys())
        ]
        
        review_activity = [
            ReviewActivity(date=d, count=date_activity_count[d])
            for d in sorted(date_activity_count.keys())
        ]
        
        # Rankings
        rankings = []
        for rep, data in repo_data.items():
            rankings.append(RepositoryRanking(
                repository=rep,
                average_score=round(data["score_sum"] / data["count"], 1),
                reviews=data["count"],
                critical_findings=data["critical"]
            ))
        
        rankings.sort(key=lambda x: x.average_score, reverse=True)
        
        # Health
        best_repo = None
        worst_repo = None
        if rankings:
            best_rank = rankings[0]
            # Most common recommendation for best repo
            best_recs = repo_data[best_rank.repository]["recommendations"]
            best_rec = max(set(best_recs), key=best_recs.count)
            best_repo = RepositoryHealth(
                repository=best_rank.repository,
                average_score=best_rank.average_score,
                recommendation=best_rec,
                review_count=best_rank.reviews
            )
            
            worst_rank = rankings[-1]
            worst_recs = repo_data[worst_rank.repository]["recommendations"]
            worst_rec = max(set(worst_recs), key=worst_recs.count)
            worst_repo = RepositoryHealth(
                repository=worst_rank.repository,
                average_score=worst_rank.average_score,
                recommendation=worst_rec,
                review_count=worst_rank.reviews
            )
            
        # Findings
        sorted_findings = sorted(finding_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        most_common_findings = [CommonFinding(issue=k, count=v) for k, v in sorted_findings]
        
        # Distributions
        rec_dist = [RecommendationCount(recommendation=k, count=v) for k, v in recommendation_counts.items()]
        cat_dist = [CategoryCount(category=k, count=v) for k, v in category_counts.items()]
        sev_dist = [SeverityCount(severity=k, count=v) for k, v in severity_counts.items()]
        
        # 4. Generate Actionable Insights (Rule-based)
        insights = []
        if total_reviews == 0:
            insights.append("No reviews available in the selected period.")
        else:
            if avg_score < 70:
                insights.append("Overall code health is poor. Focus on addressing critical findings across all repositories.")
            elif avg_score > 85:
                insights.append("Your code quality is excellent. Maintain current development practices.")
                
            if worst_repo:
                insights.append(f"'{worst_repo.repository}' is currently the most problematic repository with an average score of {worst_repo.average_score}.")
                
            if severity_counts["Critical"] > 0:
                insights.append(f"Urgent: {severity_counts['Critical']} critical issues found. These should be addressed immediately.")
                
            if cat_dist:
                top_cat = max(cat_dist, key=lambda x: x.count)
                insights.append(f"The most common issue area is {top_cat.category}, accounting for {top_cat.count} issues.")
                
            if most_common_findings:
                insights.append(f"Recurring pattern detected: '{most_common_findings[0].issue}' has appeared {most_common_findings[0].count} times.")

        return AnalyticsDashboardResponse(
            overview=AnalyticsOverview(
                total_reviews=total_reviews,
                average_score=round(avg_score, 1),
                repositories_reviewed=len(repo_set),
                files_reviewed=total_files,
                lines_reviewed=total_lines,
                critical_findings=severity_counts["Critical"],
                high_findings=severity_counts["High"],
                medium_findings=severity_counts["Medium"],
                low_findings=severity_counts["Low"]
            ),
            score_trend=score_trend,
            recommendation_distribution=rec_dist,
            issue_category_distribution=cat_dist,
            severity_distribution=sev_dist,
            repository_rankings=rankings,
            repository_health=HealthOverview(best_repository=best_repo, worst_repository=worst_repo),
            most_common_findings=most_common_findings,
            review_activity=review_activity,
            actionable_insights=insights
        )
