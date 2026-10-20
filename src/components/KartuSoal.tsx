import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, HelpCircle, Check, X, RotateCw, ArrowRight } from 'lucide-react';
import { VisualPecahan, BentukVisual } from './VisualPecahan';
import { renderTeksDenganPecahan } from './Pecahan';
import { TombolChunky } from './TombolChunky';

export type TipeKartu = 'petak' | 'kesempatan' | 'tantangan' | 'turnamen';
export type LevelSoal = 'mudah' | 'sedang' | 'sukar';

export interface KartuSoalProps {
  id?: string;
  tipe?: TipeKartu;
  subtopik?: string;
  level?: LevelSoal;
  tp?: string;
  pertanyaan: string;
  opsi: string[];
  kunci?: string;
  pembahasan?: string;
  visual?: {
    bentuk: BentukVisual;
    pembilang: number;
    penyebut: number;
  };
  konteks?: string;
  isFlippedInitial?: boolean;
  onJawab?: (pilihan: string, benar: boolean) => void;
  onLanjut?: () => void;
  teksLanjut?: string;
  autoLanjutDetik?: number;
  className?: string;
}

export const KartuSoal: React.FC<KartuSoalProps> = ({
  tipe = 'petak',
  subtopik = 'Mengenal Pecahan',
  level = 'sedang',
  tp,
  pertanyaan,
  opsi,
  kunci,
  pembahasan,
  visual,
  konteks,
  isFlippedInitial = false,
  onJawab,
  onLanjut,
  teksLanjut,
  autoLanjutDetik,
  className = ''
}) => {
  const [flipped, setFlipped] = useState(isFlippedInitial);
  const [selectedOpsi, setSelectedOpsi] = useState<string | null>(null);
  const [sudahKunci, setSudahKunci] = useState(false);
  const [sisaAutoLanjut, setSisaAutoLanjut] = useState<number | null>(null);

  // Timer auto-lanjut ke soal berikutnya setelah jawaban dikunci
  useEffect(() => {
    if (sisaAutoLanjut === null) return;
    if (sisaAutoLanjut <= 0) {
      if (onLanjut) onLanjut();
      return;
    }
    const timer = setTimeout(() => {
      setSisaAutoLanjut((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [sisaAutoLanjut, onLanjut]);

  const warnaTipe = {
    petak: 'from-[#FF6B35] to-[#FF8A80]',
    kesempatan: 'from-[#FF7EB6] to-[#FFA0CA]',
    tantangan: 'from-[#7B5CFA] to-[#9880FF]',
    turnamen: 'from-[#2EC4B6] to-[#5AE0D4]'
  }[tipe];

  const handlePilih = (ops: string) => {
    if (sudahKunci) return;
    setSelectedOpsi(ops);
  };

  const handleKunciJawaban = () => {
    if (!selectedOpsi || sudahKunci) return;
    setSudahKunci(true);
    const benar = kunci ? selectedOpsi.trim() === kunci.trim() : true;
    if (onJawab) onJawab(selectedOpsi, benar);
    if (autoLanjutDetik && onLanjut) {
      setSisaAutoLanjut(autoLanjutDetik);
    }
  };

  return (
    <div className={`perspective-1000 w-full max-w-lg min-h-[460px] mx-auto select-none ${className}`}>
      <motion.div
        className="relative w-full h-full min-h-[460px] transform-style-3d cursor-pointer"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* SISI DEPAN KARTU */}
        <div
          onClick={() => setFlipped(true)}
          className={`
            absolute inset-0 w-full h-full backface-hidden
            bg-gradient-to-br ${warnaTipe}
            border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card
            flex flex-col items-center justify-between text-white text-center
            tapis-pattern
          `}
        >
          <div className="w-full flex justify-between items-center text-xs sm:text-sm font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40">
            <span>{tipe}</span>
            <span className="flex items-center gap-1 font-extrabold">
              <Sparkles className="w-4 h-4" /> Level: {level}
            </span>
          </div>

          <div className="my-auto flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full bg-white text-[#1E2149] border-4 border-[#1E2149] flex items-center justify-center shadow-[0_6px_0_rgba(0,0,0,0.15)]">
              <HelpCircle className="w-12 h-12 text-[#FF6B35]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold drop-shadow">
              {subtopik}
            </h2>
            {konteks && (
              <p className="text-xs sm:text-sm bg-black/15 px-3 py-1 rounded-lg text-white/90">
                {konteks}
              </p>
            )}
          </div>

          <div className="w-full pt-4 border-t border-white/30 flex items-center justify-center gap-2 text-sm font-bold animate-pulse">
            <RotateCw className="w-4 h-4" />
            <span>Ketuk kartu untuk membuka soal</span>
          </div>
        </div>

        {/* SISI BELAKANG KARTU (SOAL) */}
        <div
          className={`
            absolute inset-0 w-full h-full rotate-y-180 backface-hidden
            bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-5 sm:p-6 shadow-soft-card
            flex flex-col justify-between text-[#1E2149] overflow-y-auto
          `}
        >
          {/* Header Soal */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1E2149]/15">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-[#FFD23F] border border-[#1E2149] text-xs font-display font-black uppercase">
                {level}
              </span>
              <span className="text-xs font-bold text-gray-600 truncate max-w-[180px]">
                {subtopik}
              </span>
            </div>
            {tp && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-300">
                {tp}
              </span>
            )}
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="text-xs font-bold text-[#FF6B35] hover:underline flex items-center gap-1"
            >
              <RotateCw className="w-3.5 h-3.5" /> Balik
            </button>
          </div>

          {/* Isi Pertanyaan & Visual */}
          <div className="my-3 space-y-3">
            <div className="text-base sm:text-lg font-bold leading-relaxed text-[#1E2149]">
              {renderTeksDenganPecahan(pertanyaan, 'md')}
            </div>

            {visual && (
              <div className="flex justify-center p-2 bg-amber-50 rounded-2xl border border-amber-200">
                <VisualPecahan
                  bentuk={visual.bentuk}
                  pembilang={visual.pembilang}
                  penyebut={visual.penyebut}
                  size={150}
                />
              </div>
            )}
          </div>

          {/* Opsi Pilihan Jawaban */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
            {opsi.map((ops, idx) => {
              const isSelected = selectedOpsi === ops;
              const isKunci = kunci ? ops.trim() === kunci.trim() : false;
              let styleStatus = 'bg-white hover:bg-amber-100/60 border-2 border-[#1E2149] shadow-[0_3px_0_#D4C4A8]';

              if (sudahKunci) {
                if (isKunci) {
                  styleStatus = 'bg-[#22A55B] text-white border-2 border-[#1E2149] shadow-[0_3px_0_#146938]';
                } else if (isSelected && !isKunci) {
                  styleStatus = 'bg-[#E5484D] text-white border-2 border-[#1E2149] shadow-[0_3px_0_#A8262A]';
                } else {
                  styleStatus = 'bg-gray-100 border-2 border-gray-300 opacity-60';
                }
              } else if (isSelected) {
                styleStatus = 'bg-[#FFD23F] border-2 border-[#1E2149] shadow-[0_3px_0_#C79E1A]';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={sudahKunci}
                  onClick={() => handlePilih(ops)}
                  className={`
                    flex items-center gap-2 p-3 rounded-2xl font-bold text-sm sm:text-base text-left
                    transition-all active:scale-[0.98] ${styleStatus}
                  `}
                >
                  <span className="w-7 h-7 shrink-0 rounded-full bg-black/10 flex items-center justify-center font-display font-extrabold text-xs">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="flex-1">
                    {renderTeksDenganPecahan(ops, 'sm')}
                  </div>
                  {sudahKunci && isKunci && <Check className="w-5 h-5 text-white shrink-0" />}
                  {sudahKunci && isSelected && !isKunci && <X className="w-5 h-5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Tombol Aksi Kunci Jawaban / Pembahasan & Tombol Lanjut */}
          {!sudahKunci ? (
            <div className="pt-2">
              <TombolChunky
                variant="primary"
                size="md"
                fullWidth
                disabled={!selectedOpsi}
                onClick={handleKunciJawaban}
              >
                Kunci Jawaban
              </TombolChunky>
            </div>
          ) : (
            <div className="mt-2 space-y-3">
              {pembahasan && (
                <div className="p-3 rounded-2xl bg-amber-100/70 border-2 border-[#FFB627] text-xs sm:text-sm">
                  <span className="font-extrabold block text-[#FF6B35] mb-1">
                    💡 Pembahasan:
                  </span>
                  <div className="font-semibold leading-relaxed">
                    {renderTeksDenganPecahan(pembahasan, 'sm')}
                  </div>
                </div>
              )}

              {onLanjut && (
                <div className="pt-1">
                  <TombolChunky
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                    onClick={() => {
                      setSisaAutoLanjut(null);
                      if (onLanjut) onLanjut();
                    }}
                  >
                    {teksLanjut || 'Lanjut ke Soal Berikutnya'}
                    {sisaAutoLanjut !== null && sisaAutoLanjut > 0 ? ` (${sisaAutoLanjut}s)` : ''}
                  </TombolChunky>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
