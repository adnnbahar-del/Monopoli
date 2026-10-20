import soalData from '../data/soal.json';
import { DAFTAR_KARTU_KESEMPATAN, KartuKesempatanData } from '../data/kesempatan';
import { BentukVisual } from '../components/VisualPecahan';

export type Level = 'mudah' | 'sedang' | 'sukar';
export type Subtopik = 'mengenal' | 'senilai' | 'membandingkan' | 'mengurutkan' | 'penjumlahan' | 'pengurangan' | 'campuran';

export interface Soal {
  id: string;
  tipe: 'petak' | 'tantangan' | 'turnamen';
  subtopik: Subtopik;
  level: Level;
  tp: string;
  pertanyaan: string;
  opsi: string[];
  kunci: string;
  pembahasan: string;
  visual?: {
    bentuk: BentukVisual;
    pembilang: number;
    penyebut: number;
  };
  konteks?: string;
  paket?: 'A' | 'B' | 'C';
}

export const SEMUA_SOAL: Soal[] = (soalData.soal as unknown) as Soal[];

/**
 * Mengacak opsi jawaban menggunakan Fisher-Yates shuffle.
 */
export function acakOpsi<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Memilih level soal berbobot:
 * - Mudah: 40%
 * - Sedang: 40%
 * - Sukar: 20%
 */
export function pilihLevelBerbobot(): Level {
  const rand = Math.random();
  if (rand < 0.40) return 'mudah';
  if (rand < 0.80) return 'sedang';
  return 'sukar';
}

/**
 * Mengambil soal untuk kios/petak tertentu:
 * 1. Filter tipe 'petak' dan subtopik yang sesuai.
 * 2. Hindari soal yang sudah terpakai di sesi ini.
 * 3. Ambil sesuai level berbobot (jika level tersebut tidak ada, fallback ke level lain yang belum terpakai).
 * 4. Jika semua soal di subtopik tersebut sudah terpakai, reset filter terpakai untuk subtopik tersebut.
 */
export function ambilSoalPetak(
  subtopik: Subtopik,
  soalTerpakaiIds: string[],
  levelTarget?: Level
): { soal: Soal; opsiAcak: string[] } {
  const bankSubtopik = SEMUA_SOAL.filter(
    (s) => s.tipe === 'petak' && s.subtopik === subtopik
  );

  if (bankSubtopik.length === 0) {
    throw new Error(`Tidak ditemukan soal untuk subtopik: ${subtopik}`);
  }

  // Saring soal yang belum terpakai
  let kandidat = bankSubtopik.filter((s) => !soalTerpakaiIds.includes(s.id));

  // Jika semua sudah terpakai, gunakan kembali seluruh bank subtopik
  if (kandidat.length === 0) {
    kandidat = bankSubtopik;
  }

  const levelDipilih = levelTarget || pilihLevelBerbobot();
  const sesuaiLevel = kandidat.filter((s) => s.level === levelDipilih);

  const soalTerpilih = sesuaiLevel.length > 0
    ? sesuaiLevel[Math.floor(Math.random() * sesuaiLevel.length)]
    : kandidat[Math.floor(Math.random() * kandidat.length)];

  return {
    soal: soalTerpilih,
    opsiAcak: acakOpsi(soalTerpilih.opsi)
  };
}

/**
 * Mengambil soal tipe Tantangan (timer 90 detik, bonus +40 poin).
 */
export function ambilSoalTantangan(
  soalTerpakaiIds: string[]
): { soal: Soal; opsiAcak: string[] } {
  const bankTantangan = SEMUA_SOAL.filter((s) => s.tipe === 'tantangan');
  let kandidat = bankTantangan.filter((s) => !soalTerpakaiIds.includes(s.id));
  if (kandidat.length === 0) kandidat = bankTantangan;

  const soalTerpilih = kandidat[Math.floor(Math.random() * kandidat.length)];
  return {
    soal: soalTerpilih,
    opsiAcak: acakOpsi(soalTerpilih.opsi)
  };
}

/**
 * Mengambil kartu kesempatan acak.
 */
export function ambilKartuKesempatan(): KartuKesempatanData {
  const idx = Math.floor(Math.random() * DAFTAR_KARTU_KESEMPATAN.length);
  return DAFTAR_KARTU_KESEMPATAN[idx];
}

/**
 * Menghitung perolehan poin berdasarkan level soal kios kosong:
 * - Mudah: 10
 * - Sedang: 20
 * - Sukar: 30
 */
export function hitungPoinKios(level: Level): number {
  switch (level) {
    case 'mudah': return 10;
    case 'sedang': return 20;
    case 'sukar': return 30;
  }
}
