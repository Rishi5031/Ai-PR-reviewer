import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { githubService } from '../../../services/github.service';
import { useToast } from '../../../contexts/ToastContext';
import { PullRequestSearch } from '../../pull-requests/PullRequestSearch';
import { PullRequestFilters } from '../../pull-requests/PullRequestFilters';
import { PullRequestTable } from '../../pull-requests/PullRequestTable';
import { PullRequestSkeleton } from '../../pull-requests/PullRequestSkeleton';

export const PullRequestsTab = () => {
  const { owner, repo } = useOutletContext();
  const { toast } = useToast();

  const [pullRequests, setPullRequests] = useState([]);
  const [isLoadingPRs, setIsLoadingPRs] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('open');
  const [sortBy, setSortBy] = useState('updated');

  const fetchPullRequests = useCallback(async () => {
    try {
      setIsLoadingPRs(true);
      const fetchState = stateFilter === 'all' ? 'all' : stateFilter;
      const prs = await githubService.getPullRequests(owner, repo, fetchState, 1, 50);
      setPullRequests(prs);
    } catch (error) {
      console.error('Failed to fetch pull requests', error);
      toast.error('Failed to load pull requests.');
    } finally {
      setIsLoadingPRs(false);
    }
  }, [owner, repo, stateFilter, toast]);

  useEffect(() => {
    fetchPullRequests();
  }, [fetchPullRequests]);

  const filteredAndSortedPRs = useMemo(() => {
    return pullRequests
      .filter((pr) => {
        const query = searchQuery.toLowerCase();
        return (
          pr.title.toLowerCase().includes(query) ||
          pr.author.toLowerCase().includes(query) ||
          pr.pull_number.toString().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'updated') {
          return new Date(b.updated_at) - new Date(a.updated_at);
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [pullRequests, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStateFilter('all');
  };

  const isFiltered = searchQuery !== '' || stateFilter !== 'open';

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Pull Requests</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Browse and review pull requests for this repository.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PullRequestSearch value={searchQuery} onChange={setSearchQuery} />
        <PullRequestFilters 
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>

      {isLoadingPRs ? (
        <PullRequestSkeleton />
      ) : (
        <PullRequestTable 
          pullRequests={filteredAndSortedPRs}
          owner={owner}
          repo={repo}
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
};
