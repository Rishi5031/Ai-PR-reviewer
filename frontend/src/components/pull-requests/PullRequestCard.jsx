import React from 'react';
import { GitPullRequest, GitPullRequestClosed, GitMerge, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';

export const PullRequestCard = ({ pr, owner, repo }) => {
  const isMerged = pr.state === 'closed' && pr.merged_at; // Wait, we didn't add merged_at to Summary. 
  // Wait, GitHub API returns state = 'closed'. Merged PRs often have merged_at in the full object. 
  // For the summary from our API, we only return `state`. Let's just use `state`.
  const stateIcon = pr.state === 'open' 
    ? <GitPullRequest className="h-5 w-5 text-green-500" />
    : pr.state === 'closed'
    ? <GitPullRequestClosed className="h-5 w-5 text-red-500" />
    : <GitMerge className="h-5 w-5 text-purple-500" />;

  const updatedDate = new Date(pr.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <Link 
      to={`/repositories/${owner}/${repo}/pulls/${pr.pull_number}`}
      className="block group border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors"
    >
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-1 shrink-0">
            {stateIcon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {pr.title}
            </h4>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="font-medium">#{pr.pull_number}</span>
              <span>•</span>
              <span>opened by <span className="font-medium text-foreground">{pr.author}</span></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {updatedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 sm:pl-4">
          <Badge variant={pr.state === 'open' ? 'default' : 'secondary'} className="capitalize">
            {pr.state}
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
        </div>
      </div>
    </Link>
  );
};
