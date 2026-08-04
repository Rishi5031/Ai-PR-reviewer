import React from 'react';
import { Github } from '../ui/icons';
import { Button } from '../ui/button';

export const ConnectGithubCard = ({ onConnectClick }) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted shadow-sm border border-border">
        <Github className="h-10 w-10 text-foreground" />
      </div>
      <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground">
        No GitHub Account Connected
      </h2>
      <p className="mb-8 max-w-md text-base text-muted-foreground">
        Connect your GitHub account using a Personal Access Token (PAT) to browse repositories, trigger AI code reviews, and monitor your code quality metrics.
      </p>
      <Button size="lg" onClick={onConnectClick} className="px-8 shadow-sm">
        Connect GitHub
      </Button>
    </div>
  );
};
