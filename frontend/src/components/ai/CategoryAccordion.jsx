import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../ui/accordion';
import { IssueCard } from './IssueCard';
import { CheckCircle2 } from 'lucide-react';

export const CategoryHeader = ({ title, icon: Icon, findings }) => {
  const count = findings?.length || 0;
  
  const severities = (findings || []).reduce((acc, f) => {
    const sev = (f.severity || 'unknown').toLowerCase();
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {});

  const severityOrder = ['critical', 'high', 'medium', 'low', 'info'];
  const summary = severityOrder
    .filter(sev => severities[sev] > 0)
    .map(sev => (
      <span key={sev} className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-secondary text-muted-foreground capitalize">
        {sev} {severities[sev]}
      </span>
    ));

  return (
    <div className="flex items-center gap-4 w-full pr-4 overflow-hidden">
      <div className="flex items-center gap-2 shrink-0">
        <Icon className="w-5 h-5 text-primary" />
        <span className="font-semibold text-foreground text-lg">{title}</span>
      </div>
      
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          {count} {count === 1 ? 'Finding' : 'Findings'}
        </span>
        {count > 0 && (
          <div className="flex items-center gap-2">
            {summary}
          </div>
        )}
      </div>
    </div>
  );
};

export const CategoryContent = ({ title, findings }) => {
  if (!findings || findings.length === 0) {
    return (
      <div className="flex items-center gap-2 p-4 text-sm text-success bg-success/5 border border-success/20 rounded-md my-2">
        <CheckCircle2 className="w-5 h-5" />
        <span>No {title.toLowerCase()} issues detected.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-2 mb-4">
      {findings.map((issue, idx) => (
        <IssueCard key={`${title}-${idx}`} issue={issue} />
      ))}
    </div>
  );
};

export const CategoryAccordion = ({ title, icon, findings }) => {
  return (
    <AccordionItem value={title} className="border border-border bg-card rounded-lg px-2 overflow-hidden shadow-sm data-[state=open]:border-primary/50 transition-colors">
      <AccordionTrigger className="hover:bg-transparent py-4">
        <CategoryHeader title={title} icon={icon} findings={findings} />
      </AccordionTrigger>
      <AccordionContent>
        <CategoryContent title={title} findings={findings} />
      </AccordionContent>
    </AccordionItem>
  );
};
