import React from 'react';
import { Target } from 'lucide-react';

export const CoverageSlider = ({ value, onChange }) => {
  // Map value (50-100) to percentage (0-100) for the background fill
  const fillPercentage = ((value - 50) / (100 - 50)) * 100;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-t border-border/50">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Coverage Threshold
        </label>
        <p className="text-sm text-muted-foreground mt-1">
          Minimum health score required before warning. Repository health uses reviewed PRs only.
        </p>
      </div>

      <div className="w-full md:w-[400px] shrink-0 px-1 mt-2 md:mt-0">
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">{value}%</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target</span>
        </div>
        
        <div className="relative pt-1">
          <input
            type="range"
            min="50"
            max="100"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer outline-none slider-thumb"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${fillPercentage}%, hsl(var(--muted)) ${fillPercentage}%)`
            }}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-medium">
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: hsl(var(--background));
          border: 2px solid hsl(var(--primary));
          cursor: pointer;
          transition: transform 0.1s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .slider-thumb::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
      `}} />
    </div>
  );
};
