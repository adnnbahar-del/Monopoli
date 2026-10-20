import React from 'react';
import { motion } from 'framer-motion';
import { NavHeader } from '../components/NavHeader';
import { Pemain, KepemilikanKios } from '../store/gameStore';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { Pecahan } from '../components/Pecahan';
import { Trophy, XCircle, RotateCcw, Home, Award } from 'lucide-react';

export interface JawabanDetail {
  soalId: string;
  pertanyaan: string;
  kunci: string;
  jawabanDipilih: string;
  benar: boolean;
  pembahasan: string;
  tp: string;
}

export interface RekapProps {
  pemain: Pemain[];
  kepemilikan: Record<number, KepemilikanKios>;
  riwayatJawaban: JawabanDetail[];
  onMainLagi: () => void;
  onKembaliBeranda: () => void;
}

export const Rekap: React.FC<RekapProps> = ({
  pemain,
  kepemilikan,
  riwayatJawaban,
  onMainLagi,
  onKembaliBeranda
}) => {
  // Urutkan peringkat pemain dari poin tertinggi
  const peringkat = [...pemain].sort((a, b) => b.poin - a.poin);
  const totalKiosTerjual = Object.keys(kepemilikan).length;

  // Filter soal yang salah untuk review bersama tim
  const soalPerluDiprioritaskan = riwayatJawaban.filter((j) => !j.benar);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Rekap Hasil Permainan Monopoli"
        subjudul="Sesi Permainan Monopoli Selesai!"
        onBeranda={onKembaliBeranda}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Banner Pemenang */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card text-center flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute top-2 right-4 opacity-15">
            <Trophy className="w-32 h-32 text-[#FFD23F]" />
          </div>

          <PakPeca ekspresi="ceria" size={110} />
          <span className="text-xs font-display font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149] mt-3">
            🏆 Sesi Permainan Selesai
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-[#1E2149] mt-2">
            Selamat, {peringkat[0].nama} ({peringkat[0].timNama})!
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-1 max-w-md">
            Meraih skor tertinggi dengan {peringkat[0].poin} poin! Kerja sama seluruh tim sangat luar biasa.
          </p>
        </motion.div>

        {/* Tabel Peringkat Pemain & Kios */}
        <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1E2149]/20 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-[#FF6B35]" />
              <h3 className="text-xl font-display font-black text-[#1E2149]">
                Papan Peringkat Sesi Ini
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-600">
              {totalKiosTerjual} Kios Terjual
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {peringkat.map((p, idx) => {
              const jumlahKiosMilik = Object.values(kepemilikan).filter(
                (k) => k.pemainId === p.id
              ).length;

              return (
                <div
                  key={p.id}
                  className={`
                    p-3.5 rounded-2xl border-2 border-[#1E2149] flex items-center justify-between gap-3
                    ${idx === 0 ? 'bg-amber-100/90 shadow-[0_3px_0_#C79E1A]' : 'bg-white shadow-xs'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-[#1E2149] text-white flex items-center justify-center font-display font-black text-sm shrink-0">
                      #{idx + 1}
                    </span>
                    <div
                      className="w-9 h-9 rounded-xl border border-black flex items-center justify-center text-white font-display font-extrabold text-base shrink-0"
                      style={{ backgroundColor: p.warna }}
                    >
                      {p.nama.charAt(0)}
                    </div>
                    <div>
                      <div className="font-display font-black text-base text-[#1E2149]">
                        {p.nama}
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        {p.timNama} • {jumlahKiosMilik} Kios
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div className="hidden sm:block text-xs font-bold text-gray-600">
                      <span className="text-[#22A55B]">{p.benar} Benar</span> / <span className="text-[#E5484D]">{p.salah} Salah</span>
                    </div>
                    <div className="font-display font-black text-xl text-[#FF6B35]">
                      {p.poin} Poin
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daftar Soal yang Perlu Dipelajari Lagi (Review Bersama) */}
        {soalPerluDiprioritaskan.length > 0 && (
          <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-[#1E2149]/20 pb-3">
              <XCircle className="w-6 h-6 text-[#E5484D]" />
              <div>
                <h3 className="text-lg font-display font-black text-[#1E2149]">
                  Soal yang Perlu Dipelajari Lagi Bersama Tim ({soalPerluDiprioritaskan.length})
                </h3>
                <p className="text-xs font-bold text-gray-600">
                  Diskusikan pembahasan soal-soal ini agar semakin paham!
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {soalPerluDiprioritaskan.map((item, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl border-2 border-[#1E2149] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {item.tp}
                    </span>
                    <span className="text-[#E5484D] font-extrabold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Jawabanmu: {item.jawabanDipilih}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {item.pertanyaan}
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-gray-700">
                    <span className="font-extrabold text-[#22A55B] block mb-0.5">
                      ✓ Kunci Benar: <Pecahan value={item.kunci} size="sm" />
                    </span>
                    <span className="font-semibold">{item.pembahasan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Aksi Akhir */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <TombolChunky
            variant="paper"
            size="lg"
            icon={<Home className="w-6 h-6" />}
            onClick={onKembaliBeranda}
            className="w-full sm:w-auto min-w-[180px]"
          >
            Menu Beranda
          </TombolChunky>
          <TombolChunky
            variant="primary"
            size="lg"
            icon={<RotateCcw className="w-6 h-6" />}
            onClick={onMainLagi}
            className="w-full sm:w-auto min-w-[200px]"
          >
            Main Lagi
          </TombolChunky>
        </div>
      </div>
    </div>
  );
};
