import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { githubService } from '../../services/github.service';
import { OAuthConnectionCard } from '../../components/github/OAuthConnectionCard';
import { PATConnectionCard } from '../../components/github/PATConnectionCard';
import { ConnectionStatus } from '../../components/github/ConnectionStatus';
import { Loader2 } from 'lucide-react';

export const GitHubConnectionPage = () => {
  const { data: status, isLoading } = useQuery({
    queryKey: ['github-status'],
    queryFn: githubService.getOAuthStatus,
  });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in-50 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">GitHub Integration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Connect your GitHub account to enable AI code reviews, repository insights, and pull request analysis.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="h-[120px] bg-muted rounded-lg w-full"></div>
          <div className="h-[200px] bg-muted rounded-lg w-full"></div>
        </div>
      ) : status?.is_connected ? (
        <ConnectionStatus status={status} />
      ) : (
        <div className="space-y-6">
          <OAuthConnectionCard />
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-semibold tracking-widest">
                Or
              </span>
            </div>
          </div>

          <PATConnectionCard />
        </div>
      )}
    </div>
  );
};
