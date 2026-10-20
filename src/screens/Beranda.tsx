import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  BookOpen,
  Compass,
  Trophy,
  HelpCircle,
  Settings,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Dice5,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';
import { PakPeca } from '../components/PakPeca';
import { audio, SFXKunci } from '../engine/audioManager';

export type Layar = 
  | 'splash'
  | 'beranda'
  | 'tujuanBelajar'
  | 'materiKilat'
  | 'eksplorasi'
  | 'latihanTim'
  | 'turnamenTGT'
  | 'caraBermain'
  | 'pengaturan'
  | 'loginGuru'
  | 'panelGuru'
  | 'styleguide'
  | 'papanPermainan';

export interface BerandaProps {
  onNavigasi: (layar: Layar) => void;
  adaGameTersimpan?: boolean;
  onLanjutkanGame?: () => void;
}

export const Beranda: React.FC<BerandaProps> = ({
  onNavigasi,
  adaGameTersimpan = false,
  onLanjutkanGame
}) => {
  const handlePilih = (layar: Layar, sfx: SFXKunci = 'klik_tombol') => {
    audio.putar(sfx);
    onNavigasi(layar);
  };

  return (
    <div className="min-h-screen pb-16 px-4 sm:px-6 max-w-6xl mx-auto tapis-pattern select-none">
      {/* ── HEADER ATAS ─────────────────────────────────────────── */}
      <header className="pt-6 pb-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#1E2149]/15">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-[#FF6B35] border-3 border-[#1E2149] flex items-center justify-center text-white font-display font-black text-2xl shadow-[0_4px_0_#1E2149] shrink-0">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149] tracking-tight">
                MONOPECA
              </h1>
              <span className="bg-[#FFD23F] text-[#1E2149] text-[10px] font-display font-black px-2 py-0.5 rounded-full border border-[#1E2149]">
                Fase C
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-700">
              Monopoli Pecahan • Matematika Kelas V SD
            </p>
          </div>
        </div>

        <PakPeca
          ekspresi="ceria"
          size={78}
          pesan="Halo Sobat Pecahan! Ayo pilih petualangan belajarmu hari ini!"
        />
      </header>

      {/* ── BANNER LANJUTKAN PERMAINAN (JIKA ADA SESI AKTIF) ─────── */}
      {adaGameTersimpan && onLanjutkanGame && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 sm:p-5 rounded-card bg-gradient-to-r from-[#FFD23F] to-[#FFE066] border-4 border-[#1E2149] shadow-[0_6px_0_#C79E1A] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#1E2149] flex items-center justify-center shadow-sm shrink-0">
              <RotateCcw className="w-6 h-6 text-[#FF6B35]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-[#1E2149]">
                Lanjutkan Permainan yang Tersimpan?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#1E2149]/80">
                Ada sesi monopoli yang tersimpan di memori perangkat ini.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              audio.putar('soal_muncul');
              onLanjutkanGame();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85924] text-white border-2 border-[#1E2149] font-display font-black text-sm shadow-[0_4px_0_#C4471B] active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Dice5 className="w-4 h-4" />
            <span>Lanjutkan Sekarang</span>
          </button>
        </motion.div>
      )}

      {/* ── ZONA 1: HERO PLAY ARENA (2 KARTU UTAMA BESAR) ────────── */}
      <div className="mt-7 space-y-7">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-[#FF6B35]" />
            <h2 className="font-display font-black text-base text-[#1E2149] uppercase tracking-wider">
              Arena Permainan Utama
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* HERO 1: TURNAMEN TGT */}
            <motion.div
              whileHover={{ translateY: -4 }}
              whileTap={{ translateY: 2 }}
              onClick={() => handlePilih('turnamenTGT', 'turnamen_mulai')}
              className="relative p-6 sm:p-7 rounded-card bg-gradient-to-br from-[#7B5CFA] via-[#6942EA] to-[#5527D6] border-4 border-[#1E2149] shadow-[0_8px_0_#3F1CA6] text-white cursor-pointer overflow-hidden group flex flex-col justify-between min-h-[220px]"
            >
              {/* Ornamen Latar */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-300" />
              <Trophy className="absolute right-4 bottom-4 w-28 h-28 text-white/10 pointer-events-none group-hover:text-white/20 transition-all duration-300 group-hover:rotate-6" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white font-display font-extrabold text-xs uppercase tracking-wider mb-3">
                  <Award className="w-3.5 h-3.5 text-[#FFD23F]" />
                  <span>Mode Turnamen Kooperatif TGT</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-sm">
                  Turnamen TGT
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 font-bold mt-2 max-w-sm leading-relaxed">
                  Bentuk tim heterogen, berkompetisi di meja turnamen homogen, dan raih predikat <strong>Super Team</strong>!
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-xs font-display font-black text-purple-200">
                  Paket Soal Turnamen A • B • C
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD23F] text-[#1E2149] font-display font-black text-xs sm:text-sm border-2 border-[#1E2149] shadow-[0_3px_0_#1E2149] group-hover:translate-x-1 transition-transform">
                  <span>Masuk Turnamen</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>

            {/* HERO 2: MAIN CEPAT & PAPAN MONOPOLI */}
            <motion.div
              whileHover={{ translateY: -4 }}
              whileTap={{ translateY: 2 }}
              onClick={() => handlePilih('papanPermainan', 'dadu_lempar')}
              className="relative p-6 sm:p-7 rounded-card bg-gradient-to-br from-[#FF6B35] via-[#F25A24] to-[#DE440E] border-4 border-[#1E2149] shadow-[0_8px_0_#9E2D07] text-white cursor-pointer overflow-hidden group flex flex-col justify-between min-h-[220px]"
            >
              {/* Ornamen Latar */}
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-300" />
              <Dice5 className="absolute right-4 bottom-4 w-28 h-28 text-white/10 pointer-events-none group-hover:text-white/20 transition-all duration-300 group-hover:-rotate-6" />

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs border border-white/30 text-white font-display font-extrabold text-xs uppercase tracking-wider mb-3">
                  <Zap className="w-3.5 h-3.5 text-[#FFD23F]" />
                  <span>Papan Monopoli 28 Petak</span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight drop-shadow-sm">
                  Main Cepat / Latihan Tim
                </h3>
                <p className="text-xs sm:text-sm text-orange-100 font-bold mt-2 max-w-sm leading-relaxed">
                  Kocok dadu 3D, jelajahi petak kios, jawab kuis pecahan, dan kumpulkan skor kemenangan bersama tim.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/20">
                <span className="text-xs font-display font-black text-orange-200">
                  28 Petak • Kuis Berjenjang C1–C4
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#1E2149] font-display font-black text-xs sm:text-sm border-2 border-[#1E2149] shadow-[0_3px_0_#1E2149] group-hover:translate-x-1 transition-transform">
                  <span>Mulai Bermain</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── ZONA 2: RUANG BELAJAR & EKSPLORASI (3 BENTO CARD) ──── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-[#2EC4B6]" />
            <h2 className="font-display font-black text-base text-[#1E2149] uppercase tracking-wider">
              Ruang Belajar & Eksplorasi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Materi Kilat */}
            <motion.div
              whileHover={{ translateY: -3 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('materiKilat')}
              className="p-5 rounded-card bg-gradient-to-br from-[#FFB627] to-[#FFA000] border-3 border-[#1E2149] shadow-[0_5px_0_#C77C00] text-[#1E2149] cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/90 border-2 border-[#1E2149] flex items-center justify-center mb-3 shadow-xs group-hover:rotate-6 transition-transform">
                  <BookOpen className="w-6 h-6 text-[#1E2149]" />
                </div>
                <h3 className="font-display font-black text-lg text-[#1E2149]">
                  Materi Kilat
                </h3>
                <p className="text-xs font-bold text-[#1E2149]/80 mt-1 leading-snug">
                  Slide konsep bergambar pecahan biasa, senilai, penjumlahan & pengurangan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#1E2149]/20 flex items-center justify-between text-xs font-display font-black">
                <span>Pelajari Materi</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* 2. Eksplorasi Pecahan */}
            <motion.div
              whileHover={{ translateY: -3 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('eksplorasi')}
              className="p-5 rounded-card bg-gradient-to-br from-[#2EC4B6] to-[#1DAA9C] border-3 border-[#1E2149] shadow-[0_5px_0_#14786E] text-white cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/90 border-2 border-[#1E2149] flex items-center justify-center mb-3 shadow-xs group-hover:rotate-6 transition-transform">
                  <Compass className="w-6 h-6 text-[#2EC4B6]" />
                </div>
                <h3 className="font-display font-black text-lg text-white drop-shadow-xs">
                  Eksplorasi Pecahan
                </h3>
                <p className="text-xs font-bold text-teal-100 mt-1 leading-snug">
                  Laboratorium interaktif visual kue lingkaran, batang cokelat, dan petak sawah.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-display font-black text-teal-100">
                <span>Coba Eksperimen</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>

            {/* 3. Tujuan Belajar */}
            <motion.div
              whileHover={{ translateY: -3 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('tujuanBelajar')}
              className="p-5 rounded-card bg-gradient-to-br from-[#3BC47A] to-[#2BA866] border-3 border-[#1E2149] shadow-[0_5px_0_#1F7D4B] text-white cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/90 border-2 border-[#1E2149] flex items-center justify-center mb-3 shadow-xs group-hover:rotate-6 transition-transform">
                  <Target className="w-6 h-6 text-[#2BA866]" />
                </div>
                <h3 className="font-display font-black text-lg text-white drop-shadow-xs">
                  Tujuan Belajar
                </h3>
                <p className="text-xs font-bold text-green-100 mt-1 leading-snug">
                  Capaian Pembelajaran (CP) dan TP1–TP7 Matematika Fase C Kurikulum Merdeka.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-display font-black text-green-100">
                <span>Lihat Capaian</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── ZONA 3: BAR MENU BANTUAN & PENDIDIK (BENTO BAR) ─────── */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Cara Bermain */}
            <motion.div
              whileHover={{ translateY: -2 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('caraBermain')}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#4D8DFF] to-[#3679F6] border-3 border-[#1E2149] shadow-[0_4px_0_#1E53B8] text-white cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-black text-base text-white truncate">
                  Cara Bermain
                </h4>
                <p className="text-[11px] font-bold text-blue-100 truncate">
                  Aturan & tutorial 5 langkah
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </motion.div>

            {/* Pengaturan */}
            <motion.div
              whileHover={{ translateY: -2 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('pengaturan')}
              className="p-4 rounded-2xl bg-[#FFF8EC] border-3 border-[#1E2149] shadow-[0_4px_0_#D4C4A8] text-[#1E2149] cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-100 border-2 border-[#1E2149] flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-[#1E2149]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-black text-base text-[#1E2149] truncate">
                  Pengaturan
                </h4>
                <p className="text-[11px] font-bold text-gray-600 truncate">
                  Audio, durasi, kontras tinggi
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
            </motion.div>

            {/* Panel Guru */}
            <motion.div
              whileHover={{ translateY: -2 }}
              whileTap={{ translateY: 1 }}
              onClick={() => handlePilih('loginGuru')}
              className="p-4 rounded-2xl bg-gradient-to-r from-[#FFF8EC] to-[#FFEDB3] border-3 border-[#1E2149] shadow-[0_4px_0_#C29E40] text-[#1E2149] cursor-pointer flex items-center gap-3.5 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FFD23F] border-2 border-[#1E2149] flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-[#1E2149]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display font-black text-base text-[#1E2149] truncate">
                    Panel Guru
                  </h4>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-[#1E2149] text-white">
                    Sandi
                  </span>
                </div>
                <p className="text-[11px] font-bold text-gray-700 truncate">
                  Bank soal, kelas, cetak hasil
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── FOOTER INFO RINGKAS ──────────────────────────────────── */}
      <footer className="mt-12 text-center text-xs font-bold text-gray-600 space-y-1">
        <p className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>MONOPECA • Media Pembelajaran Kooperatif Teams Games Tournament (TGT)</span>
        </p>
        <p className="text-[11px] text-gray-500">
          Matematika Pecahan Kelas V SD • Standar Kualitas ISO/IEC 25010 & Kurikulum Merdeka
        </p>
      </footer>
    </div>
  );
};
