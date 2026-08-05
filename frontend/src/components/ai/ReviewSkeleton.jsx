import React from 'react';

export const ReviewSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-6 w-32 bg-card border border-border rounded"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Score and Summary) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="h-64 bg-card border border-border rounded-lg"></div>
          <div className="h-48 bg-card border border-border rounded-lg"></div>
        </div>

        {/* Right Column (Issues) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 w-48 bg-card border border-border rounded"></div>
          <div className="space-y-4">
            <div className="h-32 bg-card border border-border rounded-lg"></div>
            <div className="h-32 bg-card border border-border rounded-lg"></div>
            <div className="h-32 bg-card border border-border rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
