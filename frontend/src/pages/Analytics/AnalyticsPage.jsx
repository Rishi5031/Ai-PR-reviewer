import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { aiService } from '../../services/ai.service';

import { AnalyticsFilters } from '../../components/analytics/AnalyticsFilters';
import { OverviewCards } from '../../components/analytics/OverviewCards';
import { ScoreTrendChart } from '../../components/analytics/ScoreTrendChart';
import { RecommendationChart } from '../../components/analytics/RecommendationChart';
import { IssueCategoryChart } from '../../components/analytics/IssueCategoryChart';
import { SeverityChart } from '../../components/analytics/SeverityChart';
import { ReviewActivityChart } from '../../components/analytics/ReviewActivityChart';
import { RepositoryHealth } from '../../components/analytics/RepositoryHealth';
import { MostCommonFindings } from '../../components/analytics/MostCommonFindings';
import { ActionableInsights } from '../../components/analytics/ActionableInsights';
import { AnalyticsSkeleton } from '../../components/analytics/AnalyticsSkeleton';

export const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    repository: '',
    dateRange: '',
    recommendation: '',
    scoreRange: ''
  });

  const queryParams = React.useMemo(() => {
    const params = {};
    if (filters.repository) params.repository = filters.repository;
    if (filters.dateRange) params.date_range = filters.dateRange;
    if (filters.recommendation) params.recommendation = filters.recommendation;
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange.split('-');
      params.minimum_score = parseInt(min);
      params.maximum_score = parseInt(max);
    }
    return params;
  }, [filters]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['analytics-dashboard', queryParams],
    queryFn: () => aiService.getAnalyticsDashboard(queryParams),
    keepPreviousData: true
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex flex-col items-center justify-center text-destructive max-w-2xl mx-auto mt-12">
        <AlertCircle className="h-12 w-12 mb-4 opacity-80" />
        <h2 className="text-xl font-bold mb-2">Failed to load analytics</h2>
        <p className="text-sm text-center mb-6">{error?.response?.data?.detail || error.message}</p>
        <Button onClick={() => window.location.reload()} variant="outline">Try Again</Button>
      </div>
    );
  }

  // Check if we have absolutely no data (before filters) to show empty state
  const isCompletelyEmpty = data?.overview?.total_reviews === 0 && !Object.values(filters).some(Boolean);

  if (isCompletelyEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center space-y-6 animate-in fade-in-50 duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <BarChart3 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">No Analytics Available</h2>
        <p className="text-muted-foreground">
          Generate AI reviews on your Pull Requests to start building powerful engineering analytics and insights.
        </p>
        <Button size="lg" onClick={() => navigate('/repositories')} className="mt-4">
          Browse Repositories
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-[1600px] mx-auto pb-12">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Understand code quality, security trends, repository health, and engineering insights across all AI reviews.
        </p>
      </div>

      <AnalyticsFilters filters={filters} onFilterChange={handleFilterChange} />

      {isLoading && !data ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          <OverviewCards overview={data.overview} />

          {/* Top Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ScoreTrendChart data={data.score_trend} />
            </div>
            <div>
              <RecommendationChart data={data.recommendation_distribution} />
            </div>
          </div>

          {/* Middle Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IssueCategoryChart data={data.issue_category_distribution} />
            <SeverityChart data={data.severity_distribution} />
          </div>

          {/* Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReviewActivityChart data={data.review_activity} />
            </div>
            <div>
              <ActionableInsights insights={data.actionable_insights} />
            </div>
          </div>

          {/* Bottom Data Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RepositoryHealth health={data.repository_health} rankings={data.repository_rankings} />
            <MostCommonFindings findings={data.most_common_findings} />
          </div>
        </>
      )}
    </div>
  );
};
