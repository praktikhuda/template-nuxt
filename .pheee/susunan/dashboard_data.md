# Susunan Modul: Manajemen Master Data CRUD

- **Target File:** `app/pages/dashboard/data/index.vue`
- **Tanggung Jawab:** Halaman contoh implementasi Full CRUD menggunakan komponen `Table.vue` (ekspor CSV, search, sort, pagination), filter kategori `Select.vue`, formulir modal dengan `InputValidate.vue`, serta dialog hapus menggunakan `confirmDialog()`.
- **Dependencies / Composables:**
  - `Table` (`app/components/Table.vue`)
  - `Select` (`app/components/Select.vue`)
  - `InputValidate` (`app/components/InputValidate.vue`)
  - `confirmDialog` (`app/utils/Confirm.js`)
  - `notify` (`app/utils/Notify.js`)

---

### Local States & Reactivity
- `tableRef` (`Ref<object | null>`): Ref instance komponen `<Table />`.
- `sampleData` (`Ref<Array>`): Data list layanan modul.
- `isDataLoading` (`Ref<boolean>`): Status loading awal (protokol skeleton pertama load).
- `selectedCategory` (`Ref<string>`): Nilai filter dropdown kategori.
- `isModalOpen` (`Ref<boolean>`): Status tampil dialog form modal.
- `isEditing` (`Ref<boolean>`): Status mode edit atau tambah data baru.
- `form` (`Reactive<object>`): State formulir `{ id, code, name, category_id, status }`.
- `errors` (`Reactive<object>`): State pesan validasi error input.

---

### Function & Method Graph
- `loadInitialData() -> Promise<void>`:
  - *Trigger:* Dipanggil saat `onMounted()` atau klik tombol refresh.
  - *Peran:* Memuat data awal dengan protokol skeleton.
- `openCreateModal() -> void`:
  - *Trigger:* Klik tombol "Tambah Layanan".
  - *Peran:* Mengosongkan form dan membuka modal.
- `handleEdit(row: object) -> void`:
  - *Trigger:* Klik tombol edit pada baris tabel.
  - *Peran:* Mengisi data baris ke `form` dan membuka modal.
- `handleSave() -> void`:
  - *Trigger:* Submit formulir modal.
  - *Peran:* Memvalidasi nama (via `errors.name`), menyimpan data, memanggil `notify.success()`, dan me-refresh tabel.
- `handleDelete(row: object) -> Promise<void>`:
  - *Trigger:* Klik tombol hapus pada baris tabel.
  - *Peran:* Menampilkan `confirmDialog(...)`. Jika disetujui, menghapus data dan menampilkan `notify.error()`.
