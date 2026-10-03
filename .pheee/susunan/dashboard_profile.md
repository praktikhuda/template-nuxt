# Susunan Modul: Profil Pengguna & Keamanan Sesi

- **Target File:** `app/pages/dashboard/profile.vue`
- **Tanggung Jawab:** Menyajikan data akun pengguna SSO aktif, status session JWT cookie, URL gateway Central SSO Hub, dan tombol logout dengan konfirmasi dialog.
- **Dependencies / Composables:**
  - `useAuth()` (`app/composables/useAuth.js`) -> `user`, `logout`.
  - `confirmDialog` (`app/utils/Confirm.js`) -> Dialog konfirmasi logout.
  - `useRuntimeConfig()` -> Alamat SSO URL.

---

### Local States & Reactivity
- `userName` (`ComputedRef<string>`): Nama pengguna dari sesi SSO.
- `userEmail` (`ComputedRef<string>`): Email akun pengguna.
- `userRole` (`ComputedRef<string>`): Peran atau kewenangan akun.
- `userInitial` (`ComputedRef<string>`): Huruf inisial kapital untuk avatar.

---

### Function & Method Graph
- `handleLogout() -> Promise<void>`:
  - *Trigger:* Klik tombol "Logout Sesi".
  - *Peran:* Menampilkan `confirmDialog(...)`. Jika disetujui, mengeksekusi `auth.logout()` dan mengalihkan browser ke Central SSO Hub.
