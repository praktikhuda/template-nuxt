# Catatan Diskusi: Arsitektur Template Nuxt (Landing Page & Dashboard Sidebar)

- **Tanggal Diskusi:** 2026-10-02
- **Fokus:** Transformasi proyek menjadi template Nuxt yang bersih, modular, dan siap pakai dengan pemisahan antara Landing Page publik dan Dashboard Admin berbasis Sidebar bawaan.

---

## 1. Kesimpulan & Arahan Utama Pengguna

1. **Pertahankan Sidebar Dashboard Bawaan:**
   - Komponen sidebar di `app/layouts/default.vue` yang sudah memiliki fitur:
     - Collapsible desktop drawer (mini vs full width)
     - Mobile responsive drawer
     - Switcher tema (System, Light, Dark/Night)
     - User profile & logout dropdown
   - **Keputusan:** Struktur, fungsionalitas, dan styling sidebar **tetap dipakai dan dipertahankan utuh**.
2. **Halaman Publik / Landing Page:**
   - Menyediakan tampilan Landing Page di rute root (`/`) yang fleksibel dan mudah disesuaikan (*customizable*).
   - Menggunakan layout independen (Navbar atas + Konten + Footer) tanpa sidebar dashboard.
3. **Pembersihan Kode Spesifik Bisnis (Jejak Dana / Finance):**
   - File-file yang bersifat spesifik ke domain aplikasi keuangan (*multi-wallet, MinIO receipt uploader, reconcile, dsb.*) diidentifikasi untuk dihapus/dibersihkan agar proyek menjadi template umum (*clean starter template*).

---

## 2. Rencana Arsitektur Layout

```
app/
├── layouts/
│   ├── default.vue          # Layout Publik / Landing Page (Top Navbar + Footer)
│   ├── dashboard.vue        # Layout Dashboard (Sidebar Drawer yang sudah ada)
│   └── auth.vue             # Layout Sesi Autentikasi / SSO Redirection
```

---

## 3. Identifikasi Berkas untuk Pembersihan (Cleanup)
File-file domain keuangan yang tidak lagi dibutuhkan untuk template umum dikelompokkan ke dalam daftar eliminasi.
