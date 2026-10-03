# Konsep Integrasi Axios, Select Dinamis, & Dual-Mode Datatable (Adaptasi manajemen-service-bpsdm)

Dokumen ini merangkum perancangan komponen inti antarmuka dan pengambilan data pada template Nuxt, diadaptasi langsung dari arsitektur teruji di `manajemen-service-bpsdm`.

---

## 1. Komponen `Select.vue` (Searchable, Multi-Select & Flexible Keys)

Komponen dropdown kustom yang mendukung pemilihan tunggal maupun jamak dengan integrasi data fleksibel:

### Fitur Kunci:
1. **Dukungan Kunci Fleksibel (`labelKey` & `valueKey`):**
   - Tidak membatasi format data backend. Bisa disesuaikan dengan skema data apa pun:
     ```html
     <Select 
       v-model="selectedUser" 
       :options="userList" 
       label-key="username" 
       value-key="user_id" 
     />
     ```
2. **Mode Tunggal (*Single*) & Jamak (*Multiple / Tagging*):**
   - Jika `multiple: true`, data yang disimpan berupa `Array<string | number>`.
   - Menampilkan *pill tags* di dalam box input yang dilengkapi tombol hapus cepat (`✕`).
   - Dropdown menampilkan checkbox interaktif (`Square` & `SquareCheck` dari Lucide).
3. **Pencarian Cepat (*Searchable*):**
   - Menampilkan input pencarian kecil di bagian atas daftar opsi dropdown untuk memfilter item secara lokal.
4. **UX & Aksesibilitas:**
   - Auto-scroll ke opsi terpilih saat dropdown dibuka.
   - Deteksi *Click-outside* otomatis untuk menutup dropdown saat pengguna mengklik di luar area.

---

## 2. Komponen `Datatable.vue` (Dual-Mode: Server-Side vs Client-Side)

Komponen tabel data serbaguna dengan dua metode pemrosesan data:

```
                      ┌──────────────────────────────────────┐
                      │           <Datatable />              │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
       [Mode Server-Side]                              [Mode Client-Side]
       (:server-side="true")                           (:server-side="false")
   • Paginasi, pencarian & sorting                 • Menarik seluruh data di awal
     didelegasikan ke Backend API.                   (atau via prop :items statis).
   • Parameter query: search, limit,               • Paginasi, pencarian (regex),
     page, order_by, order_dir.                      dan sorting diolah di browser.
   • Total data diambil dari metadata API.         • Responsif & cepat untuk data < 1000.
```

### A. Perbandingan Cara Pemanggilan:

#### 1. Cara Panggil Mode Server-Side (Ideal untuk Data Besar):
```vue
<script setup>
import { ref } from 'vue';
import { MainService } from '~/lib/MainService';

const tableColumns = [
  { data: "norut", label: "No", width: "5", classHeader: "justify-center", classContent: "text-center", sorting: false },
  { data: "name", label: "Nama", width: "30", classHeader: "justify-start", classContent: "text-left", sorting: true },
  { data: "role", label: "Peran", width: "20", classHeader: "justify-center", classContent: "text-center", sorting: true },
  { data: "aksi", label: "Aksi", width: "15", classHeader: "justify-center", classContent: "text-center", sorting: false },
];

const fetchServerUsers = (params) => {
  // params otomatis membawa: { search, limit, page, order_by, order_dir }
  return MainService.get("user", { params });
};
</script>

<template>
  <Datatable 
    :columns="tableColumns"
    :api-function="fetchServerUsers"
    :server-side="true"
    :sync-url="true"
  >
    <template #aksi="{ row }">
      <button class="btn btn-xs btn-ghost" @click="editData(row)">Edit</button>
    </template>
  </Datatable>
</template>
```

#### 2. Cara Panggil Mode Client-Side (Ideal untuk Data Lokal/Kecil):
```vue
<script setup>
const staticItems = [
  { id: 1, name: "Layanan A", status: "Aktif" },
  { id: 2, name: "Layanan B", status: "Non-Aktif" },
];
</script>

<template>
  <!-- Data statis atau hasil 1x fetch langsung difilter di browser -->
  <Datatable 
    :columns="tableColumns"
    :items="staticItems"
    :server-side="false"
  />
</template>
```

---

## 3. Fitur Keunggulan Datatable BPSDM

1. **Sinkronisasi Otomatis ke URL (`syncUrl: true`):**
   - Query pencarian (`?search=`), halaman (`?page=`), limit baris (`?limit=`), dan urutan (`?sort=&order=`) otomatis tercermin pada URL browser.
   - Memudahkan *bookmark*, berbagi link (*shareable URL*), dan mempertahankan posisi saat halaman di-refresh.
2. **Debounce Search Terintegrasi (500ms):**
   - Mencegah spam request ke server saat pengguna mengetik kata kunci.
3. **Sistem Slot Kolom Kustom yang Luwes:**
   - `#header(nama_kolom)` untuk kustomisasi header.
   - `#[nama_kolom]="{ row, index }"` untuk merender tombol aksi, badge warna, avatar, atau tautan detail.
   - `#expanded="{ row }"` untuk tampilan baris dropdown accordion (detail baris).
4. **Expose Kontrol Ref (`datatableRef`):**
   - Memiliki method `refresh()` yang bisa dipanggil setelah aksi create/edit/delete sukses.
