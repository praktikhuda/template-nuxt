# Susunan Modul: Halaman Global Error & 404

- **Target File:** `app/error.vue`
- **Tanggung Jawab:** Menangani seluruh error HTTP (404 Not Found, 500 Server Error) secara terpusat dengan antarmuka bertema modern dan navigasi kembali yang aman.
- **Dependencies / Composables:**
  - `clearError()` (`nuxt/app`) -> Mereset error dan mengarahkan pengguna kembali ke rute yang valid.

---

### Local States & Reactivity
- `statusCode` (`ComputedRef<number>`): Kode status error HTTP (default: 404).
- `statusMessage` (`ComputedRef<string>`): Pesan penjelasan error ramah pengguna.

---

### Function & Method Graph
- `handleClearError(targetPath: string) -> void`:
  - *Trigger:* Klik tombol "Kembali ke Dashboard" atau "Ke Halaman Utama".
  - *Peran:* Mengeksekusi `clearError({ redirect: targetPath })`.
