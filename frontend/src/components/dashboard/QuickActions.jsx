import React from 'react';
import { Plus, GitPullRequest, RefreshCw, BarChart2 } from 'lucide-react';

const actions = [
  { name: 'Connect Repository', icon: Plus, primary: true },
  { name: 'Review Pull Request', icon: GitPullRequest },
  { name: 'Refresh Data', icon: RefreshCw },
  { name: 'View Analytics', icon: BarChart2 },
];

export const QuickActions = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.name}
          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
            ${action.primary 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm' 
              : 'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
        >
          <action.icon className="h-4 w-4" />
          {action.name}
        </button>
      ))}
    </div>
  );
};
