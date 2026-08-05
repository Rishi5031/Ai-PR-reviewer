import React, { useState } from 'react';
import { File, ChevronRight, ChevronDown } from 'lucide-react';
import { DiffViewer } from './DiffViewer';
import { cn } from '../../lib/utils';

const ChangedFile = ({ file }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-border last:border-0">
      <div 
        className={cn(
          "flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors",
          isExpanded && "bg-muted/10"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <File className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground truncate" title={file.filename}>
            {file.filename}
          </span>
        </div>
        
        <div className="flex items-center gap-3 shrink-0 ml-4">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground capitalize">
            {file.status}
          </span>
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="text-green-500">+{file.additions}</span>
            <span className="text-red-500">-{file.deletions}</span>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t border-border">
          <DiffViewer patch={file.patch} />
        </div>
      )}
    </div>
  );
};

export const ChangedFilesList = ({ files }) => {
  if (!files || files.length === 0) return null;

  return (
    <div className="flex flex-col bg-card border border-border rounded-lg overflow-hidden mt-6">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
          Changed Files ({files.length})
        </h3>
      </div>
      <div className="flex flex-col">
        {files.map((file, idx) => (
          <ChangedFile key={file.filename || idx} file={file} />
        ))}
      </div>
    </div>
  );
};
