import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../ui/input';

export const ReviewFilters = ({ filters, onFilterChange }) => {
  const [localRepoSearch, setLocalRepoSearch] = useState(filters.repository || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localRepoSearch !== filters.repository) {
        onFilterChange({ ...filters, repository: localRepoSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localRepoSearch, filters, onFilterChange]);

  const handleSelectChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by repository name..." 
            className="pl-9 bg-background w-full"
            value={localRepoSearch}
            onChange={(e) => setLocalRepoSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={filters.recommendation || ''}
          onChange={(e) => handleSelectChange('recommendation', e.target.value)}
        >
          <option value="">All Recommendations</option>
          <option value="Approve">Approve</option>
          <option value="Approve with Changes">Approve with Changes</option>
          <option value="Request Changes">Request Changes</option>
        </select>

        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={filters.scoreRange || ''}
          onChange={(e) => handleSelectChange('scoreRange', e.target.value)}
        >
          <option value="">All Scores</option>
          <option value="90-100">90+ (Excellent)</option>
          <option value="80-100">80+ (Good)</option>
          <option value="70-100">70+ (Fair)</option>
          <option value="0-69">Below 70 (High Risk)</option>
        </select>

        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={filters.dateRange || ''}
          onChange={(e) => handleSelectChange('dateRange', e.target.value)}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last Month</option>
        </select>

        <select 
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={filters.sortBy || 'newest'}
          onChange={(e) => handleSelectChange('sortBy', e.target.value)}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
          <option value="highest_score">Sort by: Highest Score</option>
          <option value="lowest_score">Sort by: Lowest Score</option>
        </select>
      </div>
    </div>
  );
};
