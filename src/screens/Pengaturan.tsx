import React from 'react';
import { NavHeader } from '../components/NavHeader';
import { usePengaturanStore } from '../store/pengaturanStore';
import { TombolChunky } from '../components/TombolChunky';
import { PakPeca } from '../components/PakPeca';
import {
  Volume2,
  VolumeX,
  Clock,
  Type,
  Eye,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { audio } from '../engine/audioManager';

export interface PengaturanProps {
  onKembali: () => void;
  onBeranda: () => void;
}

export const Pengaturan: React.FC<PengaturanProps> = ({
  onKembali,
  onBeranda
}) => {
  const {
    volumeMusik,
    volumeSFX,
    bisu,
    durasiSesiMenit,
    ukuranTeks,
    kontrasTinggi,
    ambangSuperTeam,
    ambangGreatTeam,
    ambangGoodTeam,
    setVolumeMusik,
    setVolumeSFX,
    toggleBisu,
    setDurasiSesiMenit,
    setUkuranTeks,
    toggleKontrasTinggi,
    setAmbangTim,
    resetPengaturan
  } = usePengaturanStore();

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Pengaturan Permainan"
        subjudul="Atur Audio, Tampilan, Durasi, dan Ambang Penghargaan"
        onKembali={onKembali}
        onBeranda={onBeranda}
      />

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-6">
        {/* 1. KONTROL AUDIO */}
        <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-5">
          <div className="flex items-center justify-between border-b-2 border-[#1E2149]/20 pb-3">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-6 h-6 text-[#FF6B35]" />
              <h2 className="text-xl font-display font-black text-[#1E2149]">
                Pengaturan Suara & Audio
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                audio.putar('klik_tombol');
                toggleBisu();
              }}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#1E2149] font-display font-extrabold text-xs flex items-center gap-1.5 cursor-pointer ${
                bisu ? 'bg-[#E5484D] text-white' : 'bg-amber-100 text-[#1E2149]'
              }`}
            >
              {bisu ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{bisu ? 'Bisu (Mute)' : 'Suara Aktif'}</span>
            </button>
          </div>

          {/* Slider Musik Latar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-gray-800">
              <span>Musik Latar (Default 30%):</span>
              <span className="font-display font-extrabold text-base text-[#FF6B35]">
                {volumeMusik}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volumeMusik}
              disabled={bisu}
              onChange={(e) => setVolumeMusik(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35] disabled:opacity-50"
            />
          </div>

          {/* Slider Efek Suara (SFX) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-bold text-gray-800">
              <span>Efek Suara (Dadu, Poin, Kartu):</span>
              <span className="font-display font-extrabold text-base text-[#2EC4B6]">
                {volumeSFX}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volumeSFX}
              disabled={bisu}
              onChange={(e) => setVolumeSFX(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-[#2EC4B6] disabled:opacity-50"
            />
          </div>
        </div>

        {/* 2. DURASI SESI & TAMPILAN */}
        <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-5">
          <div className="flex items-center gap-2.5 border-b-2 border-[#1E2149]/20 pb-3">
            <Clock className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-xl font-display font-black text-[#1E2149]">
              Durasi Sesi & Aksesibilitas
            </h2>
          </div>

          {/* Pilihan Durasi Sesi Permainan */}
          <div className="space-y-2">
            <span className="text-sm font-bold text-gray-800 block">
              Durasi Sesi Permainan Monopoli:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[15, 20, 25, 30].map((durasi) => (
                <button
                  key={durasi}
                  type="button"
                  onClick={() => {
                    audio.putar('klik_tombol');
                    setDurasiSesiMenit(durasi);
                  }}
                  className={`
                    py-2.5 rounded-xl border-2 border-[#1E2149] font-display font-extrabold text-sm cursor-pointer transition-all
                    ${durasiSesiMenit === durasi ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B]' : 'bg-white text-[#1E2149] hover:bg-amber-100'}
                  `}
                >
                  {durasi} Menit
                </button>
              ))}
            </div>
          </div>

          {/* Ukuran Teks & Mode Kontras Tinggi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Ukuran Teks */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149] space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                <Type className="w-4 h-4 text-[#FF6B35]" />
                <span>Ukuran Teks:</span>
              </div>
              <div className="flex gap-2">
                {(['normal', 'besar'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => {
                      audio.putar('klik_tombol');
                      setUkuranTeks(u);
                    }}
                    className={`
                      flex-1 py-1.5 rounded-lg border-2 border-[#1E2149] text-xs font-display font-extrabold capitalize cursor-pointer
                      ${ukuranTeks === u ? 'bg-[#2EC4B6] text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode Kontras Tinggi */}
            <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#FF6B35]" />
                <div>
                  <div className="text-sm font-display font-black text-[#1E2149]">
                    Kontras Tinggi
                  </div>
                  <div className="text-xs text-gray-500 font-bold">
                    Meningkatkan ketajaman teks
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  audio.putar('klik_tombol');
                  toggleKontrasTinggi();
                }}
                className={`
                  w-14 h-8 rounded-full border-2 border-[#1E2149] p-0.5 transition-colors cursor-pointer
                  ${kontrasTinggi ? 'bg-[#22A55B]' : 'bg-gray-300'}
                `}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white border border-[#1E2149] transition-transform ${
                    kontrasTinggi ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 3. AMBANG PENGHARGAAN TIM TGT */}
        <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-5">
          <div className="flex items-center gap-2.5 border-b-2 border-[#1E2149]/20 pb-3">
            <Trophy className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-xl font-display font-black text-[#1E2149]">
              Ambang Skor Penghargaan Tim (TGT)
            </h2>
          </div>

          <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
            Rata-rata poin anggota tim untuk mencapai predikat penghargaan turnamen (dapat disesuaikan oleh guru):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-amber-50 rounded-2xl border-2 border-[#FFD23F] text-center">
              <span className="text-xs font-display font-black text-amber-700 uppercase block">
                🥇 Super Team
              </span>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-xs font-bold text-gray-600">≥</span>
                <input
                  type="number"
                  value={ambangSuperTeam}
                  onChange={(e) => setAmbangTim(parseInt(e.target.value) || 50, ambangGreatTeam, ambangGoodTeam)}
                  className="w-16 px-2 py-1 text-center font-display font-black text-lg border-2 border-[#1E2149] rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50 rounded-2xl border-2 border-[#2EC4B6] text-center">
              <span className="text-xs font-display font-black text-teal-700 uppercase block">
                🥈 Great Team
              </span>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-xs font-bold text-gray-600">≥</span>
                <input
                  type="number"
                  value={ambangGreatTeam}
                  onChange={(e) => setAmbangTim(ambangSuperTeam, parseInt(e.target.value) || 45, ambangGoodTeam)}
                  className="w-16 px-2 py-1 text-center font-display font-black text-lg border-2 border-[#1E2149] rounded-xl bg-white"
                />
              </div>
            </div>

            <div className="p-3 bg-rose-50 rounded-2xl border-2 border-[#FF8A80] text-center">
              <span className="text-xs font-display font-black text-rose-700 uppercase block">
                🥉 Good Team
              </span>
              <div className="mt-1 flex items-center justify-center gap-1">
                <span className="text-xs font-bold text-gray-600">≥</span>
                <input
                  type="number"
                  value={ambangGoodTeam}
                  onChange={(e) => setAmbangTim(ambangSuperTeam, ambangGreatTeam, parseInt(e.target.value) || 40)}
                  className="w-16 px-2 py-1 text-center font-display font-black text-lg border-2 border-[#1E2149] rounded-xl bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tombol Reset & Catatan */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card shadow-sm">
          <div className="flex items-center gap-3">
            <PakPeca ekspresi="senang" size={60} />
            <span className="text-xs font-bold text-gray-700">
              Pengaturan otomatis tersimpan di memori perangkat ini.
            </span>
          </div>

          <TombolChunky
            variant="paper"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              audio.putar('klik_tombol');
              resetPengaturan();
            }}
          >
            Kembalikan ke Default
          </TombolChunky>
        </div>
      </div>
    </div>
  );
};
