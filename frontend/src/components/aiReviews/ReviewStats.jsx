import React from 'react';
import { Bot, GitPullRequest, Star, AlertTriangle } from 'lucide-react';
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
      <div className={cn("p-3 rounded-xl flex items-center justify-center transition-colors", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export const ReviewStats = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const averageScoreDisplay = stats.average_score 
    ? Math.round(stats.average_score) 
    : 'N/A';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard 
        title="Total Reviews" 
        value={stats.total_reviews} 
        description="All-time AI reviews"
        icon={Bot}
        colorClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
      />
      <StatCard 
        title="Average Score" 
        value={averageScoreDisplay} 
        description="Out of 100 points"
        icon={Star}
        colorClass="bg-warning/10 text-warning group-hover:bg-warning group-hover:text-white"
      />
      <StatCard 
        title="Repositories Reviewed" 
        value={stats.repositories_reviewed} 
        description="Active codebases"
        icon={GitPullRequest}
        colorClass="bg-info/10 text-info group-hover:bg-info group-hover:text-white"
      />
      <StatCard 
        title="High Risk Reviews" 
        value={stats.high_risk_reviews} 
        description="Score below 70"
        icon={AlertTriangle}
        colorClass="bg-destructive/10 text-destructive group-hover:bg-destructive group-hover:text-destructive-foreground"
      />
    </div>
  );
};
