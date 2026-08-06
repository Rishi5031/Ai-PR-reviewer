import React from 'react';
import { Save, RotateCcw, Loader2 } from 'lucide-react';

export const SettingsActions = ({ isDirty, isSaving, onSave, onReset }) => {
  return (
    <div className="mt-8 flex justify-end gap-3">
      <button
        type="button"
        onClick={onReset}
        disabled={!isDirty || isSaving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-card border border-border rounded-md hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Defaults
      </button>
      
      <button
        type="button"
        onClick={onSave}
        disabled={!isDirty || isSaving}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};
