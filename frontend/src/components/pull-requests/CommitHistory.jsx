import React from 'react';
import { GitCommit, User } from 'lucide-react';

export const CommitHistory = ({ commits }) => {
  if (!commits || commits.length === 0) return null;

  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          <GitCommit className="h-4 w-4" />
          Commit History ({commits.length})
        </h3>
      </div>
      <div className="divide-y divide-border">
        {commits.map((commit, idx) => (
          <div key={commit.sha || idx} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-muted/30 transition-colors">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate" title={commit.message}>
                {commit.message}
              </p>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span className="font-medium text-foreground">{commit.author_name}</span>
                <span>•</span>
                <span>{new Date(commit.date).toLocaleString()}</span>
              </div>
            </div>
            <div className="sm:ml-4 shrink-0 flex items-center">
              <span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                {commit.sha.substring(0, 7)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
