import { api } from './api';

export const authService = {
  async signup(data) {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async signin(data) {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },

  async googleLogin(token) {
    const response = await api.post('/auth/google', { token });
    return response.data;
  },

  async refresh(refresh_token) {
    const response = await api.post('/auth/refresh', { refresh_token });
    return response.data;
  },

  async logout(refresh_token) {
    const response = await api.post('/auth/logout', { refresh_token });
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async forgotPassword(data) {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data) {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  }
};
