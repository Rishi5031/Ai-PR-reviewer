import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

const STEPS = [
  'Fetching Pull Request',
  'Reading Changed Files',
  'Preparing AI Context',
  'Analyzing Code',
  'Generating Review',
  'Saving Review'
];

export const ReviewProgressDialog = ({ isOpen, onClose, isComplete, error }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    if (error) {
      return; // Stop on error
    }

    if (isComplete) {
      setCurrentStepIndex(STEPS.length);
      return;
    }

    // Simulate progress while waiting for the single API response
    // Most time spent in "Analyzing Code" and "Generating Review"
    const intervals = [
      800,  // Fetching
      1500, // Reading
      1000, // Preparing
      8000, // Analyzing
      10000 // Generating (will likely resolve before this finishes, but just in case)
    ];

    let currentInterval = null;
    let step = 0;

    const advanceStep = () => {
      if (step >= STEPS.length - 2) return; // Don't reach Saving/Done until actual API is complete
      currentInterval = setTimeout(() => {
        step++;
        setCurrentStepIndex(step);
        advanceStep();
      }, intervals[step] || 2000);
    };

    advanceStep();

    return () => {
      if (currentInterval) clearTimeout(currentInterval);
    };
  }, [isOpen, isComplete, error]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold text-foreground">AI Code Review</h2>
          <p className="text-sm text-muted-foreground mt-1">Please wait while the AI analyzes your code...</p>
        </div>

        <div className="space-y-4 mb-8">
          {STEPS.map((step, index) => {
            const isPast = index < currentStepIndex;
            const isCurrent = index === currentStepIndex && !isComplete && !error;
            const isError = error && index === currentStepIndex;

            return (
              <div key={step} className="flex items-center gap-3">
                {isPast || (isComplete && index === STEPS.length - 1) ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : isError ? (
                  <Circle className="w-5 h-5 text-destructive" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/30" />
                )}
                
                <span className={`text-sm font-medium ${
                  isPast || isComplete ? 'text-foreground' : 
                  isCurrent ? 'text-primary' : 
                  isError ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="p-3 mb-6 text-sm text-destructive-foreground bg-destructive/10 rounded border border-destructive/20">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          {(isComplete || error) ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Close
            </button>
          ) : (
            <div className="h-9"></div> // Placeholder for layout stability
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
