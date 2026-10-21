import React from 'react';
import { motion } from 'framer-motion';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { Sparkles, Play } from 'lucide-react';

export interface SplashProps {
  onMulai: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onMulai }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 text-center select-none relative overflow-hidden tapis-pattern">
      {/* Ornamen Lingkaran Sinar Matahari Sore */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-[#FFD23F]/30 to-[#FF6B35]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Bagian Atas: Tag Kurikulum */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-4 z-10"
      >
        <span className="inline-flex items-center gap-2 bg-[#FFF8EC] border-2 border-[#1E2149] px-4 py-1.5 rounded-full text-xs sm:text-sm font-display font-extrabold text-[#1E2149] shadow-[0_3px_0_#D4C4A8]">
          <Sparkles className="w-4 h-4 text-[#FF6B35]" />
          Matematika Kelas V SD — Kurikulum Merdeka (Fase C)
        </span>
      </motion.div>

      {/* Bagian Tengah: Logo & Maskot */}
      <div className="my-auto flex flex-col items-center z-10 max-w-lg">
        {/* Maskot Pak Peca */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
          className="mb-4"
        >
          <PakPeca ekspresi="ceria" size={140} />
        </motion.div>

        {/* Judul Besar Logo */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-5xl sm:text-7xl font-display font-black text-[#FF6B35] tracking-tight drop-shadow-[0_4px_0_#1E2149] stroke-text">
            MONOPECA
          </h1>
          <div className="h-1.5 w-36 bg-[#1E2149] mx-auto rounded-full my-2" />
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[#1E2149]">
            Monopoli Pecahan
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-2 max-w-md mx-auto">
            Media Belajar Kolaboratif Model Teams Games Tournament (TGT)
          </p>
        </motion.div>
      </div>

      {/* Bagian Bawah: Tombol Mulai */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="pb-8 w-full max-w-xs z-10"
      >
        <TombolChunky
          variant="primary"
          size="lg"
          fullWidth
          icon={<Play className="w-7 h-7 fill-white" />}
          onClick={onMulai}
          className="animate-bounce"
        >
          Ketuk Untuk Mulai
        </TombolChunky>
        <p className="text-xs font-bold text-gray-600 mt-3">
          Ramah Anak • Tanpa Iklan
        </p>
      </motion.div>
    </div>
  );
};
