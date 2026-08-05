import React from 'react';
import { Bot, FileText } from 'lucide-react';

export const ReviewSummaryCard = ({ summary }) => {
  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
        <Bot className="w-5 h-5 text-primary" />
        <h2>AI Summary</h2>
      </div>
      <div className="flex-1 bg-secondary/50 rounded-md p-4 border border-border/50 overflow-y-auto">
        {summary ? (
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
            <FileText className="w-8 h-8 opacity-20" />
            <p className="text-sm italic">No summary provided.</p>
          </div>
        )}
      </div>
    </div>
  );
};
