import React from 'react';
import { IssueCard } from './IssueCard';

export const IssueSection = ({ title, issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        {issues.map((issue, idx) => (
          <IssueCard key={`${title}-${idx}`} issue={issue} />
        ))}
      </div>
    </div>
  );
};
