import React from 'react';

export const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 w-64 bg-muted rounded mb-2"></div>
        <div className="h-4 w-96 bg-muted/50 rounded"></div>
      </div>

      {/* Filters Skeleton */}
      <div className="h-20 w-full bg-card border border-border rounded-lg"></div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-28 bg-card border border-border rounded-lg"></div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px] bg-card border border-border rounded-lg"></div>
        <div className="h-[400px] bg-card border border-border rounded-lg"></div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[400px] bg-card border border-border rounded-lg"></div>
        <div className="h-[400px] bg-card border border-border rounded-lg"></div>
      </div>
    </div>
  );
};
