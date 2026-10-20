import React from 'react';
import { motion } from 'framer-motion';

export type BentukTim = 'diamond' | 'circle' | 'triangle' | 'square' | 'star';

export interface BidakProps {
  id?: string;
  namaPemain?: string;
  warna?: string;
  bentuk?: BentukTim;
  size?: number; // default 36px
  slotIndex?: number; // 0, 1, 2, 3 untuk posisi dalam satu petak tanpa menumpuk
  isAktif?: boolean;
  className?: string;
}

const IKON_BENTUK: Record<BentukTim, () => React.ReactNode> = {
  diamond: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white stroke-[#1E2149] stroke-2">
      <polygon points="12,2 22,12 12,22 2,12" />
    </svg>
  ),
  circle: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white stroke-[#1E2149] stroke-2">
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  triangle: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white stroke-[#1E2149] stroke-2">
      <polygon points="12,2 22,21 2,21" />
    </svg>
  ),
  square: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white stroke-[#1E2149] stroke-2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
  star: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white stroke-[#1E2149] stroke-2">
      <polygon points="12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9" />
    </svg>
  ),
};

export const Bidak: React.FC<BidakProps> = ({
  namaPemain = 'Pemain',
  warna = '#FF6B35',
  bentuk = 'circle',
  size = 38,
  slotIndex = 0,
  isAktif = false,
  className = ''
}) => {
  // Offset 2x2 grid dalam petak:
  // slot 0: kiri atas (-6px, -6px)
  // slot 1: kanan atas (+6px, -6px)
  // slot 2: kiri bawah (-6px, +6px)
  // slot 3: kanan bawah (+6px, +6px)
  const offsets = [
    { x: -7, y: -7 },
    { x: 7, y: -7 },
    { x: -7, y: 7 },
    { x: 7, y: 7 },
  ];
  const currentOffset = offsets[slotIndex % 4] || { x: 0, y: 0 };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        zIndex: isAktif ? 30 : 20 + slotIndex,
      }}
      animate={isAktif ? { y: [currentOffset.y - 4, currentOffset.y, currentOffset.y - 4] } : {}}
      transition={isAktif ? { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } : {}}
      title={namaPemain}
    >
      {/* Cincin Sorot Bidak Aktif */}
      {isAktif && (
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-60"
          style={{ backgroundColor: warna }}
        />
      )}

      {/* Badan Bidak Pion */}
      <div
        className="w-full h-full rounded-full border-2 border-[#1E2149] flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.25)] relative"
        style={{ backgroundColor: warna }}
      >
        {/* Ikon Bentuk Tim di Tengah Bidak */}
        <div className="shrink-0 flex items-center justify-center">
          {IKON_BENTUK[bentuk]()}
        </div>
      </div>
    </motion.div>
  );
};
