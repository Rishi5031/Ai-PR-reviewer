import React from 'react';
import { Bot, GitPullRequest, FolderGit2, AlertTriangle, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ActivityTimeline = ({ data }) => {
  const getIconConfig = (type) => {
    switch (type) {
      case 'review_completed':
        return { icon: Bot, bg: 'bg-green-500/10', color: 'text-green-500' };
      case 'pr_synced':
        return { icon: GitPullRequest, bg: 'bg-blue-500/10', color: 'text-blue-500' };
      case 'repo_connected':
        return { icon: FolderGit2, bg: 'bg-purple-500/10', color: 'text-purple-500' };
      case 'review_failed':
        return { icon: AlertTriangle, bg: 'bg-destructive/10', color: 'text-destructive' };
      case 'repo_updated':
        return { icon: Settings, bg: 'bg-muted', color: 'text-muted-foreground' };
      default:
        return { icon: Bot, bg: 'bg-muted', color: 'text-muted-foreground' };
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Track everything happening across your repositories.</p>
      </div>

      <div className="relative border-l border-border ml-3 space-y-6">
        {data.map((activity, idx) => {
          const { icon: Icon, bg, color } = getIconConfig(activity.type);
          
          return (
            <div key={activity.id} className="relative pl-6">
              {/* Timeline marker */}
              <div className={cn("absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ring-4 ring-card", bg)}>
                <Icon className={cn("h-3.5 w-3.5", color)} />
              </div>
              
              <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap sm:mt-0 mt-1">
                  {activity.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
