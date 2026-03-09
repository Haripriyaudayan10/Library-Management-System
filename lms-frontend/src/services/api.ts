import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tokenFromJwtStorage = localStorage.getItem('jwt_token');
  const tokenFromSession = (() => {
    const raw = localStorage.getItem('lms_auth_session');
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { token?: string };
      return parsed?.token ?? null;
    } catch {
      return null;
    }
  })();

  const token = tokenFromJwtStorage || tokenFromSession;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
