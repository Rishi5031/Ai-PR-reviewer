import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { aiService } from '../../../services/ai.service';
import { ReviewTable } from '../../aiReviews/ReviewTable';
import { ReviewSkeleton } from '../../aiReviews/ReviewSkeleton';
import { AlertCircle } from 'lucide-react';

export const RepositoryReviewsTab = () => {
  const { repo } = useOutletContext();
  const [page, setPage] = useState(1);
  const limit = 10;

  const queryParams = useMemo(() => {
    return {
      repository: repo,
      page,
      limit,
      sort_by: 'newest'
    };
  }, [repo, page]);

  const { data: reviewsData, isLoading: isLoadingReviews, isError, error } = useQuery({
    queryKey: ['repository-ai-reviews', queryParams],
    queryFn: () => aiService.getDashboardReviews(queryParams),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">AI Reviews</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Historical AI reviews generated for this repository.
        </p>
      </div>

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
      ) : (
        <div className="bg-card border border-border p-12 text-center rounded-lg shadow-sm">
          <p className="text-lg font-medium text-foreground mb-1">No AI Reviews yet</p>
          <p className="text-muted-foreground text-sm">Generate AI reviews for Pull Requests to see them here.</p>
        </div>
      )}
    </div>
  );
};
