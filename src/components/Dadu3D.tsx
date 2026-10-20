import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface Dadu3DProps {
  nilai?: number;
  onLempar?: (hasil: number) => void;
  isRolling?: boolean;
  disabled?: boolean;
  size?: number; // default 90px
  className?: string;
}

// Rotasi 3D untuk masing-masing sisi dadu 1 - 6
const SISI_ROTASI: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 }
};

export function kocokDaduCrypto(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return (array[0] % 6) + 1;
}

export const Dadu3D: React.FC<Dadu3DProps> = ({
  nilai = 1,
  onLempar,
  isRolling: externalRolling,
  disabled = false,
  size = 90,
  className = ''
}) => {
  const [internalRolling, setInternalRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState(nilai);
  const [extraRotation, setExtraRotation] = useState({ x: 0, y: 0 });

  const rolling = externalRolling !== undefined ? externalRolling : internalRolling;
  const half = size / 2;

  const handleKocok = () => {
    if (rolling || disabled) return;

    setInternalRolling(true);
    const hasil = kocokDaduCrypto();

    // Tambahkan putaran acak 2-4 putaran penuh (720 - 1440 deg)
    const spinX = (Math.floor(Math.random() * 3) + 2) * 360;
    const spinY = (Math.floor(Math.random() * 3) + 2) * 360;
    setExtraRotation(prev => ({ x: prev.x + spinX, y: prev.y + spinY }));

    setTimeout(() => {
      setCurrentValue(hasil);
      setInternalRolling(false);
      if (onLempar) onLempar(hasil);
    }, 1200);
  };

  const rot = SISI_ROTASI[currentValue] || SISI_ROTASI[1];
  const finalX = rot.x + extraRotation.x;
  const finalY = rot.y + extraRotation.y;

  // Helper menggambar titik dadu
  const renderTitik = (jumlah: number) => {
    const dots = [];
    const dotClasses: Record<number, string[]> = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    const pos = dotClasses[jumlah] || [];
    for (let i = 0; i < pos.length; i++) {
      let pClass = '';
      if (pos[i] === 'center') pClass = 'col-start-2 row-start-2';
      else if (pos[i] === 'top-left') pClass = 'col-start-1 row-start-1';
      else if (pos[i] === 'top-right') pClass = 'col-start-3 row-start-1';
      else if (pos[i] === 'middle-left') pClass = 'col-start-1 row-start-2';
      else if (pos[i] === 'middle-right') pClass = 'col-start-3 row-start-2';
      else if (pos[i] === 'bottom-left') pClass = 'col-start-1 row-start-3';
      else if (pos[i] === 'bottom-right') pClass = 'col-start-3 row-start-3';

      dots.push(
        <span
          key={i}
          className={`w-3.5 h-3.5 rounded-full bg-[#1E2149] shadow-inner ${pClass}`}
        />
      );
    }

    return (
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-2.5 items-center justify-items-center">
        {dots}
      </div>
    );
  };

  return (
    <div
      className={`perspective-1000 inline-block cursor-pointer select-none ${className}`}
      onClick={handleKocok}
      title="Ketuk untuk melempar dadu"
    >
      <motion.div
        className="relative transform-style-3d"
        style={{ width: size, height: size }}
        animate={{
          rotateX: finalX,
          rotateY: finalY,
        }}
        transition={{
          duration: 1.2,
          ease: [0.25, 1, 0.5, 1]
        }}
      >
        {/* Sisi 1 (Depan) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `translateZ(${half}px)` }}
        >
          {renderTitik(1)}
        </div>

        {/* Sisi 2 (Belakang) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}
        >
          {renderTitik(2)}
        </div>

        {/* Sisi 3 (Kanan) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}
        >
          {renderTitik(3)}
        </div>

        {/* Sisi 4 (Kiri) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}
        >
          {renderTitik(4)}
        </div>

        {/* Sisi 5 (Atas) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}
        >
          {renderTitik(5)}
        </div>

        {/* Sisi 6 (Bawah) */}
        <div
          className="absolute inset-0 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-2xl shadow-soft-card flex items-center justify-center backface-hidden"
          style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}
        >
          {renderTitik(6)}
        </div>
      </motion.div>
    </div>
  );
};
