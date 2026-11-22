import { useCallback, useEffect, useState } from 'react';

/**
 * Status & kontrol Fullscreen API untuk mode proyektor.
 * - `aktif` selalu mengikuti status browser (termasuk keluar lewat Escape).
 * - `toggle` mengembalikan false bila browser menolak / tidak mendukung.
 */
export function useLayarPenuh() {
  const didukung =
    typeof document !== 'undefined' &&
    !!document.documentElement.requestFullscreen &&
    document.fullscreenEnabled !== false;

  const [aktif, setAktif] = useState<boolean>(
    typeof document !== 'undefined' && !!document.fullscreenElement
  );

  useEffect(() => {
    const handler = () => setAktif(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = useCallback(async (): Promise<boolean> => {
    if (!didukung) return false;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
      return true;
    } catch {
      // Ditolak browser / pengguna — aplikasi tetap berjalan
      return false;
    }
  }, [didukung]);

  return { aktif, didukung, toggle };
}
