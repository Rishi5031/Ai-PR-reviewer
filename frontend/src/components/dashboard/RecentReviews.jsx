import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { GitPullRequest, Calendar, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecentReviews = ({ reviews = [] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent AI Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => {
          const [owner, name] = review.repository.split('/');
          
          return (
            <div 
              key={review.id} 
              className="flex flex-col space-y-3 p-4 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium text-foreground flex items-center">
                    <GitPullRequest className="h-4 w-4 mr-2 text-muted-foreground" />
                    {review.repository}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    PR #{review.pr_number}
                  </div>
                </div>
                <Badge variant={review.review_status === 'completed' ? 'default' : 'secondary'} className={review.review_status === 'completed' ? 'bg-primary text-primary-foreground' : ''}>
                  {review.review_status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex space-x-4">
                  {review.score !== null && (
                    <div className="flex items-center text-foreground font-medium">
                      Score: <span className="ml-1 text-primary">{review.score}/100</span>
                    </div>
                  )}
                  {review.critical_findings > 0 && (
                    <div className="flex items-center text-red-500">
                      <ShieldAlert className="h-4 w-4 mr-1" />
                      {review.critical_findings} Critical
                    </div>
                  )}
                  <div className="flex items-center text-muted-foreground hidden sm:flex">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate(`/reviews/${review.id}`)}
                >
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
        {reviews.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No recent reviews found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
