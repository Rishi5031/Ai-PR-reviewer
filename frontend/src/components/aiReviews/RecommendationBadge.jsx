import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export const RecommendationBadge = ({ recommendation }) => {
  if (!recommendation) {
    return <Badge variant="outline" className="text-muted-foreground border-border bg-card">N/A</Badge>;
  }

  const rec = recommendation.toLowerCase();

  if (rec.includes('approve') && !rec.includes('changes')) {
    return (
      <Badge variant="outline" className="text-success border-success/30 bg-success/10 flex items-center gap-1.5 px-2 py-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Approve
      </Badge>
    );
  }
  
  if (rec.includes('approve') && rec.includes('changes')) {
    return (
      <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10 flex items-center gap-1.5 px-2 py-1">
        <AlertCircle className="w-3.5 h-3.5" />
        Approve with Changes
      </Badge>
    );
  }

  if (rec.includes('request changes')) {
    return (
      <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 flex items-center gap-1.5 px-2 py-1">
        <XCircle className="w-3.5 h-3.5" />
        Request Changes
      </Badge>
    );
  }

  // Fallback
  return (
    <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10">
      {recommendation}
    </Badge>
  );
};
