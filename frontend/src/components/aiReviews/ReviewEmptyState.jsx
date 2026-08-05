import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Search } from 'lucide-react';
import { Button } from '../ui/button';

export const ReviewEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-card shadow-sm">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Bot className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No AI Reviews Found</h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Generate your first AI Review from a Pull Request to see it appear here.
      </p>
      <Button 
        onClick={() => navigate('/repositories')}
        className="flex items-center gap-2"
      >
        <Search className="w-4 h-4" />
        Browse Repositories
      </Button>
    </div>
  );
};
