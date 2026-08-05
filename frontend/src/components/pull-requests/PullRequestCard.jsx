import React from 'react';
import { GitPullRequest, GitPullRequestClosed, GitMerge, Clock, ArrowRight, User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const PullRequestCard = ({ pr, owner, repo }) => {
  const isOpen = pr.state === 'open';
  
  const stateIcon = isOpen 
    ? <GitPullRequest className="h-5 w-5 text-emerald-500" />
    : <GitPullRequestClosed className="h-5 w-5 text-destructive" />;

  const updatedDate = new Date(pr.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <Link 
      to={`/repositories/${owner}/${repo}/pulls/${pr.pull_number}`}
      className="block group border-b border-border/50 last:border-0 hover:bg-muted/30 transition-all duration-300"
    >
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={cn(
            "mt-0.5 shrink-0 p-2 rounded-lg border shadow-sm transition-colors duration-300",
            isOpen ? "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20" : "bg-destructive/10 border-destructive/20 group-hover:bg-destructive/20"
          )}>
            {stateIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {pr.title}
              </h4>
              <Badge variant="outline" className="font-mono text-xs text-muted-foreground border-border bg-background shadow-sm">
                #{pr.pull_number}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <User className="w-3 h-3" />
                </div>
                <span className="font-medium text-foreground/80">{pr.author}</span>
              </span>
              
              <span className="flex items-center gap-1.5 border-l border-border pl-4">
                <Clock className="h-4 w-4" />
                Updated on {updatedDate}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-6 sm:pl-4 mt-2 sm:mt-0">
          <div className={cn(
            "px-3 py-1 text-xs font-bold rounded-full border shadow-sm uppercase tracking-wider",
            isOpen ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
          )}>
            {isOpen ? 'Open' : 'Closed'}
          </div>
          <div className="w-8 h-8 rounded-full bg-background border border-border shadow-sm flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
};
