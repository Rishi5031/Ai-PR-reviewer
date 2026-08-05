import React from 'react';
import { PullRequestCard } from './PullRequestCard';
import { EmptyPullRequests } from './EmptyPullRequests';

export const PullRequestTable = ({ pullRequests, owner, repo, isFiltered, onClearFilters }) => {
  if (!pullRequests || pullRequests.length === 0) {
    return <EmptyPullRequests isFiltered={isFiltered} onClearFilters={onClearFilters} />;
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex flex-col">
        {pullRequests.map((pr) => (
          <PullRequestCard 
            key={pr.pull_number} 
            pr={pr} 
            owner={owner}
            repo={repo}
          />
        ))}
      </div>
    </div>
  );
};
