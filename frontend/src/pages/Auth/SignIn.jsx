import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SignInForm } from '../../components/auth/SignInForm';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

export const SignIn = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue"
    >
      <SignInForm />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
          Create an account
        </Link>
      </div>
    </AuthLayout>
  );
};
