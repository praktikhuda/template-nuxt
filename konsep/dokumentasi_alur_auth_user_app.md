# Dokumentasi Lengkap Alur Autentikasi (SSO), Manajemen Pengguna, dan Manajemen Aplikasi

Dokumen ini merinci arsitektur, alur kerja (*lifecycle workflow*), skenario keamanan, dan panduan penggunaan API untuk 3 modul inti service `auth`:
1. **Modul Autentikasi & SSO Gateway (`/api/auth`)**
2. **Modul Manajemen Pengguna / Users (`/api/users`)**
3. **Modul Manajemen Aplikasi Klien / Allowed Apps (`/api/apps`)**

---

## 🏗️ Gambaran Umum Arsitektur SSO

Service `auth` bertindak sebagai **Central Identity Provider (IdP)**. Seluruh aplikasi satelit / klien (misalnya: *Dashboard BPSDM*, *SIM Diklat*, *Perlindungan Sejak Dini*, *Jejak Dana*) tidak perlu mengelola otentikasi login sendiri, melainkan mendelegasikannya ke service ini melalui alur Single Sign-On (SSO) yang aman.

```text
┌──────────────────────┐                     ┌────────────────────────┐
│   Aplikasi Klien     │                     │  Central Auth Service  │
│  (Contoh: Nuxt.js)   │                     │      (Go Backend)      │
└──────────┬───────────┘                     └───────────┬────────────┘
           │                                             │
           │── 1. Buka Web Klien (Belum Login) ─────────►│
           │   Redirect ke Auth Login                    │
           │   GET /login?redirect=https://app.go.id/cb  │
           │                                             │
           │── 2. Kirim Kredensial (POST /auth/login) ──►│
           │                                             │── Validasi User (deleted_at IS NULL)
           │                                             │── Validasi Domain di allowed_apps
           │                                             │── Terbitkan JWT Token
           │                                             │
           │◄── 3. Redirect ke Klien Berisi Token ───────│
           │    https://app.go.id/cb?token=eyJhbGci...   │
           │                                             │
           │── 4. Verifikasi Token (GET /auth/verify) ──►│── Cek Blacklist (revoked_tokens)
           │◄── 5. Data User & Hak Akses Valid (200 OK) ─│
```

---

# BAGIAN 1: Dokumentasi Alur Autentikasi (`/api/auth`)

---

### 1.1. Registrasi Pengguna Baru (`POST /api/auth/register`)

Digunakan untuk mendaftarkan akun baru ke dalam sistem. Password di-hash secara otomatis menggunakan **Bcrypt** sebelum disimpan ke tabel `public.users`.

* **Endpoint:** `POST /api/auth/register`
* **Akses:** Publik (Tanpa Token)
* **Headers:** `Content-Type: application/json`
* **Request Body:**
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@bpsdm.go.id",
    "password": "passwordRahasia123"
  }
  ```
* **Alur Validasi Backend:**
  1. Memeriksa apakah email sudah terdaftar di database (`WHERE email = $1 AND deleted_at IS NULL`).
  2. Jika email sudah ada $\to$ Mengembalikan `400 Bad Request` (*"Email sudah terdaftar"*).
  3. Menghitung hash Bcrypt dari password.
  4. Menyimpan record baru ke tabel `public.users`.
* **Response Sukses (201 Created):**
  ```json
  {
    "status": "success",
    "message": "Registrasi berhasil",
    "data": {
      "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "name": "Budi Santoso",
      "email": "budi@bpsdm.go.id",
      "created_at": "2026-08-29T12:00:00Z"
    }
  }
  ```

---

### 1.2. Login Pengguna & SSO Handover (`POST /api/auth/login`)

Digunakan untuk memvalidasi kredensial pengguna dan meneruskan token JWT.

* **Endpoint:** `POST /api/auth/login`
* **Akses:** Publik
* **Headers:** `Content-Type: application/json`
* **Request Body (Login Biasa):**
  ```json
  {
    "email": "budi@bpsdm.go.id",
    "password": "passwordRahasia123"
  }
  ```
* **Request Body (Login dengan Redirect SSO):**
  ```json
  {
    "email": "budi@bpsdm.go.id",
    "password": "passwordRahasia123",
    "redirect": "https://dashboard.bpsdm.go.id/auth/callback"
  }
  ```
  *(Parameter `redirect` juga dapat dikirimkan melalui Query URL: `POST /api/auth/login?redirect=https://...`)*

* **Alur Validasi Backend:**
  1. Mencari user aktif berdasarkan email (`deleted_at IS NULL`). Jika tidak ada $\to$ `401 Unauthorized` (*"Email atau password salah"*).
  2. Memeriksa kecocokan password menggunakan `bcrypt.CompareHashAndPassword`.
  3. **Proteksi Domain SSO:** Jika ada parameter `redirect`:
     * Backend mengekstrak *hostname* (contoh: `dashboard.bpsdm.go.id`).
     * Memeriksa hostname tersebut ke tabel `allowed_apps` (`deleted_at IS NULL`).
     * Jika domain **TIDAK TERDAFTAR / DI-SOFT DELETE** $\to$ Menolak dengan `403 Forbidden` (*"Aplikasi/Domain tidak memiliki izin SSO"*).
  4. Men-generate token JWT dengan payload `user_id`, `name`, `email`, dan masa kedaluwarsa 24 jam.
* **Response Sukses (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Login berhasil",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWIxZGViNGQt...",
      "redirect_url": "https://dashboard.bpsdm.go.id/auth/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

---

### 1.3. Verifikasi Sesi Token (`GET /api/auth/verify`)

Dipanggil oleh aplikasi klien atau frontend saat inisialisasi aplikasi untuk memastikan token yang tersimpan di *browser/cookie/localStorage* masih valid dan belum dicabut.

* **Endpoint:** `GET /api/auth/verify`
* **Headers:** `Authorization: Bearer <TOKEN_JWT>`
* **Alur Validasi Backend:**
  1. Memeriksa keberadaan header `Authorization: Bearer <token>`.
  2. **Cek Blacklist (`revoked_tokens`):** Menghitung hash SHA-256 dari token dan memeriksa apakah token sudah pernah di-logout. Jika ada di blacklist $\to$ `401 Unauthorized` (*"Token telah dicabut (telah logout)"*).
  3. Memvalidasi tanda tangan kriptografi dan masa berlaku (*expiry time*) JWT.
* **Response Sukses (200 OK):**
  ```json
  {
    "status": "success",
    "message": "autentikasi valid",
    "data": {
      "user_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "name": "Budi Santoso",
      "email": "budi@bpsdm.go.id",
      "exp": 1788000000
    }
  }
  ```

---

### 1.4. Logout & Pencabutan Sesi (`POST /api/auth/logout` / `GET /api/auth/logout`)

Mematikan sesi token seketika dan memasukkan token ke daftar hitam (*token blacklist*).

* **Endpoint:** `POST /api/auth/logout` (atau `GET /api/auth/logout`)
* **Headers:** `Authorization: Bearer <TOKEN_JWT>`
* **Request Body (Opsional untuk SSO Redirect):**
  ```json
  {
    "redirect": "https://dashboard.bpsdm.go.id/login"
  }
  ```
* **Alur Validasi Backend:**
  1. Mengambil token JWT dari header `Authorization`.
  2. Menghitung hash SHA-256 dari string token.
  3. Menyimpan hash ke tabel `revoked_tokens`:
     ```sql
     INSERT INTO revoked_tokens (token_hash, expires_at, user_id) VALUES ('a8f5c2...', '2026-08-30 12:00:00', '9b1d...');
     ```
  4. Jika ada parameter `redirect`, memeriksa apakah domain tujuan terdaftar di `allowed_apps`.
* **Response Sukses (200 OK):**
  ```json
  {
    "status": "success",
    "message": "logout berhasil",
    "data": {
      "redirect_url": "https://dashboard.bpsdm.go.id/login"
    }
  }
  ```
* **Efek Lanjutan:** Token yang telah di-logout **TIDAK AKAN BISA DIGUNAKAN LAGI** untuk memanggil `/users`, `/apps`, `/storage`, `/finance`, atau `/auth/verify` meskipun masa 24 jam belum habis.

---

# BAGIAN 2: Dokumentasi Alur Manajemen Pengguna (`/api/users`)

Seluruh endpoint pada modul ini **wajib dilindungi oleh `middleware.Auth`** (`Authorization: Bearer <token>`).

---

### 2.1. Membuat Pengguna Baru (`POST /api/users`)
* **Endpoint:** `POST /api/users`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body:**
  ```json
  {
    "name": "Siti Aminah",
    "email": "siti@bpsdm.go.id",
    "password": "PasswordSiti123"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "message": "User berhasil dibuat",
    "data": {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Siti Aminah",
      "email": "siti@bpsdm.go.id",
      "created_at": "2026-08-29T12:30:00Z"
    }
  }
  ```

---

### 2.2. Mengambil Daftar Pengguna (`GET /api/users`)
Mendukung pencarian nama/email dan pagination. Otomatis hanya menampilkan pengguna aktif (`deleted_at IS NULL`).

* **Endpoint:** `GET /api/users?page=1&limit=10&search=siti`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Daftar user berhasil diambil",
    "data": [
      {
        "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
        "name": "Siti Aminah",
        "email": "siti@bpsdm.go.id",
        "created_at": "2026-08-29T12:30:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

---

### 2.3. Detail Pengguna Berdasarkan ID (`GET /api/users/:id`)
* **Endpoint:** `GET /api/users/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Detail user berhasil diambil",
    "data": {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Siti Aminah",
      "email": "siti@bpsdm.go.id",
      "created_at": "2026-08-29T12:30:00Z",
      "updated_at": "2026-08-29T12:30:00Z"
    }
  }
  ```

---

### 2.4. Memperbarui Data Pengguna (`PUT /api/users/:id`)
Dapat memperbarui nama, email, dan password (jika password diisi, otomatis di-hash ulang dengan Bcrypt).

* **Endpoint:** `PUT /api/users/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body:**
  ```json
  {
    "name": "Siti Aminah S.Kom",
    "email": "siti.aminah@bpsdm.go.id",
    "password": "PasswordBaru456"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "User berhasil diupdate",
    "data": {
      "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Siti Aminah S.Kom",
      "email": "siti.aminah@bpsdm.go.id"
    }
  }
  ```

---

### 2.5. Soft Delete Pengguna (`DELETE /api/users/:id`)
Menandai pengguna sebagai terhapus (`deleted_at = NOW()`) tanpa menghapus baris fisik dari database.

* **Endpoint:** `DELETE /api/users/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "User berhasil dihapus"
  }
  ```
* **Dampak Soft Delete:**
  * Pengguna yang telah di-delete tidak akan muncul di `GET /api/users`.
  * Jika mencoba login $\to$ Ditolak dengan `401 Unauthorized` (*"Email atau password salah"*).
  * Jika mencoba melihat detail `GET /api/users/:id` $\to$ Ditolak dengan `404 Not Found` (*"User tidak ditemukan"*).

---

# BAGIAN 3: Dokumentasi Alur Manajemen Aplikasi / Allowed Apps (`/api/apps`)

Tabel `public.allowed_apps` adalah **lapisan keamanan utama (*security barrier*)** yang mendaftarkan seluruh domain aplikasi klien resmi yang diizinkan menggunakan sistem SSO service ini.

Seluruh endpoint pada modul ini **wajib dilindungi oleh `middleware.Auth`** (`Authorization: Bearer <token>`).

---

### 3.1. Mendaftarkan Aplikasi Baru (`POST /api/apps`)
* **Endpoint:** `POST /api/apps`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body:**
  ```json
  {
    "name": "Dashboard Utama BPSDM",
    "domain": "dashboard.bpsdm.go.id"
  }
  ```
* **Aturan Input Domain:**
  * Masukkan hostname murni tanpa protokol `http://` atau `https://` dan tanpa path url.
  * Contoh valid: `dashboard.bpsdm.go.id`, `simdiklat.bpsdm.go.id`, `localhost` (untuk dev).
* **Response (201 Created):**
  ```json
  {
    "status": "success",
    "message": "Aplikasi berhasil didaftarkan",
    "data": {
      "id": "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
      "name": "Dashboard Utama BPSDM",
      "domain": "dashboard.bpsdm.go.id",
      "created_at": "2026-08-29T12:40:00Z"
    }
  }
  ```

---

### 3.2. Mengambil Daftar Aplikasi Terdaftar (`GET /api/apps`)
Mendukung pencarian nama/domain dan pagination. Otomatis hanya memuat aplikasi aktif (`deleted_at IS NULL`).

* **Endpoint:** `GET /api/apps?page=1&limit=10&search=dashboard`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Daftar aplikasi berhasil diambil",
    "data": [
      {
        "id": "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
        "name": "Dashboard Utama BPSDM",
        "domain": "dashboard.bpsdm.go.id",
        "created_at": "2026-08-29T12:40:00Z"
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1
    }
  }
  ```

---

### 3.3. Detail Aplikasi Berdasarkan ID (`GET /api/apps/:id`)
* **Endpoint:** `GET /api/apps/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Detail aplikasi berhasil diambil",
    "data": {
      "id": "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
      "name": "Dashboard Utama BPSDM",
      "domain": "dashboard.bpsdm.go.id",
      "created_at": "2026-08-29T12:40:00Z",
      "updated_at": "2026-08-29T12:40:00Z"
    }
  }
  ```

---

### 3.4. Memperbarui Data Aplikasi (`PUT /api/apps/:id`)
* **Endpoint:** `PUT /api/apps/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Body:**
  ```json
  {
    "name": "Portal Dashboard Eksekutif BPSDM",
    "domain": "dashboard.bpsdm.go.id"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Aplikasi berhasil diupdate",
    "data": {
      "id": "3f4a5b6c-7d8e-9f0a-1b2c-3d4e5f6a7b8c",
      "name": "Portal Dashboard Eksekutif BPSDM",
      "domain": "dashboard.bpsdm.go.id"
    }
  }
  ```

---

### 3.5. Soft Delete Aplikasi (`DELETE /api/apps/:id`)
Menonaktifkan izin SSO aplikasi dengan menyetel `deleted_at = NOW()`.

* **Endpoint:** `DELETE /api/apps/:id`
* **Headers:** `Authorization: Bearer <TOKEN>`
* **Response (200 OK):**
  ```json
  {
    "status": "success",
    "message": "Aplikasi berhasil dihapus"
  }
  ```
* **Dampak Keamanan Soft Delete Aplikasi:**
  * Domain aplikasi tersebut seketika **kehilangan hak akses SSO**.
  * Jika ada pengguna yang mencoba login dari aplikasi tersebut (`POST /auth/login?redirect=https://dashboard.bpsdm.go.id/...`), sistem langsung **menolak request** dengan status:
    ```json
    {
      "status": "error",
      "message": "Aplikasi/Domain tidak memiliki izin SSO",
      "error": ""
    }
    ```

---

# 📑 Ringkasan Endpoint API

| Modul | Method | Path | Akses | Deskripsi |
| :--- | :--- | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/auth/register` | Publik | Mendaftarkan akun user baru (hashing bcrypt). |
| **Auth** | `POST` | `/api/auth/login` | Publik | Login & redirect SSO ber-token JWT. |
| **Auth** | `GET` | `/api/auth/verify` | Bearer Auth | Memverifikasi validitas token & status blacklist. |
| **Auth** | `POST` | `/api/auth/logout` | Bearer Auth | Mencabut token (blacklist SHA-256) & redirect SSO. |
| **Auth** | `GET` | `/api/auth/logout` | Bearer Auth | Mencabut token via HTTP GET. |
| **Users** | `POST` | `/api/users` | Bearer Auth | Menambahkan pengguna baru. |
| **Users** | `GET` | `/api/users` | Bearer Auth | Mengambil daftar pengguna aktif (search & page). |
| **Users** | `GET` | `/api/users/:id` | Bearer Auth | Mengambil detail 1 pengguna. |
| **Users** | `PUT` | `/api/users/:id` | Bearer Auth | Memperbarui profil & password pengguna. |
| **Users** | `DELETE`| `/api/users/:id` | Bearer Auth | Soft delete pengguna (`deleted_at = NOW()`). |
| **Apps** | `POST` | `/api/apps` | Bearer Auth | Mendaftarkan whitelist domain aplikasi SSO. |
| **Apps** | `GET` | `/api/apps` | Bearer Auth | Mengambil daftar domain aplikasi aktif. |
| **Apps** | `GET` | `/api/apps/:id` | Bearer Auth | Mengambil detail domain aplikasi. |
| **Apps** | `PUT` | `/api/apps/:id` | Bearer Auth | Memperbarui nama/domain aplikasi. |
| **Apps** | `DELETE`| `/api/apps/:id` | Bearer Auth | Soft delete domain aplikasi (cabut izin SSO). |