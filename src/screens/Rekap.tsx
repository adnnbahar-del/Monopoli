import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavHeader } from '../components/NavHeader';
import { Pemain, KepemilikanKios } from '../store/gameStore';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { Pecahan } from '../components/Pecahan';
import {
  Trophy,
  XCircle,
  RotateCcw,
  Home,
  CloudUpload,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { kirimRekapNilaiKeSheets, BarisNilaiSiswa } from '../engine/sheetsService';

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
  const [loadingKirim, setLoadingKirim] = useState(false);
  const [statusKirim, setStatusKirim] = useState<{ sukses: boolean; pesan: string } | null>(null);

  // Urutkan peringkat pemain dari poin tertinggi
  const peringkat = [...pemain].sort((a, b) => b.poin - a.poin);
  const totalKiosTerjual = Object.keys(kepemilikan).length;

  // Filter soal yang salah untuk review bersama tim
  const soalPerluDiprioritaskan = riwayatJawaban.filter((j) => !j.benar);

  const handleKirimSekarang = async () => {
    setLoadingKirim(true);
    setStatusKirim(null);
    try {
      const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
      const dataNilai: BarisNilaiSiswa[] = peringkat.map((p, idx) => ({
        waktu: nowStr,
        nama: p.nama,
        tim: p.timNama || 'Tim Mandiri',
        meja: 'Meja 1',
        poinMonopoli: p.poin,
        poinDuel: 0,
        totalPoinSiswa: p.poin,
        poinTurnamen: p.poin,
        peringkatMeja: idx + 1
      }));

      const res = await kirimRekapNilaiKeSheets(dataNilai);
      setStatusKirim({ sukses: res.sukses, pesan: res.pesan });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusKirim({ sukses: false, pesan: `Gagal mengirim nilai: ${msg}` });
    } finally {
      setLoadingKirim(false);
    }
  };

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
            Selamat, {peringkat[0]?.nama || 'Pemain'} ({peringkat[0]?.timNama || 'Tim'})!
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-1 max-w-md">
            Meraih skor tertinggi dengan {peringkat[0]?.poin || 0} poin! Kerja sama seluruh tim sangat luar biasa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6">
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1E2149] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Total Kios</span>
              <span className="text-xl font-display font-black text-[#FF6B35]">
                {totalKiosTerjual} / 20
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1E2149] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Total Soal</span>
              <span className="text-xl font-display font-black text-[#2EC4B6]">
                {riwayatJawaban.length}
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1E2149] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Jawaban Benar</span>
              <span className="text-xl font-display font-black text-[#22A55B]">
                {riwayatJawaban.filter((j) => j.benar).length}
              </span>
            </div>
            <div className="p-3 bg-white rounded-2xl border-2 border-[#1E2149] shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">Akurasi</span>
              <span className="text-xl font-display font-black text-[#1E2149]">
                {riwayatJawaban.length > 0
                  ? Math.round((riwayatJawaban.filter((j) => j.benar).length / riwayatJawaban.length) * 100)
                  : 0}
                %
              </span>
            </div>
          </div>
        </motion.div>

        {/* Kotak Sinkronisasi Google Sheets: Kirim Sekarang */}
        <div className="p-5 rounded-card bg-gradient-to-r from-emerald-50 to-teal-50 border-4 border-[#2EC4B6] shadow-soft-card space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#2EC4B6] text-white flex items-center justify-center shadow-xs">
                <CloudUpload className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#1E2149]">
                  Kirim Rekap Nilai ke Google Spreadsheet
                </h3>
                <p className="text-xs font-bold text-gray-600">
                  Simpan skor sesi ini ke Spreadsheet guru secara otomatis.
                </p>
              </div>
            </div>

            <TombolChunky
              variant="primary"
              size="md"
              icon={loadingKirim ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
              onClick={handleKirimSekarang}
              disabled={loadingKirim}
            >
              {loadingKirim ? 'Mengirim...' : 'Kirim Sekarang'}
            </TombolChunky>
          </div>

          {statusKirim && (
            <div
              className={`p-3 rounded-xl border-2 flex items-start gap-2.5 text-xs font-bold ${
                statusKirim.sukses
                  ? 'bg-emerald-100/90 border-emerald-500 text-emerald-900'
                  : 'bg-red-100/90 border-red-500 text-red-900'
              }`}
            >
              {statusKirim.sukses ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed">{statusKirim.pesan}</div>
            </div>
          )}
        </div>

        {/* Tabel Peringkat Pemain */}
        <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
          <h3 className="text-lg font-display font-black text-[#1E2149]">
            Peringkat Skor Akhir Pemain
          </h3>

          <div className="space-y-2">
            {peringkat.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 bg-white rounded-xl border-2 border-[#1E2149] flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#1E2149] text-white font-display font-black text-sm flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-[#1E2149]">
                      {p.nama}
                    </h4>
                    <span className="text-xs font-bold text-gray-500">
                      {p.timNama || 'Tim Pasar Sukaraja'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-display font-black text-right">
                  <div>
                    <span className="text-lg text-[#FF6B35] block leading-none">
                      {p.poin}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Poin
                    </span>
                  </div>
                  <div>
                    <span className="text-lg text-[#22A55B] block leading-none">
                      {p.benar}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Benar
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soal yang Perlu Dipelajari Lagi */}
        {soalPerluDiprioritaskan.length > 0 && (
          <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-[#1E2149]/20 pb-3">
              <div className="p-2 bg-red-100 rounded-xl border border-red-300">
                <XCircle className="w-6 h-6 text-[#E5484D]" />
              </div>
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
