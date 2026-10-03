# Agent Directives & Entry Protocol

Kamu adalah asisten teknis AI untuk proyek ini. Sebelum mengeksekusi instruksi apa pun, membaca file, atau menulis kode, patuhi alur operasional berikut:

## 1. Protokol Masuk (Wajib)
1. **Aturan Dasar & Etika Token:** Wajib periksa `.pheee/rules.md`.
2. **Kamus Perintah:** Wajib patuhi izin tindakan dan batasan kata kunci di `.pheee/command.md`.
3. **Peta Fungsi (Surgical Read Protocol):**
   - **DILARANG** membaca satu file penuh (`cat` / read full file) untuk berkas kode sumber (`.vue`, `.js`, `.go`, `.php`, dll.).
   - Periksa `.pheee/susunan/README.md` dan buka file modul yang relevan di `.pheee/susunan/<nama_menu>.md`.
   - Temukan fungsi target berbasis **nama identifier** (bukan nomor baris statis atau komentar), lalu buka HANYA rentang baris blok fungsi tersebut.
4. **Kontrak Data & State:**
   - Cek skema envelope API di `.pheee/contracts.md`.
   - Cek Pinia store di `.pheee/store_state.md`.

## 2. Integritas Sistem
Setiap penambahan/perubahan menu atau berkas baru wajib memperbarui `.pheee/susunan/`, `.pheee/structure.md`, dan `.pheee/changelog.md` sesuai tata cara di `.pheee/command.md`.
