import axios from 'axios';

const getClientCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}\\s*=\\s*([^;]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
};

// 1. MainService (Authenticated Service)
export const MainService = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

MainService.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Dynamic API URL from localStorage (encoded base64 per BPSDM convention)
    try {
      const savedApiUrl = localStorage.getItem(btoa('api_url'));
      if (savedApiUrl) {
        config.baseURL = atob(savedApiUrl);
      }
    } catch (e) {
      // Ignore decode error
    }

    // Attach Bearer Token from Cookie (support both 'auth_token' and BPSDM 'token')
    const token = getClientCookie('auth_token') || getClientCookie(btoa('token')) || getClientCookie('token');
    if (token) {
      const finalToken = token.startsWith('eyJ') ? token : (atob(token) || token);
      config.headers.Authorization = `Bearer ${finalToken}`;
    }
  }
  return config;
});

MainService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      document.cookie = 'auth_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    return Promise.reject(error);
  }
);

// 2. NoAuthService (Public Service)
export const NoAuthService = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

NoAuthService.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const savedApiUrl = localStorage.getItem(btoa('api_url'));
      if (savedApiUrl) {
        config.baseURL = atob(savedApiUrl);
      }
    } catch (e) {
      // Ignore decode error
    }
  }
  return config;
});
