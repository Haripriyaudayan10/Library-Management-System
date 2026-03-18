import axios, { type AxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

const csrfClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetriableConfig = AxiosRequestConfig & {
  _retry?: boolean;
};

let csrfInitPromise: Promise<void> | null = null;

function getCsrfCookie(): string {
  if (typeof document === 'undefined') return '';
  const pair = document.cookie
    .split('; ')
    .find((item) => item.startsWith('XSRF-TOKEN='));
  if (!pair) return '';
  return decodeURIComponent(pair.split('=').slice(1).join('='));
}

async function ensureCsrfToken(): Promise<void> {
  if (getCsrfCookie()) return;

  if (!csrfInitPromise) {
    csrfInitPromise = csrfClient.get('/api/auth/csrf')
      .then(() => undefined)
      .finally(() => {
        csrfInitPromise = null;
      });
  }
  await csrfInitPromise;
}

api.interceptors.request.use(async (config) => {
  const method = String(config.method ?? 'get').toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  const requestUrl = String(config.url ?? '');
  const csrfExcluded =
    requestUrl.includes('/api/auth/login') ||
    requestUrl.includes('/api/auth/refresh') ||
    requestUrl.includes('/api/auth/logout') ||
    requestUrl.includes('/api/auth/csrf');

  if (isMutation && !csrfExcluded) {
    await ensureCsrfToken();
    const csrfToken = getCsrfCookie();
    if (csrfToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)['X-XSRF-TOKEN'] = csrfToken;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as RetriableConfig | undefined;
    const status = error?.response?.status as number | undefined;
    const requestUrl = String(originalRequest?.url ?? '');

    const skipRefresh =
      requestUrl.includes('/api/auth/login') ||
      requestUrl.includes('/api/auth/refresh') ||
      requestUrl.includes('/api/auth/logout');

    if ((status === 401 || status === 403) && originalRequest && !originalRequest._retry && !skipRefresh) {
      originalRequest._retry = true;
      try {
        await ensureCsrfToken();
        await refreshClient.post('/api/auth/refresh');
        return api.request(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
