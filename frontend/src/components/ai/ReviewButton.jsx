import React from 'react';
import { Sparkles } from 'lucide-react';

export const ReviewButton = ({ onClick, isReviewing, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={isReviewing || disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        ${
          isReviewing || disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-70'
            : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
        }
      `}
    >
      <Sparkles className={`w-4 h-4 ${isReviewing ? 'animate-pulse' : ''}`} />
      {isReviewing ? 'Reviewing...' : 'Review with AI'}
    </button>
  );
};
