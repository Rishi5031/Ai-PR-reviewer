import React from 'react';
import { Cpu } from 'lucide-react';

export const TokenInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    // Let the user type freely, but validation will be shown if out of bounds.
    onChange(isNaN(val) ? '' : val);
  };

  const handleBlur = () => {
    // Snap to bounds on blur
    if (value === '' || value < 1000) {
      onChange(1000);
    } else if (value > 32000) {
      onChange(32000);
    }
  };

  const isInvalid = value !== '' && (value < 1000 || value > 32000);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5 border-t border-border/50">
      <div className="flex-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          Maximum Tokens
        </label>
        <p className="text-sm text-muted-foreground mt-1">
          Max input tokens before intelligent chunking is triggered. (1000 - 32000)
        </p>
      </div>

      <div className="relative w-full md:w-[400px] shrink-0 mt-2 md:mt-0">
        <div className={`flex items-center bg-card border rounded-md shadow-sm transition-colors focus-within:ring-2 focus-within:ring-primary/50 overflow-hidden ${
          isInvalid ? 'border-destructive' : 'border-border'
        }`}>
          <div className="px-3 py-2.5 bg-muted/30 border-r border-border text-muted-foreground text-sm font-medium">
            Limit
          </div>
          <input
            type="number"
            min="1000"
            max="32000"
            step="500"
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-foreground"
          />
        </div>
        {isInvalid && (
          <p className="text-xs text-destructive mt-1.5 font-medium animate-in slide-in-from-top-1 absolute -bottom-5">
            Value must be between 1,000 and 32,000.
          </p>
        )}
      </div>
    </div>
  );
};
