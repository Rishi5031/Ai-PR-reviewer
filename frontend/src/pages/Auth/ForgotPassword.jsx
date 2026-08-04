import React from 'react';
import { Link } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const ForgotPassword = () => {
  return (
    <AuthLayout 
      title="Forgot Password" 
      subtitle="Enter your email address and we'll send you a link to reset your password."
    >
      <ForgotPasswordForm />
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
};
