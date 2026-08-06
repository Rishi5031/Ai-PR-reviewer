import { api } from './api';

export const profileApi = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    updateProfile: async (data) => {
        const response = await api.put('/profile', data);
        return response.data;
    },
    changePassword: async (data) => {
        const response = await api.put('/profile/change-password', data);
        return response.data;
    },
    getAccountInfo: async () => {
        const response = await api.get('/profile/account');
        return response.data;
    },
    getConnections: async () => {
        const response = await api.get('/profile/connections');
        return response.data;
    }
};
