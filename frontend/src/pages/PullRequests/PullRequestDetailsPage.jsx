import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { githubService } from '../../services/github.service';
import { useToast } from '../../contexts/ToastContext';

import { PullRequestDetails } from '../../components/pull-requests/PullRequestDetails';
import { ChangedFilesList } from '../../components/pull-requests/ChangedFilesList';
import { CommitHistory } from '../../components/pull-requests/CommitHistory';
import { ReviewButton } from '../../components/ai/ReviewButton';
import { ReviewProgressDialog } from '../../components/ai/ReviewProgressDialog';
import { aiService } from '../../services/ai.service';

export const PullRequestDetailsPage = () => {
  const { owner, repo, pullNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [prDetails, setPrDetails] = useState(null);
  const [files, setFiles] = useState([]);
  const [commits, setCommits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // AI Review State
  const [reviewStatus, setReviewStatus] = useState({ exists: false, review: null });
  const [isCheckingReview, setIsCheckingReview] = useState(true);
  const [isReviewDialogVisible, setIsReviewDialogVisible] = useState(false);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  const fetchAllDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsCheckingReview(true);
      
      const [detailsData, filesData, commitsData, reviewData] = await Promise.all([
        githubService.getPullRequestDetails(owner, repo, pullNumber),
        githubService.getPullRequestFiles(owner, repo, pullNumber),
        githubService.getPullRequestCommits(owner, repo, pullNumber),
        aiService.getReviewStatus(owner, repo, pullNumber).catch(() => ({ exists: false }))
      ]);

      setPrDetails(detailsData);
      setFiles(filesData);
      setCommits(commitsData);
      setReviewStatus(reviewData);
    } catch (error) {
      console.error('Failed to fetch pull request details', error);
      toast.error('Failed to load pull request details.');
    } finally {
      setIsLoading(false);
      setIsCheckingReview(false);
    }
  }, [owner, repo, pullNumber, toast]);

  useEffect(() => {
    fetchAllDetails();
  }, [fetchAllDetails]);

  const handleReviewWithAI = async () => {
    setIsReviewDialogVisible(true);
    setIsReviewComplete(false);
    setReviewError(null);

    try {
      await aiService.generateReview(owner, repo, pullNumber);
      setIsReviewComplete(true);
      
      // Give the user a moment to see the "Done" state before navigating
      setTimeout(() => {
        setIsReviewDialogVisible(false);
        navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}/ai-review`);
      }, 1500);
    } catch (err) {
      console.error('AI Review failed:', err);
      setReviewError(err.response?.data?.detail || 'Failed to generate AI review. Please try again.');
    }
  };

  const closeReviewDialog = () => {
    setIsReviewDialogVisible(false);
    if (isReviewComplete) {
      navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}/ai-review`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button 
          onClick={() => navigate(`/repositories/${owner}/${repo}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {owner}/{repo}
        </button>

        <div className="flex items-center gap-3">
          {isCheckingReview ? (
            <div className="h-9 w-32 bg-card border border-border rounded-md animate-pulse"></div>
          ) : reviewStatus.exists && reviewStatus.review ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-md">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">AI Reviewed</span>
                <span className="text-sm font-bold text-success ml-1">{reviewStatus.review.overall_score}/100</span>
              </div>
              <span className="text-xs text-muted-foreground mr-2">
                {new Date(reviewStatus.review.created_at).toLocaleDateString()}
              </span>
              <button 
                onClick={() => navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}/ai-review`)}
                className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                View AI Review
              </button>
              <button 
                onClick={handleReviewWithAI}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                disabled={isReviewDialogVisible && !isReviewComplete && !reviewError}
              >
                Re-run Review
              </button>
            </>
          ) : (
            <ReviewButton 
              onClick={handleReviewWithAI} 
              isReviewing={isReviewDialogVisible && !isReviewComplete && !reviewError} 
            />
          )}
        </div>
      </div>

      <ReviewProgressDialog
        isOpen={isReviewDialogVisible}
        onClose={closeReviewDialog}
        isComplete={isReviewComplete}
        error={reviewError}
      />

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-40 bg-card border border-border rounded-lg animate-pulse"></div>
          <div className="h-64 bg-card border border-border rounded-lg animate-pulse"></div>
        </div>
      ) : prDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <PullRequestDetails pr={prDetails} />
            <ChangedFilesList files={files} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            <CommitHistory commits={commits} />
          </div>
        </div>
      )}
    </div>
  );
};
