import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const OAuthErrorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorReason = searchParams.get('error') || 'Unknown error occurred during authentication.';

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-card border border-border rounded-xl shadow-lg p-8 max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mb-6 border border-destructive/20">
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">Connection Failed</h2>
        
        <div className="bg-muted px-4 py-3 rounded-md mb-8 border border-border/50 w-full text-left">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Reason</p>
          <p className="text-sm font-medium text-foreground break-words">
            {errorReason}
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate('/github/connect')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background text-foreground border border-border font-medium rounded-md hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
