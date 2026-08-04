import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const WelcomeBanner = () => {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  return (
    <div className="mb-8 flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome back, {firstName} 👋
      </h1>
      <p className="text-lg text-muted-foreground">
        Manage repositories, review pull requests and improve code quality with AI.
      </p>
    </div>
  );
};
