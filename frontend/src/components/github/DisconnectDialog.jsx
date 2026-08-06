import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Unplug, Loader2, X } from 'lucide-react';
import { githubService } from '../../services/github.service';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../contexts/ToastContext';

export const DisconnectDialog = ({ isOpen, onClose, onSuccess }) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true);
      // Wait, we can just use the unified disconnect from githubService
      await githubService.disconnect();
      queryClient.setQueryData(['github-status'], { is_connected: false });
      toast.success("Your GitHub account has been disconnected.");
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to disconnect account.");
    } finally {
      setIsDisconnecting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 border border-destructive/20">
                <Unplug className="w-5 h-5 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Disconnect GitHub?</h3>
            </div>
            <button
              onClick={onClose}
              disabled={isDisconnecting}
              className="text-muted-foreground hover:text-foreground focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            This removes GitHub access but keeps your CodeGuardian AI account. Any repositories currently active will lose their integration abilities.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDisconnecting}
              className="px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted/80 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive rounded-md hover:bg-destructive/90 transition-colors shadow-sm disabled:opacity-50"
            >
              {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unplug className="w-4 h-4" />}
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
