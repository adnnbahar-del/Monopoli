/**
 * Engine Pecahan Murni (Pure TypeScript Engine)
 * Menangani operasi aritmetika dan relasi pecahan untuk materi Kelas V SD.
 */

export interface PecahanObj {
  pembilang: number;
  penyebut: number;
}

/**
 * Mencari Faktor Persekutuan Terbesar (FPB) dua bilangan bulat positif.
 */
export function hitungFPB(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x === 0 ? 1 : x;
}

/**
 * Mencari Kelipatan Persekutuan Terkecil (KPK) dua bilangan bulat positif.
 */
export function hitungKPK(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));
  return Math.abs((x * y) / hitungFPB(x, y));
}

/**
 * Menyederhanakan pecahan menjadi bentuk paling sederhana.
 */
export function sederhanakan(p: PecahanObj): PecahanObj {
  if (p.penyebut === 0) {
    throw new Error('Penyebut tidak boleh bernilai nol!');
  }
  if (p.pembilang === 0) {
    return { pembilang: 0, penyebut: 1 };
  }

  let pembilang = p.pembilang;
  let penyebut = p.penyebut;

  if (penyebut < 0) {
    pembilang = -pembilang;
    penyebut = -penyebut;
  }

  const fpb = hitungFPB(pembilang, penyebut);
  return {
    pembilang: Math.round(pembilang / fpb),
    penyebut: Math.round(penyebut / fpb)
  };
}

/**
 * Parsing string pecahan ke objek PecahanObj.
 * Mendukung format:
 * - "a/b" -> misal "3/4"
 * - "c a/b" -> pecahan campuran, misal "1 1/2" = 3/2
 * - "n" -> bilangan bulat, misal "2" = 2/1
 * - desimal -> misal "0.5" -> 1/2
 */
export function parsePecahan(input: string | number): PecahanObj {
  if (typeof input === 'number') {
    if (Number.isInteger(input)) {
      return { pembilang: input, penyebut: 1 };
    }
    // Konversi desimal sederhana
    const s = input.toString();
    const decimalPlaces = s.split('.')[1]?.length || 0;
    const factor = Math.pow(10, decimalPlaces);
    return sederhanakan({ pembilang: Math.round(input * factor), penyebut: factor });
  }

  const clean = input.trim();

  // Format pecahan campuran "1 1/2" atau "1_1/2"
  const campuranMatch = clean.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (campuranMatch) {
    const bulat = parseInt(campuranMatch[1], 10);
    const pemb = parseInt(campuranMatch[2], 10);
    const peny = parseInt(campuranMatch[3], 10);
    if (peny === 0) throw new Error('Penyebut tidak boleh nol!');
    const totalPemb = bulat >= 0 ? bulat * peny + pemb : bulat * peny - pemb;
    return sederhanakan({ pembilang: totalPemb, penyebut: peny });
  }

  // Format pecahan biasa "a/b"
  const pecahanMatch = clean.match(/^(-?\d+)\/(-?\d+)$/);
  if (pecahanMatch) {
    const pemb = parseInt(pecahanMatch[1], 10);
    const peny = parseInt(pecahanMatch[2], 10);
    if (peny === 0) throw new Error('Penyebut tidak boleh nol!');
    return sederhanakan({ pembilang: pemb, penyebut: peny });
  }

  // Format angka tunggal "5"
  const bulatMatch = clean.match(/^(-?\d+)$/);
  if (bulatMatch) {
    return { pembilang: parseInt(bulatMatch[1], 10), penyebut: 1 };
  }

  // Format angka desimal "0.75"
  const desimal = parseFloat(clean);
  if (!isNaN(desimal)) {
    return parsePecahan(desimal);
  }

  throw new Error(`Format pecahan tidak valid: "${input}"`);
}

/**
 * Menjumlahkan dua pecahan (a/b + c/d).
 */
export function jumlahPecahan(p1: PecahanObj | string, p2: PecahanObj | string): PecahanObj {
  const o1 = typeof p1 === 'string' ? parsePecahan(p1) : p1;
  const o2 = typeof p2 === 'string' ? parsePecahan(p2) : p2;

  const kpk = hitungKPK(o1.penyebut, o2.penyebut);
  const pembilangTotal = (o1.pembilang * (kpk / o1.penyebut)) + (o2.pembilang * (kpk / o2.penyebut));

  return sederhanakan({ pembilang: pembilangTotal, penyebut: kpk });
}

/**
 * Mengurangkan dua pecahan (a/b - c/d).
 */
export function kurangPecahan(p1: PecahanObj | string, p2: PecahanObj | string): PecahanObj {
  const o1 = typeof p1 === 'string' ? parsePecahan(p1) : p1;
  const o2 = typeof p2 === 'string' ? parsePecahan(p2) : p2;

  const kpk = hitungKPK(o1.penyebut, o2.penyebut);
  const pembilangTotal = (o1.pembilang * (kpk / o1.penyebut)) - (o2.pembilang * (kpk / o2.penyebut));

  return sederhanakan({ pembilang: pembilangTotal, penyebut: kpk });
}

/**
 * Mengalikan dua pecahan (a/b * c/d).
 */
export function kaliPecahan(p1: PecahanObj | string, p2: PecahanObj | string): PecahanObj {
  const o1 = typeof p1 === 'string' ? parsePecahan(p1) : p1;
  const o2 = typeof p2 === 'string' ? parsePecahan(p2) : p2;

  return sederhanakan({
    pembilang: o1.pembilang * o2.pembilang,
    penyebut: o1.penyebut * o2.penyebut
  });
}

/**
 * Membagi dua pecahan (a/b : c/d).
 */
export function bagiPecahan(p1: PecahanObj | string, p2: PecahanObj | string): PecahanObj {
  const o1 = typeof p1 === 'string' ? parsePecahan(p1) : p1;
  const o2 = typeof p2 === 'string' ? parsePecahan(p2) : p2;

  if (o2.pembilang === 0) {
    throw new Error('Tidak bisa membagi dengan pecahan bernilai nol!');
  }

  return sederhanakan({
    pembilang: o1.pembilang * o2.penyebut,
    penyebut: o1.penyebut * o2.pembilang
  });
}

/**
 * Membandingkan dua pecahan.
 * Mengembalikan:
 * -1 jika p1 < p2
 *  0 jika p1 === p2 (pecahan senilai)
 *  1 jika p1 > p2
 */
export function bandingkanPecahan(p1: PecahanObj | string, p2: PecahanObj | string): -1 | 0 | 1 {
  const o1 = typeof p1 === 'string' ? parsePecahan(p1) : p1;
  const o2 = typeof p2 === 'string' ? parsePecahan(p2) : p2;

  const nilai1 = o1.pembilang * o2.penyebut;
  const nilai2 = o2.pembilang * o1.penyebut;

  if (nilai1 < nilai2) return -1;
  if (nilai1 > nilai2) return 1;
  return 0;
}

/**
 * Cek apakah dua pecahan senilai.
 */
export function apakahSenilai(p1: PecahanObj | string, p2: PecahanObj | string): boolean {
  return bandingkanPecahan(p1, p2) === 0;
}

/**
 * Mengurutkan array pecahan dari terkecil ke terbesar (ascending)
 * atau sebaliknya (descending).
 */
export function urutkanPecahan(
  daftar: (PecahanObj | string)[],
  arah: 'asc' | 'desc' = 'asc'
): PecahanObj[] {
  const parsed = daftar.map(item => (typeof item === 'string' ? parsePecahan(item) : item));
  return parsed.sort((a, b) => {
    const comp = bandingkanPecahan(a, b);
    return arah === 'asc' ? comp : -comp;
  });
}

/**
 * Mengubah PecahanObj ke representasi string "a/b" atau bilangan bulat jika penyebut = 1.
 */
export function formatPecahan(p: PecahanObj): string {
  if (p.penyebut === 1) return `${p.pembilang}`;
  return `${p.pembilang}/${p.penyebut}`;
}

/**
 * Mengubah ke pecahan campuran string jika pembilang > penyebut, misal "7/4" -> "1 3/4".
 */
export function formatCampuran(p: PecahanObj): string {
  const sed = sederhanakan(p);
  if (sed.penyebut === 1) return `${sed.pembilang}`;
  if (Math.abs(sed.pembilang) < sed.penyebut) {
    return `${sed.pembilang}/${sed.penyebut}`;
  }
  const bulat = Math.floor(sed.pembilang / sed.penyebut);
  const sisa = sed.pembilang % sed.penyebut;
  return sisa === 0 ? `${bulat}` : `${bulat} ${sisa}/${sed.penyebut}`;
}

/**
 * Menghitung nilai desimal dari pecahan.
 */
export function toDesimal(p: PecahanObj | string): number {
  const o = typeof p === 'string' ? parsePecahan(p) : p;
  return o.pembilang / o.penyebut;
}
