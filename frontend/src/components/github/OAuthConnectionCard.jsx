import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Github } from '../ui/icons';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

export const OAuthConnectionCard = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleOAuthLogin = async () => {
    try {
      setIsConnecting(true);
      const data = await githubService.getOAuthLoginUrl();
      if (data && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No authorization URL returned');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || error.message || "Failed to initiate GitHub OAuth flow.");
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 relative overflow-hidden">
      {/* Recommended Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
        <Sparkles className="w-3.5 h-3.5" />
        Recommended
      </div>

      <div className="flex flex-col h-full mt-4">
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50">
            <Github className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Connect with GitHub</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Securely connect your GitHub account without creating a Personal Access Token. This uses standard OAuth for maximum security.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={handleOAuthLogin}
            disabled={isConnecting}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center shrink-0"
          >
            {isConnecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Github className="w-4 h-4" />
            )}
            {isConnecting ? 'Connecting...' : 'Connect with GitHub'}
          </button>
        </div>
      </div>
    </div>
  );
};
