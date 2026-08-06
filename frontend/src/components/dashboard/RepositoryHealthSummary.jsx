import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Activity, ShieldCheck, AlertCircle, Percent } from 'lucide-react';

export const RepositoryHealthSummary = ({ summary }) => {
  if (!summary) return null;

  const getHealthColor = (health) => {
    if (health >= 80) return 'text-green-500';
    if (health >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (health) => {
    if (health >= 80) return 'bg-green-500';
    if (health >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="col-span-full mb-8">
      <CardHeader>
        <CardTitle>Health Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Average Health */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <Activity className="h-4 w-4 mr-2" />
              Average Health
            </div>
            <div className="flex items-end space-x-2">
              <span className={`text-4xl font-bold ${getHealthColor(summary.average_health)}`}>
                {summary.average_health?.toFixed(1) || '0.0'}
              </span>
              <span className="text-sm text-muted-foreground mb-1">/ 100</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${getProgressColor(summary.average_health)}`} 
                style={{ width: `${summary.average_health || 0}%` }}
              />
            </div>
          </div>

          {/* Highest Health Repo */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <ShieldCheck className="h-4 w-4 mr-2 text-green-500" />
              Best Repository
            </div>
            <div className="text-xl font-semibold text-foreground truncate">
              {summary.highest_health_repository || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              Highest scoring codebase
            </div>
          </div>

          {/* Lowest Health Repo */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              Needs Attention
            </div>
            <div className="text-xl font-semibold text-foreground truncate">
              {summary.lowest_health_repository || 'N/A'}
            </div>
            <div className="text-sm text-muted-foreground">
              Lowest scoring codebase
            </div>
          </div>

          {/* Coverage */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <Percent className="h-4 w-4 mr-2" />
              AI Coverage
            </div>
            <div className="text-2xl font-bold text-foreground">
              {summary.coverage?.toFixed(1) || '0.0'}%
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className={`mr-2 h-2 w-2 rounded-full ${
                summary.confidence === 'High' ? 'bg-green-500' : 
                summary.confidence === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              {summary.confidence || 'Unknown'} Confidence
            </div>
          </div>
        </div>
        
        {summary.last_updated && (
          <div className="mt-6 text-xs text-muted-foreground text-right">
            Last updated: {new Date(summary.last_updated).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
