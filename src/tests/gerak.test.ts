import { describe, it, expect } from 'vitest';
import {
  hitungPosisiBaru,
  apakahMelewatiStart,
  buatJalurLangkah,
  prosesGerak,
  POIN_BONUS_START
} from '../engine/gerak';

describe('Engine Gerak — Posisi, Wrap-Around, dan Jalur', () => {
  it('menghitung pergerakan normal tanpa wrap-around', () => {
    expect(hitungPosisiBaru(0, 4)).toBe(4);
    expect(hitungPosisiBaru(7, 5)).toBe(12);
    expect(hitungPosisiBaru(20, 6)).toBe(26);
  });

  it('menghitung pergerakan dengan wrap-around posisi (27 + 3 -> 2)', () => {
    // Sesuai spesifikasi FASE 2: 27 + 3 -> 2
    expect(hitungPosisiBaru(27, 3)).toBe(2);
    expect(hitungPosisiBaru(26, 4)).toBe(2);
    expect(hitungPosisiBaru(25, 5)).toBe(2);
    expect(hitungPosisiBaru(27, 1)).toBe(0); // Tepat mendarat di START
  });

  it('mendeteksi kapan bidak melewati atau mendarat di START (posisi 0)', () => {
    // Melewati START
    expect(apakahMelewatiStart(27, 3)).toBe(true);
    expect(apakahMelewatiStart(25, 4)).toBe(true);
    // Tepat mendarat di START
    expect(apakahMelewatiStart(24, 4)).toBe(true);
    expect(apakahMelewatiStart(27, 1)).toBe(true);
    // Tidak melewati START
    expect(apakahMelewatiStart(0, 5)).toBe(false);
    expect(apakahMelewatiStart(10, 6)).toBe(false);
    expect(apakahMelewatiStart(20, 5)).toBe(false);
  });

  it('menghasilkan urutan petak jalur langkah demi langkah dengan tepat', () => {
    // Dari posisi 27, langkah 3 -> jalur = [0, 1, 2]
    const jalur = buatJalurLangkah(27, 3);
    expect(jalur).toEqual([0, 1, 2]);

    // Dari posisi 5, langkah 4 -> jalur = [6, 7, 8, 9]
    expect(buatJalurLangkah(5, 4)).toEqual([6, 7, 8, 9]);
  });

  it('memproses satu siklus gerak lengkap dengan bonus START', () => {
    const hasil = prosesGerak(27, 3);
    expect(hasil.posisiAwal).toBe(27);
    expect(hasil.langkah).toBe(3);
    expect(hasil.posisiAkhir).toBe(2);
    expect(hasil.melewatiStart).toBe(true);
    expect(hasil.bonusPoin).toBe(POIN_BONUS_START);
    expect(hasil.jalurLangkah).toEqual([0, 1, 2]);

    const hasilNormal = prosesGerak(2, 4);
    expect(hasilNormal.posisiAkhir).toBe(6);
    expect(hasilNormal.melewatiStart).toBe(false);
    expect(hasilNormal.bonusPoin).toBe(0);
  });
});
