import { api } from './api';

export const githubService = {
  getStatus: async () => {
    const response = await api.get('/github/status');
    return response.data;
  },

  connect: async (token) => {
    const response = await api.post('/github/connect', { token });
    return response.data;
  },

  disconnect: async () => {
    await api.delete('/github/disconnect');
  },

  getRepositories: async () => {
    const response = await api.get('/github/repositories');
    return response.data;
  },

  getRepositoryDetails: async (owner, repo) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}`);
    return response.data;
  },

  getRepositoryLanguages: async (owner, repo) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}/languages`);
    return response.data;
  },

  getPullRequests: async (owner, repo, state = 'open', page = 1, perPage = 30) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}/pulls`, {
      params: { state, page, per_page: perPage }
    });
    return response.data;
  },

  getPullRequestDetails: async (owner, repo, pullNumber) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}/pulls/${pullNumber}`);
    return response.data;
  },

  getPullRequestFiles: async (owner, repo, pullNumber) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}/pulls/${pullNumber}/files`);
    return response.data;
  },

  getPullRequestCommits: async (owner, repo, pullNumber) => {
    const response = await api.get(`/github/repositories/${owner}/${repo}/pulls/${pullNumber}/commits`);
    return response.data;
  }
};
