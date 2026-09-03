# Panduan Instalasi & Restorasi SchoolQuest di Linux Baru

Panduan ini dibuat sebagai referensi lengkap untuk mengembalikan dan menjalankan project **SchoolQuest** setelah Anda melakukan instalasi ulang atau berganti distribusi Linux.

---

## 📋 Daftar Isi
1. [Hal Penting Sebelum Format/Ganti Distro](#1-hal-penting-sebelum-formatganti-distro)
2. [Instalasi Kebutuhan Sistem (Dependencies)](#2-instalasi-kebutuhan-sistem-dependencies)
3. [Clone Repository](#3-clone-repository)
4. [Konfigurasi Environment (.env)](#4-konfigurasi-environment-env)
5. [Instalasi Dependensi PHP & Node.js](#5-instalasi-dependensi-php--nodejs)
6. [Konfigurasi Database (MariaDB / MySQL)](#6-konfigurasi-database-mariadb--mysql)
7. [Inisialisasi Project Laravel](#7-inisialisasi-project-laravel)
8. [Build Frontend & Menjalankan Aplikasi](#8-build-frontend--menjalankan-aplikasi)
9. [Catatan Troubleshooting](#9-catatan-troubleshooting)

---

## 1. Hal Penting Sebelum Format/Ganti Distro

Sebelum Anda menghapus instalasi Linux saat ini, pastikan Anda telah mencatat/menyimpan:

1. **GitHub Personal Access Token (PAT):**
   - Simpan token GitHub Anda di tempat yang aman (misalnya: Google Drive, catatan HP, atau password manager).
   - Tanpa token ini, Anda tidak bisa melakukan `git clone` (jika private) atau `git push` nanti.
2. **Kunci Aplikasi (`APP_KEY`):**
   - Nilai APP_KEY saat ini:
     ```text
     base64:rNAYDh1qKEVtz1bY2EclxAMoccbflaB4E9o4SSLjHpU=
     ```
3. **Database Backup:**
   - File backup database telah disertakan di repository pada: `database/school_quest_backup.sql`.
4. **File Unggahan User (Opsional):**
   - Jika ingin mempertahankan avatar atau gambar bukti quest yang pernah diunggah selama testing, salin folder `storage/app/public` ke flashdisk atau Google Drive.

---

## 2. Instalasi Kebutuhan Sistem (Dependencies)

Di distro Linux baru, install paket-paket dasar yang dibutuhkan:

### Ubuntu / Debian / Linux Mint / Pop!_OS:
```bash
sudo apt update
sudo apt install -y git curl unzip mariadb-server \
    php php-cli php-fpm php-mysql php-xml php-mbstring \
    php-curl php-intl php-zip php-bcmath php-sqlite3
```

### Arch Linux / Manjaro / EndeavourOS:
```bash
sudo pacman -Syu
sudo pacman -S git curl unzip mariadb \
    php php-intl php-sodium php-sqlite
```

### Install Composer:
```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### Install Node.js (v20+ disarankan) & npm:
```bash
# Menggunakan NodeSource (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Atau di Arch Linux:
sudo pacman -S nodejs npm
```

---

## 3. Clone Repository

Buka terminal dan clone repository SchoolQuest:

```bash
git clone https://github.com/FooledGil/School-Quest.git
cd School-Quest
```

---

## 4. Konfigurasi Environment (.env)

Buat file `.env` dari contoh yang ada:

```bash
cp .env.example .env
```

Sesuaikan isi `.env` (terutama bagian Database dan App Key). Contoh konfigurasi yang sudah sesuai dengan project:

```env
APP_NAME=SchoolQuest
APP_ENV=local
APP_KEY=base64:rNAYDh1qKEVtz1bY2EclxAMoccbflaB4E9o4SSLjHpU=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_quest
DB_USERNAME=sq_user
DB_PASSWORD=password

SESSION_DRIVER=database
SESSION_LIFETIME=120
```

---

## 5. Instalasi Dependensi PHP & Node.js

Jalankan perintah berikut di dalam folder `School-Quest`:

```bash
# Install paket backend Laravel
composer install

# Install paket frontend (React, GSAP, Tailwind, Inertia)
npm install
```

---

## 6. Konfigurasi Database (MariaDB / MySQL)

1. Pastikan service MariaDB/MySQL berjalan:
   ```bash
   # Di Ubuntu/Debian:
   sudo systemctl enable --now mariadb

   # Di Arch Linux (jika baru pertama kali install, jalankan mariadb-install-db dulu):
   sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
   sudo systemctl enable --now mariadb
   ```

2. Buat database dan user baru sesuai konfigurasi `.env`:
   ```bash
   sudo mysql -u root
   ```
   Lalu masukkan perintah SQL berikut:
   ```sql
   CREATE DATABASE school_quest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'sq_user'@'localhost' IDENTIFIED BY 'password';
   CREATE USER 'sq_user'@'127.0.0.1' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON school_quest.* TO 'sq_user'@'localhost';
   GRANT ALL PRIVILEGES ON school_quest.* TO 'sq_user'@'127.0.0.1';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Restore Data:**
   Pilih salah satu dari 2 cara berikut:

   - **Cara A: Restore langsung dari file backup SQL (Paling Lengkap)**
     ```bash
     mariadb -u sq_user -ppassword school_quest < database/school_quest_backup.sql
     ```
   - **Cara B: Jalankan Migration & Seeder Bawaan Laravel**
     ```bash
     php artisan migrate --seed
     ```

---

## 7. Inisialisasi Project Laravel

1. Buat symbolic link untuk storage (agar avatar dan gambar bukti quest bisa diakses web):
   ```bash
   php artisan storage:link
   ```

2. (Jika belum memiliki APP_KEY di `.env`):
   ```bash
   php artisan key:generate
   ```

3. Bersihkan cache:
   ```bash
   php artisan optimize:clear
   ```

---

## 8. Build Frontend & Menjalankan Aplikasi

### Kompilasi Aset Frontend:
```bash
npm run build
```

### Menjalankan Server:
Gunakan dua jendela atau tab terminal:

- **Terminal 1 (Laravel Backend):**
  ```bash
  php artisan serve
  ```
- **Terminal 2 (Vite Hot-Reload untuk Frontend):**
  ```bash
  npm run dev
  ```

Buka browser di: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 9. Catatan Troubleshooting

- **Error `extension intl is required`:**
  Pastikan ekstensi PHP `intl` aktif di `php.ini` (`extension=intl`), lalu install paket sistem `php-intl`.
- **Git credential minta username/password terus:**
  Jalankan:
  ```bash
  git config --global credential.helper store
  ```
  Masukkan username GitHub dan **Personal Access Token (PAT)** saat pertama kali push/pull.
- **Tampilan CSS/JS berantakan:**
  Jalankan `npm run build` dan lakukan **Hard Refresh** di browser (`Ctrl + Shift + R`).
