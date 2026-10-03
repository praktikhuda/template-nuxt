# Susunan Modul: Landing Page Publik

- **Target File:** `app/pages/index.vue`
- **Tanggung Jawab:** Menyajikan antarmuka depan publik yang elegan dan responsif, memperkenalkan fitur starter template, kontrol tema (Light, Night, System), dan tombol aksi cepat menuju dashboard.
- **Dependencies / Composables:**
  - `definePageMeta({ layout: false })` -> Menggunakan tata letak mandiri tanpa sidebar.
  - `useHead()` (`nuxt/app`) -> Metadata SEO title & description.

---

### Local States & Reactivity
- `currentTheme` (`Ref<string>`): Nilai tema aktif ('system', 'light', 'night').
- `features` (`Array<object>`): Daftar data fitur unggulan template.

---

### Function & Method Graph
- `applyTheme(theme: string) -> void`: Mengatur atribut `data-theme` pada elemen `<html>`.
- `setTheme(theme: string) -> void`: Menyimpan preferensi tema ke `localStorage` dan menerapkannya.

---

### Watchers & Lifecycle
- `onMounted()`: Membaca tema tersimpan dari `localStorage` atau mendeteksi preferensi sistem OS.
