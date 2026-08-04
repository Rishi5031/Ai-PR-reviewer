import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, GitPullRequest } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ReviewCard = ({ review }) => {
  const getStatusConfig = (status) => {
    switch(status) {
      case 'passed':
        return {
          icon: ShieldCheck,
          color: 'text-green-500',
          bg: 'bg-green-500/10',
          label: 'Passed'
        };
      case 'issues_found':
        return {
          icon: ShieldAlert,
          color: 'text-yellow-500',
          bg: 'bg-yellow-500/10',
          label: 'Issues Found'
        };
      case 'failed':
        return {
          icon: ShieldX,
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          label: 'Failed'
        };
      default:
        return {
          icon: ShieldCheck,
          color: 'text-muted-foreground',
          bg: 'bg-muted',
          label: status
        };
    }
  };

  const config = getStatusConfig(review.status);
  const StatusIcon = config.icon;

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitPullRequest className="h-4 w-4" />
            <span className="font-medium text-foreground">{review.repository}</span>
            <span>#</span>
            <span className="font-mono">{review.prNumber}</span>
          </div>
          <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.bg, config.color)}>
            <StatusIcon className="h-3.5 w-3.5" />
            {config.label}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">AI Review Score</p>
          <div className="flex items-end gap-2">
            <span className={cn(
              "text-3xl font-bold tracking-tight",
              review.score >= 90 ? "text-green-500" : review.score >= 70 ? "text-yellow-500" : "text-destructive"
            )}>
              {review.score}
            </span>
            <span className="text-sm font-medium text-muted-foreground pb-1">/ 100</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
        <div className="text-sm">
          {review.criticalIssues > 0 ? (
            <span className="font-medium text-destructive">{review.criticalIssues} critical issues</span>
          ) : (
            <span className="text-muted-foreground">No critical issues</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          {review.createdAt}
        </div>
      </div>
    </div>
  );
};
