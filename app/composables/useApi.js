import axios from 'axios';

export const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || 'http://127.0.0.1:8454';

  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: false,
  });

  const api = axios.create({
    baseURL: apiBase,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(tokenCookie.value ? { Authorization: `Bearer ${tokenCookie.value}` } : {}),
    },
    timeout: 10000,
  });

  // Request interceptor: attach bearer token
  api.interceptors.request.use(
    (reqConfig) => {
      const currentToken = tokenCookie.value;
      if (currentToken) {
        reqConfig.headers.Authorization = `Bearer ${currentToken}`;
      }
      return reqConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401 unauthenticated
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        tokenCookie.value = null;
        const userState = useState('auth_user');
        userState.value = null;
      }
      return Promise.reject(error);
    }
  );

  return api;
};