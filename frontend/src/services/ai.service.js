import { api } from './api';

// Create a helper to map to the root /api/ai endpoints
// since the main api instance has /api/v1 as baseURL.
const getAiBaseUrl = () => {
  return api.defaults.baseURL.replace('/api/v1', '/api/ai');
};

export const aiService = {
  /**
   * Triggers an AI review for a given PR.
   */
  generateReview: async (owner, repository, pull_number) => {
    const response = await api.post('/review', 
      { owner, repository, pull_number },
      { baseURL: getAiBaseUrl() }
    );
    return response.data;
  },

  /**
   * Checks if an AI review exists for a given PR.
   */
  getReviewStatus: async (owner, repo, number) => {
    const response = await api.get(`/repositories/${owner}/${repo}/pulls/${number}/review`, {
      baseURL: getAiBaseUrl()
    });
    return response.data;
  },

  /**
   * Fetches the latest AI review for a given PR.
   */
  getLatestReview: async (owner, repo, number) => {
    const response = await api.get(`/repositories/${owner}/${repo}/pulls/${number}/latest-review`, {
      baseURL: getAiBaseUrl()
    });
    return response.data;
  },
  
  /**
   * Fetches a specific AI review by ID.
   */
  getReviewById: async (reviewId) => {
    const response = await api.get(`/reviews/${reviewId}`, {
      baseURL: getAiBaseUrl()
    });
    return response.data;
  }
};
