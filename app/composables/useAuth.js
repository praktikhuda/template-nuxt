export const useAuth = () => {
  const config = useRuntimeConfig();
  const authMode = computed(() => config.public.authMode || 'sso');

  const token = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7, // 7 hari (dalam detik)
    path: '/',
    sameSite: 'lax',
    secure: false, // development / local http
  });

  const user = useState('auth_user', () => null);
  const isAuthenticated = computed(() => !!token.value);

  const verify = async () => {
    if (!token.value) {
      user.value = null;
      return null;
    }

    const api = useApi();
    try {
      const res = await api.get('/api/auth/verify');
      const raw = res.data || {};
      const profile = raw?.data?.data || raw?.data || raw;
      if (raw.status === 'success' || profile?.user_id || profile?.id) {
        user.value = profile;
        return profile;
      }
      return null;
    } catch (err) {
      if (err.response?.status === 401) {
        token.value = null;
        user.value = null;
      }
      return null;
    }
  };

  const login = async ({ identifier, password }) => {
    const api = useApi();
    try {
      const res = await api.post('/api/auth/login', {
        identifier,
        password,
      });

      const raw = res.data || {};
      const payload = raw?.data?.data || raw?.data || raw;
      const extractedToken = payload?.token || payload?.access_token || raw?.token;

      if (!extractedToken) {
        throw new Error(raw?.message || 'Token otentikasi tidak ditemukan dalam respon.');
      }

      token.value = extractedToken;

      if (payload?.user) {
        user.value = payload.user;
      } else {
        await verify();
      }

      return { success: true, data: user.value };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login gagal. Periksa kredensial Anda.';
      return { success: false, error: msg };
    }
  };

  const register = async (payload) => {
    const api = useApi();
    try {
      const res = await api.post('/api/auth/register', payload);
      const raw = res.data || {};
      return { success: true, data: raw };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Pendaftaran gagal. Silakan coba lagi.';
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    const api = useApi();
    try {
      if (token.value) {
        await api.post('/api/auth/logout');
      }
    } catch (err) {
      // Abaikan error saat blacklist token
    } finally {
      token.value = null;
      user.value = null;

      if (process.client) {
        if (authMode.value === 'sso') {
          const ssoLoginUrl = config.public.ssoLoginUrl || 'http://localhost:3000';
          const appUrl = config.public.appUrl || 'http://localhost:3001';
          window.location.href = `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
        } else {
          navigateTo('/login');
        }
      }
    }
  };

  return {
    authMode,
    token,
    user,
    isAuthenticated,
    verify,
    login,
    register,
    logout,
  };
};