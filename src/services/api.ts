import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
if (API_URL && !API_URL.endsWith('/api') && !API_URL.endsWith('/api/')) {
  API_URL = API_URL.replace(/\/$/, '') + '/api';
}

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface ProviderStats {
  totalEarnings: number;
  cashReceived: number;
  activeJobs: number;
  ongoingContracts: number;
  completedJobs: number;
  averageRating: number;
}

export const getProviderStats = async (): Promise<ProviderStats> => {
  const response = await api.get('/providers/me/stats');
  return response.data;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fixam_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
