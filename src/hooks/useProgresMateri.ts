import { useCallback, useState } from 'react';
import type { MateriTP } from '../data/materiKilatData';
import type { StatusSoal } from '../components/materi/KuisAyoCoba';

/** Progres Materi Kilat per perangkat: status tiap soal "Ayo coba" per TP. */
export type ProgresMateri = Record<string, Record<number, StatusSoal>>;

const KUNCI = 'monepeca_materi_kilat_progres_v2';

function baca(): ProgresMateri {
  try {
    const raw = localStorage.getItem(KUNCI);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch {
    return {};
  }
}

function simpan(p: ProgresMateri) {
  try {
    localStorage.setItem(KUNCI, JSON.stringify(p));
  } catch {
    /* penyimpanan tidak tersedia (mode privat dsb.) — progres tetap jalan di memori */
  }
}

/** TP selesai bila semua soal wajib (bukan bonus) sudah benar atau sudah dilihat pembahasannya. */
export function tpSelesai(tp: MateriTP, progres: ProgresMateri): boolean {
  const status = progres[tp.id] ?? {};
  return tp.ayoCoba.every((s, i) => s.bonus || status[i] === 'benar' || status[i] === 'pembahasan');
}

export function useProgresMateri() {
  const [progres, setProgres] = useState<ProgresMateri>(baca);

  const tandai = useCallback((tpId: string, indexSoal: number, status: StatusSoal) => {
    setProgres((p) => {
      const lama = p[tpId]?.[indexSoal];
      // "benar" tidak diturunkan menjadi "pembahasan"
      if (lama === 'benar' || lama === status) return p;
      const baru = { ...p, [tpId]: { ...(p[tpId] ?? {}), [indexSoal]: status } };
      simpan(baru);
      return baru;
    });
  }, []);

  return { progres, tandai };
}
