# Panduan Docker - 100.000 Sultan Muda

## Prerequisites

Pastikan Docker dan Docker Compose sudah terinstall di komputer Anda:
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (untuk Windows & Mac)
- [Docker Engine](https://docs.docker.com/engine/install/) (untuk Linux)

## Cara Menjalankan dengan Docker

### 1. Clone Repository

```bash
git clone <repository-url>
cd sultanmuda
```

### 2. Jalankan dengan Docker Compose

Jalankan semua services (Frontend, Backend, MongoDB) sekaligus:

```bash
docker-compose up -d
```

Perintah ini akan:
- Build image untuk frontend dan backend
- Download image MongoDB
- Membuat network antar container
- Menjalankan semua services di background

### 3. Akses Aplikasi

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 4. Melihat Logs

Untuk melihat logs dari semua services:
```bash
docker-compose logs -f
```

Untuk melihat logs dari service tertentu:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 5. Stop Aplikasi

Untuk menghentikan semua services:
```bash
docker-compose down
```

Untuk menghentikan dan menghapus volumes (database akan terhapus):
```bash
docker-compose down -v
```

## Development dengan Docker

Untuk development dengan hot-reload, gunakan docker-compose.dev.yml:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Rebuild Setelah Ada Perubahan Code

Jika Anda melakukan perubahan pada code, rebuild container:

```bash
docker-compose up -d --build
```

## Troubleshooting

### Port sudah digunakan
Jika port 80, 5000, atau 27017 sudah digunakan, edit `docker-compose.yml` dan ubah port mapping:
```yaml
ports:
  - "8080:80"  # Ubah 80 ke port lain
```

### Container tidak bisa connect ke MongoDB
Pastikan semua container dalam network yang sama dan tunggu beberapa detik untuk MongoDB fully start.

### Permission denied (Linux)
Jalankan dengan sudo atau tambahkan user ke docker group:
```bash
sudo usermod -aG docker $USER
```

## Keuntungan Docker

✅ **Konsisten di semua device** - Windows, Mac, Linux  
✅ **Tidak perlu install MongoDB lokal** - Semua ada di container  
✅ **Mudah share ke tim** - Satu command untuk setup lengkap  
✅ **Isolated environment** - Tidak bentrok dengan aplikasi lain  
✅ **Production-ready** - Environment sama dengan production  

## Production Deployment

Untuk deploy ke production server:

1. Upload semua file ke server
2. Install Docker & Docker Compose di server
3. Set environment variables yang aman
4. Jalankan: `docker-compose up -d`
5. Setup reverse proxy (Nginx) untuk domain

Untuk production yang lebih advanced, pertimbangkan menggunakan:
- Docker Swarm atau Kubernetes
- CI/CD dengan GitHub Actions
- Container registry (Docker Hub, AWS ECR)
