import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Unplug, Clock, ShieldCheck } from 'lucide-react';
import { Github } from '../ui/icons';
import { DisconnectDialog } from './DisconnectDialog';

export const ConnectionStatus = ({ status, onDisconnectSuccess }) => {
  const [isDisconnectOpen, setIsDisconnectOpen] = useState(false);

  if (!status || !status.is_connected) return null;

  return (
    <>
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-border/50 shrink-0 bg-muted">
              {status.avatar_url ? (
                <img src={status.avatar_url} alt={status.github_username} className="w-full h-full object-cover" />
              ) : (
                <Github className="w-6 h-6 m-3 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">{status.github_username}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider">
                  <ShieldCheck className="w-3 h-3" />
                  {status.connection_type || 'PAT'}
                </span>
              </div>
              
              {status.connected_at && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3.5 h-3.5" />
                  Connected {formatDistanceToNow(new Date(status.connected_at), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDisconnectOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-md hover:bg-destructive/20 transition-colors shadow-sm w-full md:w-auto justify-center"
          >
            <Unplug className="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>

      <DisconnectDialog 
        isOpen={isDisconnectOpen} 
        onClose={() => setIsDisconnectOpen(false)} 
        onSuccess={onDisconnectSuccess}
      />
    </>
  );
};
