import React from 'react';
import { Star, GitFork, Circle, GitBranch, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

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

export const RepositoryStats = ({ repository }) => {
  if (!repository) return null;

  const updatedDate = new Date(repository.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
      {repository.language && (
        <div className="flex items-center gap-1.5">
          <Circle className={cn("h-3 w-3 fill-current", getLanguageColor(repository.language))} />
          <span>{repository.language}</span>
        </div>
      )}
      
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4" />
        <span>{repository.stargazers_count.toLocaleString()} stars</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <GitBranch className="h-4 w-4" />
        <span>{repository.default_branch}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <AlertCircle className="h-4 w-4" />
        <span>{repository.open_issues_count || 0} issues</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4" />
        <span>Updated on {updatedDate}</span>
      </div>
    </div>
  );
};
