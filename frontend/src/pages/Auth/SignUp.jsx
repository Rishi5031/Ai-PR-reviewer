import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';

export const SignUp = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Sign up to get started with CodeGuardian AI"
    >
      <SignUpForm />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
