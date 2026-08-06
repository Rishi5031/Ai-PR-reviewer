import React from 'react';
import { Scale } from 'lucide-react';

export const StrictnessSelector = ({ value, onChange }) => {
  const options = [
    { id: 'low', label: 'Low', desc: 'Only critical issues.' },
    { id: 'medium', label: 'Medium', desc: 'Balanced review.' },
    { id: 'high', label: 'High', desc: 'Enterprise-level review.' },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-t border-border/50">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Scale className="w-4 h-4 text-primary" />
          Review Strictness
        </label>
        <p className="text-sm text-muted-foreground mt-1">Configure how rigorously the AI will examine the codebase.</p>
      </div>

      <div className="w-full md:w-[400px] shrink-0">
        <div className="flex p-1 bg-muted/50 rounded-lg border border-border/50">
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-3 rounded-md text-sm transition-all duration-200 ${
                value === option.id
                  ? 'bg-background shadow-sm border border-border/50 text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-transparent'
              }`}
            >
              <span>{option.label}</span>
              <span className={`text-[10px] mt-0.5 ${value === option.id ? 'text-muted-foreground' : 'opacity-70'}`}>
                {option.desc}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
