import React from 'react';
import { Clock, GitPullRequest, GitBranch } from 'lucide-react';

export const ReviewMetadata = ({ owner, repo, pullNumber, createdAt }) => {
  return (
    <div className="flex flex-wrap items-center gap-6 mt-4 sm:mt-0 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <GitBranch className="w-4 h-4 text-primary" />
        <span>{owner}/{repo}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <GitPullRequest className="w-4 h-4 text-primary" />
        <span>PR #{pullNumber}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-primary" />
        <span>{new Date(createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};
