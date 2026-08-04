import React from 'react';

export const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-8">
      {/* Welcome Banner Skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-1/3 rounded-lg bg-muted"></div>
        <div className="h-4 w-1/2 rounded-lg bg-muted"></div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-32 rounded-lg bg-muted"></div>
        ))}
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <div className="flex justify-between">
              <div className="space-y-3 w-1/2">
                <div className="h-4 w-full rounded bg-muted"></div>
                <div className="h-8 w-2/3 rounded bg-muted"></div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-muted"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tables & Lists Skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="h-64 rounded-xl border border-border bg-card">
            <div className="border-b border-border p-6">
              <div className="h-6 w-1/4 rounded bg-muted"></div>
            </div>
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-4 w-1/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/4 rounded bg-muted"></div>
                  <div className="h-4 w-1/4 rounded bg-muted"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="h-96 rounded-xl border border-border bg-card p-6">
            <div className="h-6 w-1/3 rounded bg-muted mb-6"></div>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex-shrink-0"></div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="h-3 w-1/2 rounded bg-muted"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
