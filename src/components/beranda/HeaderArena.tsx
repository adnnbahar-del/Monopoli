import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { PakPeca } from '../PakPeca';
import { IlustrasiLaurel } from './Ilustrasi';

/**
 * Header Beranda: logo MONOPECA (kiri), emblem "Arena Turnamen Matematika"
 * (tengah), dan maskot Pak Peca dengan balon ucapan (kanan).
 */
export const HeaderArena: React.FC = () => (
  <header className="relative pt-5 pb-3 grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
    {/* Logo */}
    <div className="flex items-center gap-3 justify-center lg:justify-start">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#FF8A4C] to-[#F25A24] border-[3px] border-[#1E2149] flex items-center justify-center text-white font-display font-black text-3xl shadow-[0_5px_0_#1E2149] shrink-0">
        M
      </div>
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-[#1E2149] tracking-tight leading-none">
          MONOPECA
        </h1>
        <p className="text-xs sm:text-sm lg:text-xs xl:text-sm font-extrabold text-[#1E2149]/80 mt-1 lg:whitespace-nowrap">
          Monopoli Pecahan • Matematika Kelas V SD
        </p>
      </div>
    </div>

    {/* Emblem judul */}
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
      className="relative flex items-center justify-center order-first lg:order-none"
    >
      <IlustrasiLaurel className="w-9 sm:w-12 -mr-2 drop-shadow" />
      <div className="relative">
        <div className="flex justify-center gap-0.5 -mb-1.5 relative z-10">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className={`fill-[#FFD23F] text-[#1E2149] ${i === 2 ? 'w-5 h-5 -mt-1' : 'w-4 h-4'}`}
              strokeWidth={2}
            />
          ))}
        </div>
        <div className="px-5 sm:px-8 pt-2 pb-5 rounded-[26px] bg-gradient-to-b from-[#8B5CF6] to-[#5B2FD0] border-4 border-[#1E2149] shadow-[0_6px_0_#3F1CA6] text-center">
          <h2 className="font-display font-black text-[#FFD23F] text-2xl sm:text-3xl leading-[1.05] [text-shadow:0_3px_0_#1E2149]">
            Arena Turnamen
            <br />
            Matematika
          </h2>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 whitespace-nowrap px-4 py-1 rounded-xl bg-gradient-to-b from-[#FFE79A] to-[#FFC93C] border-[3px] border-[#1E2149] shadow-[0_3px_0_#C79E1A] font-display font-black text-sm sm:text-base text-[#3F1CA6]">
          Pecahan – Kelas V SD
        </div>
      </div>
      <IlustrasiLaurel cermin className="w-9 sm:w-12 -ml-2 drop-shadow" />
    </motion.div>

    {/* Maskot + balon ucapan */}
    <div className="hidden sm:flex items-center gap-1 justify-center lg:justify-end">
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <PakPeca ekspresi="ceria" size={92} />
      </motion.div>
      <div className="relative max-w-[220px] px-4 py-2.5 rounded-3xl bg-white border-[3px] border-[#1E2149] shadow-[0_4px_0_rgba(30,33,73,0.25)] -rotate-2">
        <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-[3px] border-b-[3px] border-[#1E2149] rotate-45" />
        <p className="relative font-display font-extrabold text-sm leading-snug text-[#1E2149]">
          Halo Sobat Pecahan! Ayo pilih petualangan belajarmu hari ini!
        </p>
      </div>
    </div>
  </header>
);
