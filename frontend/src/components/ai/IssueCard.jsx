import React from 'react';
import { AlertTriangle, FileCode, CheckCircle2, Info, FileWarning } from 'lucide-react';

const SEVERITY_CONFIG = {
  critical: {
    colorClass: 'text-destructive',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: FileWarning
  },
  high: {
    colorClass: 'text-destructive',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: AlertTriangle
  },
  medium: {
    colorClass: 'text-warning',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: AlertTriangle
  },
  low: {
    colorClass: 'text-info',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: Info
  },
  info: {
    colorClass: 'text-info',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: Info
  },
  default: {
    colorClass: 'text-muted-foreground',
    bgClass: 'bg-transparent',
    borderClass: 'border-border',
    icon: CheckCircle2
  }
};

export const IssueCard = ({ issue }) => {
  const sevKey = issue?.severity?.toLowerCase() || 'default';
  const config = SEVERITY_CONFIG[sevKey] || SEVERITY_CONFIG.default;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-lg border ${config.borderClass} ${config.bgClass} flex flex-col gap-3 transition-colors`}>
      
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${config.colorClass}`} />
          <div>
            <h4 className="text-sm font-semibold text-foreground leading-tight">{issue.title}</h4>
            <div className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap">
              {issue.description}
            </div>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${config.borderClass} ${config.colorClass}`}>
          {issue.severity || 'UNKNOWN'}
        </span>
      </div>

      {(issue.file || issue.line) && (
        <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <FileCode className="w-3.5 h-3.5" />
          <span className="font-mono bg-background/50 px-1.5 py-0.5 rounded break-all">
            {issue.file || 'Unknown File'}
            {issue.line ? ` : L${issue.line}` : ''}
          </span>
        </div>
      )}

    </div>
  );
};
