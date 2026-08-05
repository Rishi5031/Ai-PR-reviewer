import React from 'react';

export const PullRequestSkeleton = () => {
  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="p-4 sm:p-6 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start justify-between py-2 border-b border-border/50 last:border-0 animate-pulse">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
            <div className="ml-4 h-6 w-16 bg-muted rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
