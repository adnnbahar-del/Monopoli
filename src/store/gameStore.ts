import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BentukTim } from '../components/Bidak';
import { lemparDadu } from '../engine/dadu';
import { prosesGerak } from '../engine/gerak';

export interface Pemain {
  id: string;
  nama: string;
  timId: string;
  timNama: string;
  warna: string;
  bentuk: BentukTim;
  posisi: number; // 0 - 27
  poin: number;
  benar: number;
  salah: number;
}

export interface KepemilikanKios {
  pemainId: string;
  timWarna: string;
  timBentuk: BentukTim;
  bintang: number; // 1 atau 2
}

export interface GameState {
  mode: 'latihan' | 'turnamen';
  mejaId?: string;
  pemain: Pemain[];
  giliranIndex: number;
  kepemilikan: Record<number, KepemilikanKios>;
  sisaDetik: number;
  jeda: boolean;
  sudahSelesai: boolean;
  sedangMelangkah: boolean;
  angkaDadu: number;
  petakAktif: number | null;
  soalTerpakai: string[];
  pesanNotifikasi: string | null;

  // Actions
  inisialisasiGame: (daftarPemain: Pemain[], durasiMenit?: number) => void;
  kocokDanJalankan: (onStep?: (pos: number) => void, onSelesai?: (posAkhir: number, lewatStart: boolean) => void) => void;
  setPetakAktif: (idx: number | null) => void;
  tambahPoinPemain: (pemainId: string, jumlah: number) => void;
  kurangPoinPemain: (pemainId: string, jumlah: number) => void;
  beliKios: (petakIndex: number, pemainId: string) => void;
  tingkatkanKios: (petakIndex: number) => void;
  gantiGiliran: () => void;
  setJeda: (jeda: boolean) => void;
  kurangiTimer: () => void;
  resetGame: () => void;
  selesaikanGame: () => void;
}

const PEMAIN_DEFAULT: Pemain[] = [
  { id: 'p1', nama: 'Ahmad', timId: 't1', timNama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p2', nama: 'Siti', timId: 't2', timNama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p3', nama: 'Budi', timId: 't3', timNama: 'Tim Hijau', warna: '#22A55B', bentuk: 'triangle', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p4', nama: 'Dewi', timId: 't4', timNama: 'Tim Oranye', warna: '#F08C00', bentuk: 'square', posisi: 0, poin: 0, benar: 0, salah: 0 },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      mode: 'latihan',
      pemain: PEMAIN_DEFAULT,
      giliranIndex: 0,
      kepemilikan: {},
      sisaDetik: 20 * 60, // 20 menit default
      jeda: false,
      sudahSelesai: false,
      sedangMelangkah: false,
      angkaDadu: 1,
      petakAktif: 0,
      soalTerpakai: [],
      pesanNotifikasi: null,

      inisialisasiGame: (daftarPemain, durasiMenit = 20) => set({
        pemain: daftarPemain.length > 0 ? daftarPemain : PEMAIN_DEFAULT,
        giliranIndex: 0,
        kepemilikan: {},
        sisaDetik: durasiMenit * 60,
        jeda: false,
        sudahSelesai: false,
        sedangMelangkah: false,
        angkaDadu: 1,
        petakAktif: 0,
        soalTerpakai: [],
        pesanNotifikasi: 'Permainan Dimulai! Giliran Pemain Pertama.'
      }),

      kocokDanJalankan: (onStep, onSelesai) => {
        const state = get();
        if (state.sedangMelangkah || state.jeda || state.sudahSelesai) return;

        const dadu = lemparDadu();
        set({ angkaDadu: dadu, sedangMelangkah: true, pesanNotifikasi: `Dadu: ${dadu}! Bidak melangkah...` });

        const pemainAktif = state.pemain[state.giliranIndex];
        const hasil = prosesGerak(pemainAktif.posisi, dadu);

        // Jalankan animasi langkah demi langkah
        let stepCount = 0;
        const interval = setInterval(() => {
          if (stepCount < hasil.jalurLangkah.length) {
            const posSekarang = hasil.jalurLangkah[stepCount];
            // Update posisi sementara pemain
            set((s) => ({
              pemain: s.pemain.map((p, idx) =>
                idx === s.giliranIndex ? { ...p, posisi: posSekarang } : p
              ),
              petakAktif: posSekarang
            }));
            if (onStep) onStep(posSekarang);
            stepCount++;
          } else {
            clearInterval(interval);

            // Jika melewati atau mendarat di START, tambahkan bonus 10 poin
            if (hasil.melewatiStart) {
              set((s) => ({
                pemain: s.pemain.map((p, idx) =>
                  idx === s.giliranIndex ? { ...p, poin: p.poin + hasil.bonusPoin } : p
                ),
                pesanNotifikasi: `Melewati Gerbang START! +${hasil.bonusPoin} Poin Bonus!`
              }));
            }

            set({ sedangMelangkah: false });
            if (onSelesai) onSelesai(hasil.posisiAkhir, hasil.melewatiStart);
          }
        }, 280); // 280ms per langkah
      },

      setPetakAktif: (idx) => set({ petakAktif: idx }),

      tambahPoinPemain: (pemainId, jumlah) => set((s) => ({
        pemain: s.pemain.map((p) =>
          p.id === pemainId ? { ...p, poin: p.poin + jumlah, benar: p.benar + 1 } : p
        )
      })),

      kurangPoinPemain: (pemainId, jumlah) => set((s) => ({
        pemain: s.pemain.map((p) =>
          p.id === pemainId ? { ...p, poin: Math.max(0, p.poin - jumlah), salah: p.salah + 1 } : p
        )
      })),

      beliKios: (petakIndex, pemainId) => {
        const p = get().pemain.find((x) => x.id === pemainId);
        if (!p) return;
        set((s) => ({
          kepemilikan: {
            ...s.kepemilikan,
            [petakIndex]: {
              pemainId: p.id,
              timWarna: p.warna,
              timBentuk: p.bentuk,
              bintang: 1
            }
          }
        }));
      },

      tingkatkanKios: (petakIndex) => {
        set((s) => {
          const kios = s.kepemilikan[petakIndex];
          if (!kios) return s;
          return {
            kepemilikan: {
              ...s.kepemilikan,
              [petakIndex]: {
                ...kios,
                bintang: Math.min(2, kios.bintang + 1)
              }
            }
          };
        });
      },

      gantiGiliran: () => {
        const s = get();
        const nextIndex = (s.giliranIndex + 1) % s.pemain.length;
        set({
          giliranIndex: nextIndex,
          petakAktif: s.pemain[nextIndex].posisi,
          pesanNotifikasi: `Giliran ${s.pemain[nextIndex].nama} (${s.pemain[nextIndex].timNama})`
        });
      },

      setJeda: (jeda) => set({ jeda }),

      kurangiTimer: () => {
        const s = get();
        if (s.jeda || s.sudahSelesai) return;
        if (s.sisaDetik <= 1) {
          set({ sisaDetik: 0, sudahSelesai: true, jeda: true });
        } else {
          set({ sisaDetik: s.sisaDetik - 1 });
        }
      },

      resetGame: () => {
        set({
          pemain: PEMAIN_DEFAULT.map(p => ({ ...p, posisi: 0, poin: 0, benar: 0, salah: 0 })),
          giliranIndex: 0,
          kepemilikan: {},
          sisaDetik: 20 * 60,
          jeda: false,
          sudahSelesai: false,
          sedangMelangkah: false,
          angkaDadu: 1,
          petakAktif: 0,
          soalTerpakai: [],
          pesanNotifikasi: 'Permainan Dimulai Ulang!'
        });
      },

      selesaikanGame: () => set({ sudahSelesai: true, jeda: true })
    }),
    {
      name: 'monepeca_game_session',
    }
  )
);
