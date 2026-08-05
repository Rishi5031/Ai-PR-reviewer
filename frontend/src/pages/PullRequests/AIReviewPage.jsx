import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Shield, Bug, Gauge, Code, BookOpen, Wrench, TestTube, Sparkles } from 'lucide-react';
import { aiService } from '../../services/ai.service';
import { useToast } from '../../contexts/ToastContext';

import { ReviewSkeleton } from '../../components/ai/ReviewSkeleton';
import { OverallScoreCard } from '../../components/ai/OverallScoreCard';
import { ReviewSummary } from '../../components/ai/ReviewSummary';
import { CategoryAccordion } from '../../components/ai/CategoryAccordion';
import { Accordion } from '../../components/ui/accordion';
import { ReviewHeader } from '../../components/ai/ReviewHeader';
import { RecommendationCard } from '../../components/ai/RecommendationCard';
import { EmptyReview } from '../../components/ai/EmptyReview';

export const AIReviewPage = () => {
  const { owner, repo, pullNumber } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aiService.getReviewStatus(owner, repo, pullNumber);
      if (data.exists) {
        setReview(data.review);
      } else {
        setReview(null);
      }
    } catch (err) {
      console.error('Failed to fetch AI review status', err);
      setError(err.response?.data?.detail || 'Failed to load the AI review for this pull request.');
      toast.error('Failed to load AI review status.');
    } finally {
      setIsLoading(false);
    }
  }, [owner, repo, pullNumber, toast]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 max-w-6xl mx-auto">
      {review && (
        <ReviewHeader 
          owner={owner} 
          repo={repo} 
          pullNumber={pullNumber} 
          createdAt={review.created_at} 
        />
      )}

      {isLoading ? (
        <ReviewSkeleton />
      ) : error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center text-destructive flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-4 opacity-80" />
          <h2 className="text-xl font-semibold mb-2">Review Not Found</h2>
          <p>{error}</p>
        </div>
      ) : review && review.review_json ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - High Level */}
          <div className="xl:col-span-1 space-y-6">
            <div className="h-auto">
              <OverallScoreCard score={review.review_json.overall_score} />
            </div>
            {/* <div className="h-auto">
              <RecommendationCard recommendation={review.review_json.recommendation} />
            </div> */}
            <div className="h-auto">
              <ReviewSummary summary={review.review_json.summary} />
            </div>
          </div>

          {/* Right Column - Detailed Issues */}
          <div className="xl:col-span-2 bg-card border border-border p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-6">Detailed Findings</h2>
            
            {(() => {
              const categoriesWithFindings = [
                { key: 'security', title: 'Security' },
                { key: 'performance', title: 'Performance' },
                { key: 'bugs', title: 'Bugs' },
                { key: 'code_quality', title: 'Code Quality' },
                { key: 'readability', title: 'Readability' },
                { key: 'maintainability', title: 'Maintainability' },
                { key: 'testing', title: 'Testing' },
                { key: 'best_practices', title: 'Best Practices' }
              ];
              const firstCategoryWithFindings = categoriesWithFindings.find(
                c => review.review_json[c.key] && review.review_json[c.key].length > 0
              );
              const defaultAccordionValue = firstCategoryWithFindings ? firstCategoryWithFindings.title : undefined;

              return (
                <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="space-y-4">
                  <CategoryAccordion title="Security" icon={Shield} findings={review.review_json.security} />
                  <CategoryAccordion title="Performance" icon={Gauge} findings={review.review_json.performance} />
                  <CategoryAccordion title="Bugs" icon={Bug} findings={review.review_json.bugs} />
                  <CategoryAccordion title="Code Quality" icon={Code} findings={review.review_json.code_quality} />
                  <CategoryAccordion title="Readability" icon={BookOpen} findings={review.review_json.readability} />
                  <CategoryAccordion title="Maintainability" icon={Wrench} findings={review.review_json.maintainability} />
                  <CategoryAccordion title="Testing" icon={TestTube} findings={review.review_json.testing} />
                  <CategoryAccordion title="Best Practices" icon={Sparkles} findings={review.review_json.best_practices} />
                </Accordion>
              );
            })()}

            {/* Empty state if everything is perfect (no findings in any category) */}
            {!['security', 'performance', 'bugs', 'code_quality', 'readability', 'maintainability', 'testing', 'best_practices'].some(
              k => review.review_json[k] && review.review_json[k].length > 0
            ) && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">No significant issues found!</p>
                <p className="text-sm">The AI review determined this code looks great.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyReview owner={owner} repo={repo} pullNumber={pullNumber} />
      )}
    </div>
  );
};
