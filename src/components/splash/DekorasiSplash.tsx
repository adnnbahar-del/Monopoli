import React, { useEffect, useState } from 'react';
import { IlustrasiPion } from '../beranda/Ilustrasi';

/**
 * Elemen dekoratif Splash "Petualangan Monopoli 3D".
 * Semuanya aria-hidden & pointer-events: none — tidak memengaruhi state permainan.
 */

/* ── Dadu kubus CSS-3D ────────────────────────────────────────── */
// Posisi titik pada grid 3x3 (indeks 0..8) untuk tiap angka dadu standar
const POLA_TITIK: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

// Sisi berlawanan berjumlah 7 (1–6, 2–5, 3–4)
const SISI: Array<{ angka: number; kelas: string }> = [
  { angka: 1, kelas: 'dadu-depan' },
  { angka: 6, kelas: 'dadu-belakang' },
  { angka: 3, kelas: 'dadu-kanan' },
  { angka: 4, kelas: 'dadu-kiri' },
  { angka: 2, kelas: 'dadu-atas' },
  { angka: 5, kelas: 'dadu-bawah' },
];

export const DaduKubus: React.FC<{ className?: string; warnaTitik?: string }> = ({
  className = '',
  warnaTitik = '#6539D8',
}) => (
  <div className={`dadu-wadah ${className}`} aria-hidden="true">
    <div className="dadu-kubus">
      {SISI.map(({ angka, kelas }) => (
        <div key={angka} className={`dadu-sisi ${kelas}`}>
          {Array.from({ length: 9 }, (_, i) => (
            <span
              key={i}
              className="dadu-titik"
              style={{ background: POLA_TITIK[angka].includes(i) ? warnaTitik : 'transparent' }}
            />
          ))}
        </div>
      ))}
    </div>
    <div className="dadu-bayangan" />
  </div>
);

/* ── Portal Dunia Pecahan ─────────────────────────────────────── */
const PARTIKEL = Array.from({ length: 14 }, (_, i) => {
  const sudut = (i / 14) * Math.PI * 2;
  const r = 44 + (i % 3) * 4; // % dari setengah ukuran portal
  return {
    left: `${50 + Math.cos(sudut) * r}%`,
    top: `${50 + Math.sin(sudut) * r}%`,
    ukuran: 4 + (i % 4) * 2,
    delay: `${(i % 7) * 0.45}s`,
  };
});

export const PortalPecahan: React.FC<{ terbuka: boolean }> = ({ terbuka }) => (
  <div className={`portal ${terbuka ? 'portal-terbuka' : ''}`} aria-hidden="true">
    <div className="portal-aura" />
    <div className="portal-cincin-emas" />
    <div className="portal-cincin-putus" />
    <div className="portal-inti" />
    {PARTIKEL.map((p, i) => (
      <span
        key={i}
        className="portal-bintang"
        style={{ left: p.left, top: p.top, width: p.ukuran, height: p.ukuran, animationDelay: p.delay }}
      />
    ))}
  </div>
);

/* ── Keping pecahan melayang (notasi a/b vertikal yang benar) ─── */
export const KepingPecahan: React.FC<{ atas: number; bawah: number; className?: string }> = ({
  atas,
  bawah,
  className = '',
}) => (
  <div
    className={`keping-pecahan inline-flex flex-col items-center px-2.5 py-1 rounded-xl bg-white/95 border-[3px] border-[#101C48] font-display font-black text-[#32166F] leading-none shadow-[0_4px_0_#101C48] ${className}`}
    aria-hidden="true"
  >
    <span>{atas}</span>
    <span className="my-0.5 h-[3px] w-full min-w-[1.1em] rounded-full bg-[#32166F]" />
    <span>{bawah}</span>
  </div>
);

/* ── Jalur petak + pion bergiliran ────────────────────────────── */
const JUMLAH_PETAK = 9;
const WARNA_PETAK = ['#FFD45A', '#6539D8', '#FF7EB6', '#2EC4B6', '#FF693B', '#2459D9', '#3BC47A', '#B794F6', '#FF9D32'];
const PION = [
  { warna: '#E5484D', mulai: 0 },
  { warna: '#2459D9', mulai: 1 },
  { warna: '#22A55B', mulai: 2 },
  { warna: '#FFC21A', mulai: 3 },
];
const JEDA_GILIRAN_MS = 900;

export const JalurPion: React.FC<{ animasi: boolean; mendekatPortal?: boolean }> = ({
  animasi,
  mendekatPortal = false,
}) => {
  const [posisi, setPosisi] = useState<number[]>(() => PION.map((p) => p.mulai));
  const [giliran, setGiliran] = useState(-1);
  const [lompatKe, setLompatKe] = useState<number[]>(() => PION.map(() => 0));

  useEffect(() => {
    if (!animasi) return;
    let langkah = 0;
    const id = setInterval(() => {
      const i = langkah % PION.length;
      langkah += 1;
      setGiliran(i);
      setPosisi((prev) => prev.map((p, j) => (j === i ? (p + 1) % JUMLAH_PETAK : p)));
      setLompatKe((prev) => prev.map((n, j) => (j === i ? n + 1 : n)));
    }, JEDA_GILIRAN_MS);
    return () => clearInterval(id);
  }, [animasi]);

  return (
    <div className={`jalur-wadah ${mendekatPortal ? 'jalur-mendekat' : ''}`} aria-hidden="true">
      <div className="jalur-petak">
        {Array.from({ length: JUMLAH_PETAK }, (_, i) => (
          <span key={i} className="jalur-satu-petak" style={{ background: WARNA_PETAK[i] }}>
            {i === 0 && <span className="jalur-label">MULAI</span>}
          </span>
        ))}
      </div>
      <div className="jalur-pion-lapis">
        {PION.map((p, i) => {
          const pos = posisi[i];
          const melingkar = pos === 0 && giliran === i; // kembali ke petak awal → tanpa geser mundur
          return (
            <div
              key={i}
              className="jalur-pion"
              style={{
                width: `${100 / JUMLAH_PETAK}%`,
                transform: `translateX(${pos * 100}%)`,
                transition: melingkar ? 'none' : undefined,
                zIndex: giliran === i ? 5 : 1,
              }}
            >
              <span
                key={lompatKe[i]}
                className={`jalur-pion-isi ${lompatKe[i] > 0 ? 'jalur-pion-lompat' : ''}`}
                style={{ marginLeft: `${(i - 1.5) * 14}%` }}
              >
                <IlustrasiPion warna={p.warna} className="w-full" />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
