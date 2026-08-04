import React from 'react';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatisticCard = ({ title, value, icon: Icon, trend, trendUp, className }) => {
  return (
    <div className={cn("group rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/20", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{value}</h2>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-sm">
          {trendUp === true && <TrendingUp className="h-4 w-4 text-green-500" />}
          {trendUp === false && <TrendingDown className="h-4 w-4 text-red-500" />}
          {trendUp === undefined && <Minus className="h-4 w-4 text-muted-foreground" />}
          <span className={cn(
            "font-medium",
            trendUp === true ? "text-green-500" : trendUp === false ? "text-red-500" : "text-muted-foreground"
          )}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};
