import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useKelasStore } from '../../store/kelasStore';
import { usePengaturanStore } from '../../store/pengaturanStore';
import { hitungPenghargaanTim } from '../../engine/turnamen';
import { IlustrasiPiala } from './Ilustrasi';

/** Gaya baris peringkat: emas, perak, perunggu, ungu */
const GAYA_PERINGKAT = [
  { medali: 'from-[#FFE79A] to-[#F5B700]', baris: 'from-[#FFF3C4] to-[#FFE07A]' },
  { medali: 'from-[#F1F3F8] to-[#A9B3C7]', baris: 'from-[#E6F1FF] to-[#9CC4FF]' },
  { medali: 'from-[#FFC9A3] to-[#E07A3A]', baris: 'from-[#FFE1EC] to-[#FF9CC0]' },
  { medali: 'from-[#D9C9FF] to-[#8E6CF0]', baris: 'from-[#EEE6FF] to-[#C4ADFF]' },
];

export interface PapanSkorKelompokProps {
  onBuka?: () => void;
}

/**
 * Papan skor 4 kelompok teratas — memakai rumus yang sama dengan Podium TGT:
 * rata-rata poin turnamen anggota tim (hitungPenghargaanTim), sehingga peringkat
 * di Beranda selalu sama dengan peringkat resmi. Bila belum ada turnamen, semua 0.
 */
export const PapanSkorKelompok: React.FC<PapanSkorKelompokProps> = ({ onBuka }) => {
  const daftarTim = useKelasStore((s) => s.daftarTim);
  const skorTurnamen = useKelasStore((s) => s.skorTurnamen);
  const ambangSuper = usePengaturanStore((s) => s.ambangSuperTeam);
  const ambangGreat = usePengaturanStore((s) => s.ambangGreatTeam);
  const ambangGood = usePengaturanStore((s) => s.ambangGoodTeam);

  const peringkat = useMemo(() => {
    const skorList = Object.values(skorTurnamen).map((s) => ({
      siswaId: s.siswaId,
      poinTurnamen: s.poinTurnamen || 0,
    }));
    return daftarTim
      .map((tim) => {
        const hasil = hitungPenghargaanTim(tim, skorList, ambangSuper, ambangGreat, ambangGood);
        const sudahBermain = skorList.some((s) => tim.anggotaIds.includes(s.siswaId));
        return {
          id: tim.id,
          nama: tim.nama,
          warna: tim.warna,
          skor: hasil.rataRataPoin,
          predikat: sudahBermain ? hasil.predikat : null,
        };
      })
      .sort((a, b) => b.skor - a.skor)
      .slice(0, 4);
  }, [daftarTim, skorTurnamen, ambangSuper, ambangGreat, ambangGood]);

  const belumAdaSkor = peringkat.every((t) => t.skor === 0);

  return (
    <div className="relative pt-10 h-full flex flex-col">
      {/* Piala di atas papan */}
      <IlustrasiPiala className="absolute left-1/2 -translate-x-1/2 -top-1 w-20 z-10 drop-shadow-lg" />

      <button
        type="button"
        onClick={onBuka}
        aria-label="Papan skor kelompok, buka Turnamen TGT"
        className="w-full flex-1 text-left p-3 pt-8 rounded-[28px] bg-gradient-to-b from-[#FFD66B] to-[#F2A900] border-4 border-[#1E2149] shadow-[0_8px_0_#B57A00] cursor-pointer"
      >
        <div className="rounded-[20px] bg-gradient-to-b from-[#5A3E7A] to-[#3B2756] border-[3px] border-[#1E2149] p-3 pb-3.5">
          <div className="mx-auto -mt-6 mb-3 w-fit px-4 py-1 rounded-xl bg-gradient-to-b from-[#7B5CFA] to-[#5527D6] border-[3px] border-[#1E2149] font-display font-black text-white text-sm tracking-wide whitespace-nowrap">
            PAPAN SKOR KELOMPOK
          </div>

          {peringkat.length === 0 ? (
            <p className="text-center text-sm font-bold text-white/80 py-6">Belum ada kelompok.</p>
          ) : (
            <ol className="space-y-2">
              {peringkat.map((tim, i) => {
                const gaya = GAYA_PERINGKAT[i];
                return (
                  <motion.li
                    key={tim.id}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                    className={`flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full bg-gradient-to-r ${gaya.baris} border-[3px] border-[#1E2149]`}
                  >
                    <span
                      className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-b ${gaya.medali} border-[3px] border-[#1E2149] flex items-center justify-center font-display font-black text-[#1E2149]`}
                    >
                      {i + 1}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#1E2149] shrink-0" style={{ background: tim.warna }} />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate font-display font-black text-sm text-[#1E2149] leading-tight">
                        {tim.nama}
                      </span>
                      {tim.predikat && (
                        <span className="block truncate text-[10px] font-bold text-[#1E2149]/70 leading-tight">
                          {tim.predikat}
                        </span>
                      )}
                    </span>
                    <span className="min-w-[56px] text-center px-2 py-0.5 rounded-full bg-white border-2 border-[#1E2149] font-display font-black text-base text-[#1E2149] tabular-nums">
                      {Number.isInteger(tim.skor) ? tim.skor : tim.skor.toFixed(1)}
                    </span>
                  </motion.li>
                );
              })}
            </ol>
          )}

          <p className="mt-2.5 text-center text-[11px] font-bold text-white/75">
            {belumAdaSkor && peringkat.length > 0
              ? 'Skor terisi setelah turnamen dimainkan.'
              : 'Rata-rata poin turnamen per anggota tim'}
          </p>
        </div>
      </button>
    </div>
  );
};
