import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BentukTim } from '../components/Bidak';
import { lemparDadu } from '../engine/dadu';
import { prosesGerak, TOTAL_PETAK_PAPAN } from '../engine/gerak';

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

export interface LangkahBerjalan {
  pemainIndex: number;
  posisiAkhir: number;
  bonusPoin: number;
  melewatiStart: boolean;
}

/** Catatan satu jawaban soal (untuk Rekap & review). */
export interface JawabanDetail {
  soalId: string;
  pertanyaan: string;
  kunci: string;
  jawabanDipilih: string;
  benar: boolean;
  pembahasan: string;
  tp: string;
}

export type SumberLangkah = 'dadu' | 'kartu';

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
  /** Langkah yang sedang berjalan — disimpan agar bisa dipulihkan bila halaman dimuat ulang di tengah langkah. */
  langkahBerjalan: LangkahBerjalan | null;
  /** Petak yang aksinya (soal/kesempatan/dll.) belum diproses setelah pemulihan langkah. */
  aksiPetakTertunda: number | null;
  /** Pemain aktif sudah mengocok dadu pada giliran ini (satu kocokan per giliran). */
  sudahLempar: boolean;
  /** Asal langkah yang sedang berjalan: kocokan dadu atau efek kartu Kesempatan. */
  sumberLangkah: SumberLangkah;
  /** Riwayat jawaban sesi ini (tersimpan bersama sesi agar Rekap tetap lengkap). */
  riwayatJawaban: JawabanDetail[];

  // Actions
  inisialisasiGame: (daftarPemain: Pemain[], durasiMenit?: number) => void;
  kocokDanJalankan: (onStep?: (pos: number) => void, onSelesai?: (posAkhir: number, lewatStart: boolean) => void) => void;
  /** Gerakkan pemain aktif karena efek kartu (langkah negatif = mundur). */
  gerakkanPemain: (langkah: number, onSelesai?: (posAkhir: number, lewatStart: boolean) => void) => void;
  /** Kartu "lempar lagi": pemain aktif boleh mengocok sekali lagi. */
  izinkanLemparLagi: () => void;
  setPetakAktif: (idx: number | null) => void;
  tambahPoinPemain: (pemainId: string, jumlah: number) => void;
  /** Mengurangi poin (tidak di bawah 0). Mengembalikan jumlah yang benar-benar dikurangi. */
  kurangPoinPemain: (pemainId: string, jumlah: number) => number;
  /** Mencatat hasil menjawab soal: statistik benar/salah pemain + riwayat. */
  catatJawaban: (pemainId: string, detail: JawabanDetail) => void;
  beliKios: (petakIndex: number, pemainId: string) => void;
  tingkatkanKios: (petakIndex: number) => void;
  gantiGiliran: () => void;
  setJeda: (jeda: boolean) => void;
  kurangiTimer: () => void;
  resetGame: (durasiMenit?: number) => void;
  selesaikanGame: () => void;
  bersihkanAksiPetakTertunda: () => void;
  bersihkanNotifikasi: () => void;
}

const PEMAIN_DEFAULT: Pemain[] = [
  { id: 'p1', nama: 'Ahmad', timId: 't1', timNama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p2', nama: 'Siti', timId: 't2', timNama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p3', nama: 'Budi', timId: 't3', timNama: 'Tim Hijau', warna: '#22A55B', bentuk: 'triangle', posisi: 0, poin: 0, benar: 0, salah: 0 },
  { id: 'p4', nama: 'Dewi', timId: 't4', timNama: 'Tim Oranye', warna: '#F08C00', bentuk: 'square', posisi: 0, poin: 0, benar: 0, salah: 0 },
];

const DURASI_DEFAULT_MENIT = 20;
const MS_PER_LANGKAH = 280;

/** State awal satu sesi permainan (dipakai inisialisasi & reset). */
function stateSesiBaru(pemain: Pemain[], durasiMenit: number, pesan: string) {
  return {
    pemain: pemain.map((p) => ({ ...p, posisi: 0, poin: 0, benar: 0, salah: 0 })),
    giliranIndex: 0,
    kepemilikan: {},
    sisaDetik: Math.max(1, Math.round(durasiMenit)) * 60,
    jeda: false,
    sudahSelesai: false,
    sedangMelangkah: false,
    angkaDadu: 1,
    petakAktif: 0,
    soalTerpakai: [],
    pesanNotifikasi: pesan,
    langkahBerjalan: null,
    aksiPetakTertunda: null,
    sudahLempar: false,
    sumberLangkah: 'dadu' as SumberLangkah,
    riwayatJawaban: []
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      /**
       * Menjalankan bidak pemain aktif petak demi petak (280 ms/langkah).
       * Dipakai bersama oleh kocokan dadu dan efek kartu agar perilakunya identik.
       */
      const jalankanJalur = (
        jalur: number[],
        posisiAkhir: number,
        bonusPoin: number,
        melewatiStart: boolean,
        onStep?: (pos: number) => void,
        onSelesai?: (posAkhir: number, lewatStart: boolean) => void
      ) => {
        let stepCount = 0;
        const interval = setInterval(() => {
          if (stepCount < jalur.length) {
            const posSekarang = jalur[stepCount];
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

            // Jika melewati atau mendarat di START, tambahkan bonus poin
            if (melewatiStart && bonusPoin > 0) {
              set((s) => ({
                pemain: s.pemain.map((p, idx) =>
                  idx === s.giliranIndex ? { ...p, poin: p.poin + bonusPoin } : p
                ),
                pesanNotifikasi: `Melewati Gerbang START! +${bonusPoin} Poin Bonus!`
              }));
            }

            set({ sedangMelangkah: false, langkahBerjalan: null });
            if (onSelesai) onSelesai(posisiAkhir, melewatiStart);
          }
        }, MS_PER_LANGKAH);
      };

      return {
        mode: 'latihan',
        ...stateSesiBaru(PEMAIN_DEFAULT, DURASI_DEFAULT_MENIT, ''),
        pesanNotifikasi: null,

        inisialisasiGame: (daftarPemain, durasiMenit = DURASI_DEFAULT_MENIT) =>
          set(
            stateSesiBaru(
              daftarPemain.length > 0 ? daftarPemain : PEMAIN_DEFAULT,
              durasiMenit,
              'Permainan Dimulai! Giliran Pemain Pertama.'
            )
          ),

        kocokDanJalankan: (onStep, onSelesai) => {
          const state = get();
          if (state.sedangMelangkah || state.jeda || state.sudahSelesai || state.sudahLempar) return;

          const dadu = lemparDadu();
          const pemainAktif = state.pemain[state.giliranIndex];
          const hasil = prosesGerak(pemainAktif.posisi, dadu);

          set({
            angkaDadu: dadu,
            sedangMelangkah: true,
            sudahLempar: true,
            sumberLangkah: 'dadu',
            pesanNotifikasi: `Dadu: ${dadu}! Bidak melangkah...`,
            langkahBerjalan: {
              pemainIndex: state.giliranIndex,
              posisiAkhir: hasil.posisiAkhir,
              bonusPoin: hasil.bonusPoin,
              melewatiStart: hasil.melewatiStart
            }
          });

          jalankanJalur(hasil.jalurLangkah, hasil.posisiAkhir, hasil.bonusPoin, hasil.melewatiStart, onStep, onSelesai);
        },

        gerakkanPemain: (langkah, onSelesai) => {
          const state = get();
          if (state.sedangMelangkah || state.sudahSelesai || langkah === 0) return;

          const pemainAktif = state.pemain[state.giliranIndex];
          let jalur: number[];
          let posisiAkhir: number;
          let bonusPoin = 0;
          let melewatiStart = false;

          if (langkah > 0) {
            const hasil = prosesGerak(pemainAktif.posisi, langkah);
            jalur = hasil.jalurLangkah;
            posisiAkhir = hasil.posisiAkhir;
            bonusPoin = hasil.bonusPoin;
            melewatiStart = hasil.melewatiStart;
          } else {
            // Mundur: tidak pernah mendapat bonus START
            jalur = [];
            let curr = pemainAktif.posisi;
            for (let i = 0; i < -langkah; i++) {
              curr = (curr - 1 + TOTAL_PETAK_PAPAN) % TOTAL_PETAK_PAPAN;
              jalur.push(curr);
            }
            posisiAkhir = curr;
          }

          set({
            sedangMelangkah: true,
            sumberLangkah: 'kartu',
            langkahBerjalan: { pemainIndex: state.giliranIndex, posisiAkhir, bonusPoin, melewatiStart }
          });

          jalankanJalur(jalur, posisiAkhir, bonusPoin, melewatiStart, undefined, onSelesai);
        },

        izinkanLemparLagi: () => set({ sudahLempar: false }),

        setPetakAktif: (idx) => set({ petakAktif: idx }),

        // Poin dan statistik jawaban dipisah: bonus/sewa tidak dihitung sebagai jawaban benar
        tambahPoinPemain: (pemainId, jumlah) => set((s) => ({
          pemain: s.pemain.map((p) =>
            p.id === pemainId ? { ...p, poin: p.poin + jumlah } : p
          )
        })),

        kurangPoinPemain: (pemainId, jumlah) => {
          const p = get().pemain.find((x) => x.id === pemainId);
          if (!p) return 0;
          const dikurangi = Math.min(Math.max(0, jumlah), p.poin);
          set((s) => ({
            pemain: s.pemain.map((x) =>
              x.id === pemainId ? { ...x, poin: x.poin - dikurangi } : x
            )
          }));
          return dikurangi;
        },

        catatJawaban: (pemainId, detail) => set((s) => ({
          pemain: s.pemain.map((p) =>
            p.id === pemainId
              ? { ...p, benar: p.benar + (detail.benar ? 1 : 0), salah: p.salah + (detail.benar ? 0 : 1) }
              : p
          ),
          riwayatJawaban: [...s.riwayatJawaban, detail]
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
          if (s.sedangMelangkah) return; // jangan ganti giliran di tengah langkah bidak
          const nextIndex = (s.giliranIndex + 1) % s.pemain.length;
          set({
            giliranIndex: nextIndex,
            sudahLempar: false,
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

        resetGame: (durasiMenit = DURASI_DEFAULT_MENIT) => {
          set(stateSesiBaru(get().pemain.length > 0 ? get().pemain : PEMAIN_DEFAULT, durasiMenit, 'Permainan Dimulai Ulang!'));
        },

        selesaikanGame: () => set({ sudahSelesai: true, jeda: true }),

        bersihkanAksiPetakTertunda: () => set({ aksiPetakTertunda: null }),

        bersihkanNotifikasi: () => set({ pesanNotifikasi: null })
      };
    },
    {
      name: 'monepeca_game_session',
      // Pulihkan sesi yang tersimpan di tengah langkah bidak (mis. halaman dimuat ulang):
      // interval langkah tidak ikut tersimpan, jadi tanpa ini `sedangMelangkah` macet true
      // dan dadu tidak bisa dikocok lagi.
      merge: (tersimpan, sekarang) => pulihkanSesi(tersimpan as Partial<GameState> | undefined, sekarang)
    }
  )
);

/** Apakah ada sesi permainan berjalan yang layak dilanjutkan. */
export function adaSesiBerjalan(s: Pick<GameState, 'sudahSelesai' | 'pemain' | 'kepemilikan' | 'riwayatJawaban' | 'sudahLempar' | 'giliranIndex'>): boolean {
  if (s.sudahSelesai) return false;
  return (
    s.giliranIndex > 0 ||
    s.sudahLempar ||
    s.pemain.some((p) => p.posisi !== 0 || p.poin !== 0) ||
    Object.keys(s.kepemilikan).length > 0 ||
    s.riwayatJawaban.length > 0
  );
}

/**
 * Menggabungkan sesi tersimpan ke state awal dan menyelesaikan langkah yang terputus.
 * Hasil akhir sama dengan bila langkah selesai normal: bidak di petak tujuan,
 * bonus START diberikan bila dilewati, lalu aksi petak tujuan diproses oleh layar papan.
 */
export function pulihkanSesi(tersimpan: Partial<GameState> | undefined, sekarang: GameState): GameState {
  const gabung: GameState = { ...sekarang, ...(tersimpan ?? {}) };
  // Sesi lama mungkin belum punya field baru
  if (!Array.isArray(gabung.riwayatJawaban)) gabung.riwayatJawaban = [];
  if (typeof gabung.sudahLempar !== 'boolean') gabung.sudahLempar = false;
  if (!gabung.sedangMelangkah) return gabung;

  const langkah = gabung.langkahBerjalan;
  if (!langkah || !gabung.pemain[langkah.pemainIndex]) {
    // Data lama tanpa info langkah: cukup lepaskan kunci agar permainan bisa berlanjut
    return { ...gabung, sedangMelangkah: false, langkahBerjalan: null };
  }

  return {
    ...gabung,
    pemain: gabung.pemain.map((p, idx) =>
      idx === langkah.pemainIndex
        ? { ...p, posisi: langkah.posisiAkhir, poin: p.poin + (langkah.melewatiStart ? langkah.bonusPoin : 0) }
        : p
    ),
    petakAktif: langkah.posisiAkhir,
    sedangMelangkah: false,
    langkahBerjalan: null,
    aksiPetakTertunda: langkah.posisiAkhir,
    pesanNotifikasi: langkah.melewatiStart
      ? `Langkah dipulihkan. Melewati Gerbang START! +${langkah.bonusPoin} Poin Bonus!`
      : 'Langkah bidak dipulihkan setelah halaman dimuat ulang.'
  };
}
