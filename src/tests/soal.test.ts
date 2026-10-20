import { describe, it, expect } from 'vitest';
import soalData from '../data/soal.json';
import { jumlahPecahan, kurangPecahan, formatPecahan, apakahSenilai } from '../engine/pecahan';
import { Soal } from '../engine/kartu';

const daftarSoal: Soal[] = (soalData.soal as unknown) as Soal[];

describe('Validasi Bank Soal MONOPECA (soal.json)', () => {
  it('memiliki total 47 butir soal terstruktur', () => {
    expect(daftarSoal.length).toBe(47);
  });

  it('setiap soal memiliki ID yang unik', () => {
    const ids = daftarSoal.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('setiap soal memiliki kunci jawaban yang terdapat dalam opsi pilihannya', () => {
    daftarSoal.forEach((soal) => {
      const kunciBersih = soal.kunci.trim();
      const opsiBersih = soal.opsi.map((o) => o.trim());
      expect(
        opsiBersih,
        `Soal ID: ${soal.id} kunci "${kunciBersih}" tidak ditemukan dalam opsi: ${JSON.stringify(opsiBersih)}`
      ).toContain(kunciBersih);
    });
  });

  it('setiap opsi jawaban dalam satu soal tidak boleh ada yang ganda (unik)', () => {
    daftarSoal.forEach((soal) => {
      const uniqueOps = new Set(soal.opsi.map((o) => o.trim()));
      expect(
        uniqueOps.size,
        `Soal ID: ${soal.id} memiliki opsi duplikat: ${JSON.stringify(soal.opsi)}`
      ).toBe(soal.opsi.length);
    });
  });

  it('setiap soal memiliki minimal 3 atau 4 opsi pilihan', () => {
    daftarSoal.forEach((soal) => {
      expect(soal.opsi.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('memvalidasi kebenaran matematis soal hitungan penjumlahan dan pengurangan dengan engine/pecahan.ts', () => {
    daftarSoal.forEach((soal) => {
      // Periksa apakah pertanyaan adalah operasi hitungan misal "1/4 + 1/2 =" atau "3/4 - 1/2 ="
      const plusMatch = soal.pertanyaan.match(/(\d+\/\d+)\s*\+\s*(\d+\/\d+)/);
      if (plusMatch) {
        const p1 = plusMatch[1];
        const p2 = plusMatch[2];
        const hasilEngine = formatPecahan(jumlahPecahan(p1, p2));
        const benarSenilai = apakahSenilai(soal.kunci, hasilEngine);
        expect(
          benarSenilai,
          `Soal penjumlahan ID: ${soal.id} (${p1} + ${p2}): kunci "${soal.kunci}" harus senilai dengan hasil engine "${hasilEngine}"`
        ).toBe(true);
      }

      const minusMatch = soal.pertanyaan.match(/(\d+\/\d+)\s*[−-]\s*(\d+\/\d+)/);
      if (minusMatch) {
        const p1 = minusMatch[1];
        const p2 = minusMatch[2];
        const hasilEngine = formatPecahan(kurangPecahan(p1, p2));
        const benarSenilai = apakahSenilai(soal.kunci, hasilEngine);
        expect(
          benarSenilai,
          `Soal pengurangan ID: ${soal.id} (${p1} - ${p2}): kunci "${soal.kunci}" harus senilai dengan hasil engine "${hasilEngine}"`
        ).toBe(true);
      }
    });
  });

  it('memvalidasi paket turnamen A, B, dan C masing-masing berisi 5 soal dengan pola subtopik dan level yang setara', () => {
    const paketA = daftarSoal.filter((s) => s.tipe === 'turnamen' && s.paket === 'A');
    const paketB = daftarSoal.filter((s) => s.tipe === 'turnamen' && s.paket === 'B');
    const paketC = daftarSoal.filter((s) => s.tipe === 'turnamen' && s.paket === 'C');

    expect(paketA.length, 'Paket A harus berisi 5 butir soal').toBe(5);
    expect(paketB.length, 'Paket B harus berisi 5 butir soal').toBe(5);
    expect(paketC.length, 'Paket C harus berisi 5 butir soal').toBe(5);

    // Periksa kesetaraan level antarpaket
    const levelA = paketA.map((s) => s.level);
    const levelB = paketB.map((s) => s.level);
    const levelC = paketC.map((s) => s.level);

    expect(levelA).toEqual(levelB);
    expect(levelB).toEqual(levelC);

    // Periksa kesetaraan subtopik antarpaket
    const subtopikA = paketA.map((s) => s.subtopik);
    const subtopikB = paketB.map((s) => s.subtopik);
    const subtopikC = paketC.map((s) => s.subtopik);

    expect(subtopikA).toEqual(subtopikB);
    expect(subtopikB).toEqual(subtopikC);
  });
});
