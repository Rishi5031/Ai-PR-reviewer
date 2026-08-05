import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn } from '../pages/Auth/SignIn';
import { SignUp } from '../pages/Auth/SignUp';
import { ForgotPassword } from '../pages/Auth/ForgotPassword';
import { ResetPassword } from '../pages/Auth/ResetPassword';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

import { DashboardLayout } from '../layouts/DashboardLayout';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { RepositoriesPage } from '../pages/Repositories/RepositoriesPage';
import { RepositoryDetailsPage } from '../pages/Repositories/RepositoryDetailsPage';
import { PullRequestDetailsPage } from '../pages/PullRequests/PullRequestDetailsPage';
import { AIReviewPage } from '../pages/PullRequests/AIReviewPage';
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
        <Route path="/repositories" element={<DashboardLayout><RepositoriesPage /></DashboardLayout>} />
        <Route path="/repositories/:owner/:repo" element={<DashboardLayout><RepositoryDetailsPage /></DashboardLayout>} />
        <Route path="/repositories/:owner/:repo/pulls/:pullNumber" element={<DashboardLayout><PullRequestDetailsPage /></DashboardLayout>} />
        <Route path="/repositories/:owner/:repo/pulls/:pullNumber/ai-review" element={<DashboardLayout><AIReviewPage /></DashboardLayout>} />
        {/* Add more protected routes here */}
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
