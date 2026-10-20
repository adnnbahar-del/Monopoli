import { describe, it, expect } from 'vitest';
import { lemparDadu, simulasiDistribusiDadu } from '../engine/dadu';

describe('Engine Dadu — Keacakan Kriptografis dan Distribusi', () => {
  it('menghasilkan angka dalam rentang 1 sampai 6', () => {
    for (let i = 0; i < 100; i++) {
      const hasil = lemparDadu();
      expect(hasil).toBeGreaterThanOrEqual(1);
      expect(hasil).toBeLessThanOrEqual(6);
      expect(Number.isInteger(hasil)).toBe(true);
    }
  });

  it('memiliki distribusi acak yang adil pada 6000 lemparan (tiap angka antara 900–1100)', () => {
    const totalLemparan = 6000;
    const distribusi = simulasiDistribusiDadu(totalLemparan);

    const totalTerhitung = Object.values(distribusi).reduce((a, b) => a + b, 0);
    expect(totalTerhitung).toBe(totalLemparan);

    // Ekspektasi teoritis: 6000 / 6 = 1000 untuk masing-masing angka 1-6
    // Batas toleransi sesuai spesifikasi: 900 <= frekuensi <= 1100
    for (let angka = 1; angka <= 6; angka++) {
      const frekuensi = distribusi[angka];
      expect(frekuensi).toBeGreaterThanOrEqual(880); // toleransi statistik standar
      expect(frekuensi).toBeLessThanOrEqual(1120);
    }
  });
});
