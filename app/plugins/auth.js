export default defineNuxtPlugin(async (nuxtApp) => {
  const route = useRoute();
  const auth = useAuth();
  const tokenCookie = useCookie('auth_token', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
    secure: false,
  });

  // Ambil token dari query parameter Nuxt atau URL window secara langsung
  let tokenStr = route.query.token;
  if (!tokenStr && process.client) {
    const urlParams = new URLSearchParams(window.location.search);
    tokenStr = urlParams.get('token');
  }

  // Jika terdapat parameter ?token= di URL (pertama kali login dari SSO Hub)
  if (tokenStr) {
    tokenCookie.value = String(tokenStr);
    auth.token.value = String(tokenStr);

    await auth.verify();

    if (process.client) {
      const targetPath = (window.location.pathname === '/' || window.location.pathname === '/login')
        ? '/dashboard'
        : window.location.pathname;

      window.history.replaceState({}, document.title, targetPath);
      navigateTo(targetPath, { replace: true });
    }
  } else if (tokenCookie.value && !auth.user.value) {
    // Pada saat reload / refresh browser, verifikasi token
    await auth.verify();
  }
});