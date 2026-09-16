# 📱 SchoolQuest Flutter Mobile Application

Aplikasi mobile resmi pendamping **SchoolQuest** yang dibangun dengan **Flutter** dan terhubung langsung ke backend **Laravel 12** serta database **MySQL** yang sama dengan versi web.

---

## 🌟 Fitur Lengkap Aplikasi

### 🗡️ Portal Siswa (Adventurer)
1. **Beranda / Dashboard**:
   - Header RPG dengan Fantasy Rank (14 Tier: *Novice* s.d. *Immortal*).
   - Indikator Level & Quadratic EXP Progress Bar ($60(L-1)^2 + 90(L-1)$).
   - Streak Days Flame (Hari Beruntun).
   - Jadwal Pelajaran Hari Ini (Mata Pelajaran, Guru, Jam).
   - Petugas Piket Kelas Hari Ini.
   - Quick Quests (Misi aktif yang belum diselesaikan).
   - Koleksi Lencana Prestasi (Achievements).
   - Banner Peringatan Sanksi Disiplin (jika siswa sedang terkena sanksi).

2. **Quests (Misi Petualangan)**:
   - Tab Misi Harian (*Daily Quests*) & Misi Tambahan (*Additional Quests*).
   - Badge Kesulitan (*Easy*, *Medium*, *Hard*) & EXP Reward.
   - Status pengerjaan real-time (*Pending*, *Approved*, *Rejected* lengkap dengan catatan penolakan guru).
   - Modal Pengumpulan Bukti Tugas: Upload foto langsung dari kamera/galeri + catatan pengerjaan.

3. **Hall of Fame (Peringkat Siswa)**:
   - Toggle Papan Peringkat: **Mingguan (Weekly)** dan **Keseluruhan (Overall)**.
   - Visual 3D Podium untuk Juara 1 (Emas), Juara 2 (Perak), dan Juara 3 (Perunggu).
   - Countdown timer siklus reset mingguan (setiap Senin 00:00 WIB).
   - Indikator *Challenger Surge Multiplier* (1.5x / 2.0x EXP boost jika tertinggal).
   - Floating Card "Peringkat Saya" yang selalu terlihat.

4. **The Realm (Forum Komunitas Siswa)**:
   - Filter Kategori: *Semua*, *Umum*, *Quest*, *Bug*, *Saran*, *Showcase*.
   - Filter Urutan: *Terbaru*, *Populer*, *Belum Dijawab*, *Paling Aktif*.
   - Pencarian topik diskusi secara real-time.
   - Detail Diskusi dengan Nested Replies (balasan berjenjang).
   - Tombol Like/Unlike, Buat Thread, dan Laporkan Pelanggaran (Report).
   - Proteksi otomatis bagi siswa yang sedang di-mute.

5. **Profil & Kustomisasi**:
   - Avatar Generator PixelBot (DiceBear Bottts seed selector & acak).
   - Unggah foto profil kustom dari galeri perangkat.
   - Reset avatar ke siluet default.
   - Rincian akumulasi EXP dan kebutuhan ke level berikutnya.
   - Galeri seluruh lencana pencapaian (*unlocked* vs *locked*).
   - Riwayat riil 10 penyelesaian quest terakhir.
   - Form ganti kata sandi.

---

### 🛡️ Portal Guru & Admin (Guild Master)
1. **Ringkasan Sistem**: Metrik total siswa, quest aktif, penyelesaian hari ini, dan antrian validasi.
2. **Validasi Bukti Quest**:
   - Preview foto bukti pengerjaan ukuran penuh.
   - Catatan pengerjaan siswa.
   - 1-Klik **Setujui (Approve)**: Otomatis menghitung bonus EXP *Catch-Up Surge* dan level-up siswa.
   - 1-Klik **Tolak (Reject)**: Disertai input alasan penolakan yang langsung muncul pada aplikasi siswa.
   - Riwayat validasi terdahulu.
3. **Quest Builder (CRUD)**: Tambah, edit, dan hapus misi tambahan untuk siswa.
4. **Moderasi The Realm**:
   - Antrian laporan pelanggaran dari siswa (*Reports Queue*).
   - Selesaikan laporan (*Resolve*).
   - Pin/Unpin dan Kunci/Buka diskusi.
   - Tindakan Disiplin Siswa: Peringatan Resmi, Mute (1 jam - 7 hari), dan Ban.
5. **Direktori Siswa**: Cari siswa berdasarkan NISN/Nama, filter kelas, dan inspeksi detail profil beserta riwayat quest dan sanksinya.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Menjalankan Backend Laravel
Pastikan server backend Laravel berjalan di root project (`/home/fooledgil/Dokumen/School-Quest`):
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

### 2. Konfigurasi Alamat Server di Aplikasi
Di layar Login, klik ikon **Settings** di pojok kanan atas untuk mengatur URL API:
- **Linux Desktop / Web**: `http://localhost:8000/api`
- **Android Emulator**: `http://10.0.2.2:8000/api`
- **Perangkat Fisik HP (via WiFi LAN)**: `http://<IP-Komputer-Anda>:8000/api`

### 3. Akun Demo Siap Pakai
Di layar Login terdapat tombol chip 1-klik untuk mengisi kredensial:
- **Admin**: `admin@schoolquest.test` / `password`
- **Guru**: `guru@schoolquest.test` / `password`
- **Siswa RPL**: `0087654321` (NISN) / `password`
- **Siswa MPLB**: `0081234567` (NISN) / `password`

### 4. Menjalankan Flutter
```bash
cd school_quest_app
flutter pub get
flutter run
```
