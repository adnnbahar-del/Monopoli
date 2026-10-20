import { describe, it, expect } from 'vitest';
import {
  hitungFPB,
  hitungKPK,
  sederhanakan,
  parsePecahan,
  jumlahPecahan,
  kurangPecahan,
  kaliPecahan,
  bagiPecahan,
  bandingkanPecahan,
  apakahSenilai,
  urutkanPecahan,
  formatPecahan,
  formatCampuran,
  toDesimal
} from '../engine/pecahan';

describe('Engine Pecahan — FPB dan KPK', () => {
  it('menghitung FPB dengan benar', () => {
    expect(hitungFPB(12, 18)).toBe(6);
    expect(hitungFPB(8, 24)).toBe(8);
    expect(hitungFPB(7, 13)).toBe(1);
    expect(hitungFPB(0, 5)).toBe(5);
  });

  it('menghitung KPK dengan benar', () => {
    expect(hitungKPK(4, 6)).toBe(12);
    expect(hitungKPK(3, 5)).toBe(15);
    expect(hitungKPK(8, 12)).toBe(24);
  });
});

describe('Engine Pecahan — Parsing dan Penyederhanaan', () => {
  it('mem-parsing string pecahan biasa "a/b"', () => {
    expect(parsePecahan('3/4')).toEqual({ pembilang: 3, penyebut: 4 });
    expect(parsePecahan('6/8')).toEqual({ pembilang: 3, penyebut: 4 }); // disederhanakan
  });

  it('mem-parsing pecahan campuran "c a/b"', () => {
    expect(parsePecahan('1 1/2')).toEqual({ pembilang: 3, penyebut: 2 });
    expect(parsePecahan('2 3/4')).toEqual({ pembilang: 11, penyebut: 4 });
  });

  it('mem-parsing bilangan bulat', () => {
    expect(parsePecahan('3')).toEqual({ pembilang: 3, penyebut: 1 });
    expect(parsePecahan(5)).toEqual({ pembilang: 5, penyebut: 1 });
  });

  it('menyederhanakan pecahan ke bentuk paling sederhana', () => {
    expect(sederhanakan({ pembilang: 4, penyebut: 8 })).toEqual({ pembilang: 1, penyebut: 2 });
    expect(sederhanakan({ pembilang: 15, penyebut: 25 })).toEqual({ pembilang: 3, penyebut: 5 });
    expect(sederhanakan({ pembilang: 7, penyebut: 11 })).toEqual({ pembilang: 7, penyebut: 11 });
  });

  it('menolak penyebut nol', () => {
    expect(() => parsePecahan('3/0')).toThrowError();
    expect(() => sederhanakan({ pembilang: 2, penyebut: 0 })).toThrowError();
  });
});

describe('Engine Pecahan — Aritmetika', () => {
  it('menjumlahkan pecahan berpenyebut sama', () => {
    const hasil = jumlahPecahan('1/5', '2/5');
    expect(hasil).toEqual({ pembilang: 3, penyebut: 5 });
  });

  it('menjumlahkan pecahan berpenyebut beda', () => {
    // 1/2 + 1/3 = 5/6
    expect(jumlahPecahan('1/2', '1/3')).toEqual({ pembilang: 5, penyebut: 6 });
    // 2/3 + 3/4 = 8/12 + 9/12 = 17/12
    expect(jumlahPecahan('2/3', '3/4')).toEqual({ pembilang: 17, penyebut: 12 });
  });

  it('mengurangkan pecahan berpenyebut beda', () => {
    // 3/4 - 1/2 = 3/4 - 2/4 = 1/4
    expect(kurangPecahan('3/4', '1/2')).toEqual({ pembilang: 1, penyebut: 4 });
    // 5/6 - 1/3 = 5/6 - 2/6 = 3/6 = 1/2
    expect(kurangPecahan('5/6', '1/3')).toEqual({ pembilang: 1, penyebut: 2 });
  });

  it('mengalikan pecahan', () => {
    // 2/3 * 3/4 = 6/12 = 1/2
    expect(kaliPecahan('2/3', '3/4')).toEqual({ pembilang: 1, penyebut: 2 });
  });

  it('membagi pecahan', () => {
    // (1/2) : (1/4) = 4/2 = 2/1
    expect(bagiPecahan('1/2', '1/4')).toEqual({ pembilang: 2, penyebut: 1 });
  });
});

describe('Engine Pecahan — Relasi dan Perbandingan', () => {
  it('membandingkan dua pecahan', () => {
    expect(bandingkanPecahan('1/2', '3/4')).toBe(-1); // 1/2 < 3/4
    expect(bandingkanPecahan('3/4', '1/2')).toBe(1);  // 3/4 > 1/2
    expect(bandingkanPecahan('2/4', '1/2')).toBe(0);  // 2/4 == 1/2
  });

  it('memeriksa pecahan senilai', () => {
    expect(apakahSenilai('2/4', '1/2')).toBe(true);
    expect(apakahSenilai('3/9', '1/3')).toBe(true);
    expect(apakahSenilai('4/5', '8/10')).toBe(true);
    expect(apakahSenilai('2/3', '3/4')).toBe(false);
  });

  it('mengurutkan pecahan dari terkecil ke terbesar', () => {
    const list = ['3/4', '1/2', '2/3', '1/4'];
    const urut = urutkanPecahan(list, 'asc');
    expect(urut.map(formatPecahan)).toEqual(['1/4', '1/2', '2/3', '3/4']);
  });
});

describe('Engine Pecahan — Format & Desimal', () => {
  it('format pecahan ke string', () => {
    expect(formatPecahan({ pembilang: 3, penyebut: 4 })).toBe('3/4');
    expect(formatPecahan({ pembilang: 4, penyebut: 1 })).toBe('4');
  });

  it('format campuran', () => {
    expect(formatCampuran({ pembilang: 7, penyebut: 4 })).toBe('1 3/4');
    expect(formatCampuran({ pembilang: 6, penyebut: 3 })).toBe('2');
  });

  it('konversi ke desimal', () => {
    expect(toDesimal('1/2')).toBe(0.5);
    expect(toDesimal('3/4')).toBe(0.75);
  });
});
