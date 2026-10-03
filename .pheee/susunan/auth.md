# Susunan Modul: Autentikasi Dual-Mode (SSO & Standalone) & Session Guard

- **Target File:** `app/pages/login.vue`, `app/pages/register.vue`, `app/composables/useAuth.js`, `app/middleware/auth.global.js`, `app/plugins/auth.js`
- **Tanggung Jawab:** Mengelola mekanisme autentikasi ganda (SSO terpusat vs login lokal mandiri), navigasi guard, validasi sesi token cookie, serta form login & pendaftaran akun.
- **Dependencies / Composables:**
  - `useAuth()` (`app/composables/useAuth.js`) -> State token cookie, profil user, aksi login, register, verify, dan logout.
  - `useRuntimeConfig()` (`nuxt/app`) -> Mengakses `public.authMode`, `public.ssoLoginUrl`, dan `public.appUrl`.
  - `InputValidate` (`app/components/InputValidate.vue`) -> Wrapper form field dengan label, status required, dan pesan error animasi.
  - `notify` (`app/utils/Notify.js`) -> Notifikasi toast feedback autentikasi (success / error).

---

### Local States & Reactivity
- `authMode` (`ComputedRef<string>`): Mode autentikasi aktif (`'sso'` atau `'standalone'`).
- `form` (`reactive`): Payload form input kredensial (`identifier`, `password`, `remember` pada login; `name`, `email`, `password`, `password_confirmation` pada register).
- `errors` (`reactive`): Pesan error validasi lokal form kredensial.
- `showPassword` (`ref<boolean>`): Switch visibilitas kata sandi (toggle icon Eye/EyeOff).
- `isSubmitting` (`ref<boolean>`): State 4-state pengiriman form otentikasi (mengontrol spinner dan disabled).

---

### Function & Method Graph
- `auth.global.js middleware (to) -> NavigationGuard`:
  - *Trigger:* Dipicu pada setiap transisi perpindahan rute Nuxt.
  - *Peran:* Menangkap token URL callback SSO jika ada. Pada rute publik (`/`), mengizinkan akses. Pada rute terproteksi (`/dashboard/*`), jika belum ada token, mengarahkan ke SSO Hub (mode `sso`) atau me-redirect ke `/login` (mode `standalone`).
- `auth.js plugin (nuxtApp) -> void`:
  - *Trigger:* Lifecycle inisialisasi aplikasi Nuxt di sisi browser.
  - *Peran:* Mengekstrak query token SSO, memicu `auth.verify()`, dan membersihkan query URL.
- `validateForm() -> boolean`:
  - *Trigger:* Dipanggil sesaat sebelum `handleLogin` atau `handleRegister` dieksekusi.
  - *Peran:* Memvalidasi kelengkapan form kredensial dan mencocokkan konfirmasi kata sandi.
- `handleLogin() -> Promise<void>`:
  - *Trigger:* Submit event form login mandiri.
  - *Peran:* Menjalankan 4-state visual (loading), memanggil `auth.login()`, menampilkan notifikasi toast, dan mengalihkan ke `/dashboard`.
- `handleRegister() -> Promise<void>`:
  - *Trigger:* Submit event form pendaftaran mandiri.
  - *Peran:* Memvalidasi input, memanggil `auth.register()`, lalu mengarahkan user ke `/login`.

---

### Watchers & Lifecycle
- `onMounted()`:
  - *Trigger:* Saat halaman `login.vue` atau `register.vue` dimount pada client.
  - *Peran:* Jika `authMode === 'sso'`, otomatis mengalihkan browser ke endpoint SSO eksternal terkait.