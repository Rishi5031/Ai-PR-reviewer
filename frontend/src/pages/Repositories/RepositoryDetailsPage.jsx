import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

import { RepositoryHeader } from '../../components/github/RepositoryHeader';
import { RepositoryStats } from '../../components/github/RepositoryStats';
import { PullRequestSearch } from '../../components/pull-requests/PullRequestSearch';
import { PullRequestFilters } from '../../components/pull-requests/PullRequestFilters';
import { PullRequestTable } from '../../components/pull-requests/PullRequestTable';
import { PullRequestSkeleton } from '../../components/pull-requests/PullRequestSkeleton';

export const RepositoryDetailsPage = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [repository, setRepository] = useState(null);
  const [pullRequests, setPullRequests] = useState([]);
  const [isLoadingRepo, setIsLoadingRepo] = useState(true);
  const [isLoadingPRs, setIsLoadingPRs] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('open'); // 'open', 'closed', 'all'
  const [sortBy, setSortBy] = useState('updated'); // 'updated', 'created'

  const fetchRepositoryDetails = useCallback(async () => {
    try {
      setIsLoadingRepo(true);
      const data = await githubService.getRepositoryDetails(owner, repo);
      setRepository(data);
    } catch (error) {
      console.error('Failed to fetch repository details', error);
      toast.error('Failed to load repository details.');
    } finally {
      setIsLoadingRepo(false);
    }
  }, [owner, repo, toast]);

  const fetchPullRequests = useCallback(async () => {
    try {
      setIsLoadingPRs(true);
      // We pass state='all' so we can filter on the client side for a snappier UX, 
      // or we can fetch based on the filter. Let's fetch based on the stateFilter to match GitHub API perfectly.
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
    fetchRepositoryDetails();
  }, [fetchRepositoryDetails]);

  // Refetch PRs when the state filter changes because GitHub API handles state filtering
  useEffect(() => {
    fetchPullRequests();
  }, [fetchPullRequests]);

  const filteredAndSortedPRs = useMemo(() => {
    return pullRequests
      .filter((pr) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          pr.title.toLowerCase().includes(query) ||
          pr.author.toLowerCase().includes(query) ||
          pr.pull_number.toString().includes(query);
        return matchesSearch;
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
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <button 
        onClick={() => navigate('/repositories')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Repositories
      </button>

      {/* Repo Header Section */}
      {isLoadingRepo ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 w-1/3 bg-muted rounded"></div>
          <div className="h-4 w-2/3 bg-muted rounded"></div>
          <div className="h-4 w-1/2 bg-muted rounded"></div>
        </div>
      ) : (
        <div>
          <RepositoryHeader repository={repository} />
          <RepositoryStats repository={repository} />
        </div>
      )}

      {/* Pull Requests Section */}
      <div className="space-y-6 pt-6 border-t border-border">
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
    </div>
  );
};
