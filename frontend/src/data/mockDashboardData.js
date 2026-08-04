export const mockStatistics = {
  repositories: {
    value: 12,
    trend: "+2 this month",
    trendUp: true
  },
  pullRequests: {
    value: 48,
    trend: "+12 this week",
    trendUp: true
  },
  aiReviews: {
    value: 156,
    trend: "+34 this week",
    trendUp: true
  },
  criticalIssues: {
    value: 3,
    trend: "-2 this week",
    trendUp: false
  },
  averageScore: {
    value: "94/100",
    trend: "+2 pts",
    trendUp: true
  },
  reviewsThisWeek: {
    value: 24,
    trend: "Consistent",
    trendUp: true
  }
};

export const mockRecentPullRequests = [
  {
    id: "PR-102",
    repository: "frontend-core",
    number: 102,
    author: "sarah-dev",
    status: "merged",
    createdAt: "2 hours ago"
  },
  {
    id: "PR-101",
    repository: "frontend-core",
    number: 101,
    author: "alex-chen",
    status: "reviewing",
    createdAt: "4 hours ago"
  },
  {
    id: "PR-54",
    repository: "backend-api",
    number: 54,
    author: "mike-smith",
    status: "open",
    createdAt: "1 day ago"
  },
  {
    id: "PR-53",
    repository: "backend-api",
    number: 53,
    author: "emily-wong",
    status: "merged",
    createdAt: "2 days ago"
  },
  {
    id: "PR-12",
    repository: "auth-service",
    number: 12,
    author: "david-kim",
    status: "closed",
    createdAt: "3 days ago"
  }
];

export const mockRecentReviews = [
  {
    id: "REV-204",
    repository: "frontend-core",
    prNumber: 102,
    score: 98,
    criticalIssues: 0,
    status: "passed",
    createdAt: "1 hour ago"
  },
  {
    id: "REV-203",
    repository: "frontend-core",
    prNumber: 101,
    score: 75,
    criticalIssues: 2,
    status: "issues_found",
    createdAt: "3 hours ago"
  },
  {
    id: "REV-202",
    repository: "backend-api",
    prNumber: 54,
    score: 92,
    criticalIssues: 0,
    status: "passed",
    createdAt: "1 day ago"
  },
  {
    id: "REV-201",
    repository: "backend-api",
    prNumber: 53,
    score: 64,
    criticalIssues: 5,
    status: "failed",
    createdAt: "2 days ago"
  }
];

export const mockActivityTimeline = [
  {
    id: "ACT-1",
    type: "review_completed",
    title: "AI Review Completed",
    description: "Review finished for frontend-core #102 with score 98/100.",
    timestamp: "1 hour ago"
  },
  {
    id: "ACT-2",
    type: "pr_synced",
    title: "Pull Request Synced",
    description: "New pull request #101 detected in frontend-core.",
    timestamp: "4 hours ago"
  },
  {
    id: "ACT-3",
    type: "repo_connected",
    title: "Repository Connected",
    description: "Successfully connected to github.com/org/payment-service.",
    timestamp: "1 day ago"
  },
  {
    id: "ACT-4",
    type: "review_failed",
    title: "Critical Issues Found",
    description: "AI detected 5 critical security issues in backend-api #53.",
    timestamp: "2 days ago"
  },
  {
    id: "ACT-5",
    type: "repo_updated",
    title: "Repository Settings Updated",
    description: "Changed default AI review strictness for auth-service.",
    timestamp: "3 days ago"
  }
];
