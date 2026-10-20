import { describe, it, expect } from 'vitest';
import {
  Siswa,
  bagiTimPolaUlar,
  bagiMejaTurnamen,
  konversiPoinTurnamen,
  hitungPenghargaanTim,
  encodeKodeHasilMeja,
  decodeKodeHasilMeja,
  HasilMejaRingkas
} from '../engine/turnamen';

describe('Engine Turnamen TGT — Pembagian Tim Pola Ular Heterogen', () => {
  const dummySiswa: Siswa[] = [
    { id: 's1', nama: 'Ahmad', kemampuan: 'tinggi' },
    { id: 's2', nama: 'Budi', kemampuan: 'tinggi' },
    { id: 's3', nama: 'Cici', kemampuan: 'tinggi' },
    { id: 's4', nama: 'Dewi', kemampuan: 'tinggi' },
    { id: 's5', nama: 'Eko', kemampuan: 'sedang' },
    { id: 's6', nama: 'Fani', kemampuan: 'sedang' },
    { id: 's7', nama: 'Gilang', kemampuan: 'sedang' },
    { id: 's8', nama: 'Hani', kemampuan: 'sedang' },
    { id: 's9', nama: 'Indah', kemampuan: 'rendah' },
    { id: 's10', nama: 'Joko', kemampuan: 'rendah' },
    { id: 's11', nama: 'Kiki', kemampuan: 'rendah' },
    { id: 's12', nama: 'Lia', kemampuan: 'rendah' },
  ];

  it('membagi siswa ke dalam 4 tim heterogen secara seimbang', () => {
    const timHasil = bagiTimPolaUlar(dummySiswa, 4);
    expect(timHasil.length).toBe(4);

    // Masing-masing tim mendapat 3 siswa (1 tinggi, 1 sedang, 1 rendah)
    timHasil.forEach((tim) => {
      expect(tim.anggotaIds.length).toBe(3);
    });

    // Cek pola ular pada baris pertama (s1->t1, s2->t2, s3->t3, s4->t4)
    expect(timHasil[0].anggotaIds).toContain('s1');
    expect(timHasil[1].anggotaIds).toContain('s2');
    expect(timHasil[2].anggotaIds).toContain('s3');
    expect(timHasil[3].anggotaIds).toContain('s4');

    // Baris kedua berbalik (s5->t4, s6->t3, s7->t2, s8->t1)
    expect(timHasil[3].anggotaIds).toContain('s5');
    expect(timHasil[2].anggotaIds).toContain('s6');
    expect(timHasil[1].anggotaIds).toContain('s7');
    expect(timHasil[0].anggotaIds).toContain('s8');
  });
});

describe('Engine Turnamen TGT — Pembagian Meja Homogen & Anti-Bentrok Tim', () => {
  const dummySiswa: Siswa[] = [
    { id: 's1', nama: 'Ahmad', kemampuan: 'tinggi' },
    { id: 's2', nama: 'Budi', kemampuan: 'tinggi' },
    { id: 's3', nama: 'Cici', kemampuan: 'tinggi' },
    { id: 's4', nama: 'Dewi', kemampuan: 'tinggi' },
    { id: 's5', nama: 'Eko', kemampuan: 'sedang' },
    { id: 's6', nama: 'Fani', kemampuan: 'sedang' },
    { id: 's7', nama: 'Gilang', kemampuan: 'sedang' },
    { id: 's8', nama: 'Hani', kemampuan: 'sedang' },
    { id: 's9', nama: 'Indah', kemampuan: 'rendah' },
    { id: 's10', nama: 'Joko', kemampuan: 'rendah' },
    { id: 's11', nama: 'Kiki', kemampuan: 'rendah' },
    { id: 's12', nama: 'Lia', kemampuan: 'rendah' },
  ];

  it('membagi meja turnamen dengan paket soal A, B, C berurutan', () => {
    const timList = bagiTimPolaUlar(dummySiswa, 4);
    const mejaList = bagiMejaTurnamen(dummySiswa, timList, 4);

    expect(mejaList.length).toBe(3);
    expect(mejaList[0].paketSoal).toBe('A');
    expect(mejaList[1].paketSoal).toBe('B');
    expect(mejaList[2].paketSoal).toBe('C');

    // Pastikan tidak ada 2 anggota tim yang sama di Meja 1
    const anggotaMeja1 = mejaList[0].anggotaIds;
    const timMeja1 = anggotaMeja1.map((sid) =>
      timList.find((t) => t.anggotaIds.includes(sid))?.id
    );
    const uniqueTim = new Set(timMeja1);
    expect(uniqueTim.size).toBe(anggotaMeja1.length);
  });
});

describe('Engine Turnamen TGT — Konversi Poin Turnamen', () => {
  it('mengonversi skor 4 pemain tanpa seri menjadi 60, 40, 30, 20', () => {
    const pemain = [
      { siswaId: 's1', totalSkor: 120 },
      { siswaId: 's2', totalSkor: 90 },
      { siswaId: 's3', totalSkor: 70 },
      { siswaId: 's4', totalSkor: 40 }
    ];

    const hasil = konversiPoinTurnamen(pemain);
    expect(hasil[0]).toEqual({ siswaId: 's1', peringkat: 1, poinTurnamen: 60 });
    expect(hasil[1]).toEqual({ siswaId: 's2', peringkat: 2, poinTurnamen: 40 });
    expect(hasil[2]).toEqual({ siswaId: 's3', peringkat: 3, poinTurnamen: 30 });
    expect(hasil[3]).toEqual({ siswaId: 's4', peringkat: 4, poinTurnamen: 20 });
  });

  it('mengonversi skor 3 pemain tanpa seri menjadi 60, 40, 20', () => {
    const pemain = [
      { siswaId: 's1', totalSkor: 100 },
      { siswaId: 's2', totalSkor: 80 },
      { siswaId: 's3', totalSkor: 50 }
    ];

    const hasil = konversiPoinTurnamen(pemain);
    expect(hasil[0]).toEqual({ siswaId: 's1', peringkat: 1, poinTurnamen: 60 });
    expect(hasil[1]).toEqual({ siswaId: 's2', peringkat: 2, poinTurnamen: 40 });
    expect(hasil[2]).toEqual({ siswaId: 's3', peringkat: 3, poinTurnamen: 20 });
  });

  it('menangani kasus seri peringkat 1 pada 4 pemain: (60 + 40)/2 = 50 poin', () => {
    const pemain = [
      { siswaId: 's1', totalSkor: 100 },
      { siswaId: 's2', totalSkor: 100 }, // seri di peringkat 1
      { siswaId: 's3', totalSkor: 70 },
      { siswaId: 's4', totalSkor: 50 }
    ];

    const hasil = konversiPoinTurnamen(pemain);
    expect(hasil[0].poinTurnamen).toBe(50);
    expect(hasil[1].poinTurnamen).toBe(50);
    expect(hasil[0].peringkat).toBe(1);
    expect(hasil[1].peringkat).toBe(1);
    expect(hasil[2].poinTurnamen).toBe(30);
    expect(hasil[3].poinTurnamen).toBe(20);
  });

  it('menangani kasus seri peringkat 2 dan 3: (40 + 30)/2 = 35 poin', () => {
    const pemain = [
      { siswaId: 's1', totalSkor: 120 },
      { siswaId: 's2', totalSkor: 85 }, // seri
      { siswaId: 's3', totalSkor: 85 }, // seri
      { siswaId: 's4', totalSkor: 40 }
    ];

    const hasil = konversiPoinTurnamen(pemain);
    expect(hasil[0].poinTurnamen).toBe(60);
    expect(hasil[1].poinTurnamen).toBe(35);
    expect(hasil[2].poinTurnamen).toBe(35);
    expect(hasil[3].poinTurnamen).toBe(20);
  });

  it('menangani kasus seri 3 pemain di peringkat 1: (60 + 40 + 30)/3 = 43.33 poin', () => {
    const pemain = [
      { siswaId: 's1', totalSkor: 90 },
      { siswaId: 's2', totalSkor: 90 },
      { siswaId: 's3', totalSkor: 90 },
      { siswaId: 's4', totalSkor: 50 }
    ];

    const hasil = konversiPoinTurnamen(pemain);
    expect(hasil[0].poinTurnamen).toBe(43.33);
    expect(hasil[1].poinTurnamen).toBe(43.33);
    expect(hasil[2].poinTurnamen).toBe(43.33);
    expect(hasil[3].poinTurnamen).toBe(20);
  });
});

describe('Engine Turnamen TGT — Predikat Penghargaan Tim', () => {
  it('menentukan predikat Super Team (>= 50), Great Team (45-49), dan Good Team (40-44)', () => {
    const dummyTim = {
      id: 't1',
      nama: 'Tim Merah',
      warna: '#E5484D',
      bentuk: 'diamond' as const,
      anggotaIds: ['s1', 's2', 's3']
    };

    // Rata-rata 55 -> Super Team
    const skorSuper = [
      { siswaId: 's1', poinTurnamen: 60 },
      { siswaId: 's2', poinTurnamen: 60 },
      { siswaId: 's3', poinTurnamen: 45 }
    ];
    expect(hitungPenghargaanTim(dummyTim, skorSuper).predikat).toBe('Super Team');

    // Rata-rata 46.67 -> Great Team
    const skorGreat = [
      { siswaId: 's1', poinTurnamen: 50 },
      { siswaId: 's2', poinTurnamen: 50 },
      { siswaId: 's3', poinTurnamen: 40 }
    ];
    expect(hitungPenghargaanTim(dummyTim, skorGreat).predikat).toBe('Great Team');

    // Rata-rata 40 -> Good Team
    const skorGood = [
      { siswaId: 's1', poinTurnamen: 40 },
      { siswaId: 's2', poinTurnamen: 40 },
      { siswaId: 's3', poinTurnamen: 40 }
    ];
    expect(hitungPenghargaanTim(dummyTim, skorGood).predikat).toBe('Good Team');
  });
});

describe('Engine Turnamen TGT — Kode Hasil Meja & QR Serialisasi', () => {
  it('berhasil melakukan encoding dan decoding kode hasil meja', () => {
    const dataMeja: HasilMejaRingkas = {
      mejaId: 'meja-1',
      nomorMeja: 1,
      skorPemain: [
        { siswaId: 's1', timId: 't1', poinTurnamen: 60 },
        { siswaId: 's2', timId: 't2', poinTurnamen: 40 },
        { siswaId: 's3', timId: 't3', poinTurnamen: 30 },
        { siswaId: 's4', timId: 't4', poinTurnamen: 20 }
      ]
    };

    const kode = encodeKodeHasilMeja(dataMeja);
    expect(typeof kode).toBe('string');
    expect(kode.length).toBeGreaterThan(10);

    const decoded = decodeKodeHasilMeja(kode);
    expect(decoded).toEqual(dataMeja);
  });
});
