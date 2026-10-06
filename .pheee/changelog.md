# Project Changelog

Semua perubahan sistem, restrukturisasi modul, dan eksekusi perintah AI dicatat di sini secara kronologis (entri terbaru di paling atas).

---

### [2026-10-03 21:18:00] - Penyelarasan Protokol Global: history_chat & Gitignore Guard
- **Aktivasi Siklus coding-mistakes-recorder:** Menginisialisasi direktori .pheee/history_chat/, membuat log harian log-2026-10-03.md (append-only), dan mendokumentasikan dataset kesalahan koding mistakes_dataset.md terkait penanganan UTF-8 BOM pada JSON resolver.
- **Gitignore Guard (uto-agents-protocol):** Memastikan direktori .pheee/ terlindungi di dalam .gitignore.

### [2026-10-03 21:15:00] - Penyesuaian Nama Proyek Menjadi Template Nuxt
- **Pembersihan Branding Sisa:** Mengganti seluruh nama proyek 'Jejak Dana' menjadi 'Template Nuxt' pada package.json, package-lock.json, 
uxt.config.js (title template, meta tags, description, keywords, author, og:*), pp/layouts/auth.vue (header brand & footer copyright), serta kontrak API .pheee/contracts.md.

### [2026-10-03 19:33:00] - Penambahan Konfigurasi .gitignore
- **Git Ignore Template:** Menambahkan berkas .gitignore untuk mengabaikan output build Nuxt (.nuxt/, .output/, dist/), direktori dependensi (
ode_modules/), berkas rahasia .env, serta file sampah sistem operasi dan IDE.

### [2026-10-03 18:55:00] - Penambahan Fitur Dual-Auth Mode (SSO vs Standalone) & Protokol Aturan Baru
- **Protokol Mode Autentikasi (ules.md Bagian 10):** Menetapkan aturan wajib verifikasi mode NUXT_PUBLIC_AUTH_MODE ('sso' vs 'standalone'), isolasi cookie token uth_token, serta standar UI form autentikasi mandiri.
- **Runtime Config & Environment:** Menambahkan public.authMode di 
uxt.config.js, memperbarui .env dan .env.example.
- **Ekstensi Composable useAuth.js:** Menambahkan state uthMode, aksi login(credentials) mandiri, egister(payload), serta logout() adaptif sesuai mode aktif.
- **Guard Rute Cerdas (uth.global.js):** Menambahkan percabangan rute terproteksi dan login/register agar mengarah ke SSO Hub saat mode sso atau membuka form internal saat mode standalone.
- **Halaman Login & Register Dual-Mode (pages/login.vue & pages/register.vue):** Menyajikan form autentikasi mandiri lengkap dengan wrapper InputValidate, switch visibilitas sandi, 4-state visual loading spinner, dan notifikasi toast.
- **Dokumentasi & Integritas:** Menambahkan konsep/catatan-diskusi-dual-auth-mode.md, memperbarui store_state.md, contracts.md, susunan/auth.md, dan structure.md.

### [2026-10-02 22:33:00] - Implementasi Penuh Ekosistem Template Komprehensif
- **Modal Konfirmasi Cantik (`ConfirmModal.vue` & `Confirm.js`):** Menggantikan `window.confirm()` bawaan browser dengan modal dialog Promise-based (`confirmDialog()`). Terpasang global di `app/app.vue`.
- **Sentralisasi Menu Sidebar (`utils/Menus.js`):** Memisahkan daftar menu menjadi konfigurasi objek dinamis; `app/layouts/default.vue` kini secara otomatis merender menu dari `Menus.js`.
- **Komponen Form Input Validator (`InputValidate.vue`):** Komponen wrapper field formulir dengan label, tanda bintang merah wajib isi, ring border error, dan animasi pesan error.
- **Fitur Ekspor CSV pada `Table.vue`:** Menambahkan tombol dan method `exportToCsv()` pada `<Table />` untuk mengunduh data tabel dalam format CSV.
- **Halaman Global Error / 404 (`error.vue`):** Membuat penanganan error global ramah pengguna dengan tombol kembali ke dashboard/beranda.
- **Subhalaman Master Data CRUD (`pages/dashboard/data/index.vue`):** Memisahkan modul contoh CRUD penuh (Table + Filter Select + Form InputValidate + ConfirmModal + Toast).
- **Halaman Profil Pengguna (`pages/dashboard/profile.vue`):** Menyajikan rincian kredensial akun pengguna, status sesi SSO, dan tombol logout dengan konfirmasi.
- **Dashboard Ringkasan Overview (`pages/dashboard/index.vue`):** Menata ulang dashboard menjadi tampilan analitik eksekutif dengan statistik metrik, visual log aktivitas, dan pintasan navigasi cepat.
- **Pembaruan Manifest & Susunan:** Memperbarui `.pheee/structure.md`, `.pheee/susunan/README.md`, dan seluruh peta modul terkait.

---

### [2026-10-02 22:20:00] - Pembersihan Aturan & Perintah Non-Frontend (`clean rules & commands`)
- **Pembersihan rules.md:** Menghapus seluruh klausul backend (Golang Fiber regex/syntax guard, PHP regex, aturan protected files go.mod/main.go, Bagian 5.B Kategori Backend, Varian B susunan backend, dan deteksi multi-stack di init-pheee).
- **Pembersihan command.md:** Menghapus checklist audit backend dan referensi Varian B. Memfokuskan seluruh perintah khusus ekosistem Frontend (Nuxt 4 + Vue 3).

---

### [2026-10-02 22:17:00] - Penambahan Aturan: Protokol Skeleton Pertama Load (Mandatory Initial Skeleton Guard)
- **Aturan Baru:** Menambahkan klausul wajib pada `.pheee/rules.md` (Bagian 5) dan `.pheee/store_state.md`.
- **Implementasi Komponen:** Memperbarui `app/components/Table.vue` agar `isLoading` secara default bernilai `true`.

---

### [2026-10-02 22:14:00] - Implementasi Penuh: Table.vue, Select.vue, MainService, Toast & Landing Page
- **Pustaka Axios:** Membuat `app/lib/MainService.js` (mendukung `MainService` & `NoAuthService`, bearer token cookie, URL dinamis, interceptor 401).
- **Notifikasi Global:** Membuat `app/utils/Notify.js` dan komponen `app/components/ToastNotification.vue` yang terintegrasi di `app/app.vue`.
- **Komponen Select:** Mengimplementasikan `app/components/Select.vue` (searchable, single & multi-select tags, labelKey, valueKey).
- **Komponen Table:** Mengimplementasikan `app/components/Table.vue`.
- **Dashboard Starter:** Memperbarui `app/pages/dashboard/index.vue`.
- **Landing Page:** Membangun `app/pages/index.vue`.
