import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

export const RepositoryWorkspace = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [repository, setRepository] = useState(null);
  const [isLoadingRepo, setIsLoadingRepo] = useState(true);

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

  useEffect(() => {
    fetchRepositoryDetails();
  }, [fetchRepositoryDetails]);

  const tabs = [
    { name: 'Health', path: `/repositories/${owner}/${repo}/health` },
    { name: 'Pull Requests', path: `/repositories/${owner}/${repo}/pulls` },
    { name: 'AI Reviews', path: `/repositories/${owner}/${repo}/reviews` },
    { name: 'Settings', path: `/repositories/${owner}/${repo}/settings` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
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
        </div>
      ) : (
        <div className="flex flex-col gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {owner} / <span className="text-primary">{repo}</span>
            </h1>
            {repository?.description && (
              <p className="text-muted-foreground mt-2">{repository.description}</p>
            )}
          </div>
          
          <nav className="-mb-[17px] flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`
                    whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                    }
                  `}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* Render the active tab content and pass down the repository object via context */}
      <div className="pt-2">
        {!isLoadingRepo && <Outlet context={{ repository, owner, repo }} />}
      </div>
    </div>
  );
};
