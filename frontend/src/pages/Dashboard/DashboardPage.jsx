import React from 'react';
import { WelcomeBanner } from '../../components/dashboard/WelcomeBanner';
import { StatisticCard } from '../../components/dashboard/StatisticCard';
import { RepositoryOverview } from '../../components/dashboard/RepositoryOverview';
import { NeedsAttention } from '../../components/dashboard/NeedsAttention';
import { RepositoryHealthSummary } from '../../components/dashboard/RepositoryHealthSummary';
import { RecentReviews } from '../../components/dashboard/RecentReviews';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { EmptyState } from '../../components/dashboard/EmptyState';
import { DashboardSkeleton } from '../../components/dashboard/DashboardSkeleton';
import { FolderSearch, FolderGit2, GitPullRequest, Bot, BarChart2, Activity } from 'lucide-react';

import {
  useDashboardOverview,
  useDashboardRepositories,
  useDashboardAttention,
  useDashboardRecentReviews,
  useDashboardActivity,
  useDashboardHealthSummary
} from '../../hooks/useDashboard';

export const DashboardPage = () => {
  const { data: overview, isLoading: loadingOverview } = useDashboardOverview();
  const { data: repositories, isLoading: loadingRepos } = useDashboardRepositories();
  const { data: attentionItems, isLoading: loadingAttention } = useDashboardAttention();
  const { data: recentReviews, isLoading: loadingReviews } = useDashboardRecentReviews();
  const { data: activity, isLoading: loadingActivity } = useDashboardActivity();
  const { data: healthSummary, isLoading: loadingHealth } = useDashboardHealthSummary();

  const isLoading = loadingOverview || loadingRepos || loadingAttention || loadingReviews || loadingActivity || loadingHealth;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Handle empty state if no repositories are connected
  const hasData = overview && overview.repositories.total > 0;

  if (!hasData) {
    return (
      <div className="space-y-8">
        <WelcomeBanner />
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

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard 
          title="Connected Repositories" 
          value={overview?.repositories.connected || 0} 
          icon={FolderGit2} 
        />
        <StatisticCard 
          title="Open Pull Requests" 
          value={overview?.pull_requests.open || 0} 
          icon={GitPullRequest} 
        />
        <StatisticCard 
          title="Total AI Reviews" 
          value={overview?.reviews.total || 0} 
          icon={Bot} 
        />
        <StatisticCard 
          title="Avg Quality Score" 
          value={overview?.reviews.avg_score?.toFixed(1) || '0.0'} 
          icon={Activity} 
        />
      </div>

      <RepositoryHealthSummary summary={healthSummary} />
      
      <NeedsAttention items={attentionItems || []} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Takes up 2/3 space on large screens */}
        <div className="lg:col-span-2 space-y-8">
          <RepositoryOverview repositories={repositories || []} />
          <RecentReviews reviews={recentReviews || []} />
        </div>

        {/* Right Column - Takes up 1/3 space on large screens */}
        <div className="lg:col-span-1">
          <RecentActivity activity={activity || []} />
        </div>
      </div>
    </div>
  );
};
