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
import { RepositoryWorkspace } from '../pages/Repositories/RepositoryWorkspace';
import { HealthTab } from '../components/repository/tabs/HealthTab';
import { PullRequestsTab } from '../components/repository/tabs/PullRequestsTab';
import { RepositoryReviewsTab } from '../components/repository/tabs/RepositoryReviewsTab';
import { RepositorySettingsTab } from '../components/repository/tabs/RepositorySettingsTab';
import { PullRequestDetailsPage } from '../pages/PullRequests/PullRequestDetailsPage';
import { AIReviewPage } from '../pages/PullRequests/AIReviewPage';
import { AIReviewsPage } from '../pages/AIReviews/AIReviewsPage';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage';
import { GitHubConnectionPage } from '../pages/GitHub/GitHubConnectionPage';
import { OAuthSuccessPage } from '../pages/GitHub/OAuthSuccessPage';
import { OAuthErrorPage } from '../pages/GitHub/OAuthErrorPage';
import { ProfilePage } from '../pages/Profile/ProfilePage';

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
        <Route path="/repositories/:owner/:repo" element={<DashboardLayout><RepositoryWorkspace /></DashboardLayout>}>
          <Route index element={<Navigate to="health" replace />} />
          <Route path="health" element={<HealthTab />} />
          <Route path="pulls" element={<PullRequestsTab />} />
          <Route path="reviews" element={<RepositoryReviewsTab />} />
          <Route path="settings" element={<RepositorySettingsTab />} />
        </Route>
        <Route path="/repositories/:owner/:repo/pulls/:pullNumber" element={<DashboardLayout><PullRequestDetailsPage /></DashboardLayout>} />
        <Route path="/repositories/:owner/:repo/pulls/:pullNumber/ai-review" element={<DashboardLayout><AIReviewPage /></DashboardLayout>} />
        <Route path="/ai-reviews" element={<DashboardLayout><AIReviewsPage /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><AnalyticsPage /></DashboardLayout>} />
        <Route path="/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
        <Route path="/github/connect" element={<DashboardLayout><GitHubConnectionPage /></DashboardLayout>} />
        <Route path="/github/success" element={<DashboardLayout><OAuthSuccessPage /></DashboardLayout>} />
        <Route path="/github/error" element={<DashboardLayout><OAuthErrorPage /></DashboardLayout>} />
        {/* Add more protected routes here */}
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
