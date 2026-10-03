# Catatan Diskusi: Mekanisme Pemilihan Dual-Auth Mode (SSO vs Standalone)

**Tanggal:** 3 Oktober 2026  
**Status:** Disetujui & Diimplementasikan  
**Topik:** Fleksibilitas Arsitektur Autentikasi Template Nuxt (SSO vs Login Mandiri)

---

## 1. Latar Belakang & Masalah
Repositori ini dirancang sebagai **starter kit / template Nuxt 4**. Pada implementasi awal, sistem mengasumsikan seluruh proyek turunan menggunakan arsitektur Single Sign-On (SSO) terpusat. Hal ini membatasi kegunaan template ketika sebuah proyek baru hanya membutuhkan autentikasi mandiri (*standalone login*) dengan kredensial lokal (email/username & password) langsung ke endpoint backend lokal tanpa ketergantungan pada Central SSO Hub.

---

## 2. Kesepakatan Desain & Arsitektur

### A. Pengendali Mode (*Environment-Driven*)
Pemilihan mode autentikasi dikendalikan melalui variabel runtime:
- `.env` & `.env.example`: `NUXT_PUBLIC_AUTH_MODE=sso` atau `standalone`.
- `nuxt.config.js`: Diekspos melalui `runtimeConfig.public.authMode`.

### B. Perilaku Berdasarkan Mode

| Aspek | Mode `sso` | Mode `standalone` |
| :--- | :--- | :--- |
| **`/login`** | Redirect otomatis ke SSO Hub via query `?redirect=appUrl`. | Menampilkan Form Login modern (Username/Email & Password). |
| **`/register`** | Redirect otomatis ke URL registrasi SSO Hub. | Menampilkan Form Registrasi lokal mandiri. |
| **`auth.global.js`** | Mengarahkan user belum login ke SSO Hub. | Mengarahkan user belum login ke `/login` internal. |
| **`useAuth.js`** | Menangani cookie `auth_token`, `verify()`, dan logout SSO. | Menyediakan `login(credentials)`, `register(payload)`, dan cookie token. |
| **Downstream Guards** | Membaca cookie `auth_token` yang sama. | Membaca cookie `auth_token` yang sama. |

---

## 3. Komponen & Fungsionalitas yang Diperbarui
1. `nuxt.config.js`: Penambahan runtime config `public.authMode`.
2. `.env` & `.env.example`: Dokumentasi variabel `NUXT_PUBLIC_AUTH_MODE`.
3. `app/composables/useAuth.js`: Penambahan method `login()`, `register()`, dan `authMode`.
4. `app/middleware/auth.global.js`: Percabangan navigasi rute berbasis `authMode`.
5. `app/pages/login.vue`: Dual-rendering (kartu loading SSO vs form login DaisyUI + `InputValidate`).
6. `app/pages/register.vue`: Dual-rendering (kartu loading SSO vs form pendaftaran akun baru).

---

## 4. Standar Baru untuk AI Agent
AI Agent yang bekerja pada template ini wajib mematuhi aturan baru pada `.pheee/rules.md`:
- **Dual-Auth Guard:** Memeriksa nilai `AUTH_MODE` saat inisialisasi modul atau pembuatan alur otentikasi baru.
- Menjaga persistensi cookie `auth_token` agar tetap kompatibel dengan kedua mode tanpa duplikasi logic guard rute.