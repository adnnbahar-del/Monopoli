import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Siswa,
  TimTurnamen,
  MejaTurnamen,
  SkorPemainTurnamen,
  HasilMejaRingkas,
  bagiTimPolaUlar,
  bagiMejaTurnamen,
  konversiPoinTurnamen,
  decodeKodeHasilMeja
} from '../engine/turnamen';

export interface KelasState {
  daftarSiswa: Siswa[];
  daftarTim: TimTurnamen[];
  daftarMeja: MejaTurnamen[];
  skorTurnamen: Record<string, SkorPemainTurnamen>;
  mejaAktifIndex: number;
  tahapTurnamen: 'siswa' | 'tim' | 'meja' | 'duel' | 'podium';

  // Actions
  setDaftarSiswa: (siswa: Siswa[]) => void;
  tambahSiswa: (nama: string, kemampuan: 'tinggi' | 'sedang' | 'rendah') => void;
  hapusSiswa: (id: string) => void;
  imporSiswaDariTeks: (teks: string) => { berhasil: number; gagal: number; pesan: string };
  bentukTimOtomatis: (jumlahTim?: number) => void;
  ubahNamaTim: (timId: string, namaBaru: string) => void;
  pindahSiswaKeTim: (siswaId: string, timTargetId: string) => void;
  bentukMejaOtomatis: (ukuranMeja?: number) => void;
  setMejaAktifIndex: (idx: number) => void;
  simpanSkorMeja: (mejaId: string, skorList: { siswaId: string; poinMonopoli: number; poinDuel: number }[]) => void;
  gabungKodeHasilMeja: (kode: string) => { sukses: boolean; pesan: string };
  setTahapTurnamen: (tahap: 'siswa' | 'tim' | 'meja' | 'duel' | 'podium') => void;
  resetTurnamen: () => void;
}

const SISWA_DEFAULT: Siswa[] = [
  { id: 's1', nama: 'Ahmad Dahlan', kemampuan: 'tinggi' },
  { id: 's2', nama: 'Siti Rahma', kemampuan: 'tinggi' },
  { id: 's3', nama: 'Budi Santoso', kemampuan: 'tinggi' },
  { id: 's4', nama: 'Dewi Sartika', kemampuan: 'tinggi' },
  { id: 's5', nama: 'Eko Prasetyo', kemampuan: 'sedang' },
  { id: 's6', nama: 'Fani Indah', kemampuan: 'sedang' },
  { id: 's7', nama: 'Gilang Ramadhan', kemampuan: 'sedang' },
  { id: 's8', nama: 'Hani Wijaya', kemampuan: 'sedang' },
  { id: 's9', nama: 'Indah Permata', kemampuan: 'rendah' },
  { id: 's10', nama: 'Joko Widodo', kemampuan: 'rendah' },
  { id: 's11', nama: 'Kiki Amalia', kemampuan: 'rendah' },
  { id: 's12', nama: 'Lia Lestari', kemampuan: 'rendah' },
];

export const useKelasStore = create<KelasState>()(
  persist(
    (set, get) => ({
      daftarSiswa: SISWA_DEFAULT,
      daftarTim: bagiTimPolaUlar(SISWA_DEFAULT, 4),
      daftarMeja: bagiMejaTurnamen(SISWA_DEFAULT, bagiTimPolaUlar(SISWA_DEFAULT, 4), 4),
      skorTurnamen: {},
      mejaAktifIndex: 0,
      tahapTurnamen: 'siswa',

      setDaftarSiswa: (siswa) => set({ daftarSiswa: siswa }),

      tambahSiswa: (nama, kemampuan) => {
        const clean = nama.trim();
        if (!clean) return;
        const baru: Siswa = {
          id: `s-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          nama: clean,
          kemampuan
        };
        set((s) => ({ daftarSiswa: [...s.daftarSiswa, baru] }));
      },

      hapusSiswa: (id) => set((s) => ({
        daftarSiswa: s.daftarSiswa.filter((x) => x.id !== id),
        daftarTim: s.daftarTim.map((t) => ({
          ...t,
          anggotaIds: t.anggotaIds.filter((aid) => aid !== id)
        })),
        daftarMeja: s.daftarMeja.map((m) => ({
          ...m,
          anggotaIds: m.anggotaIds.filter((aid) => aid !== id)
        }))
      })),

      imporSiswaDariTeks: (teks) => {
        const baris = teks.split('\n').map((b) => b.trim()).filter(Boolean);
        if (baris.length === 0) {
          return { berhasil: 0, gagal: 0, pesan: 'Tidak ada baris nama yang valid.' };
        }

        const namaSudahAda = new Set(get().daftarSiswa.map((s) => s.nama.toLowerCase()));
        const siswaBaru: Siswa[] = [];
        let gagal = 0;

        baris.forEach((b) => {
          // Format CSV: "Nama, Kemampuan" atau cukup "Nama"
          const parts = b.split(/[,;\t]/).map((p) => p.trim());
          const nama = parts[0];
          let kemampuan: 'tinggi' | 'sedang' | 'rendah' = 'sedang';

          if (parts[1]) {
            const k = parts[1].toLowerCase();
            if (k === 'tinggi' || k === 'sedang' || k === 'rendah') {
              kemampuan = k;
            }
          }

          if (nama && !namaSudahAda.has(nama.toLowerCase())) {
            namaSudahAda.add(nama.toLowerCase());
            siswaBaru.push({
              id: `s-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              nama,
              kemampuan
            });
          } else {
            gagal++;
          }
        });

        if (siswaBaru.length > 0) {
          set((s) => ({ daftarSiswa: [...s.daftarSiswa, ...siswaBaru] }));
        }

        return {
          berhasil: siswaBaru.length,
          gagal,
          pesan: `Berhasil menambahkan ${siswaBaru.length} siswa.${gagal > 0 ? ` (${gagal} nama dilewati karena kosong atau ganda)` : ''}`
        };
      },

      bentukTimOtomatis: (jumlahTim = 4) => {
        const tim = bagiTimPolaUlar(get().daftarSiswa, jumlahTim);
        set({ daftarTim: tim });
      },

      ubahNamaTim: (timId, namaBaru) => {
        set((s) => ({
          daftarTim: s.daftarTim.map((t) =>
            t.id === timId ? { ...t, nama: namaBaru.trim() || t.nama } : t
          )
        }));
      },

      pindahSiswaKeTim: (siswaId, timTargetId) => {
        set((s) => ({
          daftarTim: s.daftarTim.map((t) => {
            if (t.id === timTargetId) {
              return t.anggotaIds.includes(siswaId)
                ? t
                : { ...t, anggotaIds: [...t.anggotaIds, siswaId] };
            }
            return { ...t, anggotaIds: t.anggotaIds.filter((id) => id !== siswaId) };
          })
        }));
      },

      bentukMejaOtomatis: (ukuranMeja = 4) => {
        const meja = bagiMejaTurnamen(get().daftarSiswa, get().daftarTim, ukuranMeja);
        set({ daftarMeja: meja });
      },

      setMejaAktifIndex: (idx) => set({ mejaAktifIndex: idx }),

      simpanSkorMeja: (mejaId, skorList) => {
        // Konversi poin turnamen (60/40/30/20 atau 60/40/20 + seri)
        const totalList = skorList.map((s) => ({
          siswaId: s.siswaId,
          totalSkor: s.poinMonopoli + s.poinDuel
        }));

        const konversi = konversiPoinTurnamen(totalList);
        const mapKonversi = new Map(konversi.map((k) => [k.siswaId, k]));

        const skorUpdate = { ...get().skorTurnamen };

        skorList.forEach((item) => {
          const siswa = get().daftarSiswa.find((s) => s.id === item.siswaId);
          const tim = get().daftarTim.find((t) => t.anggotaIds.includes(item.siswaId));
          const hasilK = mapKonversi.get(item.siswaId);

          if (siswa) {
            skorUpdate[item.siswaId] = {
              siswaId: item.siswaId,
              nama: siswa.nama,
              timId: tim ? tim.id : '',
              poinMonopoli: item.poinMonopoli,
              poinDuel: item.poinDuel,
              totalPoinSiswa: item.poinMonopoli + item.poinDuel,
              peringkatMeja: hasilK ? hasilK.peringkat : 1,
              poinTurnamen: hasilK ? hasilK.poinTurnamen : 0
            };
          }
        });

        // Tandai meja sebagai selesai
        set((s) => ({
          skorTurnamen: skorUpdate,
          daftarMeja: s.daftarMeja.map((m) =>
            m.id === mejaId ? { ...m, selesai: true } : m
          )
        }));
      },

      gabungKodeHasilMeja: (kode) => {
        try {
          const data: HasilMejaRingkas = decodeKodeHasilMeja(kode);
          const skorUpdate = { ...get().skorTurnamen };

          data.skorPemain.forEach((p) => {
            const siswa = get().daftarSiswa.find((s) => s.id === p.siswaId);
            if (siswa) {
              skorUpdate[p.siswaId] = {
                siswaId: p.siswaId,
                nama: siswa.nama,
                timId: p.timId,
                poinMonopoli: 0,
                poinDuel: 0,
                totalPoinSiswa: 0,
                poinTurnamen: p.poinTurnamen
              };
            }
          });

          set((s) => ({
            skorTurnamen: skorUpdate,
            daftarMeja: s.daftarMeja.map((m) =>
              m.id === data.mejaId ? { ...m, selesai: true } : m
            )
          }));

          return { sukses: true, pesan: `Hasil Meja ${data.nomorMeja} berhasil digabungkan!` };
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Kode tidak valid.';
          return { sukses: false, pesan: msg };
        }
      },

      setTahapTurnamen: (tahap) => set({ tahapTurnamen: tahap }),

      resetTurnamen: () => {
        const tim = bagiTimPolaUlar(SISWA_DEFAULT, 4);
        const meja = bagiMejaTurnamen(SISWA_DEFAULT, tim, 4);
        set({
          daftarSiswa: SISWA_DEFAULT,
          daftarTim: tim,
          daftarMeja: meja,
          skorTurnamen: {},
          mejaAktifIndex: 0,
          tahapTurnamen: 'siswa'
        });
      }
    }),
    {
      name: 'monepeca_kelas_turnamen',
    }
  )
);
