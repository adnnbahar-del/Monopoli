import React from 'react';
import { DAFTAR_PETAK } from '../../data/papan';
import type { Pemain } from '../../store/gameStore';

/**
 * Lapisan pion semi-3D di atas papan.
 * SEPENUHNYA visual: posisi dibaca dari `pemain[].posisi` (state store existing).
 * Store sudah menggeser posisi satu petak per langkah, sehingga transisi CSS di sini
 * menghasilkan animasi perjalanan antarpetak yang selalu sinkron dengan state.
 */

/** Celah grid papan dalam persen — dipakai bersama oleh <Papan> agar koordinat cocok. */
export const GAP_GRID_PERSEN = 0.9;
const JUMLAH_KOLOM = 8;
const SEL = (100 - GAP_GRID_PERSEN * (JUMLAH_KOLOM - 1)) / JUMLAH_KOLOM;

/** Titik tengah sel (dalam % ukuran papan) untuk baris/kolom grid. */
export function pusatSel(baris: number, kolom: number) {
  return {
    x: kolom * (SEL + GAP_GRID_PERSEN) + SEL / 2,
    y: baris * (SEL + GAP_GRID_PERSEN) + SEL / 2,
  };
}

// Offset agar maksimal 4 pion di satu petak tidak saling menutupi (dalam % papan)
const OFFSET_SLOT = [
  { x: -2.2, y: 0.4 },
  { x: 2.2, y: 0.4 },
  { x: -2.2, y: 3.4 },
  { x: 2.2, y: 3.4 },
];
/** Pion berdiri sedikit di bawah titik tengah agar label & nomor petak tetap terbaca. */
const TURUN_PERSEN = 2.2;

const INK = '#1E2149';

const Pion3D: React.FC<{ warna: string }> = ({ warna }) => (
  <svg viewBox="0 0 60 92" className="w-full h-auto block" aria-hidden="true">
    <defs>
      <radialGradient id={`kilau-${warna.replace('#', '')}`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.75" />
        <stop offset="45%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="30" cy="86" rx="22" ry="5" fill="rgba(16,28,72,0.35)" />
    <path d="M7 80 C7 70 15 66 21 64 L23 46 C15 42 13 34 17 26 L43 26 C47 34 45 42 37 46 L39 64 C45 66 53 70 53 80 Z" fill={warna} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M7 80 C7 70 15 66 21 64 L23 46 C15 42 13 34 17 26 L43 26 C47 34 45 42 37 46 L39 64 C45 66 53 70 53 80 Z" fill={`url(#kilau-${warna.replace('#', '')})`} />
    <rect x="6" y="76" width="48" height="9" rx="4.5" fill={warna} stroke={INK} strokeWidth="3.5" />
    <circle cx="30" cy="17" r="13" fill={warna} stroke={INK} strokeWidth="3.5" />
    <circle cx="25" cy="12" r="4.5" fill="#fff" opacity="0.8" />
  </svg>
);

export interface LapisanPionProps {
  pemain: Pemain[];
  idPemainAktif?: string;
  sedangMelangkah: boolean;
  kurangiGerak?: boolean;
}

export const LapisanPion: React.FC<LapisanPionProps> = ({
  pemain,
  idPemainAktif,
  sedangMelangkah,
  kurangiGerak = false,
}) => {
  // Urutan slot per petak mengikuti urutan pemain (deterministik)
  const slotPerPemain: Record<string, number> = {};
  const hitungPerPetak: Record<number, number> = {};
  pemain.forEach((p) => {
    const n = hitungPerPetak[p.posisi] ?? 0;
    slotPerPemain[p.id] = n;
    hitungPerPetak[p.posisi] = n + 1;
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30" aria-hidden="true">
      {pemain.map((p) => {
        const petak = DAFTAR_PETAK[p.posisi];
        if (!petak) return null;
        const pusat = pusatSel(petak.gridRow, petak.gridCol);
        const sendirian = (hitungPerPetak[p.posisi] ?? 1) === 1;
        const off = sendirian ? { x: 0, y: TURUN_PERSEN } : OFFSET_SLOT[slotPerPemain[p.id] % 4];
        const aktif = p.id === idPemainAktif;

        return (
          <div
            key={p.id}
            className="pion-wadah"
            style={{
              transform: `translate(${pusat.x + off.x}%, ${pusat.y + off.y}%)`,
              transition: kurangiGerak ? 'none' : undefined,
              zIndex: aktif ? 40 : 10 + Math.round(pusat.y),
            }}
          >
            <div className={`pion-badan ${aktif ? 'pion-aktif' : ''}`}>
              {aktif && <span className="pion-cincin" style={{ borderColor: p.warna }} />}
              {/* key = posisi → animasi lompat diputar ulang setiap pindah petak */}
              <span
                key={p.posisi}
                className={`block ${
                  aktif && !kurangiGerak ? (sedangMelangkah ? 'pion-lompat' : 'pion-goyang') : ''
                }`}
              >
                <Pion3D warna={p.warna} />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
