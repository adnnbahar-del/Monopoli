import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PengaturanState {
  volumeMusik: number; // 0 - 100
  volumeSFX: number; // 0 - 100
  bisu: boolean;
  durasiSesiMenit: number; // default 20 menit
  ukuranTeks: 'normal' | 'besar';
  kontrasTinggi: boolean;
  ambangSuperTeam: number; // default 50
  ambangGreatTeam: number; // default 45
  ambangGoodTeam: number; // default 40
  
  // Actions
  setVolumeMusik: (val: number) => void;
  setVolumeSFX: (val: number) => void;
  toggleBisu: () => void;
  setDurasiSesiMenit: (val: number) => void;
  setUkuranTeks: (val: 'normal' | 'besar') => void;
  toggleKontrasTinggi: () => void;
  setAmbangTim: (superTeam: number, greatTeam: number, goodTeam: number) => void;
  resetPengaturan: () => void;
}

const defaultPengaturan = {
  volumeMusik: 30, // musik default 30% sesuai spesifikasi
  volumeSFX: 80,
  bisu: false,
  durasiSesiMenit: 20,
  ukuranTeks: 'normal' as const,
  kontrasTinggi: false,
  ambangSuperTeam: 50,
  ambangGreatTeam: 45,
  ambangGoodTeam: 40,
};

export const usePengaturanStore = create<PengaturanState>()(
  persist(
    (set) => ({
      ...defaultPengaturan,

      setVolumeMusik: (val) => set({ volumeMusik: Math.max(0, Math.min(100, val)) }),
      setVolumeSFX: (val) => set({ volumeSFX: Math.max(0, Math.min(100, val)) }),
      toggleBisu: () => set((state) => ({ bisu: !state.bisu })),
      setDurasiSesiMenit: (val) => set({ durasiSesiMenit: val }),
      setUkuranTeks: (val) => set({ ukuranTeks: val }),
      toggleKontrasTinggi: () => set((state) => {
        const next = !state.kontrasTinggi;
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('high-contrast');
          } else {
            document.documentElement.classList.remove('high-contrast');
          }
        }
        return { kontrasTinggi: next };
      }),
      setAmbangTim: (superTeam, greatTeam, goodTeam) => set({
        ambangSuperTeam: superTeam,
        ambangGreatTeam: greatTeam,
        ambangGoodTeam: goodTeam
      }),
      resetPengaturan: () => set(defaultPengaturan),
    }),
    {
      name: 'monepeca_pengaturan',
    }
  )
);
