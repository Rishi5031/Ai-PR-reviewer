import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReviewMetadata } from './ReviewMetadata';

export const ReviewHeader = ({ owner, repo, pullNumber, createdAt }) => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-foreground">AI Code Review</h1>
      </div>
      
      <ReviewMetadata 
        owner={owner} 
        repo={repo} 
        pullNumber={pullNumber} 
        createdAt={createdAt} 
      />
    </div>
  );
};
