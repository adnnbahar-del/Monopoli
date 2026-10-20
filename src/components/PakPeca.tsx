import React from 'react';

export type EkspresiPakPeca = 'ceria' | 'senang' | 'berpikir' | 'semangat' | 'bingung';

export interface PakPecaProps {
  ekspresi?: EkspresiPakPeca;
  size?: number;
  pesan?: string;
  className?: string;
}

export const PakPeca: React.FC<PakPecaProps> = ({
  ekspresi = 'ceria',
  size = 120,
  pesan,
  className = ''
}) => {
  return (
    <div className={`inline-flex flex-col sm:flex-row items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        className="shrink-0 drop-shadow-lg select-none"
        aria-label={`Maskot Pak Peca - Ekspresi ${ekspresi}`}
      >
        <defs>
          <radialGradient id="boluGradient" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="60%" stopColor="#FFCA28" />
            <stop offset="100%" stopColor="#FFA000" />
          </radialGradient>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#1E2149" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Topi Koki Tradisional Kecil */}
        <g transform="translate(62, 10)">
          <path
            d="M 6 22 C 2 12, 12 4, 18 8 C 24 0, 32 4, 34 12 C 40 12, 42 22, 36 24 Z"
            fill="#FFF8EC"
            stroke="#1E2149"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <rect x="6" y="22" width="30" height="6" rx="3" fill="#FF6B35" stroke="#1E2149" strokeWidth="2.5" />
        </g>

        {/* Tubuh Bulat Bolu Sukaraja */}
        <circle
          cx="80"
          cy="90"
          r="60"
          fill="url(#boluGradient)"
          stroke="#1E2149"
          strokeWidth="5"
        />

        {/* Irisan Garis Pecahan di Kulit Bolu (Motif Khas) */}
        <path
          d="M 80 32 L 80 50 M 138 90 L 120 90 M 80 148 L 80 130 M 22 90 L 40 90"
          stroke="#D97706"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Pipi Merona Ceria */}
        <circle cx="48" cy="100" r="10" fill="#FF8A80" opacity="0.6" />
        <circle cx="112" cy="100" r="10" fill="#FF8A80" opacity="0.6" />

        {/* Mata dan Alis Sesuai Ekspresi */}
        {ekspresi === 'ceria' && (
          <>
            {/* Mata Melengkung Bahagia ^ ^ */}
            <path d="M 52 82 Q 62 70 72 82" stroke="#1E2149" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 88 82 Q 98 70 108 82" stroke="#1E2149" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Mulut Senyum Lebar */}
            <path
              d="M 64 96 Q 80 120 96 96 Z"
              fill="#E5484D"
              stroke="#1E2149"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Lidah */}
            <path d="M 72 108 Q 80 102 88 108 Q 80 118 72 108" fill="#FF8A80" />
          </>
        )}

        {ekspresi === 'semangat' && (
          <>
            {/* Mata Berbintang Semangat */}
            <circle cx="60" cy="80" r="7" fill="#1E2149" />
            <circle cx="58" cy="77" r="2.5" fill="#FFF" />
            <circle cx="100" cy="80" r="7" fill="#1E2149" />
            <circle cx="98" cy="77" r="2.5" fill="#FFF" />
            {/* Alis Tekad */}
            <path d="M 50 70 L 68 74" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 110 70 L 92 74" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" />
            {/* Mulut Terbuka Semangat */}
            <path d="M 66 94 Q 80 124 94 94 Z" fill="#E5484D" stroke="#1E2149" strokeWidth="4" />
          </>
        )}

        {ekspresi === 'berpikir' && (
          <>
            {/* Mata Melirik ke Atas */}
            <circle cx="62" cy="78" r="6" fill="#1E2149" />
            <circle cx="102" cy="78" r="6" fill="#1E2149" />
            <path d="M 52 68 Q 62 64 72 68" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 92 68 Q 102 64 112 68" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            {/* Mulut O Berpikir */}
            <ellipse cx="80" cy="102" rx="7" ry="10" fill="#E5484D" stroke="#1E2149" strokeWidth="3.5" />
          </>
        )}

        {ekspresi === 'bingung' && (
          <>
            {/* Mata Berputar / Bingung */}
            <circle cx="60" cy="80" r="6" fill="#1E2149" />
            <circle cx="100" cy="80" r="6" fill="#1E2149" />
            <path d="M 50 68 L 70 74" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 90 74 L 110 68" stroke="#1E2149" strokeWidth="3.5" strokeLinecap="round" />
            {/* Mulut Gelombang */}
            <path d="M 68 102 Q 74 96 80 102 T 92 102" stroke="#1E2149" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}

        {ekspresi === 'senang' && (
          <>
            <circle cx="60" cy="80" r="7" fill="#1E2149" />
            <circle cx="58" cy="77" r="2.5" fill="#FFF" />
            <circle cx="100" cy="80" r="7" fill="#1E2149" />
            <circle cx="98" cy="77" r="2.5" fill="#FFF" />
            <path d="M 68 98 Q 80 114 92 98" stroke="#1E2149" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Tangan Bolu Menyapa */}
        <g transform="translate(130, 85)">
          <path d="M 4 8 Q 18 0 20 14 Q 22 24 10 22 Z" fill="#FFCA28" stroke="#1E2149" strokeWidth="3.5" />
        </g>
      </svg>

      {/* Balon Ucapan Jika Ada Pesan */}
      {pesan && (
        <div className="relative bg-[#FFF8EC] border-2 border-[#1E2149] rounded-2xl p-4 shadow-[0_6px_0_#D4C4A8] max-w-xs text-sm sm:text-base font-bold text-ink leading-snug">
          {pesan}
          {/* Panah Balon Ucapan */}
          <div className="hidden sm:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[10px] border-r-[#1E2149]" />
          <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[9px] border-r-[#FFF8EC]" />
        </div>
      )}
    </div>
  );
};
