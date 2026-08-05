import React from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

export const ActionableInsights = ({ insights }) => {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-primary/20 rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <Lightbulb className="w-5 h-5 fill-primary/20" />
          Engineering Insights
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Automated analysis based on your AI reviews
        </p>
      </div>
      
      <div className="p-6 flex-1 flex flex-col justify-center">
        {insights && insights.length > 0 ? (
          <ul className="space-y-4">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-3 group">
                <div className="mt-0.5 bg-primary/10 p-1 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ChevronRight className="w-3 h-3" />
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {insight}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Lightbulb className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Not enough data to generate insights yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
