import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReviewMetadata } from './ReviewMetadata';

export const ReviewHeader = ({ owner, repo, pullNumber, createdAt }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <button 
          onClick={() => navigate(`/repositories/${owner}/${repo}/pulls/${pullNumber}`)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pull Request #{pullNumber}
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
