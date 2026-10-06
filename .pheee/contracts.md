# Data & API Contracts

Dokumen acuan kontrak komunikasi data antara frontend **Template Nuxt** dan backend REST API.

---

## 1. Global Response Envelope
Semua endpoint REST backend mengembalikan format JSON standar berikut:

### Format Berhasil (200 OK / 201 Created)
```json
{
  "status": "success",
  "message": "Pesan deskripsi status operasi",
  "data": {
    "key": "value"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "total_pages": 3
  }
}
```

### Format Gagal (400 / 401 / 403 / 404 / 500)
```json
{
  "status": "error",
  "message": "Penjelasan error yang ramah pengguna",
  "data": null
}
```

---

## 2. Katalog Endpoint & Payload

### A. Autentikasi & Sesi Pengguna
- **`GET /api/auth/verify`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Response `data`:**
    ```json
    {
      "id": "usr-123",
      "name": "Budi Santoso",
      "email": "budi@bpsdm.go.id",
      "avatar_url": null
    }
    ```
- **`POST /api/auth/logout`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Deskripsi:** Memasukkan token aktif ke daftar hitam (*blacklist*) server.

---

### B. Dompet & Rekening (`/api/finance/wallets`)
- **`GET /api/finance/wallets`**
  - **Response `data`:**
    ```json
    {
      "total_net_worth": 12500000,
      "wallets": [
        {
          "id": "wal-1",
          "name": "Bank BSI",
          "type": "bank",
          "account_number": "7123456789",
          "color": "#00A39D",
          "initial_balance": 5000000,
          "current_balance": 5000000,
          "created_at": "2026-10-01T08:00:00Z"
        }
      ]
    }
    ```
- **`POST /api/finance/wallets`**
  - **Request Body:**
    ```json
    {
      "name": "Bank Jago",
      "type": "bank",
      "account_number": "1098765432",
      "color": "#FF6B00",
      "initial_balance": 2000000
    }
    ```
- **`PUT /api/finance/wallets/:id`**
  - **Request Body:**
    ```json
    {
      "name": "Bank Jago Utama",
      "type": "bank",
      "account_number": "1098765432",
      "color": "#FF6B00"
    }
    ```
- **`DELETE /api/finance/wallets/:id`**
  - Menghapus entitas dompet (transaksi yang sudah ada tetap dipertahankan).

---

### C. Kategori Transaksi (`/api/finance/categories`)
- **`GET /api/finance/categories?type=expense`**
  - **Query Params:** `type` (`expense`, `income`, opsional)
  - **Response `data`:**
    ```json
    {
      "categories": [
        {
          "id": "cat-1",
          "name": "Makanan & Minuman",
          "type": "expense",
          "icon": "Utensils",
          "color": "#EF4444"
        }
      ]
    }
    ```

---

### D. Transaksi & Mutasi Keuangan (`/api/finance/transactions`)
- **`GET /api/finance/transactions`**
  - **Query Params:** `wallet_id`, `category_id`, `type`, `page`, `limit`, `start_date`, `end_date`
  - **Response `data`:**
    ```json
    {
      "transactions": [
        {
          "id": "tx-101",
          "wallet_id": "wal-1",
          "wallet_name": "Bank BSI",
          "to_wallet_id": null,
          "to_wallet_name": null,
          "category_id": "cat-1",
          "category_name": "Makanan & Minuman",
          "type": "expense",
          "amount": 45000,
          "admin_fee": 0,
          "description": "Makan siang",
          "transacted_at": "2026-10-02T12:30:00Z",
          "file_id": "storage-id-99",
          "file_thumbnail": "http://.../thumb.jpg",
          "file_preview": "http://.../preview.jpg"
        }
      ],
      "meta": {
        "page": 1,
        "limit": 20,
        "total": 1,
        "total_pages": 1
      }
    }
    ```
- **`POST /api/finance/transactions`**
  - **Request Body (Expense / Income):**
    ```json
    {
      "type": "expense",
      "wallet_id": "wal-1",
      "category_id": "cat-1",
      "amount": 45000,
      "description": "Makan siang",
      "transacted_at": "2026-10-02T12:30:00Z",
      "file_id": "uuid-optional"
    }
    ```
  - **Request Body (Transfer Saldo Antar Dompet):**
    ```json
    {
      "type": "transfer",
      "wallet_id": "wal-bsi",
      "to_wallet_id": "wal-jago",
      "amount": 500000,
      "admin_fee": 2500,
      "description": "Top up tabungan",
      "transacted_at": "2026-10-02T14:00:00Z"
    }
    ```
- **`PUT /api/finance/transactions/:id`**
  - Memperbarui nominal, kategori, deskripsi, tanggal, atau mengganti `adjustment` menjadi pengeluaran spesifik.
- **`DELETE /api/finance/transactions/:id`**
  - Menghapus transaksi dan otomatis me-rollback saldo dompet terkait.

---

### E. Rekonsiliasi Saldo Cerdas (`/api/finance/reconcile`)
- **`POST /api/finance/reconcile`**
  - **Request Body:**
    ```json
    {
      "wallet_id": "wal-cash",
      "actual_balance": 185000,
      "description": "Penyesuaian saldo fisik riil saku"
    }
    ```
  - **Deskripsi:** Backend menghitung selisih (`actual_balance - system_balance`) dan secara otomatis menerbitkan satu baris mutasi `type: adjustment`.

---

### F. Ringkasan & Laporan Keuangan (`/api/finance/summary`)
- **`GET /api/finance/summary?month=10&year=2026`**
  - **Response `data`:**
    ```json
    {
      "period": "10-2026",
      "total_income": 8500000,
      "total_expense": 3200000,
      "net_cashflow": 5300000,
      "expense_by_category": [
        { "category_name": "Makanan", "total": 1200000, "percentage": 37.5 }
      ]
    }
    ```

---

### G. Upload Struk Bukti Transaksi (`/api/storage/upload/sync`)
- **`POST /api/storage/upload/sync`**
  - **Headers:** `Content-Type: multipart/form-data`
  - **Payload Body:** `file: <Binary>`
  - **Response `data`:**
    ```json
    {
      "id": "file-uuid-001",
      "filename": "struk.jpg",
      "file_thumbnail": "http://.../thumb.webp",
      "file_preview": "http://.../preview.webp"
    }
    ```
