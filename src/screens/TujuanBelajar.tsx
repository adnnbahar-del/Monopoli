import React from 'react';
import { motion } from 'framer-motion';
import { NavHeader } from '../components/NavHeader';
import { CP_FASE_C, DAFTAR_MATERI } from '../data/materi';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { Target, CheckCircle2, ArrowRight } from 'lucide-react';

export interface TujuanBelajarProps {
  onKembali: () => void;
  onBeranda: () => void;
  onMulaiMateri?: () => void;
}

export const TujuanBelajar: React.FC<TujuanBelajarProps> = ({
  onKembali,
  onBeranda,
  onMulaiMateri
}) => {
  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Tujuan Belajar & Kurikulum"
        subjudul="Capaian Pembelajaran (CP) dan Alur TP1–TP7"
        onKembali={onKembali}
        onBeranda={onBeranda}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner Capaian Pembelajaran (CP) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF6B35] border-2 border-[#1E2149] flex items-center justify-center text-white shrink-0 shadow-[0_3px_0_#C4471B]">
              <Target className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-display font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149]">
                {CP_FASE_C.fase} • Elemen {CP_FASE_C.elemen}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149] mt-2 mb-2">
                Capaian Pembelajaran (CP)
              </h2>
              <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed bg-amber-50/80 p-4 rounded-2xl border-2 border-[#FFB627]">
                "{CP_FASE_C.capaian}"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daftar 7 Tujuan Pembelajaran (TP1 - TP7) */}
        <div className="space-y-3">
          <h2 className="text-xl font-display font-black text-[#1E2149] flex items-center gap-2 px-1">
            <span>Alur Tujuan Pembelajaran (ATP) Matematika Pecahan:</span>
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {DAFTAR_MATERI.map((materi, idx) => (
              <motion.div
                key={materi.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-4 sm:p-5 rounded-2xl bg-[#FFF8EC] border-3 border-[#1E2149] shadow-[0_4px_0_#D4C4A8] flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2EC4B6] border-2 border-[#1E2149] text-white flex items-center justify-center font-display font-black text-sm shrink-0 shadow-[0_2px_0_#1B8C81]">
                  {materi.kodeTP}
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-display font-black text-[#1E2149] leading-snug">
                    {materi.judul}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                    {materi.ringkasan}
                  </p>
                  <div className="mt-2 text-xs font-extrabold text-[#FF6B35] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Konteks Sukaraja: {materi.konteksLokal.judul} ({materi.konteksLokal.pecahan})
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Kotak Pesan Maskot & Tombol Aksi */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <PakPeca
            ekspresi="semangat"
            size={90}
            pesan="Siap menguasai seluruh TP ini? Ayo pelajari materinya atau langsung main bersama tim!"
          />

          {onMulaiMateri && (
            <TombolChunky
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-6 h-6" />}
              iconPosition="right"
              onClick={onMulaiMateri}
              className="w-full sm:w-auto"
            >
              Buka Materi Kilat
            </TombolChunky>
          )}
        </motion.div>
      </div>
    </div>
  );
};
