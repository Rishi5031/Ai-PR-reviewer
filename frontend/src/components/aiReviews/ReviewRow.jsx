import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, GitPullRequest, Search, Trash2, RotateCw, ExternalLink, MoreVertical } from 'lucide-react';
import { ScoreBadge } from './ScoreBadge';
import { RecommendationBadge } from './RecommendationBadge';
import { Button } from '../ui/button';
import { DeleteReviewDialog } from './DeleteReviewDialog';
import { aiService } from '../../services/ai.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../contexts/ToastContext';

export const ReviewRow = ({ review }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => aiService.deleteDashboardReview(review.id),
    onSuccess: () => {
      toast.success('Review deleted successfully');
      setIsDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['ai-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['ai-reviews-stats'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.detail || 'Failed to delete review');
      setIsDeleteDialogOpen(false);
    }
  });

  const handleView = () => {
    navigate(`/repositories/${review.owner}/${review.repository_name}/pulls/${review.pull_request_number}/ai-review`);
  };

  const handleReRun = () => {
    navigate(`/repositories/${review.owner}/${review.repository_name}/pulls/${review.pull_request_number}`);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 hover:bg-muted/30 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground text-sm truncate">
              {review.owner}/{review.repository_name}
            </span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <GitPullRequest className="w-3 h-3" />
              #{review.pull_request_number}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <RecommendationBadge recommendation={review.recommendation} />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline-block">Score:</span>
            <ScoreBadge score={review.overall_score} />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleView} className="h-8 text-xs px-3">
              View
            </Button>
            <div className="relative group">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 py-1">
                <button 
                  onClick={handleReRun}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  Re-run Review
                </button>
                <button 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteReviewDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};
