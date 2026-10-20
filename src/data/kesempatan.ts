export type TipeAksiKesempatan = 
  | 'maju_petak'
  | 'mundur_petak'
  | 'lempar_lagi'
  | 'pindah_petak'
  | 'bonus_poin'
  | 'bantu_teman';

export interface KartuKesempatanData {
  id: string;
  judul: string;
  deskripsi: string;
  tipeAksi: TipeAksiKesempatan;
  nilai?: number; // jumlah langkah atau jumlah poin
  targetPetak?: number; // target indeks petak jika pindah
  pesanPakPeca: string;
}

export const DAFTAR_KARTU_KESEMPATAN: KartuKesempatanData[] = [
  {
    id: 'k1',
    judul: 'Langkah Semangat!',
    deskripsi: 'Kerja sama tim kalian hebat! Maju 2 petak ke depan.',
    tipeAksi: 'maju_petak',
    nilai: 2,
    pesanPakPeca: 'Langkah bersama tim selalu membawa kita maju lebih jauh!'
  },
  {
    id: 'k2',
    judul: 'Lemparan Keberuntungan',
    deskripsi: 'Timmu mendapat kesempatan lempar dadu sekali lagi!',
    tipeAksi: 'lempar_lagi',
    pesanPakPeca: 'Kocok dadunya dengan penuh semangat ya!'
  },
  {
    id: 'k3',
    judul: 'Kunjungan Pojok Baca',
    deskripsi: 'Saatnya menambah wawasan! Pindah langsung ke petak Pojok Baca dan raih +5 poin bonus.',
    tipeAksi: 'pindah_petak',
    targetPetak: 14, // Pojok Baca
    nilai: 5,
    pesanPakPeca: 'Membaca membuat kita semakin mahir memahami pecahan!'
  },
  {
    id: 'k4',
    judul: 'Evaluasi Strategi',
    deskripsi: 'Periksa kembali strategi timmu. Mundur 1 petak dengan hati-hati.',
    tipeAksi: 'mundur_petak',
    nilai: 1,
    pesanPakPeca: 'Mundur sejenak untuk melompat lebih tinggi bersama tim!'
  },
  {
    id: 'k5',
    judul: 'Bonus Kejujuran',
    deskripsi: 'Sikap sportif dan jujur adalah juara sejati! Kamu mendapat bonus +5 poin.',
    tipeAksi: 'bonus_poin',
    nilai: 5,
    pesanPakPeca: 'Kejujuran dan sportivitas selalu berbuah manis!'
  },
  {
    id: 'k6',
    judul: 'Bantu Teman Satu Tim',
    deskripsi: 'Jelaskan cara menjawab satu soal pecahan kepada anggota timmu! Jika tim/guru setuju, raih +10 poin bonus.',
    tipeAksi: 'bantu_teman',
    nilai: 10,
    pesanPakPeca: 'Mengajari teman membuat pemahaman pecahanmu berlipat ganda!'
  }
];
