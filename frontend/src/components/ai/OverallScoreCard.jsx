import React from 'react';

export const OverallScoreCard = ({ score }) => {
  // Determine color based on score
  let scoreColorClass = 'text-success';
  let barColorClass = 'bg-success';
  
  if (score < 70) {
    scoreColorClass = 'text-destructive';
    barColorClass = 'bg-destructive';
  } else if (score < 85) {
    scoreColorClass = 'text-warning';
    barColorClass = 'bg-warning';
  }

  return (
    <div className="bg-card border border-border p-6 rounded-lg shadow-sm flex flex-col justify-center items-center h-full">
      <div className="text-center space-y-4 w-full">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall AI Score</h3>
        
        <div className="flex justify-center items-end gap-1">
          <span className="text-6xl font-bold text-foreground">{score}</span>
          <span className="text-2xl font-medium text-muted-foreground pb-1">/100</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-3 max-w-[200px] mx-auto mt-4 overflow-hidden">
          <div 
            className={`h-full ${barColorClass} transition-all duration-1000 ease-out`} 
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
};
