import React from 'react';
import { Bot, Star, GitPullRequest, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

const StatCard = ({ title, value, description, icon: Icon, colorClass }) => (
  <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:border-primary/30 transition-colors group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h4 className="text-3xl font-bold text-foreground mt-2">{value}</h4>
        {description && (
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      <div className={cn("p-3 rounded-xl flex items-center justify-center transition-colors text-white", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export const OverviewCards = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Reviews" 
        value={overview.total_reviews} 
        description="Generated AI reviews"
        icon={Bot}
        colorClass="bg-primary/80 group-hover:bg-primary"
      />
      <StatCard 
        title="Average Score" 
        value={overview.average_score} 
        description="Out of 100"
        icon={Star}
        colorClass="bg-warning/80 group-hover:bg-warning"
      />
      <StatCard 
        title="Repositories" 
        value={overview.repositories_reviewed} 
        description="Active codebases"
        icon={GitPullRequest}
        colorClass="bg-info/80 group-hover:bg-info"
      />
      <StatCard 
        title="Critical Findings" 
        value={overview.critical_findings} 
        description="Immediate action required"
        icon={AlertTriangle}
        colorClass="bg-destructive/80 group-hover:bg-destructive"
      />
    </div>
  );
};
