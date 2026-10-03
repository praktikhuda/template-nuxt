# Susunan Modul: Wrapper Input & Validasi (InputValidate)

- **Target File:** `app/components/InputValidate.vue`
- **Tanggung Jawab:** Menyediakan wrapper standar untuk field formulir (input, select, textarea) dengan dukungan label, tanda bintang wajib isi (*), ring border error, dan pesan error validasi animasi.
- **Dependencies / Composables:**
  - Runtime Vue 3 reactivity.

---

### Local States & Reactivity
- `hasError` (`ComputedRef<boolean>`): True jika prop `error` terisi atau bernilai true.
- `displayError` (`ComputedRef<string>`): Teks pesan error yang diekstrak dari prop `error` atau `errorMessage`.

---

### Props Definition
- `label` (`string`, required): Label teks nama field.
- `error` (`[Boolean, String]`): Status atau pesan error validasi.
- `errorMessage` (`string`): Fallback pesan error bila `error` bertipe Boolean.
- `required` (`boolean`): Menampilkan tanda bintang merah (*).
- `hint` (`string`): Keterangan kecil di sisi kanan label.
