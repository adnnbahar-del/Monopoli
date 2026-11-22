import { useEffect, useRef } from 'react';
import { audio } from '../engine/audioManager';
import type { Pemain } from '../store/gameStore';

/**
 * Efek suara papan permainan yang DIPICU OLEH perubahan state existing.
 * Hook ini hanya membaca state — tidak pernah menulis ke store.
 * Pemutaran mengikuti preferensi bisu/volume di audioManager.
 *
 * - sedangMelangkah false → true : suara kocok dadu
 * - posisi pemain aktif berubah   : suara langkah bidak
 * - sedangMelangkah true → false : suara bidak mendarat (petak aktif disorot)
 * - giliranIndex berubah          : suara pergantian giliran
 */
export function useSuaraPapan(pemain: Pemain[], giliranIndex: number, sedangMelangkah: boolean) {
  const posisiAktif = pemain[giliranIndex]?.posisi;
  const prev = useRef({ sedangMelangkah, giliranIndex, posisiAktif });

  useEffect(() => {
    const p = prev.current;
    try {
      if (!p.sedangMelangkah && sedangMelangkah) {
        audio.putar('dadu_lempar');
      } else if (p.sedangMelangkah && !sedangMelangkah) {
        audio.putar('bidak_landing');
      } else if (sedangMelangkah && p.giliranIndex === giliranIndex && p.posisiAktif !== posisiAktif) {
        audio.putar('bidak_jalan');
      }

      if (p.giliranIndex !== giliranIndex) {
        audio.putar('notif_info');
      }
    } catch {
      // Audio gagal tidak boleh mengganggu permainan
    }
    prev.current = { sedangMelangkah, giliranIndex, posisiAktif };
  }, [sedangMelangkah, giliranIndex, posisiAktif]);
}
