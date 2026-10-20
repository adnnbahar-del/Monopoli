/**
 * Engine Gerak Bidak MONOPECA
 * Menghitung pergerakan bidak 28 petak, wrap-around, bonus START, dan jalur animasi.
 */

export const TOTAL_PETAK_PAPAN = 28;
export const POIN_BONUS_START = 10;

export interface HasilGerak {
  posisiAwal: number;
  langkah: number;
  posisiAkhir: number;
  melewatiStart: boolean;
  bonusPoin: number;
  jalurLangkah: number[]; // daftar petak yang dilalui satu per satu
}

/**
 * Menghitung posisi baru setelah bidak melangkah dengan wrap-around (0 - 27).
 */
export function hitungPosisiBaru(
  posisiAwal: number,
  langkah: number,
  totalPetak: number = TOTAL_PETAK_PAPAN
): number {
  if (langkah <= 0) return posisiAwal;
  return (posisiAwal + langkah) % totalPetak;
}

/**
 * Menentukan apakah bidak melewati atau mendarat di petak START (indeks 0).
 * Jika ya, pemain berhak mendapatkan bonus START +10 poin.
 */
export function apakahMelewatiStart(
  posisiAwal: number,
  langkah: number,
  totalPetak: number = TOTAL_PETAK_PAPAN
): boolean {
  if (langkah <= 0) return false;
  return posisiAwal + langkah >= totalPetak;
}

/**
 * Menghasilkan jalur petak langkah demi langkah untuk animasi bidak melompat satu per satu.
 * Contoh: posisiAwal = 27, langkah = 3 -> jalur = [0, 1, 2]
 */
export function buatJalurLangkah(
  posisiAwal: number,
  langkah: number,
  totalPetak: number = TOTAL_PETAK_PAPAN
): number[] {
  const jalur: number[] = [];
  let curr = posisiAwal;
  for (let i = 1; i <= langkah; i++) {
    curr = (curr + 1) % totalPetak;
    jalur.push(curr);
  }
  return jalur;
}

/**
 * Memproses satu siklus pergerakan bidak secara menyeluruh.
 */
export function prosesGerak(
  posisiAwal: number,
  langkah: number,
  totalPetak: number = TOTAL_PETAK_PAPAN
): HasilGerak {
  const posisiAkhir = hitungPosisiBaru(posisiAwal, langkah, totalPetak);
  const lewatStart = apakahMelewatiStart(posisiAwal, langkah, totalPetak);
  const jalur = buatJalurLangkah(posisiAwal, langkah, totalPetak);

  return {
    posisiAwal,
    langkah,
    posisiAkhir,
    melewatiStart: lewatStart,
    bonusPoin: lewatStart ? POIN_BONUS_START : 0,
    jalurLangkah: jalur
  };
}
