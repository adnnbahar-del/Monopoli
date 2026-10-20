import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavHeader } from '../components/NavHeader';
import { DAFTAR_MATERI } from '../data/materi';
import { VisualPecahan } from '../components/VisualPecahan';
import { Pecahan } from '../components/Pecahan';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { ArrowLeft, ArrowRight, Compass, Sparkles } from 'lucide-react';

export interface MateriKilatProps {
  onKembali: () => void;
  onBeranda: () => void;
  onBukaEksplorasi: () => void;
  tpAwalIndex?: number;
}

export const MateriKilat: React.FC<MateriKilatProps> = ({
  onKembali,
  onBeranda,
  onBukaEksplorasi,
  tpAwalIndex = 0
}) => {
  const [indexAktif, setIndexAktif] = useState(tpAwalIndex);
  const materi = DAFTAR_MATERI[indexAktif];

  const handleNext = () => {
    if (indexAktif < DAFTAR_MATERI.length - 1) {
      setIndexAktif(indexAktif + 1);
    }
  };

  const handlePrev = () => {
    if (indexAktif > 0) {
      setIndexAktif(indexAktif - 1);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Materi Kilat Pecahan"
        subjudul={`${materi.kodeTP}: ${materi.judul}`}
        onKembali={onKembali}
        onBeranda={onBeranda}
        rightAction={
          <TombolChunky
            variant="accent"
            size="sm"
            icon={<Compass className="w-4 h-4" />}
            onClick={onBukaEksplorasi}
          >
            Mode Eksplorasi
          </TombolChunky>
        }
      />

      <div className="max-w-4xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">
        {/* Stepper Indikator TP1 - TP7 */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-2 px-1">
          {DAFTAR_MATERI.map((m, idx) => {
            const isCurrent = idx === indexAktif;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setIndexAktif(idx)}
                className={`
                  px-3 py-1.5 rounded-xl border-2 border-[#1E2149] font-display font-extrabold text-xs sm:text-sm shrink-0 cursor-pointer transition-all
                  ${isCurrent ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B] scale-105' : 'bg-[#FFF8EC] text-[#1E2149] hover:bg-amber-100'}
                `}
              >
                {m.kodeTP}
              </button>
            );
          })}
        </div>

        {/* Slide Konten Materi Aktif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={materi.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="p-5 sm:p-8 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-6"
          >
            {/* Header Slide */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#1E2149]/20 pb-4">
              <div>
                <span className="text-xs font-display font-extrabold uppercase bg-[#2EC4B6] text-white px-3 py-1 rounded-full border border-[#1E2149]">
                  {materi.kodeTP} dari 7 TP
                </span>
                <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149] mt-2">
                  {materi.judul}
                </h2>
              </div>
              <div className="shrink-0 flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
                <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                <span className="text-xs font-bold text-gray-700">Fase C Kelas V</span>
              </div>
            </div>

            {/* Bagian Visual Pecahan & Poin Penjelasan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Kolom Kiri: Visual Pecahan */}
              <div className="p-5 bg-amber-50/70 border-2 border-[#1E2149] rounded-2xl flex flex-col items-center justify-center text-center">
                <VisualPecahan
                  bentuk={materi.visual.bentuk}
                  pembilang={materi.visual.pembilang}
                  penyebut={materi.visual.penyebut}
                  size={190}
                />
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-600">Representasi:</span>
                  <Pecahan
                    value={{ pembilang: materi.visual.pembilang, penyebut: materi.visual.penyebut }}
                    size="xl"
                  />
                </div>
              </div>

              {/* Kolom Kanan: Poin Penjelasan */}
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-display font-extrabold text-[#FF6B35]">
                  {materi.ringkasan}
                </p>
                <ul className="space-y-2">
                  {materi.penjelasan.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base font-bold text-gray-800">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B35] mt-2 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Konteks Nyata Sehari-hari */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50 border-2 border-[#2EC4B6] space-y-2">
              <span className="text-xs font-display font-black uppercase text-[#2EC4B6] tracking-wider block">
                🏪 Contoh Nyata dalam Kehidupan Sehari-hari
              </span>
              <h3 className="text-lg font-display font-black text-[#1E2149]">
                {materi.konteksLokal.judul}
              </h3>
              <p className="text-sm sm:text-base font-bold text-gray-800 leading-relaxed">
                {materi.konteksLokal.cerita}
              </p>
              <div className="text-xs font-black text-[#FF6B35] bg-white inline-block px-3 py-1 rounded-lg border border-[#2EC4B6]">
                Nilai Pecahan: {materi.konteksLokal.pecahan}
              </div>
            </div>

            {/* Tips Maskot Pak Peca */}
            <div className="p-4 rounded-2xl bg-amber-100/60 border-2 border-[#FFB627] flex items-center gap-4">
              <PakPeca ekspresi="senang" size={70} />
              <p className="text-xs sm:text-sm font-bold text-[#1E2149] leading-snug">
                💡 <span className="font-extrabold text-[#FF6B35]">Tips Pak Peca:</span> {materi.tipsPakPeca}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tombol Navigasi Slide: Sebelumnya / Selanjutnya */}
        <div className="flex items-center justify-between gap-4">
          <TombolChunky
            variant="paper"
            size="md"
            icon={<ArrowLeft className="w-5 h-5" />}
            disabled={indexAktif === 0}
            onClick={handlePrev}
            className="min-w-[130px]"
          >
            Sebelumnya
          </TombolChunky>

          <span className="text-sm font-display font-black text-[#1E2149]">
            {indexAktif + 1} / {DAFTAR_MATERI.length}
          </span>

          <TombolChunky
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            disabled={indexAktif === DAFTAR_MATERI.length - 1}
            onClick={handleNext}
            className="min-w-[130px]"
          >
            Selanjutnya
          </TombolChunky>
        </div>
      </div>
    </div>
  );
};
