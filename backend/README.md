# Backend - 100.000 Sultan Muda Sumatera Selatan

Backend API untuk program 100.000 Sultan Muda Sumatera Selatan menggunakan Express.js dan MongoDB.

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v14 atau lebih baru)
- MongoDB (lokal atau MongoDB Atlas)
- npm atau yarn

### Instalasi

1. **Masuk ke folder backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
- Salin file `.env.example` menjadi `.env`
```bash
cp .env.example .env
```

- Edit file `.env` dan sesuaikan konfigurasi:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sultanmuda
JWT_SECRET=ganti-dengan-secret-key-anda
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_REGISTRATION_KEY=sultanmuda_admin_key_2024
```

**PENTING**: Ubah `JWT_SECRET` dan `ADMIN_REGISTRATION_KEY` dengan nilai yang aman!

4. **Jalankan server**

Development mode (dengan auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📁 Struktur Folder

```
backend/
├── config/
│   └── db.js              # Konfigurasi database
├── controllers/
│   ├── authController.js  # Login, register, autentikasi
│   ├── umkmController.js  # CRUD UMKM
│   ├── productController.js # CRUD Produk
│   └── adminController.js  # Admin moderasi
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── models/
│   ├── User.js            # Model User (UMKM & Admin)
│   ├── UMKM.js            # Model UMKM
│   └── Product.js         # Model Produk
├── routes/
│   ├── auth.js            # Routes autentikasi
│   ├── umkm.js            # Routes UMKM
│   ├── product.js         # Routes produk
│   └── admin.js           # Routes admin
├── .env.example           # Template environment variables
├── package.json.example   # Template package.json
├── server.js              # Entry point aplikasi
└── README.md
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register UMKM baru (dengan data UMKM)
- `POST /api/auth/register-admin` - Register Admin baru (memerlukan admin key)
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get user profile (Protected)

### UMKM (Public)
- `GET /api/umkm` - Get semua UMKM yang approved (dengan pagination & search)
- `GET /api/umkm/:id` - Get detail UMKM beserta produknya

### UMKM (Protected)
- `GET /api/umkm/my/profile` - Get UMKM profile sendiri
- `PUT /api/umkm/:id` - Update UMKM
- `DELETE /api/umkm/:id` - Delete UMKM

### Products
- `GET /api/products/umkm/:umkmId` - Get produk berdasarkan UMKM
- `GET /api/products/:id` - Get detail produk
- `POST /api/products` - Tambah produk (Protected - UMKM)
- `PUT /api/products/:id` - Update produk (Protected - UMKM)
- `DELETE /api/products/:id` - Delete produk (Protected - UMKM)

### Admin (Protected - Admin Only)
- `GET /api/admin/umkm` - Get semua UMKM
- `GET /api/admin/umkm/pending` - Get UMKM yang pending
- `PUT /api/admin/umkm/:id/approve` - Approve UMKM
- `PUT /api/admin/umkm/:id/reject` - Reject UMKM
- `GET /api/admin/stats` - Get statistik dashboard

## 🔐 Authentication

API menggunakan JWT (JSON Web Token) untuk autentikasi. Setelah login, simpan token dan kirim dalam header:

```
Authorization: Bearer <your-token-here>
```

## 👤 User Roles

Ada 2 jenis user dalam sistem ini:

### 1. UMKM (User)
- **Registrasi**: Harus mendaftar dengan data UMKM lengkap melalui form registrasi
- **Status awal**: "pending" dan menunggu persetujuan admin
- **Akses**: Dashboard UMKM (`/dashboard`)
- **Fitur**:
  - Melihat dan mengedit profil UMKM (nama, logo, deskripsi, kontak)
  - Mengelola produk sendiri (tambah, edit, hapus)
  - Status UMKM akan ditampilkan (pending/approved/rejected)

### 2. Admin
- **Registrasi**: Tidak memerlukan UMKM, hanya email dan password + admin key
- **Akses**: Dashboard Admin (`/admin/dashboard`)
- **Fitur**:
  - Melihat semua UMKM (approved, pending, rejected)
  - Menyetujui atau menolak pendaftaran UMKM baru
  - Filter UMKM berdasarkan status dan pencarian
  - Melihat statistik dashboard (total UMKM, approved, pending, rejected)
  - Akses penuh ke semua data UMKM dan produk

## 🔑 Cara Membuat Akun Admin

Ada 2 cara untuk membuat akun admin:

### Cara 1: Melalui API (Recommended)

Gunakan endpoint `/api/auth/register-admin` dengan menyertakan admin key yang sesuai:

```bash
curl -X POST http://localhost:5000/api/auth/register-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sultanmuda.com",
    "password": "password123",
    "adminKey": "sultanmuda_admin_key_2024"
  }'
```

Atau gunakan halaman `/auth` di frontend, pilih tab **"Admin"** untuk registrasi admin.

**PENTING**: 
- Admin key harus sama dengan `ADMIN_REGISTRATION_KEY` di file `.env`
- Rahasiakan admin key ini dan jangan share ke sembarang orang!
- Ubah admin key default dengan nilai yang aman!

### Cara 2: Manual via MongoDB (Alternatif)

Jika ingin membuat admin langsung melalui database MongoDB:

```javascript
// Login ke MongoDB shell
use sultanmuda

// Insert admin user
// Note: Password harus di-hash dulu menggunakan bcrypt
// Contoh untuk password "admin123":
db.users.insertOne({
  email: "admin@sultanmuda.com",
  password: "$2a$10$xJzQ6oS.zV8yQJ.8MqN5G.YdWvYJH8P4x0Mz3Z2LxK7L6N5H8P4x0",
  role: "admin",
  createdAt: new Date()
})
```

**Catatan**: Cara manual memerlukan password yang sudah di-hash. Lebih mudah menggunakan Cara 1.

## 🛠️ Teknologi

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM untuk MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## ⚙️ Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Port server | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/sultanmuda |
| JWT_SECRET | Secret key untuk JWT | - |
| JWT_EXPIRE | Token expiration time | 7d |
| NODE_ENV | Environment mode | development |
| ADMIN_REGISTRATION_KEY | Kunci rahasia untuk registrasi admin | - |

## 🐛 Troubleshooting

**MongoDB connection error:**
- Pastikan MongoDB sudah running
- Check connection string di `.env`
- Untuk MongoDB Atlas, pastikan IP sudah di-whitelist

**Port already in use:**
- Ubah PORT di file `.env`
- Atau stop service yang menggunakan port 5000

**JWT authentication error:**
- Pastikan JWT_SECRET sudah diset di `.env`
- Check token sudah disertakan di header

## 📧 Kontak

Untuk pertanyaan atau bantuan, hubungi tim development.
