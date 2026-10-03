# Agent Core Rules & Protocol

Berkas ini adalah hukum operasional mutlak dalam proyek ini. Setiap AI Agent wajib mematuhi seluruh poin di bawah ini sebelum dan selama mengeksekusi instruksi pengguna.

---

## 1. Aturan Efisiensi Token & Respon
- **Dilarang Menampilkan Seluruh Isi Berkas:** Jangan pernah mencetak ulang seluruh baris berkas kode jika hanya memodifikasi sebagian fungsi. Selalu gunakan format *diff* atau potongan blok fungsi terkait.
- **Pembaruan Senyap (*Background Update*):** Pembaruan terhadap `.pheee/susunan/`, `.pheee/structure.md`, dan `.pheee/changelog.md` wajib dilakukan secara otomatis di latar belakang tanpa mencetak ulang seluruh isi dokumen tersebut ke layar obrolan pengguna.

---

## 2. Navigasi Modular (Susunan First Protocol)
- **Dilarang Membaca Codebase Secara Acak:** Jangan pernah melakukan pembacaan direktori menyeluruh atau membuka berkas tanpa acuan konteks.
- **Urutan Langkah Navigasi:**
  1. Identifikasi modul yang relevan melalui `.pheee/susunan/README.md`.
  2. Buka dan baca HANYA berkas susunan spesifik di `.pheee/susunan/<nama_modul>.md`.
  3. Buka berkas kode sumber asli HANYA jika fungsi terkait perlu diubah atau diteliti lebih lanjut.

---

## 3. Surgical Read Protocol (Resilient Identifier Search)
- **Larangan Mutlak:** Dilarang keras melakukan inspeksi menyeluruh (baris 1 sampai akhir / full-file read) terhadap berkas kode sumber aplikasi (`.vue`, `.js`, dll.).
- **Pencarian Berbasis Identifier (Resilient):**
  - DILARANG mengandalkan nomor baris statis atau teks komentar (yang rentan bergeser).
  - AI wajib mencari pola deklarasi teknis nama fungsi/identifier menggunakan regex/grep:
    - *Vue / JS:* `function namaFungsi`, `const namaFungsi =`, `ref(...)`, `computed(...)`
  - Baca **HANYA rentang baris** dari kurung pembuka `{` hingga kurung penutup `}` blok fungsi target.
- **Isolasi Markup:** Dilarang membaca blok `<template>` atau `<style>` kecuali jika instruksi pengguna secara eksplisit meminta perbaikan tata letak UI atau styling CSS.

---

## 4. Berkas Terlindungi (Protected Files Guard)
DILARANG memodifikasi, menginstal paket baru, atau mengubah konfigurasi berikut tanpa izin eksplisit pengguna:
- **Konfigurasi & Env:** `.env*`, `.gitignore`.
- **Frontend Dependencies & Framework:** `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `nuxt.config.*`, `tsconfig.json`.

---

## 5. Standar Kode Frontend (Nuxt 4, Vue 3, Tailwind v4, DaisyUI v5)
- **Paradigma Scripting:**
  - Wajib **Pure JavaScript (ES6+)** dan Vue 3 Composition API (`<script setup>`).
  - DILARANG menggunakan sintaks TypeScript pada berkas komponen (`.vue`) maupun composables (`.js`).
  - Dilarang memanipulasi DOM manual (`document.querySelector`, dll.); gunakan selalu reactive binding (`ref`, `reactive`, `computed`, `v-model`).
- **4-State Visual Rendering & Protokol Skeleton Pertama Load:** Setiap widget, kartu metrik, kontainer data, atau tabel wajib menangani 4 kondisi visual:
  1. *Loading (Skeleton Pertama Load - Wajib):*
     - **Inisialisasi State Default:** Seluruh ref loading data (`isLoading`, `loading`, dll.) **WAJIB diinisialisasi bernilai `true` secara default** (`const isLoading = ref(true)`), BUKAN `false`.
     - **Tampilan Pertama Wajib Skeleton:** Saat halaman atau komponen pertama kali dimount (`onMounted` / render awal), kontainer data atau tabel **WAJIB menampilkan elemen Skeleton terlebih dahulu** (`<div class="skeleton ...">`) sebelum data aktual diterima dari API/store.
     - **Anti-Flash of Empty Content:** DILARANG KERAS membiarkan tampilan kosong (*blank*) atau memunculkan status "Data tidak ditemukan" / angka 0 sekilas sebelum data selesai diambil. Selama fase pengambilan data pertama, hanya Skeleton yang diizinkan tampil.
     - **Terminasi Loading:** Nilai `isLoading.value = false` HANYA diubah di dalam blok `finally` setelah proses pengambilan data (baik berhasil maupun gagal) selesai dieksekusi.
  2. *Error:* Tampilkan banner info error / toast yang ramah pengguna via `notify.error()`.
  3. *Empty:* Tampilkan indikator/ilustrasi data kosong jika array kosong (bukan membiarkan tabel/chart crash atau blank).
  4. *Ready / Success:* Render data aktual.
- **Standar Penataan Kolom Tabel (Data Alignment):**
  - Header kolom (`th`): Rata tengah (`text-center justify-center`).
  - Teks, nama, dan deskripsi: Rata kiri (`text-left justify-start`).
  - Angka, nilai uang, persentase, dan kuantitas: Rata kanan (`text-right justify-end`).
  - Nomor urut, kode/ID, badge status, dan tombol aksi: Rata tengah (`text-center justify-center`).
- **Styling Semantik:** Gunakan utility Tailwind CSS dan DaisyUI dengan dukungan variabel semantik tema (`bg-base-100`, `text-base-content`, `border-base-300`).

---

## 6. Syntax Guard Pasca-Edit
Setiap kali AI selesai melakukan modifikasi kode (`perbaiki`):
- AI wajib memverifikasi integritas sintaks berkas:
  - Pastikan pasangan kurung kurawal `{ }`, kurung siku `[ ]`, tanda kurung `( )`, dan tag markup penutup (`</template>`, `</script>`, `</div>`) seimbang dan valid sebelum menyelesaikan tugas.

---

## 7. Protokol Integritas Struktur Berkas (`structure.md`)
- **Penambahan Berkas Baru:** Setiap kali berkas baru dibuat (di `app/`, `konsep/`, `.pheee/`, dll.), AI WAJIB menyisipkan jalur berkas tersebut ke dalam pohon direktori `.pheee/structure.md` lengkap dengan keterangan peran (# komentar di sisi kanan).
- **Penghapusan / Pemindahan:** Jika ada berkas yang dihapus atau dipindahkan (*rename/move*), AI WAJIB memperbarui atau menghapus jalurnya dari `.pheee/structure.md`.

---

## 8. Standar Baku Format File Susunan (`.pheee/susunan/*.md`)
Setiap kali membuat file susunan baru untuk modul komponen atau halaman frontend, AI **WAJIB** menggunakan format baku berikut:

```markdown
# Susunan Modul: [Nama Modul / Halaman]

- **Target File:** [Path file implementasi, contoh: app/pages/dashboard/index.vue]
- **Tanggung Jawab:** [Penjelasan 1 kalimat peran modul]
- **Dependencies / Composables:**
  - `namaComposable()` (`path/file.js`) -> [Peran singkat]

---

### Local States & Reactivity
- `namaState` (`tipeData`): [Fungsi dan kegunaan state lokal]

---

### Function & Method Graph
- `namaFungsi(param: Tipe) -> ReturnType`:
  - *Trigger:* [Kapan fungsi ini dipanggil / event pemicu]
  - *Peran:* [Penjelasan 1-2 kalimat apa yang dikerjakan fungsi]

---

### Watchers & Lifecycle
- `watch(target)` / `onMounted()`: [Trigger dan dampak perilakunya]
```

---

## 9. `init-pheee` (Inisialisasi Konteks Proyek Frontend)
Perintah ini dijalankan saat folder `.pheee/` perlu disinkronkan atau diinisialisasi ulang:

1. **Generate `structure.md`:**
   - Telusuri pohon direktori proyek (abaikan `node_modules`, `.git`, `.output`, `dist`, `.nuxt`).
   - Petakan ke format visual tree lengkap dengan keterangan peran di sisi kanan (`# peran file`).
2. **Generate `store_state.md`:**
   - Dokumentasikan shared state composables (`useAuth`, local reactive state, pattern 4-state).
3. **Generate `contracts.md`:**
   - Ekstrak envelope response API dan katalog endpoint yang dikonsumsi oleh service frontend.
4. **Generate `susunan/` & `susunan/README.md`:**
   - Pindai berkas halaman (`app/pages/`) dan komponen utama (`app/components/`).
   - Buat tabel pemetaan indeks di `.pheee/susunan/README.md`.
5. **Inisialisasi `changelog.md`:**
   - Tulis entri log bahwa inisialisasi `.pheee/` telah selesai dilakukan.

---

## 10. Protokol Mode Autentikasi (Dual-Auth Guard)
Template ini mendukung dua mode autentikasi yang ditentukan melalui variabel lingkungan `NUXT_PUBLIC_AUTH_MODE` (`'sso'` atau `'standalone'`):

1. **Pemeriksaan Mode saat Inisialisasi Proyek Baru:**
   - Saat membuat atau mengonfigurasi proyek dari template ini, AI wajib mengidentifikasi atau menanyakan mode autentikasi yang diinginkan:
     - `sso`: Autentikasi terpusat via SSO Hub (`NUXT_PUBLIC_SSO_LOGIN_URL`), penanganan token query URL callback, dan redirect eksternal.
     - `standalone`: Autentikasi lokal mandiri dengan form login/register internal via endpoint backend `/api/auth/login` dan `/api/auth/register`.
2. **Standar Antarmuka Form Autentikasi Mandiri:**
   - Form login dan registrasi mandiri WAJIB menggunakan komponen pembungkus [InputValidate.vue](file:////wsl.localhost/Ubuntu-24.04/home/samsul/script/nuxt/template-nuxt/app/components/InputValidate.vue) untuk seluruh input kredensial.
   - Tombol aksi submit WAJIB menerapkan standar 4-State Visual Rendering (menampilkan `loading-spinner` dan atribut `disabled` saat pengiriman data berlangsung).
   - Penanganan error autentikasi WAJIB menyajikan notifikasi toast yang ramah via `notify.error()`.
3. **Integritas Guard Rute & Persistensi Token:**
   - Sesi login kedua mode WAJIB menggunakan cookie sentral yang sama (`auth_token`).
   - Middleware `auth.global.js` wajib menjaga kompatibilitas rute terproteksi: alihkan ke SSO Hub jika mode `sso`, atau alihkan ke `/login` jika mode `standalone`.