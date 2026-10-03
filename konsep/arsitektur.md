# Konsep Template Dashboard & Landing Page

Template ini dirancang menggunakan **Nuxt 3** dan **DaisyUI**. Untuk memberikan fleksibilitas agar pengguna dapat memilih antara tampilan *Navbar* atau *Sidebar*, kita akan memanfaatkan arsitektur **Layouts** bawaan Nuxt.

## Susunan Folder (Folder Structure)

```text
/
├── app/
│   ├── components/
│   │   ├── layout/          # Komponen khusus untuk merangkai layout
│   │   │   ├── Navbar.vue   # Navbar atas
│   │   │   ├── Sidebar.vue  # Sidebar samping
│   │   │   └── Footer.vue   # Footer halaman
│   │   └── ui/              # Komponen standar (Card, Button, ThemeController, dll)
│   │
│   ├── layouts/             # Pilihan Layout
│   │   ├── default.vue      # Layout untuk Landing Page (Hanya Navbar)
│   │   ├── sidebar.vue      # Layout untuk Dashboard (Sidebar + Navbar)
│   │   └── auth.vue         # Layout polos untuk Login/Register
│   │
│   ├── pages/               # Halaman Aplikasi
│   │   ├── index.vue        # Halaman Landing Page (memakai layout default)
│   │   ├── dashboard/       # Halaman Dashboard Admin
│   │   │   └── index.vue    # (memakai layout sidebar)
│   │   └── auth/
│   │       ├── login.vue
│   │       └── register.vue
│   │
│   └── composables/         # Fungsi state/logika global yang bisa dipakai berulang
│       └── useTheme.js      # Logika dark/light/system mode
```

## Mekanisme Pemilihan Layout (Navbar vs Sidebar)

Nuxt memudahkan kita untuk memisahkan struktur UI luar (layout) dari konten halaman (page).

### 1. Menggunakan Layout Navbar (Misal: Landing Page)
Pada file `app/layouts/default.vue`, kita hanya memanggil komponen `<Navbar />` dan `<slot />` untuk konten utama. Layout ini akan otomatis digunakan oleh semua halaman secara *default*, kecuali halaman tersebut meminta layout lain.

### 2. Menggunakan Layout Sidebar (Misal: Dashboard)
Pada file `app/layouts/sidebar.vue`, kita mendesain struktur layar terbagi dua: `<Sidebar />` di sisi kiri, dan `<Navbar />` beserta `<slot />` konten di sisi kanan.

Untuk menggunakan layout ini pada halaman spesifik (seperti halaman Dashboard), kamu cukup menambahkan `definePageMeta` pada file page-nya (`app/pages/dashboard/index.vue`):

```vue
<script setup>
// Menginstruksikan Nuxt untuk menggunakan layouts/sidebar.vue
definePageMeta({
  layout: 'sidebar'
})
</script>

<template>
  <div>
    <h1>Ini Halaman Dashboard (memakai sidebar)</h1>
  </div>
</template>
```

## Rencana Tahapan Eksekusi Selanjutnya
1. **Ekstraksi Komponen**: Memecah kode layout sidebar yang sekarang ada di `default.vue` ke dalam komponen terpisah (`Sidebar.vue` dan `Navbar.vue`) di dalam folder `components/layout/`.
2. **Pembuatan File Layout**:
   - Membuat `layouts/sidebar.vue` untuk membungkus halaman dashboard.
   - Mengubah `layouts/default.vue` agar murni hanya berisi Navbar atas (untuk mode Landing Page).
3. **Pengaturan Routing/Pages**: Memindahkan tampilan yang sekarang ke halaman `dashboard/index.vue` dan mengaturnya agar menggunakan layout `sidebar`.
