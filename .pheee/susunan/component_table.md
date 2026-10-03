# Susunan Modul: Komponen Table (Dual-Mode Datatable)

- **Target File:** `app/components/Table.vue`
- **Tanggung Jawab:** Menyediakan tabel data serbaguna dengan dukungan dua mode (server-side vs client-side), pencarian otomatis dengan debounce, sorting kolom, seleksi limit baris, pagination dengan ellipsis, slot kustom, dan sinkronisasi URL query.
- **Dependencies / Composables:**
  - `useRoute()`, `useRouter()` (`nuxt/app`) -> Sinkronisasi query param URL.

---

### Local States & Reactivity
- `listData` (`Ref<Array>`): Data mentah yang diambil dari `apiFunction` atau `items`.
- `totalRecords` (`Ref<number>`): Jumlah total baris (dari metadata API untuk server-side, atau panjang array untuk client-side).
- `isLoading` (`Ref<boolean>`): Status loading skeleton tabel.
- `searchQuery` (`Ref<string>`): Kata kunci input pencarian.
- `currentEntries` (`Ref<number>`): Jumlah baris per halaman (5, 10, 25, 50).
- `currentPage` (`Ref<number>`): Halaman aktif.
- `sortConfig` (`Ref<{ key: string, order: string }>`): Konfigurasi kolom urut dan arah (asc/desc).
- `processedData` (`ComputedRef<Array>`): Data hasil pemrosesan client-side (filter, search, sort, pagination slice).

---

### Function & Method Graph
- `loadData() -> Promise<void>`:
  - *Trigger:* Dipanggil saat `onMounted()`, pergantian filter, atau via method `refresh()`.
  - *Peran:* Mengeksekusi `apiFunction` dengan parameter lengkap atau memuat `items`.
- `handleSort(key: string) -> void`:
  - *Trigger:* Klik pada th header kolom tabel yang memiliki `sorting !== false`.
  - *Peran:* Mengubah arah `asc`/`desc` dan me-reload data jika mode `serverSide`.
- `changePage(page: number | string) -> void`:
  - *Trigger:* Klik tombol angka pagination.
  - *Peran:* Berpindah halaman aktif.

---

### Watchers & Lifecycle
- `watch([searchQuery, currentEntries, currentPage, sortConfig])`: Menyinkronkan nilai ke URL query browser jika `syncUrl: true`.
- `watch(debounceTimer)`: Mencegah spam request pencarian server-side (delay 500ms).
