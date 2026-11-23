/**
 * Pemeriksa jawaban "Ayo coba" Materi Kilat (fungsi murni, mudah diuji).
 *
 * Aturan:
 * - Jawaban kosong → status 'kosong' ("Isi jawabanmu dulu, ya.").
 * - Jawaban senilai diterima, kecuali soal mewajibkan bentuk tertentu:
 *   wajib 'sederhana' → belum disederhanakan = 'hampir' ("Hampir! Sederhanakan lagi.")
 *   wajib 'campuran'  → bukan pecahan campuran paling sederhana = 'hampir'.
 * - Jawaban benar tetapi bentuknya beda dari kunci → tetap 'benar' + catatan bentuk sederhananya.
 */
import { hitungFPB } from './pecahan';

export type StatusJawaban = 'kosong' | 'benar' | 'hampir' | 'salah';

export interface HasilPeriksa {
  status: StatusJawaban;
  /** Pesan singkat untuk siswa (boleh berisi penanda pecahan {a/b}). */
  pesan?: string;
}

export interface InputIsian {
  bulat?: string;
  pembilang?: string;
  penyebut?: string;
  angka?: string;
}

export type BentukIsian = 'pecahan' | 'campuran' | 'angka';
export type WajibBentuk = 'sederhana' | 'campuran';

interface Rasional {
  pembilang: number; // total (bisa > penyebut)
  penyebut: number;
}

const kosong = (s?: string) => s === undefined || s.trim() === '';
const keAngka = (s?: string) => (kosong(s) ? NaN : Number(s!.trim().replace(',', '.')));

/** Parse kunci jawaban: "6", "2/6", "2 1/4". */
export function parseKunci(kunci: string): Rasional {
  const t = kunci.trim();
  const campuran = t.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (campuran) {
    const [b, p, q] = campuran.slice(1).map(Number);
    return { pembilang: b * q + p, penyebut: q };
  }
  const pecahan = t.match(/^(\d+)\/(\d+)$/);
  if (pecahan) return { pembilang: Number(pecahan[1]), penyebut: Number(pecahan[2]) };
  return { pembilang: Number(t), penyebut: 1 };
}

const samaNilai = (a: Rasional, b: Rasional) => a.pembilang * b.penyebut === b.pembilang * a.penyebut;

/** Bentuk paling sederhana sebagai teks penanda, mis. "{1 1/3}" atau "{5/7}" atau "1". */
export function bentukSederhana(r: Rasional, campuran: boolean): string {
  const fpb = hitungFPB(r.pembilang, r.penyebut);
  const p = r.pembilang / fpb;
  const q = r.penyebut / fpb;
  if (q === 1) return String(p);
  if (campuran && p > q) {
    const b = Math.floor(p / q);
    return `{${b} ${p - b * q}/${q}}`;
  }
  return `{${p}/${q}}`;
}

export function periksaIsian(
  bentuk: BentukIsian,
  input: InputIsian,
  kunci: string,
  wajib?: WajibBentuk
): HasilPeriksa {
  const target = parseKunci(kunci);

  if (bentuk === 'angka') {
    if (kosong(input.angka)) return { status: 'kosong' };
    const n = keAngka(input.angka);
    if (!Number.isFinite(n)) return { status: 'salah', pesan: 'Tulis jawabanmu dengan angka, ya.' };
    return n * target.penyebut === target.pembilang ? { status: 'benar' } : { status: 'salah' };
  }

  // Pecahan biasa / campuran
  const adaBulat = bentuk === 'campuran' && !kosong(input.bulat);
  const adaPembilang = !kosong(input.pembilang);
  const adaPenyebut = !kosong(input.penyebut);

  if (!adaBulat && !adaPembilang && !adaPenyebut) return { status: 'kosong' };
  // Pecahan wajib lengkap (pembilang & penyebut), kecuali jawaban bilangan bulat saja di mode campuran
  if (adaPembilang !== adaPenyebut) return { status: 'kosong' };

  const bulat = adaBulat ? keAngka(input.bulat) : 0;
  const pembilang = adaPembilang ? keAngka(input.pembilang) : 0;
  const penyebut = adaPenyebut ? keAngka(input.penyebut) : 1;
  if (![bulat, pembilang, penyebut].every((x) => Number.isInteger(x) && x >= 0)) {
    return { status: 'salah', pesan: 'Gunakan bilangan bulat, ya.' };
  }
  if (penyebut === 0) return { status: 'salah', pesan: 'Penyebut tidak boleh 0.' };

  const jawab: Rasional = { pembilang: bulat * penyebut + pembilang, penyebut };
  if (!samaNilai(jawab, target)) return { status: 'salah' };

  const fpb = hitungFPB(pembilang || penyebut, penyebut);
  const pecahanSederhana = !adaPembilang || pembilang === 0 || fpb === 1;

  if (wajib === 'sederhana' && !pecahanSederhana) {
    return { status: 'hampir', pesan: 'Hampir! Sederhanakan lagi.' };
  }
  if (wajib === 'campuran') {
    const bentukCampuran = (adaBulat && bulat > 0) && (!adaPembilang || pembilang < penyebut) && pecahanSederhana;
    if (!bentukCampuran) return { status: 'hampir', pesan: 'Hampir! Tulis dalam bentuk pecahan campuran paling sederhana.' };
  }

  // Benar. Bila bentuknya belum sama dengan kunci (mis. 8/6 untuk 1 1/3), beri catatan.
  const kunciCampuran = /\s/.test(kunci.trim());
  const kunciBulat = target.pembilang % target.penyebut === 0;
  const sudahBentukKunci = kunciBulat
    ? !adaPembilang || pembilang === 0
    : pecahanSederhana &&
      (kunciCampuran ? adaBulat && bulat > 0 && (!adaPembilang || pembilang < penyebut) : !adaBulat || bulat === 0);
  if (!sudahBentukKunci) {
    return { status: 'benar', pesan: `Bentuk paling sederhananya ${bentukSederhana(target, kunciCampuran)}.` };
  }
  return { status: 'benar' };
}

/** Cocokkan urutan kartu dengan kunci. */
export function periksaUrutan(jawaban: string[], kunci: string[]): HasilPeriksa {
  if (jawaban.length < kunci.length) return { status: 'kosong' };
  return jawaban.every((x, i) => x === kunci[i]) ? { status: 'benar' } : { status: 'salah' };
}
