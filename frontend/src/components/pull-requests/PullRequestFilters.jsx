import React from 'react';

export const PullRequestFilters = ({
  stateFilter,
  setStateFilter,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={stateFilter}
        onChange={(e) => setStateFilter(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="open">Open PRs</option>
        <option value="closed">Closed PRs</option>
        <option value="all">All PRs</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="updated">Sort by Updated</option>
        <option value="created">Sort by Created</option>
      </select>
    </div>
  );
};
