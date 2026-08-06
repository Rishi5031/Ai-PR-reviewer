import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../services/profileApi';

export const PROFILE_KEYS = {
    all: ['profile'],
    details: () => [...PROFILE_KEYS.all, 'details'],
    accountInfo: () => [...PROFILE_KEYS.all, 'accountInfo'],
    connections: () => [...PROFILE_KEYS.all, 'connections'],
};

export const useProfile = () => {
    return useQuery({
        queryKey: PROFILE_KEYS.details(),
        queryFn: profileApi.getProfile,
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: profileApi.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.details() });
        },
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: profileApi.changePassword,
    });
};

export const useAccountInfo = () => {
    return useQuery({
        queryKey: PROFILE_KEYS.accountInfo(),
        queryFn: profileApi.getAccountInfo,
    });
};

export const useConnections = () => {
    return useQuery({
        queryKey: PROFILE_KEYS.connections(),
        queryFn: profileApi.getConnections,
    });
};
