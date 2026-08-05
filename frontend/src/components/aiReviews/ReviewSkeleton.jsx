import React from 'react';

export const ReviewSkeleton = () => {
  return (
    <div className="w-full">
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <div className="border-b border-border bg-muted/50 p-4">
          <div className="h-6 w-1/4 bg-border/50 rounded animate-pulse"></div>
        </div>
        <div className="divide-y divide-border">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-5 w-1/3 bg-border/40 rounded animate-pulse"></div>
                <div className="h-4 w-1/4 bg-border/20 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-20 bg-border/30 rounded-full animate-pulse"></div>
                <div className="h-8 w-24 bg-border/30 rounded-full animate-pulse"></div>
                <div className="h-8 w-8 bg-border/40 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
