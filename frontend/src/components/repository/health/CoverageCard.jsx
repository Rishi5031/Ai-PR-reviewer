import React from 'react';
import { GitPullRequest } from 'lucide-react';

export const CoverageCard = ({ coverage }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-lg shrink-0">
          <GitPullRequest className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Analysis Coverage</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {coverage.reviewed_pull_requests} of {coverage.total_pull_requests} PRs
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-1.5 min-w-[100px]">
        <div className="text-lg font-bold text-foreground">
          {coverage.coverage_percentage}%
        </div>
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(coverage.coverage_percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
