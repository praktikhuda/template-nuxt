# Susunan Modul: Modal Konfirmasi Terpusat (ConfirmModal)

- **Target File:** `app/components/ConfirmModal.vue`, `app/utils/Confirm.js`
- **Tanggung Jawab:** Menyediakan modal konfirmasi tindakan dialog berbasis Promise (`confirmDialog()`) untuk menggantikan `window.confirm()` bawaan browser.
- **Dependencies / Composables:**
  - `confirmState`, `handleConfirmChoice` (`app/utils/Confirm.js`).

---

### Local States & Reactivity
- `confirmState.isOpen` (`boolean`): Status keterbukaan modal.
- `confirmState.title` (`string`): Judul konfirmasi dialog.
- `confirmState.message` (`string`): Deskripsi pesan tindakan.
- `confirmState.type` (`string`): Jenis semantik ('danger', 'warning', 'info').
- `confirmState.confirmText` (`string`): Teks tombol persetujuan.
- `confirmState.cancelText` (`string`): Teks tombol pembatalan.

---

### Function & Method Graph
- `confirmDialog(options) -> Promise<boolean>`:
  - *Trigger:* Dipanggil saat ada tindakan destruktif (misal: hapus data, logout).
  - *Peran:* Membuka modal dan meresolve nilai `true` jika disetujui atau `false` jika dibatalkan.
- `handleConfirmChoice(isConfirmed: boolean) -> void`:
  - *Trigger:* Klik tombol konfirmasi atau tombol batal.
  - *Peran:* Menutup modal dan memicu callback `resolve(isConfirmed)`.
