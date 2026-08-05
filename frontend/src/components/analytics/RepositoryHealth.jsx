import React from 'react';
import { ShieldCheck, ShieldAlert, GitPullRequest } from 'lucide-react';
import { cn } from '../../lib/utils';

export const RepositoryHealth = ({ health, rankings }) => {
  const topRepos = rankings ? rankings.slice(0, 5) : [];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-border bg-muted/30 p-6">
        <h3 className="text-lg font-semibold text-foreground">Repository Health</h3>
        <p className="text-sm text-muted-foreground mt-1">Ranking of your codebases</p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col gap-6">
        {/* Health Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {health?.best_repository && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-success font-semibold mb-2">
                <ShieldCheck className="w-5 h-5" />
                Healthiest Repo
              </div>
              <p className="font-medium text-foreground truncate">{health.best_repository.repository}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>Score: {health.best_repository.average_score}</span>
                <span>•</span>
                <span>{health.best_repository.review_count} reviews</span>
              </div>
            </div>
          )}

          {health?.worst_repository && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-destructive font-semibold mb-2">
                <ShieldAlert className="w-5 h-5" />
                Needs Attention
              </div>
              <p className="font-medium text-foreground truncate">{health.worst_repository.repository}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span>Score: {health.worst_repository.average_score}</span>
                <span>•</span>
                <span>{health.worst_repository.review_count} reviews</span>
              </div>
            </div>
          )}
        </div>

        {/* Top 5 Table */}
        <div className="mt-2">
          <h4 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">Top Repositories</h4>
          {topRepos.length > 0 ? (
            <div className="space-y-3">
              {topRepos.map((repo, idx) => (
                <div key={repo.repository} className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-mono text-sm w-4">{idx + 1}.</span>
                    <GitPullRequest className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm truncate max-w-[150px] sm:max-w-[200px]">{repo.repository}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-muted-foreground">Score</span>
                      <span className={cn(
                        "text-sm font-semibold",
                        repo.average_score >= 80 ? "text-success" : repo.average_score >= 70 ? "text-warning" : "text-destructive"
                      )}>
                        {repo.average_score}
                      </span>
                    </div>
                    <div className="flex flex-col items-end hidden sm:flex w-16">
                      <span className="text-xs text-muted-foreground">Critical</span>
                      <span className="text-sm font-medium">{repo.critical_findings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No repository data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};
