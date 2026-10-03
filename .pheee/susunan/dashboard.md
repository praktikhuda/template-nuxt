# Susunan Modul: Dashboard Ringkasan Starter

- **Target File:** `app/pages/dashboard/index.vue`
- **Tanggung Jawab:** Menampilkan dashboard ringkasan starter, kartu statistik metrik, demonstrasi filter interaktif (`Select.vue`), serta pengelolaan data tabel serbaguna (`Table.vue`) lengkap dengan form dialog tambah/edit.
- **Dependencies / Composables:**
  - `Table` (`app/components/Table.vue`) -> Komponen tabel dual-mode.
  - `Select` (`app/components/Select.vue`) -> Komponen dropdown pencarian & multi-tag.
  - `notify` (`app/utils/Notify.js`) -> Notifikasi toast.

---

### Local States & Reactivity
- `tableRef` (`Ref<object | null>`): Ref instance komponen `<Table />` untuk pemanggilan `.refresh()`.
- `selectedCategory` (`Ref<string>`): Nilai filter kategori tunggal.
- `selectedTags` (`Ref<Array>`): Nilai filter kategori jamak (multi-select tagging).
- `sampleData` (`Ref<Array>`): Koleksi data demonstrasi modul/layanan.
- `isModalOpen` (`Ref<boolean>`): Status visibilitas modal dialog tambah/edit data.
- `isEditing` (`Ref<boolean>`): Menentukan apakah modal sedang dalam mode edit atau tambah baru.
- `form` (`Reactive<object>`): Objek data input `{ id, code, name, category_id, status }`.

---

### Function & Method Graph
- `openCreateModal() -> void`: Menyiapkan form kosong dan memunculkan dialog tambah data.
- `handleEdit(row: object) -> void`: Mengisi form dengan data baris terpilih dan membuka modal edit.
- `handleSave() -> void`: Memvalidasi input, melakukan mutasi data, memunculkan `notify.success()`, dan memicu refresh tabel.
- `handleDelete(row: object) -> void`: Meminta konfirmasi, menghapus data dari state, dan memunculkan `notify.error()`.
- `handleRefresh() -> void`: Menyegarkan tabel via `tableRef.value.refresh()`.
