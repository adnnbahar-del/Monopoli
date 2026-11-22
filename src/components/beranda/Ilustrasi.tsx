import React from 'react';

/**
 * Kumpulan ilustrasi SVG ringan untuk Beranda "Arena Turnamen".
 * Semua digambar inline agar tetap berjalan offline tanpa aset gambar.
 */

interface IlustrasiProps {
  className?: string;
}

const INK = '#1E2149';

/* ── Piala emas berlogo M ─────────────────────────────────────── */
export const IlustrasiPiala: React.FC<IlustrasiProps> = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="pialaEmas" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="45%" stopColor="#FFD23F" />
        <stop offset="100%" stopColor="#E09A00" />
      </linearGradient>
    </defs>
    {/* gagang */}
    <path d="M28 30 C8 30 8 62 36 64" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
    <path d="M28 30 C8 30 8 62 36 64" fill="none" stroke="#FFC21A" strokeWidth="5" strokeLinecap="round" />
    <path d="M92 30 C112 30 112 62 84 64" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
    <path d="M92 30 C112 30 112 62 84 64" fill="none" stroke="#FFC21A" strokeWidth="5" strokeLinecap="round" />
    {/* mangkuk */}
    <path d="M26 20 H94 V40 C94 62 78 76 60 76 C42 76 26 62 26 40 Z" fill="url(#pialaEmas)" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <path d="M36 26 V42 C36 54 42 62 50 66" fill="none" stroke="#FFFBE0" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    {/* batang & alas */}
    <rect x="52" y="74" width="16" height="14" fill="#FFC21A" stroke={INK} strokeWidth="4" />
    <rect x="38" y="86" width="44" height="10" rx="3" fill="url(#pialaEmas)" stroke={INK} strokeWidth="4" />
    <rect x="32" y="95" width="56" height="13" rx="4" fill="#7B5CFA" stroke={INK} strokeWidth="4" />
    {/* lencana M */}
    <circle cx="60" cy="44" r="14" fill="#FF6B35" stroke={INK} strokeWidth="3.5" />
    <text x="60" y="51" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="900" fontSize="19" fill="#fff">M</text>
    {/* kilau */}
    <path d="M100 10 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#fff" />
  </svg>
);

/* ── Dadu putih berbintik merah ───────────────────────────────── */
export const IlustrasiDadu: React.FC<IlustrasiProps> = ({ className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
    {/* sisi atas */}
    <path d="M60 10 L104 32 L60 54 L16 32 Z" fill="#FFFFFF" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {/* sisi kiri */}
    <path d="M16 32 L60 54 L60 108 L16 86 Z" fill="#F1EEF8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {/* sisi kanan */}
    <path d="M104 32 L60 54 L60 108 L104 86 Z" fill="#E2DCF0" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    {/* titik atas: 1 */}
    <ellipse cx="60" cy="32" rx="8" ry="4.5" fill="#E5484D" />
    {/* titik kiri: 3 */}
    <ellipse cx="27" cy="50" rx="4.5" ry="5.5" fill="#E5484D" />
    <ellipse cx="38" cy="70" rx="4.5" ry="5.5" fill="#E5484D" />
    <ellipse cx="49" cy="90" rx="4.5" ry="5.5" fill="#E5484D" />
    {/* titik kanan: 4 */}
    <ellipse cx="72" cy="62" rx="4.5" ry="5.5" fill="#E5484D" />
    <ellipse cx="92" cy="52" rx="4.5" ry="5.5" fill="#E5484D" />
    <ellipse cx="72" cy="88" rx="4.5" ry="5.5" fill="#E5484D" />
    <ellipse cx="92" cy="78" rx="4.5" ry="5.5" fill="#E5484D" />
  </svg>
);

/* ── Pion permainan ───────────────────────────────────────────── */
export const IlustrasiPion: React.FC<IlustrasiProps & { warna: string }> = ({ className, warna }) => (
  <svg viewBox="0 0 60 90" className={className} aria-hidden="true">
    <ellipse cx="30" cy="84" rx="24" ry="5" fill="rgba(30,33,73,0.25)" />
    <path d="M8 80 C8 70 16 66 22 64 L24 46 C16 42 14 34 18 26 L42 26 C46 34 44 42 36 46 L38 64 C44 66 52 70 52 80 Z" fill={warna} stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <circle cx="30" cy="18" r="13" fill={warna} stroke={INK} strokeWidth="3.5" />
    <circle cx="25" cy="13" r="4" fill="#fff" opacity="0.7" />
    <path d="M14 76 C16 70 22 68 26 67" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
  </svg>
);

/* ── Petak papan isometrik kecil ──────────────────────────────── */
export const IlustrasiPetak: React.FC<IlustrasiProps & { warna?: string[] }> = ({
  className,
  warna = ['#3BC47A', '#4D8DFF', '#FF7EB6', '#FFD23F']
}) => (
  <svg viewBox="0 0 160 70" className={className} aria-hidden="true">
    {[0, 1, 2, 3].map((i) => {
      const x = 12 + i * 34;
      const y = 22 + (i % 2) * 6;
      return (
        <g key={i}>
          <path d={`M${x} ${y} L${x + 34} ${y - 8} L${x + 52} ${y + 4} L${x + 18} ${y + 12} Z`} fill={warna[i % warna.length]} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <path d={`M${x} ${y} L${x + 18} ${y + 12} L${x + 18} ${y + 20} L${x} ${y + 8} Z`} fill="rgba(30,33,73,0.35)" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d={`M${x + 18} ${y + 12} L${x + 52} ${y + 4} L${x + 52} ${y + 12} L${x + 18} ${y + 20} Z`} fill="rgba(30,33,73,0.2)" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    })}
  </svg>
);

/* ── Pizza 8 potong dengan satu irisan terlepas ───────────────── */
export const IlustrasiPizza: React.FC<IlustrasiProps> = ({ className }) => {
  const potong = Array.from({ length: 8 }, (_, i) => i);
  const r = 44;
  const titik = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return [60 + r * Math.cos(rad), 60 + r * Math.sin(rad)];
  };
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="#E8A14F" stroke={INK} strokeWidth="4" />
      <circle cx="60" cy="60" r="44" fill="#FFCF5C" />
      {potong.map((i) => {
        if (i === 0) return null; // irisan yang diambil
        const [x1, y1] = titik(i * 45);
        const [x2, y2] = titik((i + 1) * 45);
        return (
          <path key={i} d={`M60 60 L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`} fill="#FFD66B" stroke="#C97B1E" strokeWidth="2" />
        );
      })}
      {/* irisan kosong */}
      <path d={`M60 60 L104 60 A44 44 0 0 1 ${titik(45)[0]} ${titik(45)[1]} Z`} fill="#FFF3D6" stroke="#C97B1E" strokeWidth="2" strokeDasharray="4 3" />
      {/* topping */}
      {[[40, 40], [72, 34], [36, 74], [62, 82], [84, 80], [50, 58], [78, 52]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="6" fill="#E5484D" stroke="#A82E33" strokeWidth="1.5" />
      ))}
      {[[56, 30], [30, 58], [70, 66]].map(([x, y], i) => (
        <circle key={`z${i}`} cx={x} cy={y} r="3" fill="#2BA866" />
      ))}
    </svg>
  );
};

/* ── Kartu pecahan a/b ────────────────────────────────────────── */
export const KartuPecahan: React.FC<IlustrasiProps & { atas: number; bawah: number }> = ({
  className,
  atas,
  bawah
}) => (
  <svg viewBox="0 0 44 60" className={className} aria-hidden="true">
    <rect x="2" y="2" width="40" height="56" rx="7" fill="#fff" stroke={INK} strokeWidth="3" />
    <text x="22" y="25" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="900" fontSize="18" fill={INK}>{atas}</text>
    <line x1="12" y1="31" x2="32" y2="31" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <text x="22" y="50" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="900" fontSize="18" fill={INK}>{bawah}</text>
  </svg>
);

/* ── Kue lingkaran + batang cokelat ───────────────────────────── */
export const IlustrasiEksplorasi: React.FC<IlustrasiProps> = ({ className }) => (
  <svg viewBox="0 0 130 120" className={className} aria-hidden="true">
    {/* kue lingkaran 1/4 */}
    <ellipse cx="54" cy="56" rx="44" ry="30" fill="#BFA6F5" stroke={INK} strokeWidth="3.5" />
    <ellipse cx="54" cy="50" rx="44" ry="30" fill="#E9E1FF" stroke={INK} strokeWidth="3.5" />
    <path d="M54 50 L54 20 A44 30 0 0 1 98 50 Z" fill="#8E6CF0" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    <line x1="54" y1="50" x2="10" y2="50" stroke={INK} strokeWidth="2.5" />
    <line x1="54" y1="50" x2="54" y2="80" stroke={INK} strokeWidth="2.5" />
    {/* batang cokelat 2x3 */}
    <g transform="translate(14 78)">
      <rect x="0" y="0" width="72" height="34" rx="4" fill="#5B3420" stroke={INK} strokeWidth="3.5" />
      {[0, 1, 2].map((c) =>
        [0, 1].map((r) => (
          <rect
            key={`${c}-${r}`}
            x={4 + c * 22.5}
            y={4 + r * 14}
            width="19"
            height="11"
            rx="2"
            fill={c === 2 ? '#F3D9B5' : '#8A5A3B'}
            stroke="#3A1F12"
            strokeWidth="1.5"
          />
        ))
      )}
    </g>
  </svg>
);

/* ── Papan klip + sasaran ─────────────────────────────────────── */
export const IlustrasiTujuan: React.FC<IlustrasiProps> = ({ className }) => (
  <svg viewBox="0 0 130 120" className={className} aria-hidden="true">
    <rect x="10" y="14" width="74" height="96" rx="8" fill="#C98A4B" stroke={INK} strokeWidth="3.5" />
    <rect x="18" y="24" width="58" height="80" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
    <rect x="32" y="8" width="30" height="14" rx="4" fill="#9AA3B8" stroke={INK} strokeWidth="3" />
    {[40, 60, 80].map((y) => (
      <g key={y}>
        <rect x="24" y={y - 7} width="12" height="12" rx="2" fill="#E2FAEC" stroke={INK} strokeWidth="2" />
        <path d={`M26 ${y - 1} l3 3 6 -7`} fill="none" stroke="#22A55B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y={y - 3} width="30" height="4" rx="2" fill="#CBD2E0" />
      </g>
    ))}
    {/* sasaran */}
    <circle cx="96" cy="84" r="26" fill="#fff" stroke={INK} strokeWidth="3.5" />
    <circle cx="96" cy="84" r="19" fill="#E5484D" />
    <circle cx="96" cy="84" r="12" fill="#fff" />
    <circle cx="96" cy="84" r="6" fill="#E5484D" />
    <line x1="96" y1="84" x2="122" y2="58" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    <path d="M118 54 l8 -2 -2 8 z" fill="#FFD23F" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/* ── Ranting daun salam (laurel) ──────────────────────────────── */
export const IlustrasiLaurel: React.FC<IlustrasiProps & { cermin?: boolean }> = ({ className, cermin }) => (
  <svg viewBox="0 0 50 90" className={className} aria-hidden="true" style={cermin ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M40 86 C14 70 8 40 22 8" fill="none" stroke="#C98A00" strokeWidth="4" strokeLinecap="round" />
    {[14, 28, 42, 56, 70].map((y, i) => (
      <g key={y}>
        <ellipse cx={16 + i * 2} cy={y} rx="9" ry="4.5" transform={`rotate(-35 ${16 + i * 2} ${y})`} fill="#FFD23F" stroke={INK} strokeWidth="2" />
        <ellipse cx={30 + i * 1.5} cy={y + 6} rx="9" ry="4.5" transform={`rotate(30 ${30 + i * 1.5} ${y + 6})`} fill="#FFC21A" stroke={INK} strokeWidth="2" />
      </g>
    ))}
  </svg>
);

/* ── Panji gantung berlogo M ──────────────────────────────────── */
export const IlustrasiPanji: React.FC<IlustrasiProps> = ({ className }) => (
  <svg viewBox="0 0 80 150" className={className} aria-hidden="true">
    <rect x="4" y="4" width="72" height="10" rx="5" fill="#C98A00" stroke={INK} strokeWidth="3" />
    <path d="M10 14 H70 V128 L40 108 L10 128 Z" fill="#FF6B35" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
    <path d="M18 20 H62 V112 L40 98 L18 112 Z" fill="none" stroke="#FFD23F" strokeWidth="3" strokeLinejoin="round" />
    <text x="40" y="72" textAnchor="middle" fontFamily="'Baloo 2', sans-serif" fontWeight="900" fontSize="36" fill="#FFD23F" stroke={INK} strokeWidth="1.5">M</text>
  </svg>
);
