import React from 'react';
import { Unplug } from 'lucide-react';
import { Github } from '../ui/icons';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

export const GithubConnectionStatus = ({ statusData, onDisconnect, isDisconnecting, className }) => {
  if (!statusData || !statusData.is_connected) return null;

  const connectedDate = statusData.connected_at 
    ? new Date(statusData.connected_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      })
    : 'Recently';

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-sm", className)}>
      <div className="flex items-center gap-4">
        {statusData.avatar_url ? (
          <img 
            src={statusData.avatar_url} 
            alt={statusData.github_username} 
            className="h-14 w-14 rounded-full border border-border"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted border border-border">
            <Github className="h-6 w-6 text-foreground" />
          </div>
        )}
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-foreground">
              {statusData.github_username}
            </h3>
            <Badge variant="default" className="bg-green-500/15 text-green-600 hover:bg-green-500/25 dark:text-green-400">
              Connected
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Connected since {connectedDate}
          </p>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDisconnect}
        disabled={isDisconnecting}
        isLoading={isDisconnecting}
        className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
      >
        <Unplug className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    </div>
  );
};
