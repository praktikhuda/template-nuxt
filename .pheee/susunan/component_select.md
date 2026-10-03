# Susunan Modul: Komponen Select Dinamis & Searchable

- **Target File:** `app/components/Select.vue`
- **Tanggung Jawab:** Menyediakan dropdown seleksi cerdas dengan fitur pencarian lokal (*searchable*), mode tunggal & jamak (*multiple tagging*), serta fleksibilitas pemetaan kunci objek (`labelKey` & `valueKey`).
- **Dependencies / Composables:**
  - `Square`, `SquareCheck`, `ChevronDown`, `X` (`lucide-vue-next`).

---

### Local States & Reactivity
- `isOpen` (`Ref<boolean>`): Status buka/tutup menu dropdown.
- `search` (`Ref<string>`): Kata kunci pencarian lokal opsi.
- `selectedLabel` (`ComputedRef<string>`): Teks label yang ditampilkan pada trigger box.
- `filteredOptions` (`ComputedRef<Array>`): Daftar opsi setelah difilter pencarian.

---

### Function & Method Graph
- `selectOption(opt: object) -> void`:
  - *Trigger:* Klik opsi dalam dropdown.
  - *Peran:* Menambah/menghapus nilai jika `multiple`, atau mengisi nilai dan menutup dropdown jika single-select. Meng-emit `update:modelValue` dan `change`.
- `removeTag(val: any) -> void`:
  - *Trigger:* Klik tombol silang (✕) pada tag badge pill.
  - *Peran:* Menghapus satu item dari array `modelValue`.
- `close(e: Event) -> void`:
  - *Trigger:* Klik di luar kontainer komponen (click-outside listener).
  - *Peran:* Menutup dropdown jika `isOpen` bernilai true.

---

### Watchers & Lifecycle
- `watch(isOpen)`: Menjalankan auto-scroll ke item aktif dalam daftar saat dropdown terbuka.
- `onMounted()` & `onUnmounted()`: Mendaftarkan dan membersihkan window click-outside event listener.
