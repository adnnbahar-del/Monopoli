# 🎲 MONOPECA — Monopoli Pecahan

> **Media Game Edukatif Monopoli Berbasis Model Pembelajaran Kooperatif Teams Games Tournament (TGT)**  
> **Materi Matematika Pecahan Kelas V SD (Fase C — Kurikulum Merdeka)**  
> Disusun untuk Memenuhi Standar Validasi Ahli Materi, Ahli Media, dan Ahli Sistem (ISO/IEC 25010).

---

## 🌟 Tentang MONOPECA

**MONOPECA** adalah media pembelajaran interaktif berbasis web (Progressive Web Application) yang dirancang khusus untuk siswa sekolah dasar usia 10–11 tahun (Kelas V SD). Media ini mengintegrasikan mekanisme permainan monopoli bertema kearifan lokal **Pasar Tradisional Sukaraja** dengan sintaks model pembelajaran kooperatif **Teams Games Tournament (TGT)**.

Melalui MONOPECA, konsep matematika pecahan yang abstrak (penjumlahan, pengurangan, perbandingan pecahan berpenyebut beda, serta pecahan senilai) ditransformasikan menjadi aktivitas turnamen belajar yang menyenangkan, kolaboratif, dan kontekstual.

---

## 🚀 Fitur Unggulan

### 1. Papan Permainan Monopoli 28 Petak (Pasar Sukaraja)
- **4 Kuadran Tematik**: Pasar Sayur Segar, Sentra Buah Tropis, Warung Rempah Nusantara, dan Toko Kue Tradisional.
- **Petak Khusus**: START (bonus modal), Kesempatan, Pasar Kaget, Pajak Pasar, dan Istirahat Siang.
- **Dadu 3D Kriptografis**: Menggunakan Web Cryptography API (`crypto.getRandomValues`) untuk keacakan mutlak dan adil.

### 2. Sintaks Lengkap Teams Games Tournament (TGT)
- **Pembagian Tim Heterogen (Pola Ular)**: Menyeimbangkan anggota tim berdasarkan tingkat kemampuan akademik awal (Tinggi, Sedang, Perlu Bimbingan).
- **Meja Turnamen Homogen**: Peserta bertanding di Meja 1, Meja 2, Meja 3, dst., bersama teman yang memiliki kemampuan akademik setara, menggunakan **Paket Soal Turnamen A, B, dan C**.
- **Konversi Poin Turnamen (Slavin, 1995)**: Perhitungan skor meja otomatis (60, 40, 30, 20 poin) dengan sistem pembagian rata saat skor kembar (*tie-breaker*).
- **Penghargaan Kelompok Berjenjang**:
  - 🥇 **Super Team**: Rata-rata poin tim $\ge 50$
  - 🥈 **Great Team**: Rata-rata poin tim $45 - 49$
  - 🥉 **Good Team**: Rata-rata poin tim $40 - 44$
- **Podium Juara & Cetak Sertifikat**: Selebrasi konfeti interaktif dan cetak sertifikat tim resmi siap print (`@media print`).

### 3. Bank Soal & Representasi Visual Pecahan
- **47 Butir Soal Terstandar** (`soal.json`) yang mencakup level kognitif C1 hingga C4.
- **Visualisasi Dinamis**: Representasi pecahan interaktif dalam bentuk kue/lingkaran, balok panjang/batang cokelat, dan petak sawah persegi.
- **Pembahasan Ramah Anak**: Ulasan langkah penyelesaian langkah demi langkah jika siswa menjawab keliru.

### 4. Panel Khusus Guru (Terproteksi Sandi: `guru123`)
- **Manajemen Kelas & Siswa**: Tambah/edit siswa atau impor massal melalui file CSV.
- **Generator Tim & Meja Otomatis**: Sekali klik untuk membentuk tim heterogen dan meja turnamen.
- **Input Skor & Scanner QR / Kode Meja**: Validasi skor turnamen cepat.
- **Ekspor Hasil**: Unduh rekap penilaian dalam format CSV/Excel atau cetak laporan format dokumen.

### 5. Audio Synthesizer (Web Audio API) & Aksesibilitas
- **18 Efek Suara Prosedural**: Dihasilkan secara langsung oleh peramban tanpa file eksternal (bekerja 100% offline).
- **Aksesibilitas Universal**:
  - Mode Kontras Tinggi (*High Contrast*) untuk visibilitas optimal.
  - Pilihan Ukuran Teks (Normal & Besar).
  - Tautan Lewati ke Konten (*Skip-to-Content*) dan dukungan keyboard.

---

## 🛠️ Arsitektur Teknologi

- **Frontend Core**: React 18, TypeScript 5, Vite 6
- **Styling**: Tailwind CSS 3, Lucide React Icons, Font Nunito & Baloo 2
- **Animasi**: Framer Motion, Canvas Confetti
- **State Management**: Zustand 5 (Persistensi LocalStorage otomatis)
- **Audio**: Web Audio API murni
- **PWA**: `vite-plugin-pwa` (Workbox Service Worker offline-ready)
- **Testing**: Vitest (41 unit tests lulus 100%)

---

## 📦 Panduan Menjalankan Proyek

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Aplikasi dapat diakses di browser pada: `http://localhost:5173`

### 2. Menjalankan Pengujian Unit
```bash
npm run test
```
Seluruh 41 pengujian unit pada engine pecahan, pergerakan, dadu, turnamen TGT, dan integritas butir soal akan dieksekusi.

### 3. Build Produksi PWA
```bash
npm run build
```
Menghasilkan bundle statis siap publikasi di folder `dist/` beserta Service Worker dan manifest PWA.

### 4. Menjalankan Pratinjau Build Produksi
```bash
npm run preview
```

---

## 📄 Dokumen Validasi & Evaluasi

Proyek ini dilengkapi dengan dokumen panduan validasi:
1. [LAPORAN_VALIDASI_MONOPECA.md](file:///c:/Users/ASUS/Music/Media%20Monopoli/LAPORAN_VALIDASI_MONOPECA.md): Laporan pemenuhan standar ISO/IEC 25010 & matriks implementasi.
2. [INSTRUMEN_ANGKET_VALIDASI.md](file:///c:/Users/ASUS/Music/Media%20Monopoli/INSTRUMEN_ANGKET_VALIDASI.md): Instrumen angket evaluasi skala Likert untuk Ahli Materi, Media, dan Sistem.
