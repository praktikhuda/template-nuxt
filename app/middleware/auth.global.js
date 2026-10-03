export default defineNuxtRouteMiddleware(async (to) => {
  const config = useRuntimeConfig();
  const authMode = config.public.authMode || 'sso';
  const ssoLoginUrl = config.public.ssoLoginUrl || 'http://localhost:3000';
  const appUrl = config.public.appUrl || 'http://localhost:3001';

  const auth = useAuth();
  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: false,
  });

  // 1. Tangkap parameter ?token= jika datang dari redirect SSO Hub
  if (to.query.token) {
    const tokenStr = String(to.query.token).trim();
    tokenCookie.value = tokenStr;
    auth.token.value = tokenStr;
    return;
  }

  const tokenVal = auth.token.value || tokenCookie.value;

  // 2. Rute Publik (Landing Page /) - Bebas diakses tanpa autentikasi
  if (to.path === '/') {
    return;
  }

  // 3. Rute Akses Login & Register Eksplisit
  if (to.path === '/login' || to.path === '/register') {
    if (tokenVal) {
      return navigateTo('/dashboard', { replace: true });
    }

    // Jika mode SSO aktif, delegasikan navigasi ke SSO Hub eksternal
    if (authMode === 'sso' && process.client) {
      const targetUrl = to.path === '/register'
        ? `${ssoLoginUrl}/register?redirect=${encodeURIComponent(appUrl)}`
        : `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
      window.location.href = targetUrl;
    }

    // Jika mode standalone, izinkan pengguna mengakses halaman form login / register
    return;
  }

  // 4. Rute Terproteksi (Dashboard & Fitur Internal)
  if (to.path.startsWith('/dashboard')) {
    if (!tokenVal) {
      if (authMode === 'sso') {
        if (process.client) {
          window.location.href = `${ssoLoginUrl}?redirect=${encodeURIComponent(appUrl)}`;
        }
        return;
      } else {
        return navigateTo('/login', { replace: true });
      }
    }

    // Verifikasi token jika state profil pengguna belum termuat
    if (!auth.user.value && process.client) {
      auth.verify().catch(() => {});
    }
  }
});