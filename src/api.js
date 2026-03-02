import axios from 'axios';

const API = axios.create({
  baseURL: 'https://epl-prediction-app-backend.onrender.com' || 'http://localhost:8080',
});

// logging interceptor
API.interceptors.request.use(config => {
  console.debug('API request:', config.method.toUpperCase(), config.url, config.data || config.params || '');
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  res => {
    console.debug('API response:', res.config.url, res.status, res.data);
    return res;
  },
  err => {
    console.debug('API error:', err.config?.url, err.response?.status, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;
