import React from 'react';
import { cn } from '../../../lib/utils';
import { Shield, FileCode, Zap, CheckCircle2, LayoutTemplate, Settings, GraduationCap } from 'lucide-react';

const categoryConfig = {
  security: { icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  code_quality: { icon: FileCode, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  performance: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  testing: { icon: CheckCircle2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  architecture: { icon: LayoutTemplate, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  maintainability: { icon: Settings, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  best_practices: { icon: GraduationCap, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
};

export const CategoryScoreCard = ({ category, score }) => {
  const config = categoryConfig[category] || { icon: FileCode, color: 'text-primary', bg: 'bg-primary/10' };
  const Icon = config.icon;
  const label = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  // Determine bar color based on score (0-10)
  let barColor = "bg-primary";
  if (score < 6) barColor = "bg-destructive";
  else if (score < 8) barColor = "bg-warning";

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg", config.bg, config.color)}>
          <Icon className="w-4 h-4" />
        </div>
        <h4 className="font-medium text-foreground">{label}</h4>
      </div>
      
      <div className="flex justify-between items-end mb-2">
        <span className="text-2xl font-bold text-foreground">{score.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground pb-1">/ 10</span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
        <div 
          className={cn("h-1.5 rounded-full transition-all duration-500", barColor)} 
          style={{ width: `${(score / 10) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
