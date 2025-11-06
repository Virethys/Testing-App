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
```

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
- `POST /api/auth/register` - Register UMKM baru
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

1. **UMKM** - Pemilik UMKM yang bisa mengelola profile dan produk sendiri
2. **Admin** - Moderator yang bisa approve/reject UMKM dan melihat semua data

## 📝 Data Dummy

Untuk membuat user admin pertama kali, gunakan MongoDB shell atau Compass:

```javascript
// Insert admin user (password: admin123)
db.users.insertOne({
  email: "admin@sultanmuda.com",
  password: "$2a$10$YourHashedPasswordHere",
  role: "admin",
  createdAt: new Date()
})
```

Atau buat melalui API dengan mengganti role di code sementara.

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
