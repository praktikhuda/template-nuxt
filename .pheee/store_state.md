# Global Stores & Context State Reference

Dokumen acuan state management template Nuxt. Proyek ini dibangun di atas paradigma **Nuxt 3/4 Reactive Composables & Shared State (`useState`, `useCookie`, `ref`)**.

---

### 1. `useAuth` (`app/composables/useAuth.js`)
Mengelola state otentikasi pengguna, token persisten cookie, sinkronisasi session dengan SSO Hub, serta login mandiri (standalone).

#### State & Getters
- `authMode` (`ComputedRef<'sso' | 'standalone'>`): Mode autentikasi aktif dari runtime config `public.authMode`.
- `token` (`CookieRef<string | null>`): Cookie `auth_token` (usia 7 hari, sameSite: lax).
- `user` (`Ref<object | null>`): Shared state `useState('auth_user')` berisi profil akun pengguna yang sedang login (`id`, `name`, `email`, dsb.).
- `isAuthenticated` (`ComputedRef<boolean>`): True jika `token.value` terisi, false jika tidak ada.

#### Actions & Methods
- `login({ identifier, password }) -> Promise<{ success: boolean, data?: object, error?: string }>`:
  - Mengirim POST ke `/api/auth/login` (digunakan pada mode standalone).
  - Menyimpan token hasil otentikasi ke cookie `auth_token` dan menginisialisasi state `user`.
- `register(payload) -> Promise<{ success: boolean, data?: object, error?: string }>`:
  - Mengirim POST ke `/api/auth/register` (digunakan pada mode standalone).
- `verify() -> Promise<object | null>`:
  - Mengirim GET ke `/api/auth/verify` via `useApi()`.
  - Jika valid, mengupdate state `user` dan mengembalikan data profil.
  - Jika 401 atau gagal, membersihkan `token` dan `user`.
- `logout() -> Promise<void>`:
  - Mengirim POST ke `/api/auth/logout` untuk invalidasi server/blacklist token.
  - Menghapus nilai cookie `token` dan mereset `user` menjadi `null`.
  - Mengalihkan ke SSO Hub jika mode `sso`, atau me-redirect ke `/login` jika mode `standalone`.

---

### 2. Client Local State Standard (4-State Visual Pattern)
Setiap halaman atau komponen yang melakukan rendering mandiri wajib mengimplementasikan 4-state visual:
```js
// WAJIB: Bernilai true secara default agar Skeleton selalu tampil pada initial load
const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref('');
const isDataEmpty = computed(() => dataList.value.length === 0);
```