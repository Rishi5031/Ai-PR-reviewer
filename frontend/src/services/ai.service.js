import { api } from './api';

// Create a helper to map to the root /api/ai endpoints
// since the main api instance has /api/v1 as baseURL.
const getAiBaseUrl = () => {
  return api.defaults.baseURL.replace('/api/v1', '/api/ai');
};

const getAiReviewsBaseUrl = () => {
  return api.defaults.baseURL.replace('/api/v1', '/api/ai-reviews');
};

const getAnalyticsBaseUrl = () => {
  return api.defaults.baseURL.replace('/api/v1', '/api/analytics');
};

const getRepositoryBaseUrl = () => {
  return api.defaults.baseURL.replace('/api/v1', '/api/repositories');
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
  },

  /**
   * AI Reviews Dashboard Endpoints
   */
  getDashboardReviews: async (params) => {
    const response = await api.get('', {
      baseURL: getAiReviewsBaseUrl(),
      params
    });
    return response.data;
  },

  getDashboardStatistics: async () => {
    const response = await api.get('/statistics', {
      baseURL: getAiReviewsBaseUrl()
    });
    return response.data;
  },

  getDashboardLatestReviews: async () => {
    const response = await api.get('/latest', {
      baseURL: getAiReviewsBaseUrl()
    });
    return response.data;
  },

  deleteDashboardReview: async (reviewId) => {
    const response = await api.delete(`/${reviewId}`, {
      baseURL: getAiReviewsBaseUrl()
    });
    return response.data;
  },

  /**
   * AI Analytics Endpoints
   */
  getAnalyticsDashboard: async (params) => {
    const response = await api.get('/dashboard', {
      baseURL: getAnalyticsBaseUrl(),
      params
    });
    return response.data;
  },

  /**
   * Repository Health Endpoints
   */
  getRepositoryHealth: async (owner, repo) => {
    const response = await api.get(`/${owner}/${repo}/health`, {
      baseURL: getRepositoryBaseUrl()
    });
    return response.data;
  },

  /**
   * Repository Settings Endpoints
   */
  getRepositorySettings: async (owner, repo) => {
    const response = await api.get(`/${owner}/${repo}/settings`, {
      baseURL: getRepositoryBaseUrl()
    });
    return response.data;
  },

  updateRepositorySettings: async (owner, repo, settings) => {
    const response = await api.put(`/${owner}/${repo}/settings`, settings, {
      baseURL: getRepositoryBaseUrl()
    });
    return response.data;
  }
};
