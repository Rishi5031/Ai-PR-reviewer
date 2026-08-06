import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { githubService } from '../../services/github.service';

export const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const { data: status } = useQuery({
    queryKey: ['github-status'],
    queryFn: githubService.getOAuthStatus,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/repositories');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-card border border-border rounded-xl shadow-lg p-8 max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">GitHub Connected</h2>
        
        <div className="bg-muted px-4 py-2 rounded-md mb-6 border border-border/50">
          <p className="text-sm font-medium text-foreground">
            {status?.github_username || 'Your account'}
          </p>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Repository access granted successfully. Redirecting you to repositories...
        </p>

        <button
          onClick={() => navigate('/repositories')}
          className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
        >
          Continue to Repositories
        </button>
      </div>
    </div>
  );
};
