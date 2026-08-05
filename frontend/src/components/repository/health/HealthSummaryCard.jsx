import React from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const HealthSummaryCard = ({ summary, overall }) => {
  const isHealthy = ['Excellent', 'Very Good', 'Good'].includes(overall.health_status);
  
  return (
    <div className={cn(
      "border rounded-xl shadow-sm overflow-hidden relative",
      isHealthy ? "bg-card border-primary/20" : "bg-card border-destructive/20"
    )}>
      {/* Top Banner */}
      <div className={cn(
        "h-2 w-full",
        isHealthy ? "bg-primary" : "bg-destructive"
      )}></div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <div className={cn(
            "p-4 rounded-2xl shrink-0 mt-1",
            isHealthy ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
          )}>
            {isHealthy ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="text-2xl font-bold text-foreground">
                {overall.health_status}
              </h3>
              <div className={cn(
                "text-sm font-bold px-3 py-1 rounded-full border inline-flex w-max",
                isHealthy ? "bg-primary/10 border-primary/30 text-primary" : "bg-destructive/10 border-destructive/30 text-destructive"
              )}>
                Score: {overall.overall_health_score}/10
              </div>
            </div>
            
            <p className="text-foreground/80 mt-3 text-base leading-relaxed">
              {summary.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <p className="text-sm font-semibold flex items-center gap-2 text-primary mb-2">
                  <Zap className="w-4 h-4" /> Top Strengths
                </p>
                <div className="flex flex-wrap gap-2">
                  {summary.strengths.map(s => (
                    <span key={s} className="text-xs bg-background border border-border px-2 py-1 rounded-md text-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="bg-destructive/5 rounded-lg p-4 border border-destructive/10">
                <p className="text-sm font-semibold flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="w-4 h-4" /> Focus Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {summary.weaknesses.map(w => (
                    <span key={w} className="text-xs bg-background border border-border px-2 py-1 rounded-md text-foreground">{w}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-bold text-foreground flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-primary" />
                Action Plan
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {summary.recommended_next_step}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
