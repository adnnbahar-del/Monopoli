import { BentukTim } from '../components/Bidak';

export type Kemampuan = 'tinggi' | 'sedang' | 'rendah';
export type PredikatTim = 'Super Team' | 'Great Team' | 'Good Team';

export interface Siswa {
  id: string;
  nama: string;
  kemampuan: Kemampuan;
  timId?: string;
  mejaId?: string;
}

export interface TimTurnamen {
  id: string;
  nama: string;
  warna: string;
  bentuk: BentukTim;
  anggotaIds: string[];
  totalPoinTurnamen?: number;
  rataRataPoin?: number;
  predikat?: PredikatTim;
}

export interface MejaTurnamen {
  id: string;
  nomor: number;
  nama: string;
  tingkatKemampuan: Kemampuan;
  paketSoal: 'A' | 'B' | 'C';
  anggotaIds: string[];
  selesai?: boolean;
}

export interface SkorPemainTurnamen {
  siswaId: string;
  nama: string;
  timId: string;
  poinMonopoli: number;
  poinDuel: number;
  totalPoinSiswa: number;
  peringkatMeja?: number;
  poinTurnamen: number;
}

export interface HasilMejaRingkas {
  mejaId: string;
  nomorMeja: number;
  skorPemain: {
    siswaId: string;
    timId: string;
    poinTurnamen: number;
  }[];
}

export const TIM_DEFAULT: TimTurnamen[] = [
  { id: 't1', nama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond', anggotaIds: [] },
  { id: 't2', nama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle', anggotaIds: [] },
  { id: 't3', nama: 'Tim Hijau', warna: '#22A55B', bentuk: 'triangle', anggotaIds: [] },
  { id: 't4', nama: 'Tim Oranye', warna: '#F08C00', bentuk: 'square', anggotaIds: [] },
  { id: 't5', nama: 'Tim Ungu', warna: '#8E4EC6', bentuk: 'star', anggotaIds: [] },
];

/**
 * Nilai numerik bobot kemampuan untuk pengurutan
 */
export const BOBOT_KEMAMPUAN: Record<Kemampuan, number> = {
  tinggi: 3,
  sedang: 2,
  rendah: 1
};

/**
 * Pembagian Tim Heterogen menggunakan Pola Ular (Snake Pattern Distribution).
 * Urutkan siswa berdasarkan kemampuan (Tinggi -> Rendah),
 * lalu sebarkan ke tim secara bolak-balik:
 * Baris 1: Tim 1, 2, 3, 4
 * Baris 2: Tim 4, 3, 2, 1
 * Baris 3: Tim 1, 2, 3, 4 ...
 */
export function bagiTimPolaUlar(
  daftarSiswa: Siswa[],
  jumlahTim: number = 4
): TimTurnamen[] {
  if (daftarSiswa.length === 0) return [];

  // 1. Urutkan siswa: Tinggi -> Sedang -> Rendah
  const siswaUrut = [...daftarSiswa].sort((a, b) => {
    return BOBOT_KEMAMPUAN[b.kemampuan] - BOBOT_KEMAMPUAN[a.kemampuan];
  });

  // 2. Siapkan tim
  const timHasil: TimTurnamen[] = TIM_DEFAULT.slice(0, jumlahTim).map((t) => ({
    ...t,
    anggotaIds: []
  }));

  // 3. Distribusi pola ular
  let indexTim = 0;
  let arahMaju = true;

  for (const s of siswaUrut) {
    timHasil[indexTim].anggotaIds.push(s.id);

    if (arahMaju) {
      if (indexTim === jumlahTim - 1) {
        arahMaju = false;
      } else {
        indexTim++;
      }
    } else {
      if (indexTim === 0) {
        arahMaju = true;
      } else {
        indexTim--;
      }
    }
  }

  return timHasil;
}

/**
 * Pembagian Meja Turnamen Homogen Kemampuan (3-4 siswa per meja)
 * dengan syarat: dalam satu meja tidak boleh ada dua anggota dari tim yang sama.
 */
export function bagiMejaTurnamen(
  daftarSiswa: Siswa[],
  daftarTim: TimTurnamen[],
  ukuranMeja: number = 4
): MejaTurnamen[] {
  if (daftarSiswa.length === 0) return [];

  // Peta siswa ke timId
  const siswaTimMap = new Map<string, string>();
  daftarTim.forEach((t) => {
    t.anggotaIds.forEach((sid) => siswaTimMap.set(sid, t.id));
  });

  // Kelompokkan siswa berdasarkan tingkat kemampuan
  const tinggi = daftarSiswa.filter((s) => s.kemampuan === 'tinggi');
  const sedang = daftarSiswa.filter((s) => s.kemampuan === 'sedang');
  const rendah = daftarSiswa.filter((s) => s.kemampuan === 'rendah');

  // Urutkan kumpulan siswa: Tinggi, lalu Sedang, lalu Rendah
  const terurut = [...tinggi, ...sedang, ...rendah];

  const totalMeja = Math.ceil(terurut.length / ukuranMeja);
  const paketList: ('A' | 'B' | 'C')[] = ['A', 'B', 'C'];

  // Kapasitas tiap meja dibuat seimbang (mis. 13 siswa → 4/3/3/3, bukan 4/4/4/1)
  // agar tidak ada meja turnamen yang hanya berisi 1 siswa.
  const dasar = Math.floor(terurut.length / totalMeja);
  const sisa = terurut.length % totalMeja;
  const kapasitas = Array.from({ length: totalMeja }, (_, m) => dasar + (m < sisa ? 1 : 0));

  const mejaHasil: MejaTurnamen[] = [];
  for (let m = 0; m < totalMeja; m++) {
    mejaHasil.push({
      id: `meja-${m + 1}`,
      nomor: m + 1,
      nama: `Meja ${m + 1}`,
      tingkatKemampuan: m === 0 ? 'tinggi' : m === totalMeja - 1 ? 'rendah' : 'sedang',
      paketSoal: paketList[m % 3],
      anggotaIds: []
    });
  }

  // Isi meja secara berurutan dan selesaikan bentrok tim jika ada anggota dari tim yang sama
  for (const siswa of terurut) {
    const timSiswa = siswaTimMap.get(siswa.id);
    let ditempatkan = false;

    // Cari meja yang belum penuh dan belum memiliki anggota dari tim yang sama
    for (const [m, meja] of mejaHasil.entries()) {
      if (meja.anggotaIds.length < kapasitas[m]) {
        const adaBentrok = meja.anggotaIds.some(
          (idSudah) => siswaTimMap.get(idSudah) === timSiswa
        );
        if (!adaBentrok) {
          meja.anggotaIds.push(siswa.id);
          ditempatkan = true;
          break;
        }
      }
    }

    // Jika semua meja bentrok atau penuh, masukkan ke meja yang masih punya tempat
    // (paling sedikit anggotanya), agar kapasitas seimbang tetap terjaga
    if (!ditempatkan) {
      const mejaTersedia =
        mejaHasil
          .map((meja, m) => ({ meja, m }))
          .filter(({ meja, m }) => meja.anggotaIds.length < kapasitas[m])
          .sort((a, b) => a.meja.anggotaIds.length - b.meja.anggotaIds.length)[0]?.meja ??
        [...mejaHasil].sort((a, b) => a.anggotaIds.length - b.anggotaIds.length)[0];
      if (mejaTersedia) {
        mejaTersedia.anggotaIds.push(siswa.id);
      }
    }
  }

  perbaikiBentrokMeja(mejaHasil, siswaTimMap);
  return mejaHasil;
}

/**
 * Penempatan berurutan bisa menyisakan meja berisi dua anggota tim yang sama
 * padahal susunan tanpa bentrok masih mungkin. Tukar siswa yang bentrok dengan
 * siswa di meja lain (meja terdekat lebih dulu agar kemampuan tetap setara),
 * selama penukaran tidak menimbulkan bentrok baru.
 */
function perbaikiBentrokMeja(mejaList: MejaTurnamen[], siswaTimMap: Map<string, string>) {
  const timDari = (id: string) => siswaTimMap.get(id);
  const adaTim = (meja: MejaTurnamen, tim: string | undefined, kecuali: string) =>
    tim !== undefined && meja.anggotaIds.some((id) => id !== kecuali && timDari(id) === tim);

  for (let putaran = 0; putaran < mejaList.length * 4; putaran++) {
    let adaPerubahan = false;

    for (let a = 0; a < mejaList.length; a++) {
      const mejaA = mejaList[a];
      // Cari anggota yang timnya sudah ada di meja ini
      const bentrok = mejaA.anggotaIds.find((id, idx) =>
        mejaA.anggotaIds.findIndex((lain) => timDari(lain) === timDari(id)) !== idx
      );
      if (!bentrok) continue;
      const timBentrok = timDari(bentrok);

      // Meja lain diurutkan dari yang terdekat
      const urutan = mejaList
        .map((_, i) => i)
        .filter((i) => i !== a)
        .sort((x, y) => Math.abs(x - a) - Math.abs(y - a));

      tukar: for (const b of urutan) {
        const mejaB = mejaList[b];
        if (adaTim(mejaB, timBentrok, '')) continue; // meja B sudah punya tim yang sama
        for (const calon of mejaB.anggotaIds) {
          // calon pindah ke meja A tanpa bentrok (selain dengan siswa yang ditukar)
          if (adaTim(mejaA, timDari(calon), bentrok)) continue;
          mejaA.anggotaIds = mejaA.anggotaIds.map((id) => (id === bentrok ? calon : id));
          mejaB.anggotaIds = mejaB.anggotaIds.map((id) => (id === calon ? bentrok : id));
          adaPerubahan = true;
          break tukar;
        }
      }
    }

    if (!adaPerubahan) break;
  }
}

/**
 * Konversi Poin Turnamen TGT
 * - 4 pemain: 60 / 40 / 30 / 20
 * - 3 pemain: 60 / 40 / 20
 * - Penanganan Seri: Rata-rata poin dari peringkat yang ditempati bersama.
 */
export function konversiPoinTurnamen(
  pemainMeja: { siswaId: string; totalSkor: number }[]
): { siswaId: string; peringkat: number; poinTurnamen: number }[] {
  const n = pemainMeja.length;
  if (n === 0) return [];

  const tabelPoin = n === 3 ? [60, 40, 20] : [60, 40, 30, 20];

  // Urutkan siswa dari skor total tertinggi ke terendah
  const terurut = [...pemainMeja].sort((a, b) => b.totalSkor - a.totalSkor);

  const hasil: { siswaId: string; peringkat: number; poinTurnamen: number }[] = [];
  let i = 0;

  while (i < n) {
    // Cari semua pemain yang memiliki skor sama (seri)
    let j = i;
    while (j < n && terurut[j].totalSkor === terurut[i].totalSkor) {
      j++;
    }

    // Pemain dari indeks i sampai j-1 memiliki skor sama
    const jumlahSeri = j - i;
    let totalPoinJatah = 0;

    for (let k = i; k < j; k++) {
      totalPoinJatah += tabelPoin[k] !== undefined ? tabelPoin[k] : 20;
    }

    // Rata-rata poin dibagi sama rata dan dibulatkan 2 desimal
    const rataPoin = Math.round((totalPoinJatah / jumlahSeri) * 100) / 100;
    const peringkatBersama = i + 1;

    for (let k = i; k < j; k++) {
      hasil.push({
        siswaId: terurut[k].siswaId,
        peringkat: peringkatBersama,
        poinTurnamen: rataPoin
      });
    }

    i = j;
  }

  return hasil;
}

/**
 * Menghitung Penghargaan Tim berdasarkan rata-rata poin turnamen anggota tim:
 * - Super Team: rata-rata ≥ 50
 * - Great Team: 45 - 49
 * - Good Team: 40 - 44 (atau di bawahnya)
 */
export function hitungPenghargaanTim(
  tim: TimTurnamen,
  skorSemuaSiswa: { siswaId: string; poinTurnamen: number }[],
  ambangSuper = 50,
  ambangGreat = 45,
  ambangGood = 40
): { rataRataPoin: number; predikat: PredikatTim } {
  const anggotaPoin = skorSemuaSiswa.filter((s) => tim.anggotaIds.includes(s.siswaId));
  if (anggotaPoin.length === 0) {
    return { rataRataPoin: 0, predikat: 'Good Team' };
  }

  const total = anggotaPoin.reduce((sum, item) => sum + item.poinTurnamen, 0);
  const rata = Math.round((total / anggotaPoin.length) * 100) / 100;

  let predikat: PredikatTim = 'Good Team';
  if (rata >= ambangSuper) {
    predikat = 'Super Team';
  } else if (rata >= ambangGreat) {
    predikat = 'Great Team';
  } else if (rata >= ambangGood) {
    predikat = 'Good Team';
  }

  return { rataRataPoin: rata, predikat };
}

/**
 * Kompresi & Encoding Hasil Meja menjadi Kode Singkat (Base64) untuk Multi-perangkat offline.
 */
export function encodeKodeHasilMeja(data: HasilMejaRingkas): string {
  const jsonStr = JSON.stringify(data);
  return btoa(unescape(encodeURIComponent(jsonStr)));
}

/**
 * Decoding & Dekompresi Kode Hasil Meja dari string teks atau QR.
 */
export function decodeKodeHasilMeja(kode: string): HasilMejaRingkas {
  try {
    const jsonStr = decodeURIComponent(escape(atob(kode.trim())));
    return JSON.parse(jsonStr) as HasilMejaRingkas;
  } catch (e) {
    throw new Error('Kode hasil meja tidak valid atau format salah!');
  }
}
