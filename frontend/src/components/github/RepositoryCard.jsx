import React from 'react';
import { Star, GitFork, ExternalLink, ShieldAlert, Circle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

// Helper to get a color for programming languages
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: 'text-yellow-400',
    TypeScript: 'text-blue-500',
    Python: 'text-blue-600',
    Java: 'text-red-500',
    HTML: 'text-orange-500',
    CSS: 'text-blue-400',
    Ruby: 'text-red-600',
    Go: 'text-cyan-500',
    Rust: 'text-orange-600',
  };
  return colors[language] || 'text-muted-foreground';
};

export const RepositoryCard = ({ repo }) => {
  const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 truncate pr-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary font-bold text-xs shrink-0">
              {repo.full_name.split('/')[0].substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-semibold text-foreground truncate" title={repo.name}>
              {repo.name}
            </h3>
          </div>
          <Badge variant={repo.private ? "secondary" : "outline"} className="shrink-0 capitalize">
            {repo.private ? 'Private' : 'Public'}
          </Badge>
        </div>
        
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {repo.description || "No description provided."}
        </p>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {repo.language && (
              <div className="flex items-center gap-1.5">
                <Circle className={cn("h-3 w-3 fill-current", getLanguageColor(repo.language))} />
                <span>{repo.language}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>{repo.stargazers_count || 0}</span>
            </div>
          </div>
          
          <div className="text-xs">
            Updated {updatedDate}
          </div>
        </div>
      </div>
    </div>
  );
};
