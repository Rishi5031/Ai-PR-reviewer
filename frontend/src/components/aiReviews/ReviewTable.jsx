import React from 'react';
import { ReviewRow } from './ReviewRow';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ReviewTable = ({ reviews, total, page, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit + 1;
  const endIdx = Math.min(page * limit, total);

  return (
    <div className="w-full">
      <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm">
        <div className="border-b border-border bg-muted/50 p-4">
          <h3 className="text-sm font-semibold text-foreground">AI Reviews</h3>
        </div>
        
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <ReviewRow key={review.id} review={review} />
          ))}
        </div>

        {total > 0 && (
          <div className="border-t border-border p-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Showing {startIdx} to {endIdx} of {total} reviews
            </span>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium text-foreground px-2">
                Page {page} of {totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
