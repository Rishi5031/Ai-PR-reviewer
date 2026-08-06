import React, { useState } from 'react';
import { FileWarning, X, Plus } from 'lucide-react';

export const IgnoreFilesInput = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue('');
    }
  };

  const handleRemove = (patternToRemove) => {
    onChange(value.filter(p => p !== patternToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAdd(e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 py-5 border-t border-border/50">
      <div className="flex-1 mt-1">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <FileWarning className="w-4 h-4 text-primary" />
          Ignore Files
        </label>
        <p className="text-sm text-muted-foreground mt-1">Files matching these patterns will be skipped by the AI.</p>
      </div>

      <div className="w-full md:w-[400px] shrink-0 bg-card border border-border rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 transition-shadow">
        <div className="p-2 flex flex-wrap gap-2 items-center min-h-[44px]">
          {value.map((pattern) => (
            <span
              key={pattern}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted text-foreground text-xs font-medium border border-border/50 transition-colors hover:bg-muted/80"
            >
              {pattern}
              <button
                type="button"
                onClick={() => handleRemove(pattern)}
                className="text-muted-foreground hover:text-destructive focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          
          <div className="flex-1 min-w-[120px] flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={value.length === 0 ? "e.g. package-lock.json..." : "Add..."}
              className="w-full bg-transparent border-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground/60 h-7"
            />
          </div>
        </div>
        
        <div className="bg-muted/30 border-t border-border px-3 py-1.5 flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Press Enter to add</span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
            className="text-xs font-medium text-primary flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:text-primary/80 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
