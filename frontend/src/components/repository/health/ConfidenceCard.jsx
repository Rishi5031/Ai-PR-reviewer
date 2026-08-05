import React from 'react';
import { Activity } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const ConfidenceCard = ({ confidence }) => {
  const getBadgeStyle = (level) => {
    switch (level) {
      case 'High': return 'bg-primary/10 text-primary border-primary/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Low': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-secondary/10 text-secondary-foreground border border-secondary/20 rounded-lg shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">Data Confidence</h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px] sm:max-w-[300px]">
            Based on {confidence.confidence_percentage}% historical coverage
          </p>
        </div>
      </div>
      
      <div className={cn("px-3 py-1.5 rounded-full border text-xs font-bold shrink-0", getBadgeStyle(confidence.confidence))}>
        {confidence.confidence}
      </div>
    </div>
  );
};
