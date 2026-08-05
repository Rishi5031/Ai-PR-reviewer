import React from 'react';
import { Badge } from '../ui/badge';

export const RepositoryHeader = ({ repository }) => {
  if (!repository) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xl shrink-0">
          {repository.full_name.split('/')[0].substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            {repository.name}
            <Badge variant={repository.private ? "secondary" : "outline"} className="capitalize ml-2">
              {repository.private ? 'Private' : 'Public'}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {repository.full_name}
          </p>
        </div>
      </div>
      
      {repository.description && (
        <p className="text-foreground max-w-3xl">
          {repository.description}
        </p>
      )}
    </div>
  );
};
