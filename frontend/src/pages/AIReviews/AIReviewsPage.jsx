import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { aiService } from '../../services/ai.service';
import { ReviewStats } from '../../components/aiReviews/ReviewStats';
import { ReviewFilters } from '../../components/aiReviews/ReviewFilters';
import { ReviewTable } from '../../components/aiReviews/ReviewTable';
import { ReviewSkeleton } from '../../components/aiReviews/ReviewSkeleton';
import { ReviewEmptyState } from '../../components/aiReviews/ReviewEmptyState';
import { AlertCircle } from 'lucide-react';

export const AIReviewsPage = () => {
  const [filters, setFilters] = useState({
    repository: '',
    recommendation: '',
    scoreRange: '',
    dateRange: '',
    sortBy: 'newest',
    page: 1,
    limit: 10
  });

  const queryParams = useMemo(() => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      sort_by: filters.sortBy
    };
    if (filters.repository) params.repository = filters.repository;
    if (filters.recommendation) params.recommendation = filters.recommendation;
    
    if (filters.scoreRange) {
      const [min, max] = filters.scoreRange.split('-');
      params.min_score = parseInt(min);
      params.max_score = parseInt(max);
    }
    
    if (filters.dateRange) {
      const now = new Date();
      if (filters.dateRange === 'today') {
        now.setHours(0, 0, 0, 0);
        params.start_date = now.toISOString();
      } else if (filters.dateRange === 'week') {
        now.setDate(now.getDate() - 7);
        params.start_date = now.toISOString();
      } else if (filters.dateRange === 'month') {
        now.setMonth(now.getMonth() - 1);
        params.start_date = now.toISOString();
      }
    }
    return params;
  }, [filters]);

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['ai-reviews-stats'],
    queryFn: () => aiService.getDashboardStatistics(),
  });

  const { data: reviewsData, isLoading: isLoadingReviews, isError, error } = useQuery({
    queryKey: ['ai-reviews', queryParams],
    queryFn: () => aiService.getDashboardReviews(queryParams),
    keepPreviousData: true,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const hasActiveFilters = Boolean(
    filters.repository || filters.recommendation || filters.scoreRange || filters.dateRange
  );

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Reviews</h1>
          <p className="text-muted-foreground mt-1">Browse, search and manage all AI-generated Pull Request reviews.</p>
        </div>
      </div>

      <ReviewStats stats={statsData} isLoading={isLoadingStats} />

      <ReviewFilters filters={filters} onFilterChange={handleFilterChange} />

      {isError ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-center justify-center text-destructive flex-col">
          <AlertCircle className="h-10 w-10 mb-4 opacity-80" />
          <p className="font-semibold text-lg">Failed to load reviews</p>
          <p className="text-sm mt-1">{error?.response?.data?.detail || error.message}</p>
        </div>
      ) : isLoadingReviews && !reviewsData ? (
        <ReviewSkeleton />
      ) : reviewsData?.reviews?.length > 0 ? (
        <ReviewTable 
          reviews={reviewsData.reviews} 
          total={reviewsData.total} 
          page={reviewsData.page} 
          limit={reviewsData.limit} 
          onPageChange={handlePageChange} 
        />
      ) : hasActiveFilters ? (
        <div className="bg-card border border-border p-12 text-center rounded-lg shadow-sm">
          <p className="text-lg font-medium text-foreground mb-1">No results match your filters</p>
          <p className="text-muted-foreground text-sm">Try adjusting your search criteria</p>
          <button 
            onClick={() => setFilters({ ...filters, repository: '', recommendation: '', scoreRange: '', dateRange: '', page: 1 })}
            className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <ReviewEmptyState />
      )}
    </div>
  );
};
