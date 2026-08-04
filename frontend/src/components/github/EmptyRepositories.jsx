import React from 'react';
import { SearchX, FolderGit2 } from 'lucide-react';
import { Button } from '../ui/button';

export const EmptyRepositories = ({ type = 'no_results', onClearFilters }) => {
  if (type === 'no_results') {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">No repositories found</h3>
        <p className="mb-6 max-w-md text-sm text-muted-foreground">
          We couldn't find any repositories matching your current search or filter criteria.
        </p>
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <FolderGit2 className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">No Repositories</h3>
      <p className="max-w-md text-sm text-muted-foreground">
        You don't have any repositories in your connected GitHub account.
      </p>
    </div>
  );
};
