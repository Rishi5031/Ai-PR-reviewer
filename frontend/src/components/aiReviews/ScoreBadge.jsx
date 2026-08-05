import React from 'react';
import { Badge } from '../ui/badge';

export const ScoreBadge = ({ score }) => {
  if (score === null || score === undefined) {
    return <Badge variant="outline" className="text-muted-foreground border-border bg-card">N/A</Badge>;
  }
  
  if (score >= 90) {
    return <Badge variant="outline" className="text-success border-success/30 bg-success/10">{score}/100</Badge>;
  }
  if (score >= 70) {
    return <Badge variant="outline" className="text-warning border-warning/30 bg-warning/10">{score}/100</Badge>;
  }
  return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10">{score}/100</Badge>;
};
