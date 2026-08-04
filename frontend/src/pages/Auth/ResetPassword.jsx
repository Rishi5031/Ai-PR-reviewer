import React from 'react';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';
import { AuthLayout } from '../../components/auth/AuthLayout';

export const ResetPassword = () => {
  return (
    <AuthLayout 
      title="Set New Password" 
      subtitle="Please enter your new strong password below."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};
