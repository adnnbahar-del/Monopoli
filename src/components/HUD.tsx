import React from 'react';
import { Pause, Clock, Trophy } from 'lucide-react';
import { BentukTim } from './Bidak';

export interface PemainHUD {
  id: string;
  nama: string;
  timNama: string;
  warna: string;
  bentuk: BentukTim;
  poin: number;
}

export interface HUDProps {
  pemainAktif: PemainHUD;
  semuaPemain: PemainHUD[];
  sisaDetik: number;
  onJeda?: () => void;
  className?: string;
}

export const HUD: React.FC<HUDProps> = ({
  pemainAktif,
  semuaPemain,
  sisaDetik,
  onJeda,
  className = ''
}) => {
  const menit = Math.floor(sisaDetik / 60);
  const detik = sisaDetik % 60;
  const formatWaktu = `${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`;

  return (
    <header
      className={`
        w-full bg-[#FFF8EC]/95 backdrop-blur-md border-b-4 border-[#1E2149]
        px-3 sm:px-6 py-2.5 shadow-soft-card flex items-center justify-between gap-3 select-none
        ${className}
      `}
    >
      {/* Kiri: Pemain yang Sedang Giliran */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-2 border-[#1E2149] flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.15)] shrink-0"
          style={{ backgroundColor: pemainAktif.warna }}
        >
          <span className="text-white font-display font-extrabold text-xl">
            {pemainAktif.nama.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-gray-500">
              Giliran Saat Ini
            </span>
            <span
              className="text-[10px] px-1.5 py-0.2 rounded-full font-bold text-white"
              style={{ backgroundColor: pemainAktif.warna }}
            >
              {pemainAktif.timNama}
            </span>
          </div>
          <h1 className="text-sm sm:text-base font-display font-extrabold text-[#1E2149] leading-tight truncate max-w-[120px] sm:max-w-[200px]">
            {pemainAktif.nama}
          </h1>
        </div>
      </div>

      {/* Tengah: Ringkasan Skor Semua Pemain */}
      <div className="hidden md:flex items-center gap-2 overflow-x-auto py-1 max-w-xl">
        {semuaPemain.map((p) => {
          const isCurrent = p.id === pemainAktif.id;
          return (
            <div
              key={p.id}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-[#1E2149] text-xs font-bold transition-all
                ${isCurrent ? 'bg-amber-100/90 shadow-[0_2px_0_#1E2149] scale-105' : 'bg-white opacity-85'}
              `}
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-[#1E2149]"
                style={{ backgroundColor: p.warna }}
              />
              <span className="truncate max-w-[80px]">{p.nama}</span>
              <span className="flex items-center gap-0.5 text-[#FF6B35] font-extrabold">
                <Trophy className="w-3 h-3" />
                {p.poin}
              </span>
            </div>
          );
        })}
      </div>

      {/* Kanan: Timer & Tombol Jeda */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Timer Box */}
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border-2 border-[#1E2149] shadow-[0_2px_0_#D4C4A8]">
          <Clock className="w-4 h-4 text-[#FF6B35]" />
          <span className="font-display font-extrabold text-sm sm:text-base text-[#1E2149]">
            {formatWaktu}
          </span>
        </div>

        {/* Tombol Jeda */}
        {onJeda && (
          <button
            type="button"
            onClick={onJeda}
            className="h-10 px-3 sm:px-4 bg-[#FFD23F] hover:bg-[#EBC032] border-2 border-[#1E2149] rounded-xl font-display font-extrabold text-xs sm:text-sm text-[#1E2149] shadow-[0_3px_0_#C79E1A] active:translate-y-[2px] active:shadow-[0_1px_0_#C79E1A] flex items-center gap-1.5 cursor-pointer"
          >
            <Pause className="w-4 h-4" />
            <span className="hidden sm:inline">Jeda</span>
          </button>
        )}
      </div>
    </header>
  );
};
