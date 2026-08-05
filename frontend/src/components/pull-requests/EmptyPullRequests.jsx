import React from 'react';
import { GitPullRequestDraft } from 'lucide-react';

export const EmptyPullRequests = ({ isFiltered, onClearFilters }) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center animate-in fade-in-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <GitPullRequestDraft className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {isFiltered ? 'No matches found' : 'No Pull Requests Found'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {isFiltered 
          ? 'We could not find any pull requests matching your current filters and search criteria.' 
          : 'There are no pull requests in this repository matching the selected state.'}
      </p>
      {isFiltered && (
        <button
          onClick={onClearFilters}
          className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
