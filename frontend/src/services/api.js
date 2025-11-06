import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get all cities
  getCities: () => api.get('/cities'),

  // Get buildings for a city
  getCityBuildings: (cityId) => api.get(`/cities/${cityId}/buildings`),

  // Calculate route
  calculateRoute: (data) => api.post('/calculate-route', data),

  // Get recommendations
  getRecommendations: (data) => api.post('/recommend', data),

  // Get weather
  getWeather: (cityId) => api.get(`/weather/${cityId}`),

  // Chat with AI
  chat: (message, context) => api.post('/chat', { message, context }),

  // Get traffic updates
  getTraffic: (routeId) => api.get(`/traffic/${routeId}`),

  // Health check
  healthCheck: () => api.get('/health'),
};

export default apiService;
