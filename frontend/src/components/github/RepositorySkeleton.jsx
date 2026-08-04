import React from 'react';

export const RepositorySkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex flex-col rounded-xl border border-border bg-card p-5 h-48">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 w-3/4">
              <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
              <div className="h-5 w-full bg-muted rounded" />
            </div>
            <div className="h-6 w-16 bg-muted rounded-full shrink-0" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-3 w-full bg-muted rounded" />
            <div className="h-3 w-2/3 bg-muted rounded" />
          </div>
          <div className="mt-auto flex items-center justify-between">
            <div className="flex gap-4">
              <div className="h-4 w-12 bg-muted rounded" />
              <div className="h-4 w-12 bg-muted rounded" />
            </div>
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
