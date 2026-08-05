import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmptyReview = ({ owner, repo, pullNumber }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6">
        <Bot className="w-10 h-10 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">No AI Review Available</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        This pull request hasn't been reviewed by the AI yet. Generate a review to get automated feedback on code quality, security, and performance.
      </p>
      <button 
        onClick={() => navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}`)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
      >
        Go to Pull Request <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
