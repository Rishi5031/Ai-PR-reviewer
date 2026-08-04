import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner';
import { StatisticCard } from '../../components/dashboard/StatisticCard';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { RecentPullRequests } from '../../components/dashboard/RecentPullRequests';
import { RecentReviews } from '../../components/dashboard/RecentReviews';
import { ActivityTimeline } from '../../components/dashboard/ActivityTimeline';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { FolderSearch, FolderGit2, GitPullRequest, Bot, BarChart2 } from 'lucide-react';
import { 
  mockStatistics, 
  mockRecentPullRequests, 
  mockRecentReviews, 
  mockActivityTimeline 
} from '../../data/mockDashboardData';

export const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Small delay to show off the skeleton loader
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Example of how we might handle empty states
  const hasData = mockRecentPullRequests.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-8">
        <WelcomeBanner />
        <QuickActions />
        <EmptyState 
          icon={FolderSearch}
          title="No repositories connected"
          description="Connect your first repository to start reviewing pull requests and improving your code quality."
          actionLabel="Connect Repository"
          onAction={() => console.log('Connect repo clicked')}
          className="min-h-[400px]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <WelcomeBanner />
      
      <QuickActions />

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatisticCard 
          title="Repositories" 
          value={mockStatistics.repositories.value} 
          icon={FolderGit2} 
          trend={mockStatistics.repositories.trend} 
          trendUp={mockStatistics.repositories.trendUp} 
        />
        <StatisticCard 
          title="Pull Requests" 
          value={mockStatistics.pullRequests.value} 
          icon={GitPullRequest} 
          trend={mockStatistics.pullRequests.trend} 
          trendUp={mockStatistics.pullRequests.trendUp} 
        />
        <StatisticCard 
          title="AI Reviews" 
          value={mockStatistics.aiReviews.value} 
          icon={Bot} 
          trend={mockStatistics.aiReviews.trend} 
          trendUp={mockStatistics.aiReviews.trendUp} 
        />
        <StatisticCard 
          title="Critical Issues" 
          value={mockStatistics.criticalIssues.value} 
          icon={BarChart2} 
          trend={mockStatistics.criticalIssues.trend} 
          trendUp={mockStatistics.criticalIssues.trendUp} 
        />
        <StatisticCard 
          title="Avg Quality Score" 
          value={mockStatistics.averageScore.value} 
          icon={BarChart2} 
          trend={mockStatistics.averageScore.trend} 
          trendUp={mockStatistics.averageScore.trendUp} 
        />
        <StatisticCard 
          title="Reviews This Week" 
          value={mockStatistics.reviewsThisWeek.value} 
          icon={Bot} 
          trend={mockStatistics.reviewsThisWeek.trend} 
          trendUp={mockStatistics.reviewsThisWeek.trendUp} 
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Takes up 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          <RecentPullRequests data={mockRecentPullRequests} />
          <RecentReviews data={mockRecentReviews} />
        </div>

        {/* Right Column - Takes up 1/3 space on large screens */}
        <div className="lg:col-span-1">
          <ActivityTimeline data={mockActivityTimeline} />
        </div>
      </div>
    </div>
  );
};
