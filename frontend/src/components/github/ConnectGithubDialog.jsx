import React, { useState } from 'react';
import { Eye, EyeOff, ExternalLink, KeyRound } from 'lucide-react';
import { Github } from '../ui/icons';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';

export const ConnectGithubDialog = ({ open, onOpenChange, onConnect, isConnecting }) => {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleConnect = () => {
    if (token.trim()) {
      onConnect(token.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Github className="h-5 w-5 text-foreground" />
          <DialogTitle>Connect GitHub Account</DialogTitle>
        </div>
        <DialogDescription>
          Provide a GitHub Personal Access Token (PAT) to securely link your account. 
          Your token will be encrypted before being stored.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="pat" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
            Personal Access Token
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <KeyRound className="h-4 w-4" />
            </div>
            <input
              id="pat"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground border border-border/50">
          <p className="font-medium text-foreground mb-1">How to create a token:</p>
          <ol className="list-decimal pl-4 space-y-1 ml-1">
            <li>Go to GitHub Developer Settings</li>
            <li>Generate a new token (classic)</li>
            <li>Select the <strong>repo</strong> scope</li>
            <li>Copy and paste the token above</li>
          </ol>
          <a 
            href="https://github.com/settings/tokens/new" 
            target="_blank" 
            rel="noreferrer"
            className="mt-3 inline-flex items-center text-primary hover:underline font-medium"
          >
            Create token on GitHub <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={() => onOpenChange(false)}
          disabled={isConnecting}
          className="bg-background text-foreground hover:bg-accent"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleConnect} 
          disabled={!token.trim() || isConnecting}
          isLoading={isConnecting}
        >
          Connect
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
