# Project Directory Structure & Manifest

```
template-nuxt/
├── .env                                     # Konfigurasi environment runtime aktif
├── .env.example                             # Template variabel environment & panduan dual-auth mode
├── .gitignore                               # Daftar berkas dan direktori yang diabaikan oleh Git
├── AGENTS.md                                # Instruksi dan protokol kerja AI assistant
├── README.md                                # Dokumentasi umum proyek template Nuxt
├── nuxt.config.js                           # Konfigurasi Nuxt 4 (Tailwind, icons, API base, runtime dual-auth)
├── package.json                             # Dependensi proyek (Vue 3, Nuxt 4, DaisyUI, Tailwind v4, Axios)
├── tsconfig.json                            # Konfigurasi TypeScript Nuxt (kompatibilitas IDE)
├── public/                                  # Static assets publik
│   ├── favicon.ico                          # Favicon browser
│   └── robots.txt                           # Aturan crawler search engine
├── app/                                     # Direktori sumber aplikasi Nuxt 4
│   ├── app.vue                              # Root entry component (ToastNotification & ConfirmModal)
│   ├── error.vue                            # Global error & 404 page yang elegan
│   ├── assets/                              # Aset statis terkompilasi
│   │   ├── css/
│   │   │   └── main.css                     # Global stylesheet (Tailwind v4 theme & DaisyUI)
│   │   ├── font/
│   │   │   └── GoogleSans.woff2             # Font lokal Google Sans
│   │   └── images/
│   │       ├── gemini.svg                   # Logo vector Gemini
│   │       └── icon.png                     # Icon logo aplikasi
│   ├── components/                          # Komponen UI Vue 3
│   │   ├── ConfirmModal.vue                 # Dialog modal konfirmasi tindakan (pengganti window.confirm)
│   │   ├── InputValidate.vue                # Wrapper form input dengan label & validasi error
│   │   ├── Select.vue                       # Komponen dropdown searchable & multi-tagging
│   │   ├── Table.vue                        # Komponen tabel data dual-mode (server-side, client-side & CSV export)
│   │   └── ToastNotification.vue            # Container toast notifikasi global
│   ├── composables/                         # Shared reactive composables Nuxt
│   │   ├── useApi.js                        # Axios instance wrapper, interceptor bearer & 401 handler
│   │   └── useAuth.js                       # Reusable state auth, token cookie, dual-mode login, register, verify & logout
│   ├── layouts/                             # Layout template Nuxt
│   │   ├── auth.vue                         # Layout halaman autentikasi (tema dark/light)
│   │   └── default.vue                      # Layout utama aplikasi (sidebar drawer dinamis dari Menus.js)
│   ├── lib/                                 # Pustaka utilitas API client
│   │   └── MainService.js                   # Service Axios terpusat (MainService & NoAuthService)
│   ├── middleware/                          # Route navigation guards
│   │   └── auth.global.js                   # Global middleware proteksi rute & intercept token dual-mode
│   ├── pages/                               # File-based routing pages
│   │   ├── index.vue                        # Halaman publik depan (Landing Page interaktif & responsif)
│   │   ├── login.vue                        # Handler autentikasi dual-mode: SSO Hub redirector & Form Login mandiri
│   │   ├── register.vue                     # Handler pendaftaran dual-mode: SSO Hub redirector & Form Registrasi mandiri
│   │   └── dashboard/                       # Area fitur utama aplikasi
│   │       ├── index.vue                    # Dashboard executive overview & monitoring
│   │       ├── profile.vue                  # Halaman profil akun pengguna & sesi SSO
│   │       └── data/
│   │           └── index.vue                # Subhalaman contoh Full CRUD Master Data
│   ├── plugins/                             # Nuxt runtime plugins
│   │   └── auth.js                          # Plugin inisialisasi auth, penangkapan token URL SSO
│   └── utils/                               # Helper & utilitas reaktif
│       ├── Confirm.js                       # Utilitas dialog konfirmasi Promise-based (confirmDialog)
│       ├── Menus.js                         # Konfigurasi sentral daftar menu sidebar
│       └── Notify.js                        # Sistem notifikasi reaktif global (notify.success, error, dll.)
├── konsep/                                  # Dokumen arsitektur, catatan diskusi & alur sistem
│   ├── arsitektur.md                        # Blueprint arsitektur teknis aplikasi & layout Nuxt
│   ├── catatan-diskusi-dual-auth-mode.md    # Catatan diskusi mekanisme dual-auth SSO vs Standalone
│   ├── catatan-diskusi-template-dashboard-landing.md # Hasil diskusi pembuatan template Nuxt
│   ├── dokumentasi_alur_auth_user_app.md    # Dokumentasi mekanisme SSO terpusat
│   └── konsep_axios_dan_data_fetching.md    # Konsep adopsi Axios & Datatable dari manajemen-service-bpsdm
└── .pheee/                                  # Knowledge base & panduan kepatuhan operasional AI
    ├── AGENTS.md                            # Entry protocol & petunjuk agen AI
    ├── changelog.md                         # Log riwayat modifikasi & pembaruan sistem oleh AI
    ├── history_chat/                        # Log append-only jejak tugas & dataset coding mistakes
    │   ├── log-2026-10-03.md                # Log jejak instruksi & output harian
    │   └── mistakes_dataset.md              # Dataset evaluasi bug & pola clean code
    ├── command.md                           # Kamus kata kunci perintah dan batasan tindakan AI
    ├── contracts.md                         # Spesifikasi envelope & payload API REST
    ├── rules.md                             # Panduan arsitektur, etika token, dan standar kode
    ├── store_state.md                       # Dokumentasi reaktivitas state global & composables
    ├── structure.md                         # Visual manifest struktur direktori proyek
    └── susunan/                             # Peta dekonstruksi fungsi & reaktivitas modul
        ├── README.md                        # Tabel indeks referensi susunan modul
        ├── auth.md                          # Peta fungsi modul otentikasi dual-mode
        ├── component_confirm.md             # Peta fungsi modal konfirmasi
        ├── component_input_validate.md      # Peta fungsi input validate
        ├── component_select.md              # Peta fungsi komponen Select
        ├── component_table.md               # Peta fungsi komponen Table
        ├── dashboard.md                     # Peta fungsi halaman dashboard overview
        ├── dashboard_data.md                # Peta fungsi halaman master data CRUD
        ├── dashboard_profile.md             # Peta fungsi halaman profil pengguna
        ├── error.md                         # Peta fungsi halaman global error
        └── landing.md                       # Peta fungsi halaman landing page
```