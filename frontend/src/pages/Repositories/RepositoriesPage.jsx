import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

// Components
import { ConnectGithubCard } from '../../components/github/ConnectGithubCard';
import { OAuthConnectionCard } from '../../components/github/OAuthConnectionCard';
import { PATConnectionCard } from '../../components/github/PATConnectionCard';
import { ConnectGithubDialog } from '../../components/github/ConnectGithubDialog';
import { ConnectionStatus } from '../../components/github/ConnectionStatus';
import { RepositoryGrid } from '../../components/github/RepositoryGrid';
import { RepositorySearch } from '../../components/github/RepositorySearch';
import { RepositoryFilters } from '../../components/github/RepositoryFilters';
import { RepositorySkeleton } from '../../components/github/RepositorySkeleton';

export const RepositoriesPage = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [status, setStatus] = useState(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const toastShownRef = React.useRef(false);

  // Check for successful OAuth connection parameter on mount
  useEffect(() => {
    if (searchParams.get('connected') === 'true' && !toastShownRef.current) {
      toastShownRef.current = true;
      toast.success("Your GitHub account has been connected securely via OAuth.");
      // Clean up the URL parameter
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, toast]);

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

  const navigate = useNavigate();

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
    <div className="space-y-8 min-h-[calc(100vh-6rem)] flex flex-col">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
        <p className="text-muted-foreground mt-2">Manage your connected GitHub repositories.</p>
      </div>

      {!status?.is_connected ? (
        <div className="flex-1 flex flex-col justify-center pb-20 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-card border border-dashed border-border bg-card/50 rounded-xl p-8 mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">No GitHub Account Connected</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Connect your GitHub account to browse repositories, trigger AI code reviews, and monitor code quality. Choose your preferred connection method below.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-full flex flex-col">
                <OAuthConnectionCard />
              </div>
              <div className="h-full flex flex-col">
                <PATConnectionCard />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ConnectionStatus 
            status={status} 
            onDisconnectSuccess={() => {
              setStatus({ is_connected: false });
              setRepositories([]);
            }} 
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
    </div>
  );
};
