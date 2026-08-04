import React, { useState, useEffect, useMemo } from 'react';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

// Components
import { ConnectGithubCard } from '../../components/github/ConnectGithubCard';
import { ConnectGithubDialog } from '../../components/github/ConnectGithubDialog';
import { GithubConnectionStatus } from '../../components/github/GithubConnectionStatus';
import { RepositoryGrid } from '../../components/github/RepositoryGrid';
import { RepositorySearch } from '../../components/github/RepositorySearch';
import { RepositoryFilters } from '../../components/github/RepositoryFilters';
import { RepositorySkeleton } from '../../components/github/RepositorySkeleton';

export const RepositoriesPage = () => {
  const { toast } = useToast();
  
  // State
  const [status, setStatus] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  
  // Repositories Data
  const [repositories, setRepositories] = useState([]);
  const [isReposLoading, setIsReposLoading] = useState(false);
  
  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated');

  const fetchStatus = async () => {
    try {
      setIsStatusLoading(true);
      const data = await githubService.getStatus();
      setStatus(data);
      if (data.is_connected) {
        fetchRepositories();
      }
    } catch (error) {
      toast.error('Failed to fetch GitHub connection status.');
    } finally {
      setIsStatusLoading(false);
    }
  };

  const fetchRepositories = async () => {
    try {
      setIsReposLoading(true);
      const repos = await githubService.getRepositories();
      setRepositories(repos);
    } catch (error) {
      toast.error('Failed to fetch repositories. Please try again.');
    } finally {
      setIsReposLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleConnect = async (token) => {
    try {
      setIsConnecting(true);
      const result = await githubService.connect(token);
      setStatus(result);
      setIsConnectDialogOpen(false);
      toast.success('GitHub account connected successfully!');
      fetchRepositories();
    } catch (error) {
      const message = error.response?.data?.detail || 'Failed to connect. Please check your token.';
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      await githubService.disconnect();
      setStatus({ is_connected: false });
      setRepositories([]);
      toast.success('GitHub account disconnected.');
    } catch (error) {
      toast.error('Failed to disconnect GitHub account.');
    } finally {
      setIsDisconnecting(false);
    }
  };

  // Derived Data for Filters
  const uniqueLanguages = useMemo(() => {
    const langs = new Set();
    repositories.forEach(repo => {
      if (repo.language) langs.add(repo.language);
    });
    return Array.from(langs).sort();
  }, [repositories]);

  const filteredAndSortedRepos = useMemo(() => {
    return repositories
      .filter(repo => {
        const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesLanguage = languageFilter === 'all' || repo.language === languageFilter;
        
        let matchesVisibility = true;
        if (visibilityFilter === 'private') matchesVisibility = repo.private === true;
        if (visibilityFilter === 'public') matchesVisibility = repo.private === false;

        return matchesSearch && matchesLanguage && matchesVisibility;
      })
      .sort((a, b) => {
        if (sortBy === 'updated') return new Date(b.updated_at) - new Date(a.updated_at);
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [repositories, searchQuery, languageFilter, visibilityFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setLanguageFilter('all');
    setVisibilityFilter('all');
  };

  if (isStatusLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
          <p className="text-muted-foreground mt-2">Manage your connected GitHub repositories.</p>
        </div>
        <RepositorySkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
        <p className="text-muted-foreground mt-2">Manage your connected GitHub repositories.</p>
      </div>

      {!status?.is_connected ? (
        <ConnectGithubCard onConnectClick={() => setIsConnectDialogOpen(true)} />
      ) : (
        <>
          <GithubConnectionStatus 
            statusData={status} 
            onDisconnect={handleDisconnect}
            isDisconnecting={isDisconnecting}
          />
          
          <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <RepositorySearch value={searchQuery} onChange={setSearchQuery} />
              <RepositoryFilters 
                languageFilter={languageFilter}
                setLanguageFilter={setLanguageFilter}
                visibilityFilter={visibilityFilter}
                setVisibilityFilter={setVisibilityFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                languages={uniqueLanguages}
              />
            </div>

            {isReposLoading ? (
              <RepositorySkeleton />
            ) : (
              <RepositoryGrid 
                repositories={filteredAndSortedRepos} 
                isLoading={false} 
              />
            )}
          </div>
        </>
      )}

      <ConnectGithubDialog 
        open={isConnectDialogOpen} 
        onOpenChange={setIsConnectDialogOpen}
        onConnect={handleConnect}
        isConnecting={isConnecting}
      />
    </div>
  );
};
