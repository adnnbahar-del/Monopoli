import React, { useEffect, useRef, useState } from 'react';

/**
 * Dadu 3D visual untuk papan permainan.
 * - TIDAK mengacak apa pun: wajah akhir = `nilai` (angkaDadu dari store existing).
 * - Putaran dipicu saat `sedangMelangkah` berubah false → true (dadu baru dikocok),
 *   sehingga lemparan beruntun dengan angka sama tetap terlihat berputar.
 */

// Rotasi kubus agar sisi bernilai n menghadap depan
const ROTASI_SISI: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
};

const KELAS_SISI: Record<number, string> = {
  1: 'dp-depan',
  2: 'dp-belakang',
  3: 'dp-kanan',
  4: 'dp-kiri',
  5: 'dp-atas',
  6: 'dp-bawah',
};

const POLA: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export interface DaduArenaProps {
  nilai: number;
  sedangMelangkah: boolean;
  disabled?: boolean;
  onKocok: () => void;
  kurangiGerak?: boolean;
}

export const DaduArena: React.FC<DaduArenaProps> = ({
  nilai,
  sedangMelangkah,
  disabled = false,
  onKocok,
  kurangiGerak = false,
}) => {
  const [putaran, setPutaran] = useState({ x: 0, y: 0 });
  const [berputar, setBerputar] = useState(false);
  const sebelumnya = useRef(sedangMelangkah);

  useEffect(() => {
    const mulaiLangkah = !sebelumnya.current && sedangMelangkah;
    sebelumnya.current = sedangMelangkah;
    if (!mulaiLangkah || kurangiGerak) return;
    // Tambah 2 putaran penuh tiap sumbu (deterministik, murni visual)
    setPutaran((p) => ({ x: p.x + 720, y: p.y + 720 }));
    setBerputar(true);
    const t = setTimeout(() => setBerputar(false), 900);
    return () => clearTimeout(t);
  }, [sedangMelangkah, kurangiGerak]);

  const sisi = ROTASI_SISI[nilai] ?? ROTASI_SISI[1];
  const rx = sisi.x + putaran.x;
  const ry = sisi.y + putaran.y;

  return (
    <button
      type="button"
      onClick={onKocok}
      disabled={disabled}
      aria-label={`Dadu, hasil terakhir ${nilai}. Ketuk untuk mengocok`}
      className={`dadu-papan ${berputar ? 'dadu-papan-roll' : ''} ${!disabled && !berputar ? 'dadu-papan-idle' : ''}`}
    >
      <span className="dadu-papan-miring">
      <span
        className="dadu-papan-kubus"
        style={{
          transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
          transition: kurangiGerak ? 'none' : undefined,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <span key={n} className={`dadu-papan-sisi ${KELAS_SISI[n]}`}>
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className={POLA[n].includes(i) ? 'dadu-papan-titik' : ''} />
            ))}
          </span>
        ))}
      </span>
      </span>
      <span className="dadu-papan-bayangan" aria-hidden="true" />
    </button>
  );
};
