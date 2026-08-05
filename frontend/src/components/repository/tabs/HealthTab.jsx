import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { aiService } from '../../../services/ai.service';
import { AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { HealthSummaryCard } from '../health/HealthSummaryCard';
import { CoverageCard } from '../health/CoverageCard';
import { ConfidenceCard } from '../health/ConfidenceCard';
import { MostCommonFindings } from '../../analytics/MostCommonFindings';

export const HealthTab = () => {
  const { owner, repo, repository } = useOutletContext();

  const { data: healthData, isLoading, isError, error } = useQuery({
    queryKey: ['repository-health', owner, repo],
    queryFn: () => aiService.getRepositoryHealth(owner, repo)
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-64 bg-muted rounded-lg w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-32 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 flex items-center justify-center text-destructive flex-col">
        <AlertCircle className="h-10 w-10 mb-4 opacity-80" />
        <p className="font-semibold text-lg">Failed to load repository health</p>
        <p className="text-sm mt-1">{error?.response?.data?.detail || error.message}</p>
      </div>
    );
  }

  if (!healthData) return null;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 pb-12">
      {/* Header info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Repository Health</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Engineering insights based on CodeGuardian AI reviews.
          </p>
        </div>
        
        {healthData.last_updated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
            <Clock className="w-4 h-4" />
            Last Updated: {formatDistanceToNow(new Date(healthData.last_updated), { addSuffix: true })}
          </div>
        )}
      </div>

      <HealthSummaryCard summary={healthData.repository_executive_summary} overall={healthData.overall_health} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CoverageCard coverage={healthData.analysis_coverage} />
        <ConfidenceCard confidence={healthData.confidence_level} />
      </div>



      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Most Common Findings</h3>
        {healthData.most_common_findings?.length > 0 ? (
          <MostCommonFindings findings={healthData.most_common_findings} />
        ) : (
          <div className="bg-card border border-border p-8 text-center rounded-lg shadow-sm">
            <p className="text-muted-foreground">No critical findings detected.</p>
          </div>
        )}
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-sm text-primary items-start">
        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p>{healthData.health_disclaimer}</p>
      </div>
    </div>
  );
};
