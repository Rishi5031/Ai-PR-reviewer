import { api } from './api';

const getDashboardBaseUrl = () => {
    return api.defaults.baseURL.replace('/api/v1', '/api/dashboard');
};

export const dashboardApi = {
    getOverview: async () => {
        const response = await api.get('/overview', { baseURL: getDashboardBaseUrl() });
        return response.data;
    },
    getRepositories: async () => {
        const response = await api.get('/repositories', { baseURL: getDashboardBaseUrl() });
        return response.data;
    },
    getAttentionItems: async () => {
        const response = await api.get('/attention', { baseURL: getDashboardBaseUrl() });
        return response.data;
    },
    getRecentReviews: async () => {
        const response = await api.get('/recent-reviews', { baseURL: getDashboardBaseUrl() });
        return response.data;
    },
    getActivity: async () => {
        const response = await api.get('/activity', { baseURL: getDashboardBaseUrl() });
        return response.data;
    },
    getHealthSummary: async () => {
        const response = await api.get('/health-summary', { baseURL: getDashboardBaseUrl() });
        return response.data;
    }
};
