export type JenisPetak = 'sudut' | 'kios' | 'kesempatan' | 'tantangan';
export type SisiZona = 1 | 2 | 3 | 4;

export interface PetakData {
  index: number;
  nama: string;
  namaSingkat: string;
  jenis: JenisPetak;
  sisiZona?: SisiZona;
  subtopik?: 'mengenal' | 'senilai' | 'membandingkan' | 'mengurutkan' | 'penjumlahan' | 'pengurangan' | 'campuran';
  warna: string;
  deskripsi: string;
  ikon: string; // nama ikon lucide
  gridRow: number; // 0 - 7
  gridCol: number; // 0 - 7
}

/**
 * Data 28 Petak Papan Monopoli MONOPECA
 * Grid 8x8 keliling searah jarum jam:
 * - Petak 0: Kiri Bawah (START)
 * - Petak 1-6: Sisi Kiri (Sisi 1 - Coral #FF8A80)
 * - Petak 7: Kiri Atas (Saung Kopi)
 * - Petak 8-13: Sisi Atas (Sisi 2 - Kuning #FFB627)
 * - Petak 14: Kanan Atas (Pojok Baca)
 * - Petak 15-20: Sisi Kanan (Sisi 3 - Hijau #3BC47A)
 * - Petak 21: Kanan Bawah (Pantai Semaka)
 * - Petak 22-27: Sisi Bawah (Sisi 4 - Biru #4D8DFF)
 */
export const DAFTAR_PETAK: PetakData[] = [
  // PETAK 0: SUDUT KIRI BAWAH (START)
  {
    index: 0,
    nama: 'START — Gerbang Sekolah',
    namaSingkat: 'START',
    jenis: 'sudut',
    warna: '#FF6B35',
    deskripsi: 'Lewat atau berhenti mendapat bonus +10 poin!',
    ikon: 'School',
    gridRow: 7,
    gridCol: 0
  },
  // SISI 1 (KIRI, NAIK): Mengenal & Pecahan Senilai
  {
    index: 1,
    nama: 'Warung Bolu',
    namaSingkat: 'Wrg Bolu',
    jenis: 'kios',
    sisiZona: 1,
    subtopik: 'mengenal',
    warna: '#FF8A80',
    deskripsi: 'Kios Bolu Sukaraja. Subtopik: Mengenal Pecahan.',
    ikon: 'Cake',
    gridRow: 6,
    gridCol: 0
  },
  {
    index: 2,
    nama: 'Toko Pizza Mini',
    namaSingkat: 'Pizza Mini',
    jenis: 'kios',
    sisiZona: 1,
    subtopik: 'mengenal',
    warna: '#FF8A80',
    deskripsi: 'Toko Pizza Mini. Subtopik: Mengenal Pecahan.',
    ikon: 'Pizza',
    gridRow: 5,
    gridCol: 0
  },
  {
    index: 3,
    nama: 'Kartu Kesempatan',
    namaSingkat: 'Kesempatan',
    jenis: 'kesempatan',
    warna: '#FF7EB6',
    deskripsi: 'Ambil Kartu Kesempatan bernuansa kerja sama.',
    ikon: 'Sparkles',
    gridRow: 4,
    gridCol: 0
  },
  {
    index: 4,
    nama: 'Kios Martabak',
    namaSingkat: 'Martabak',
    jenis: 'kios',
    sisiZona: 1,
    subtopik: 'senilai',
    warna: '#FF8A80',
    deskripsi: 'Kios Martabak Manis. Subtopik: Pecahan Senilai.',
    ikon: 'Utensils',
    gridRow: 3,
    gridCol: 0
  },
  {
    index: 5,
    nama: 'Kartu Tantangan',
    namaSingkat: 'Tantangan',
    jenis: 'tantangan',
    warna: '#7B5CFA',
    deskripsi: 'Tantangan waktu 90 detik untuk +40 poin!',
    ikon: 'Flame',
    gridRow: 2,
    gridCol: 0
  },
  {
    index: 6,
    nama: 'Lapak Semangka',
    namaSingkat: 'Semangka',
    jenis: 'kios',
    sisiZona: 1,
    subtopik: 'senilai',
    warna: '#FF8A80',
    deskripsi: 'Lapak Semangka Segar. Subtopik: Pecahan Senilai.',
    ikon: 'Apple',
    gridRow: 1,
    gridCol: 0
  },
  // PETAK 7: SUDUT KIRI ATAS (SAUNG KOPI)
  {
    index: 7,
    nama: 'Saung Kopi — Istirahat',
    namaSingkat: 'Istirahat',
    jenis: 'sudut',
    warna: '#2EC4B6',
    deskripsi: 'Petak aman beristirahat tanpa beban aksi soal.',
    ikon: 'Coffee',
    gridRow: 0,
    gridCol: 0
  },
  // SISI 2 (ATAS, KE KANAN): Membandingkan Pecahan
  {
    index: 8,
    nama: 'Kebun Kopi',
    namaSingkat: 'Kopi',
    jenis: 'kios',
    sisiZona: 2,
    subtopik: 'membandingkan',
    warna: '#FFB627',
    deskripsi: 'Kebun Kopi Robusta. Subtopik: Membandingkan Pecahan.',
    ikon: 'Trees',
    gridRow: 0,
    gridCol: 1
  },
  {
    index: 9,
    nama: 'Kebun Pisang',
    namaSingkat: 'Pisang',
    jenis: 'kios',
    sisiZona: 2,
    subtopik: 'membandingkan',
    warna: '#FFB627',
    deskripsi: 'Kebun Pisang Cavendish. Subtopik: Membandingkan Pecahan.',
    ikon: 'Leaf',
    gridRow: 0,
    gridCol: 2
  },
  {
    index: 10,
    nama: 'Kartu Kesempatan',
    namaSingkat: 'Kesempatan',
    jenis: 'kesempatan',
    warna: '#FF7EB6',
    deskripsi: 'Ambil Kartu Kesempatan bernuansa kerja sama.',
    ikon: 'Sparkles',
    gridRow: 0,
    gridCol: 3
  },
  {
    index: 11,
    nama: 'Kebun Lada',
    namaSingkat: 'Lada',
    jenis: 'kios',
    sisiZona: 2,
    subtopik: 'membandingkan',
    warna: '#FFB627',
    deskripsi: 'Kebun Lada Hitam Sukaraja. Subtopik: Membandingkan.',
    ikon: 'Sparkle',
    gridRow: 0,
    gridCol: 4
  },
  {
    index: 12,
    nama: 'Kartu Tantangan',
    namaSingkat: 'Tantangan',
    jenis: 'tantangan',
    warna: '#7B5CFA',
    deskripsi: 'Tantangan waktu 90 detik untuk +40 poin!',
    ikon: 'Flame',
    gridRow: 0,
    gridCol: 5
  },
  {
    index: 13,
    nama: 'Kebun Kakao',
    namaSingkat: 'Kakao',
    jenis: 'kios',
    sisiZona: 2,
    subtopik: 'membandingkan',
    warna: '#FFB627',
    deskripsi: 'Kebun Cokelat Kakao. Subtopik: Membandingkan.',
    ikon: 'Flower2',
    gridRow: 0,
    gridCol: 6
  },
  // PETAK 14: SUDUT KANAN ATAS (POJOK BACA)
  {
    index: 14,
    nama: 'Pojok Baca — Pembahasan',
    namaSingkat: 'Pojok Baca',
    jenis: 'sudut',
    warna: '#3E7BFA',
    deskripsi: 'Ringkasan materi zona berikutnya +5 poin bonus!',
    ikon: 'BookOpen',
    gridRow: 0,
    gridCol: 7
  },
  // SISI 3 (KANAN, TURUN): Mengurutkan Pecahan
  {
    index: 15,
    nama: 'Dermaga Nelayan',
    namaSingkat: 'Dermaga',
    jenis: 'kios',
    sisiZona: 3,
    subtopik: 'mengurutkan',
    warna: '#3BC47A',
    deskripsi: 'Dermaga Nelayan Sukaraja. Subtopik: Mengurutkan.',
    ikon: 'Anchor',
    gridRow: 1,
    gridCol: 7
  },
  {
    index: 16,
    nama: 'Pasar Ikan',
    namaSingkat: 'Pasar Ikan',
    jenis: 'kios',
    sisiZona: 3,
    subtopik: 'mengurutkan',
    warna: '#3BC47A',
    deskripsi: 'Pasar Ikan Segar. Subtopik: Mengurutkan.',
    ikon: 'Fish',
    gridRow: 2,
    gridCol: 7
  },
  {
    index: 17,
    nama: 'Kartu Kesempatan',
    namaSingkat: 'Kesempatan',
    jenis: 'kesempatan',
    warna: '#FF7EB6',
    deskripsi: 'Ambil Kartu Kesempatan bernuansa kerja sama.',
    ikon: 'Sparkles',
    gridRow: 3,
    gridCol: 7
  },
  {
    index: 18,
    nama: 'Perahu Jukung',
    namaSingkat: 'Jukung',
    jenis: 'kios',
    sisiZona: 3,
    subtopik: 'mengurutkan',
    warna: '#3BC47A',
    deskripsi: 'Perahu Jukung Tradisional. Subtopik: Mengurutkan.',
    ikon: 'Ship',
    gridRow: 4,
    gridCol: 7
  },
  {
    index: 19,
    nama: 'Kartu Tantangan',
    namaSingkat: 'Tantangan',
    jenis: 'tantangan',
    warna: '#7B5CFA',
    deskripsi: 'Tantangan waktu 90 detik untuk +40 poin!',
    ikon: 'Flame',
    gridRow: 5,
    gridCol: 7
  },
  {
    index: 20,
    nama: 'Mercusuar',
    namaSingkat: 'Mercusuar',
    jenis: 'kios',
    sisiZona: 3,
    subtopik: 'mengurutkan',
    warna: '#3BC47A',
    deskripsi: 'Mercusuar Semaka. Subtopik: Mengurutkan.',
    ikon: 'Navigation',
    gridRow: 6,
    gridCol: 7
  },
  // PETAK 21: SUDUT KANAN BAWAH (PANTAI SEMAKA)
  {
    index: 21,
    nama: 'Pantai Semaka — Bonus Tim',
    namaSingkat: 'Pantai Semaka',
    jenis: 'sudut',
    warna: '#8E4EC6',
    deskripsi: 'Semua anggota tim pemain mendapat bonus +5 poin!',
    ikon: 'Sun',
    gridRow: 7,
    gridCol: 7
  },
  // SISI 4 (BAWAH, KE KIRI): Penjumlahan & Pengurangan Pecahan
  {
    index: 22,
    nama: 'Toko Kain Tapis',
    namaSingkat: 'Kain Tapis',
    jenis: 'kios',
    sisiZona: 4,
    subtopik: 'penjumlahan',
    warna: '#4D8DFF',
    deskripsi: 'Toko Kain Tapis Khas Lampung. Subtopik: Penjumlahan.',
    ikon: 'Shirt',
    gridRow: 7,
    gridCol: 6
  },
  {
    index: 23,
    nama: 'Toko Gula Aren',
    namaSingkat: 'Gula Aren',
    jenis: 'kios',
    sisiZona: 4,
    subtopik: 'penjumlahan',
    warna: '#4D8DFF',
    deskripsi: 'Toko Gula Aren Murni. Subtopik: Penjumlahan.',
    ikon: 'Package',
    gridRow: 7,
    gridCol: 5
  },
  {
    index: 24,
    nama: 'Kartu Kesempatan',
    namaSingkat: 'Kesempatan',
    jenis: 'kesempatan',
    warna: '#FF7EB6',
    deskripsi: 'Ambil Kartu Kesempatan bernuansa kerja sama.',
    ikon: 'Sparkles',
    gridRow: 7,
    gridCol: 4
  },
  {
    index: 25,
    nama: 'Toko Pita',
    namaSingkat: 'Toko Pita',
    jenis: 'kios',
    sisiZona: 4,
    subtopik: 'pengurangan',
    warna: '#4D8DFF',
    deskripsi: 'Toko Pita Kerajinan. Subtopik: Pengurangan.',
    ikon: 'Scissors',
    gridRow: 7,
    gridCol: 3
  },
  {
    index: 26,
    nama: 'Kartu Tantangan',
    namaSingkat: 'Tantangan',
    jenis: 'tantangan',
    warna: '#7B5CFA',
    deskripsi: 'Tantangan waktu 90 detik untuk +40 poin!',
    ikon: 'Flame',
    gridRow: 7,
    gridCol: 2
  },
  {
    index: 27,
    nama: 'Toko Pupuk',
    namaSingkat: 'Toko Pupuk',
    jenis: 'kios',
    sisiZona: 4,
    subtopik: 'pengurangan',
    warna: '#4D8DFF',
    deskripsi: 'Toko Pupuk Sukaraja. Subtopik: Pengurangan.',
    ikon: 'Sprout',
    gridRow: 7,
    gridCol: 1
  }
];
