import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/dashboardApi';

export const useDashboardOverview = () => {
    return useQuery({
        queryKey: ['dashboard-overview'],
        queryFn: dashboardApi.getOverview,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDashboardRepositories = () => {
    return useQuery({
        queryKey: ['dashboard-repositories'],
        queryFn: dashboardApi.getRepositories,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDashboardAttention = () => {
    return useQuery({
        queryKey: ['dashboard-attention'],
        queryFn: dashboardApi.getAttentionItems,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDashboardRecentReviews = () => {
    return useQuery({
        queryKey: ['dashboard-recent-reviews'],
        queryFn: dashboardApi.getRecentReviews,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDashboardActivity = () => {
    return useQuery({
        queryKey: ['dashboard-activity'],
        queryFn: dashboardApi.getActivity,
        staleTime: 5 * 60 * 1000,
    });
};

export const useDashboardHealthSummary = () => {
    return useQuery({
        queryKey: ['dashboard-health-summary'],
        queryFn: dashboardApi.getHealthSummary,
        staleTime: 5 * 60 * 1000,
    });
};
