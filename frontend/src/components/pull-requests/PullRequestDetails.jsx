import React from 'react';
import { GitPullRequest, GitPullRequestClosed, GitMerge, Clock, GitBranch, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/badge';

export const PullRequestDetails = ({ pr }) => {
  if (!pr) return null;

  const stateIcon = pr.state === 'open' 
    ? <GitPullRequest className="h-6 w-6 text-green-500" />
    : pr.merge_status
    ? <GitMerge className="h-6 w-6 text-purple-500" />
    : <GitPullRequestClosed className="h-6 w-6 text-red-500" />;

  const createdDate = new Date(pr.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="flex flex-col gap-6 bg-card border border-border rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="mt-1 shrink-0">{stateIcon}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {pr.title} <span className="text-muted-foreground font-normal">#{pr.pull_number}</span>
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <Badge variant={pr.state === 'open' ? 'default' : pr.merge_status ? 'secondary' : 'destructive'} className="capitalize">
              {pr.merge_status ? 'Merged' : pr.state}
            </Badge>
            <span className="flex items-center gap-1 font-medium text-foreground">
              {pr.author}
            </span>
            <span>wants to merge into</span>
            <Badge variant="outline" className="font-mono bg-muted/50">{pr.base_branch}</Badge>
            <span>from</span>
            <Badge variant="outline" className="font-mono bg-muted/50">{pr.head_branch}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-border/50">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Commits</span>
          <span className="text-sm font-medium text-foreground">{pr.commits_count}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Files Changed</span>
          <span className="text-sm font-medium text-foreground">{pr.changed_files_count}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Additions</span>
          <span className="text-sm font-medium text-green-500">+{pr.additions}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground uppercase font-semibold">Deletions</span>
          <span className="text-sm font-medium text-red-500">-{pr.deletions}</span>
        </div>
      </div>

      {pr.description && (
        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
          {pr.description}
        </div>
      )}
      
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          Created {createdDate}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          {pr.review_comments_count} review comments
        </span>
      </div>
    </div>
  );
};
