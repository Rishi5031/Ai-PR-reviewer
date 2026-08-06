import React, { useState } from 'react';
import { Key, Loader2, Info } from 'lucide-react';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';
import { useQueryClient } from '@tanstack/react-query';

export const PATConnectionCard = () => {
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsConnecting(true);
    try {
      await githubService.connect(token);
      toast.success("Your GitHub account has been connected using PAT.");
      // Invalidate status so it re-fetches
      queryClient.invalidateQueries(['github-status']);
      setToken('');
    } catch (error) {
      toast.error(error.response?.data?.detail || "Invalid token or network error.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-6 h-full">
      <div className="flex flex-col h-full">
        <div className="flex gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50">
            <Key className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">Personal Access Token</h3>
              <div className="relative group flex items-center">
                <div className="text-muted-foreground hover:text-primary transition-colors cursor-help">
                  <Info className="w-4 h-4" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-full mt-2 w-[280px] z-50 p-3 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <p className="text-xs font-semibold mb-2">How to get a PAT:</p>
                  <ol className="text-xs space-y-1.5 list-decimal list-inside text-muted-foreground">
                    <li>Go to GitHub <strong>Settings</strong></li>
                    <li>Click <strong>Developer settings</strong></li>
                    <li>Select <strong>Personal access tokens (classic)</strong></li>
                    <li>Click <strong>Generate new token</strong></li>
                    <li>Check the <code className="bg-muted px-1 rounded">repo</code> scope</li>
                    <li>Generate and copy your token</li>
                  </ol>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Alternatively, connect using a classic Personal Access Token with <code className="text-xs bg-muted px-1 py-0.5 rounded border border-border/50 text-foreground">repo</code> permissions.
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <form onSubmit={handleConnect} className="w-full flex gap-3">
            <input
              type="password"
              placeholder="ghp_..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isConnecting}
              className="flex-1 px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 min-w-0"
            />
            <button
              type="submit"
              disabled={isConnecting || !token.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border rounded-md hover:bg-muted/80 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              Connect
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
