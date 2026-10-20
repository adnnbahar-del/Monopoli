import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import soalData from '../data/soal.json';
import { Soal } from '../engine/kartu';

export interface GuruState {
  pinGuru: string; // default "1234"
  sudahGantiPinAwal: boolean;
  daftarSoal: Soal[];
  kustomNamaKios: Record<number, string>; // index petak -> nama kios kustom
  kustomNamaZona: Record<number, string>; // sisi 1-4 -> nama zona kustom

  // Actions
  verifikasiPin: (inputPin: string) => boolean;
  gantiPin: (pinLama: string, pinBaru: string) => { sukses: boolean; pesan: string };
  setPinPertamaKali: (pinBaru: string) => { sukses: boolean; pesan: string };
  tambahSoal: (soal: Soal) => void;
  ubahSoal: (id: string, soalUpdate: Partial<Soal>) => void;
  hapusSoal: (id: string) => void;
  resetKeSoalBawaan: () => void;
  imporSoalJSON: (jsonString: string) => { sukses: boolean; jumlah: number; pesan: string };
  imporSoalCSV: (csvString: string) => { sukses: boolean; jumlah: number; pesan: string };
  simpanKustomKios: (index: number, namaBaru: string) => void;
  simpanKustomZona: (sisi: number, namaBaru: string) => void;
  resetKustomMateri: () => void;
}

const DEFAULT_SOAL_LIST: Soal[] = (soalData.soal as unknown) as Soal[];

export const useGuruStore = create<GuruState>()(
  persist(
    (set, get) => ({
      pinGuru: '1234',
      sudahGantiPinAwal: false,
      daftarSoal: DEFAULT_SOAL_LIST,
      kustomNamaKios: {},
      kustomNamaZona: {},

      verifikasiPin: (inputPin) => {
        return inputPin.trim() === get().pinGuru;
      },

      gantiPin: (pinLama, pinBaru) => {
        if (pinLama.trim() !== get().pinGuru) {
          return { sukses: false, pesan: 'PIN lama salah!' };
        }
        if (pinBaru.trim().length < 4) {
          return { sukses: false, pesan: 'PIN baru minimal harus 4 digit angka/karakter!' };
        }
        if (pinBaru.trim() === '1234') {
          return { sukses: false, pesan: 'PIN baru tidak boleh menggunakan PIN bawaan 1234!' };
        }

        set({ pinGuru: pinBaru.trim(), sudahGantiPinAwal: true });
        return { sukses: true, pesan: 'PIN Guru berhasil diubah!' };
      },

      setPinPertamaKali: (pinBaru) => {
        if (pinBaru.trim().length < 4) {
          return { sukses: false, pesan: 'PIN baru minimal harus 4 karakter!' };
        }
        if (pinBaru.trim() === '1234') {
          return { sukses: false, pesan: 'PIN baru tidak boleh sama dengan PIN bawaan (1234)!' };
        }

        set({ pinGuru: pinBaru.trim(), sudahGantiPinAwal: true });
        return { sukses: true, pesan: 'PIN baru berhasil disimpan. Selamat datang di Panel Guru!' };
      },

      tambahSoal: (soal) => {
        set((s) => ({ daftarSoal: [soal, ...s.daftarSoal] }));
      },

      ubahSoal: (id, update) => {
        set((s) => ({
          daftarSoal: s.daftarSoal.map((soal) =>
            soal.id === id ? { ...soal, ...update } : soal
          )
        }));
      },

      hapusSoal: (id) => {
        set((s) => ({
          daftarSoal: s.daftarSoal.filter((soal) => soal.id !== id)
        }));
      },

      resetKeSoalBawaan: () => {
        set({ daftarSoal: DEFAULT_SOAL_LIST });
      },

      imporSoalJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          const list: Soal[] = Array.isArray(parsed) ? parsed : parsed.soal;
          if (!Array.isArray(list)) {
            return { sukses: false, jumlah: 0, pesan: 'Format JSON harus berupa array soal atau { soal: [...] }' };
          }
          set({ daftarSoal: list });
          return { sukses: true, jumlah: list.length, pesan: `Berhasil mengimpor ${list.length} butir soal!` };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Format JSON tidak valid';
          return { sukses: false, jumlah: 0, pesan: `Gagal membaca JSON: ${msg}` };
        }
      },

      imporSoalCSV: (csvString) => {
        try {
          const lines = csvString.split('\n').map((l) => l.trim()).filter(Boolean);
          if (lines.length <= 1) {
            return { sukses: false, jumlah: 0, pesan: 'File CSV kosong atau hanya berisi header.' };
          }

          // Lewati header baris 1
          const soalBaru: Soal[] = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
            if (cols.length >= 7) {
              soalBaru.push({
                id: cols[0] || `kustom-${Date.now()}-${i}`,
                tipe: (cols[1] as any) || 'petak',
                subtopik: (cols[2] as any) || 'mengenal',
                level: (cols[3] as any) || 'sedang',
                tp: cols[4] || 'TP1',
                pertanyaan: cols[5],
                opsi: cols[6].split(';').map((o) => o.trim()),
                kunci: cols[7] || '',
                pembahasan: cols[8] || 'Pembahasan soal.'
              });
            }
          }

          if (soalBaru.length > 0) {
            set((s) => ({ daftarSoal: [...soalBaru, ...s.daftarSoal] }));
            return { sukses: true, jumlah: soalBaru.length, pesan: `Berhasil menambahkan ${soalBaru.length} soal dari CSV!` };
          }
          return { sukses: false, jumlah: 0, pesan: 'Tidak ada baris CSV yang valid.' };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Format CSV salah';
          return { sukses: false, jumlah: 0, pesan: `Gagal impor CSV: ${msg}` };
        }
      },

      simpanKustomKios: (index, namaBaru) => {
        set((s) => ({
          kustomNamaKios: { ...s.kustomNamaKios, [index]: namaBaru.trim() }
        }));
      },

      simpanKustomZona: (sisi, namaBaru) => {
        set((s) => ({
          kustomNamaZona: { ...s.kustomNamaZona, [sisi]: namaBaru.trim() }
        }));
      },

      resetKustomMateri: () => {
        set({ kustomNamaKios: {}, kustomNamaZona: {} });
      }
    }),
    {
      name: 'monepeca_guru_store',
    }
  )
);
