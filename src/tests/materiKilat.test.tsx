import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { periksaIsian, periksaUrutan, parseKunci } from '../engine/kuisMateri';
import { renderPecahan, teksLisan } from '../components/materi/PecahanText';
import { MATERI_KILAT } from '../data/materiKilatData';
import { tpSelesai } from '../hooks/useProgresMateri';

const nilai = (token: string) => {
  const r = parseKunci(token.replace(/[{}]/g, ''));
  return r.pembilang / r.penyebut;
};

describe('Aturan kuis "Ayo coba"', () => {
  it('jawaban kosong ditolak', () => {
    expect(periksaIsian('pecahan', {}, '2/6').status).toBe('kosong');
    expect(periksaIsian('pecahan', { pembilang: '2' }, '2/6').status).toBe('kosong');
    expect(periksaIsian('angka', { angka: '' }, '3').status).toBe('kosong');
    expect(periksaUrutan(['{1/2}'], ['{1/2}', '{2/5}', '{3/10}']).status).toBe('kosong');
  });

  it('jawaban senilai diterima bila tidak diminta bentuk paling sederhana', () => {
    expect(periksaIsian('pecahan', { pembilang: '1', penyebut: '3' }, '2/6').status).toBe('benar');
    expect(periksaIsian('pecahan', { pembilang: '3', penyebut: '6' }, '1/2').status).toBe('benar');
  });

  it('bentuk paling sederhana: belum disederhanakan → "Hampir! Sederhanakan lagi."', () => {
    const h = periksaIsian('pecahan', { pembilang: '4', penyebut: '6' }, '2/3', 'sederhana');
    expect(h.status).toBe('hampir');
    expect(h.pesan).toBe('Hampir! Sederhanakan lagi.');
    expect(periksaIsian('pecahan', { pembilang: '2', penyebut: '3' }, '2/3', 'sederhana').status).toBe('benar');
  });

  it('TP6: 8/6 dan 4/3 diterima untuk 1 1/3 dengan pesan bentuk sederhana', () => {
    for (const [p, q] of [['8', '6'], ['4', '3']]) {
      const h = periksaIsian('campuran', { pembilang: p, penyebut: q }, '1 1/3');
      expect(h.status).toBe('benar');
      expect(h.pesan).toBe('Bentuk paling sederhananya {1 1/3}.');
    }
    expect(periksaIsian('campuran', { bulat: '1', pembilang: '1', penyebut: '3' }, '1 1/3')).toEqual({ status: 'benar' });
  });

  it('TP5: wajib pecahan campuran', () => {
    expect(periksaIsian('campuran', { pembilang: '9', penyebut: '4' }, '2 1/4', 'campuran').status).toBe('hampir');
    expect(periksaIsian('campuran', { bulat: '2', pembilang: '1', penyebut: '4' }, '2 1/4', 'campuran').status).toBe('benar');
  });

  it('TP9: jawaban bilangan bulat "1 m" di kotak bulat', () => {
    expect(periksaIsian('campuran', { bulat: '1' }, '1')).toEqual({ status: 'benar' });
  });

  it('penyebut 0 dan jawaban salah', () => {
    expect(periksaIsian('pecahan', { pembilang: '1', penyebut: '0' }, '1/2').pesan).toBe('Penyebut tidak boleh 0.');
    expect(periksaIsian('pecahan', { pembilang: '2', penyebut: '5' }, '1/2').status).toBe('salah');
    expect(periksaIsian('angka', { angka: '4' }, '3').status).toBe('salah');
  });
});

describe('Pecahan bersusun dari penanda teks', () => {
  it('mengubah {3/8}, {1 3/4}, dan ekspresi menjadi pecahan bersusun', () => {
    const { container } = render(<p>{renderPecahan('Makan {3/8}, sisa {1 3/4}, dan {3×2/4×2} = {6/8}.')}</p>);
    const pecahan = container.querySelectorAll('.pecahan-teks');
    expect(pecahan).toHaveLength(4);
    expect(pecahan[0].getAttribute('aria-label')).toBe('tiga per delapan');
    expect(pecahan[1].querySelector('.pecahan-teks-bulat')?.textContent).toBe('1');
    expect(pecahan[1].getAttribute('aria-label')).toBe('satu tiga per empat');
    expect(pecahan[2].querySelector('.pecahan-teks-atas')?.textContent).toBe('3×2');
    expect(container.textContent).not.toContain('{');
  });

  it('teks lisan untuk tombol Dengarkan', () => {
    expect(teksLisan('{3/8} dibaca')).toBe('tiga per delapan dibaca');
  });
});

describe('Data Materi Kilat (9 TP) lengkap & benar secara matematis', () => {
  it('ada 9 TP berurutan dengan judul pendek sesuai struktur', () => {
    expect(MATERI_KILAT.map((t) => t.judulPendek)).toEqual([
      'Kenal', 'Senilai', 'Banding', 'Urut', 'Campuran', 'Jumlah', 'Kurang', 'Operasi Campuran', 'Soal Cerita',
    ]);
    MATERI_KILAT.forEach((t, i) => expect(t.nomor).toBe(i + 1));
  });

  it.each(MATERI_KILAT.map((t) => [t.id, t] as const))('%s punya semua bagian', (_id, t) => {
    expect(t.tujuan.length).toBeGreaterThan(10);
    expect(t.konsep.length).toBeGreaterThan(0);
    expect(t.konsep.length).toBeLessThanOrEqual(4);
    expect(t.langkah.length).toBeGreaterThan(0);
    expect(t.contohNyata.kalimatMatematika).toBeTruthy();
    expect(t.awasKeliru.salah && t.awasKeliru.benar).toBeTruthy();
    expect(t.ayoCoba.filter((s) => !s.bonus)).toHaveLength(3);
    expect(t.tips && t.ringkasan).toBeTruthy();
  });

  it('kunci pilihan selalu ada di daftar pilihan & tanda banding benar', () => {
    for (const t of MATERI_KILAT) {
      for (const s of t.ayoCoba) {
        if (s.tipe !== 'pilihan') continue;
        expect(s.pilihan).toContain(s.jawaban);
        const banding = s.soal.match(/^(\{[^}]+\}) … (\{[^}]+\})$/);
        if (banding) {
          const a = nilai(banding[1]);
          const b = nilai(banding[2]);
          expect(s.jawaban).toBe(a < b ? '<' : a > b ? '>' : '=');
        }
      }
    }
  });

  it('kunci "urutkan" benar-benar terurut naik/turun', () => {
    for (const t of MATERI_KILAT) {
      for (const s of t.ayoCoba) {
        if (s.tipe !== 'urutkan') continue;
        expect([...s.jawaban].sort()).toEqual([...s.item].sort());
        const v = s.jawaban.map(nilai);
        for (let i = 1; i < v.length; i++) {
          if (s.arah === 'naik') expect(v[i]).toBeGreaterThan(v[i - 1]);
          else expect(v[i]).toBeLessThan(v[i - 1]);
        }
      }
    }
  });

  it('kunci isian dihitung ulang dari soal operasi', () => {
    const hitung: Record<string, number> = {
      '{2/7} + {3/7} = …': 2 / 7 + 3 / 7,
      '{1/4} + {2/3} = …': 1 / 4 + 2 / 3,
      '{5/6} + {1/2} = … (tulis dalam bentuk pecahan campuran)': 5 / 6 + 1 / 2,
      '{7/9} − {4/9} = … (bentuk paling sederhana)': 7 / 9 - 4 / 9,
      '{2/3} − {1/4} = …': 2 / 3 - 1 / 4,
      '1 − {2/5} = …': 1 - 2 / 5,
      '{2 1/3} + {1 1/2} = …': 7 / 3 + 3 / 2,
      '{4 1/2} − {2 3/4} = …': 9 / 2 - 11 / 4,
      '{1 2/3} + {2/3} = …': 5 / 3 + 2 / 3,
    };
    let dicek = 0;
    for (const t of MATERI_KILAT) {
      for (const s of t.ayoCoba) {
        if (s.tipe === 'isian' && hitung[s.soal] !== undefined) {
          expect(nilai(s.jawaban)).toBeCloseTo(hitung[s.soal], 10);
          dicek++;
        }
      }
    }
    expect(dicek).toBe(Object.keys(hitung).length);
  });

  it('TP dianggap selesai bila 3 soal wajib benar/dibahas (bonus opsional)', () => {
    const tp3 = MATERI_KILAT[2];
    expect(tpSelesai(tp3, { tp3: { 0: 'benar', 1: 'pembahasan' } })).toBe(false);
    expect(tpSelesai(tp3, { tp3: { 0: 'benar', 1: 'pembahasan', 2: 'benar' } })).toBe(true);
  });
});
