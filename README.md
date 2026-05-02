# AquaControl — Admin Dashboard Aquantum

Panel administrasi berbasis web untuk memantau dan mengelola sistem air prepaid PDAM **Aquantum** secara real-time.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Struktur Proyek](#struktur-proyek)
- [Halaman & Fitur Detail](#halaman--fitur-detail)
  - [Login](#login)
  - [Dashboard](#dashboard)
  - [Generate Token](#generate-token)
- [Koneksi ke Backend](#koneksi-ke-backend)
- [Konversi Saldo](#konversi-saldo)
- [Kredensial Default](#kredensial-default)

---

## Gambaran Umum

AquaControl adalah antarmuka admin untuk sistem **Aquantum** — solusi air prepaid berbasis IoT yang dikelola PDAM. Dashboard ini terhubung langsung ke [Aquantum Backend](../aquantum-backend) dan menyajikan data pelanggan, pemakaian air, serta kontrol valve secara real-time.

```
┌─────────────────────────────────────────────┐
│              AQUANTUM SYSTEM                │
│                                             │
│  ESP32 Sensor ──► Backend (port 3000)       │
│                       │                     │
│                  AquaControl (port 3002)    │
│              (Admin Dashboard)              │
└─────────────────────────────────────────────┘
```

---

## Fitur

### Dashboard Real-time
- Polling otomatis ke backend setiap **3 detik**
- 4 kartu ringkasan: pelanggan aktif, nonaktif, volume hari ini, saldo beredar
- Indikator live dengan animasi pulse

### Grafik Pemakaian
- Line chart 7 hari terakhir menggunakan **Recharts**
- Toggle antara tampilan **agregat semua pelanggan** atau **per pelanggan**

### Tabel Pelanggan
- Data lengkap: ID, Nama, Alamat, Saldo (kredit), Volume (liter), Flow Rate, Status Valve
- Badge status valve dengan animasi **glowing pulse**
- Animasi flow rate saat air sedang mengalir
- **Toggle switch** per baris untuk membuka/menutup valve langsung dari dashboard

### Generate Token
- Pilih nilai token: **10 kredit (100 liter)** atau **20 kredit (200 liter)**
- Tampilan kode token besar dengan efek gradient
- Tombol salin satu klik
- Riwayat token yang digenerate hari ini (tersimpan di localStorage)

### Autentikasi
- Login dengan username & password
- Sesi tersimpan di **localStorage**
- Redirect otomatis ke login jika belum autentikasi

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Chart | Recharts |
| Font | Syne (heading) + Space Mono (data/angka) |
| Runtime | Node.js + React 19 |

---

## Prasyarat

- **Node.js** v18 atau lebih baru
- **Aquantum Backend** berjalan di `http://localhost:3000`

---

## Instalasi & Menjalankan

### 1. Jalankan backend terlebih dahulu

```bash
cd aquantum-backend
npm install
npm start
# Backend berjalan di http://localhost:3000
```

### 2. Jalankan AquaControl

```bash
cd aquacontrol
npm install
npm run dev
# Dashboard berjalan di http://localhost:3002
```

> **Catatan:** Frontend menggunakan port 3002 agar tidak bentrok dengan backend (3000) maupun Aquallet (3001).

### Build production

```bash
npm run build
npm start
```

---

## Struktur Proyek

```
aquacontrol/
├── app/
│   ├── globals.css            # Design system: CSS variables, animasi, komponen CSS
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Halaman login (/)
│   ├── dashboard/
│   │   └── page.tsx           # Halaman dashboard (/dashboard)
│   └── generate-token/
│       └── page.tsx           # Halaman generate token (/generate-token)
├── components/
│   ├── SummaryCards.tsx       # 4 kartu ringkasan statistik
│   ├── PelangganTable.tsx     # Tabel pelanggan + toggle valve
│   ├── UsageChart.tsx         # Line chart pemakaian 7 hari
│   └── TokenGenerator.tsx     # Form generate token + history
├── lib/
│   ├── api.ts                 # Fungsi fetch ke backend
│   └── auth.ts                # Login, logout, cek autentikasi (localStorage)
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## Halaman & Fitur Detail

### Login

**URL:** `/`

| Field | Nilai |
|---|---|
| Username | `admin` |
| Password | `pdam2024` |

Sesi disimpan di `localStorage` dengan key `aquacontrol_auth`. Setelah login berhasil, pengguna diarahkan ke `/dashboard`. Mengakses `/dashboard` atau `/generate-token` tanpa login akan redirect otomatis ke halaman ini.

---

### Dashboard

**URL:** `/dashboard`

**Summary Cards**

| Kartu | Sumber Data | Warna |
|---|---|---|
| Total Pelanggan Aktif | `summary.total_aktif` (valve = true) | Hijau |
| Total Pelanggan Nonaktif | `summary.total_nonaktif` (valve = false) | Merah |
| Volume Pemakaian Hari Ini | `summary.total_volume_hari_ini` | Biru |
| Total Saldo Beredar | `summary.total_saldo_beredar` | Kuning |

**Grafik Pemakaian**

Data diambil dari `GET /api/admin/usage-chart`. Tersedia dua mode:
- **Semua Pelanggan** — satu garis agregat total volume harian
- **Per Pelanggan** — satu garis per pelanggan dengan warna berbeda

**Tabel Pelanggan**

Data diambil dari `GET /api/admin/dashboard` setiap 3 detik.

| Kolom | Keterangan |
|---|---|
| ID | Kode unik pelanggan (contoh: P001) |
| Nama | Nama lengkap pelanggan |
| Alamat | Alamat pelanggan |
| Saldo (Kredit) | Saldo tersisa dalam satuan kredit |
| Volume (L) | Total liter air yang sudah mengalir |
| Flow Rate | Debit aliran saat ini (L/menit) — animasi jika > 0 |
| Status Valve | Badge AKTIF/NONAKTIF + toggle switch on/off |
| Last Update | Waktu data terakhir diperbarui |

**Toggle Valve**

Klik toggle switch pada kolom Status Valve untuk membuka atau menutup katup air pelanggan secara langsung. Perubahan dikirim ke `POST /api/admin/valve` dan tabel di-refresh segera setelah respons diterima.

---

### Generate Token

**URL:** `/generate-token`

1. Pilih nilai token: **10 kredit** (= 100 liter) atau **20 kredit** (= 200 liter)
2. Klik tombol **GENERATE TOKEN**
3. Kode 4 digit muncul dalam tampilan besar — klik **Salin Token** untuk menyalin
4. Token dapat diberikan ke pelanggan untuk dimasukkan lewat keypad ESP32 atau aplikasi Aquallet
5. Riwayat token hari ini ditampilkan di panel kanan (tersimpan di localStorage)

---

## Koneksi ke Backend

Base URL dikonfigurasi di `lib/api.ts`:

```typescript
const BASE_URL = 'http://localhost:3000';
```

| Endpoint | Method | Digunakan di |
|---|---|---|
| `/api/admin/dashboard` | GET | Dashboard (polling 3 detik) |
| `/api/admin/usage-chart` | GET | Dashboard (polling 3 detik) |
| `/api/admin/valve` | POST | Toggle valve per pelanggan |
| `/api/admin/generate-token` | POST | Halaman Generate Token |

---

## Konversi Saldo

```
1 kredit = 10 liter air

Token nilai 10  →  10 kredit  →  100 liter
Token nilai 20  →  20 kredit  →  200 liter
```

Saldo ditampilkan dalam satuan **kredit** di seluruh antarmuka.

---

## Kredensial Default

| Field | Nilai |
|---|---|
| Username | `admin` |
| Password | `pdam2024` |
