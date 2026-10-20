import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export interface NavHeaderProps {
  judul: string;
  subjudul?: string;
  onKembali?: () => void;
  onBeranda?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  judul,
  subjudul,
  onKembali,
  onBeranda,
  rightAction,
  className = ''
}) => {
  return (
    <header
      className={`
        sticky top-0 z-30 w-full bg-[#FFF8EC]/95 backdrop-blur-md
        border-b-4 border-[#1E2149] px-4 py-2.5 sm:px-6 shadow-sm
        flex items-center justify-between gap-3 select-none
        ${className}
      `}
    >
      {/* KIRI: Tombol Kembali dan Beranda */}
      <div className="flex items-center gap-2">
        {onKembali && (
          <button
            type="button"
            onClick={onKembali}
            title="Kembali ke halaman sebelumnya"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFF8EC] hover:bg-amber-100/70 border-2 border-[#1E2149] flex items-center justify-center text-[#1E2149] shadow-[0_3px_0_#D4C4A8] active:translate-y-0.5 active:shadow-[0_1px_0_#D4C4A8] cursor-pointer transition-all"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        {onBeranda && (
          <button
            type="button"
            onClick={onBeranda}
            title="Kembali ke Menu Utama (Beranda)"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#FFD23F] hover:bg-[#EBC032] border-2 border-[#1E2149] flex items-center justify-center text-[#1E2149] shadow-[0_3px_0_#C79E1A] active:translate-y-0.5 active:shadow-[0_1px_0_#C79E1A] cursor-pointer transition-all"
          >
            <Home className="w-6 h-6 stroke-[2.5]" />
          </button>
        )}

        <div className="ml-1 sm:ml-2">
          <h1 className="text-lg sm:text-xl font-display font-extrabold text-[#1E2149] leading-tight">
            {judul}
          </h1>
          {subjudul && (
            <p className="text-xs font-bold text-gray-600 hidden sm:block">
              {subjudul}
            </p>
          )}
        </div>
      </div>

      {/* KANAN: Aksi tambahan (misal info, audio, pengaturan) */}
      {rightAction && (
        <div className="flex items-center gap-2 shrink-0">
          {rightAction}
        </div>
      )}
    </header>
  );
};
