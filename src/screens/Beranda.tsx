import React from 'react';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  BookOpen,
  FlaskConical,
  Trophy,
  HelpCircle,
  Settings,
  GraduationCap,
  RotateCcw,
  Play,
  ChevronRight,
  Flame,
  Users,
  Dices,
  Volume2,
  VolumeX,
  Maximize,
  Minimize
} from 'lucide-react';
import { audio, SFXKunci } from '../engine/audioManager';
import { usePengaturanStore } from '../store/pengaturanStore';
import { useLayarPenuh } from '../hooks/useLayarPenuh';
import { ArenaLatar } from '../components/beranda/ArenaLatar';
import { HeaderArena } from '../components/beranda/HeaderArena';
import { PapanSkorKelompok } from '../components/beranda/PapanSkorKelompok';
import {
  IlustrasiPiala,
  IlustrasiDadu,
  IlustrasiPion,
  IlustrasiPetak,
  IlustrasiPizza,
  IlustrasiEksplorasi,
  IlustrasiTujuan,
  KartuPecahan
} from '../components/beranda/Ilustrasi';

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

/* ── Judul bagian berbentuk pil ───────────────────────────────── */
const JudulBagian: React.FC<{ ikon: React.ReactNode; children: React.ReactNode }> = ({ ikon, children }) => (
  <div className="inline-flex items-center gap-2 mb-3 pl-3 pr-5 py-1.5 rounded-full bg-white/85 backdrop-blur-sm border-2 border-white shadow-[0_3px_10px_rgba(30,33,73,0.12)]">
    {ikon}
    <h2 className="font-display font-black text-sm sm:text-base text-[#1E2149] uppercase tracking-wide">
      {children}
    </h2>
  </div>
);

/* ── Kartu ruang belajar (Fase 3) ─────────────────────────────── */
interface KartuBelajarProps {
  judul: string;
  deskripsi: string;
  tombol: string;
  ikon: React.ReactNode;
  ilustrasi: React.ReactNode;
  latar: string;
  bayangan: string;
  warnaTombol: string;
  onClick: () => void;
}

const KartuBelajar: React.FC<KartuBelajarProps> = ({
  judul, deskripsi, tombol, ikon, ilustrasi, latar, bayangan, warnaTombol, onClick
}) => (
  <motion.button
    type="button"
    whileHover={{ y: -4 }}
    whileTap={{ y: 2 }}
    onClick={onClick}
    className={`group relative w-full text-left p-4 rounded-[26px] ${latar} border-4 border-[#1E2149] ${bayangan} cursor-pointer flex items-stretch gap-3 overflow-hidden`}
  >
    <div className="w-24 sm:w-28 shrink-0 flex items-center justify-center group-hover:scale-105 group-hover:-rotate-3 transition-transform">
      {ilustrasi}
    </div>
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="flex items-center gap-2">
        <span className="w-9 h-9 shrink-0 rounded-xl bg-white border-[3px] border-[#1E2149] flex items-center justify-center">
          {ikon}
        </span>
        <h3 className="font-display font-black text-lg sm:text-xl text-[#1E2149] leading-tight">{judul}</h3>
      </div>
      <p className="text-xs font-bold text-[#1E2149]/85 mt-1.5 leading-snug flex-1">{deskripsi}</p>
      <span className={`mt-2.5 inline-flex items-center justify-between gap-2 px-4 py-1.5 rounded-full ${warnaTombol} border-[3px] border-[#1E2149] font-display font-black text-sm text-[#1E2149]`}>
        <span>{tombol}</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </span>
    </div>
  </motion.button>
);

/* ── Baris menu bantuan (Fase 3) ──────────────────────────────── */
interface KartuMenuProps {
  judul: string;
  deskripsi: string;
  ikon: React.ReactNode;
  latar: string;
  bayangan: string;
  teksGelap?: boolean;
  lencana?: string;
  onClick: () => void;
}

const KartuMenu: React.FC<KartuMenuProps> = ({
  judul, deskripsi, ikon, latar, bayangan, teksGelap = true, lencana, onClick
}) => (
  <motion.button
    type="button"
    whileHover={{ y: -3 }}
    whileTap={{ y: 2 }}
    onClick={onClick}
    className={`group w-full text-left px-4 py-3 rounded-[22px] ${latar} border-4 border-[#1E2149] ${bayangan} cursor-pointer flex items-center gap-3.5`}
  >
    <span className={`w-12 h-12 shrink-0 rounded-2xl border-[3px] border-[#1E2149] flex items-center justify-center ${teksGelap ? 'bg-[#FFD23F]' : 'bg-white/20'}`}>
      {ikon}
    </span>
    <span className="flex-1 min-w-0">
      <span className="flex items-center gap-2">
        <span className={`font-display font-black text-lg truncate ${teksGelap ? 'text-[#1E2149]' : 'text-white'}`}>{judul}</span>
        {lencana && (
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-[#1E2149] text-white">{lencana}</span>
        )}
      </span>
      <span className={`block text-xs font-bold truncate ${teksGelap ? 'text-[#1E2149]/75' : 'text-blue-100'}`}>{deskripsi}</span>
    </span>
    <ChevronRight className={`w-5 h-5 shrink-0 group-hover:translate-x-1 transition-transform ${teksGelap ? 'text-[#1E2149]' : 'text-white'}`} />
  </motion.button>
);

export const Beranda: React.FC<BerandaProps> = ({
  onNavigasi,
  adaGameTersimpan = false,
  onLanjutkanGame
}) => {
  const bisu = usePengaturanStore((s) => s.bisu);
  const toggleBisu = usePengaturanStore((s) => s.toggleBisu);
  const layarPenuh = useLayarPenuh();

  const handlePilih = (layar: Layar, sfx: SFXKunci = 'klik_tombol') => {
    audio.putar(sfx);
    onNavigasi(layar);
  };

  const handleToggleSuara = () => {
    // Bunyikan konfirmasi hanya saat suara dinyalakan kembali
    if (bisu) {
      audio.setBisu(false);
      audio.putar('jawab_benar');
    }
    toggleBisu();
  };

  return (
    <div className="arena-root relative min-h-screen overflow-hidden select-none">
      {/* ── FASE 1: LATAR ARENA ─────────────────────────────────── */}
      <ArenaLatar />

      {/* Dekorasi samping layar lebar (Fase 4) */}
      <div className="hidden 2xl:block absolute left-6 bottom-44 w-40 -rotate-6 z-0 pointer-events-none" aria-hidden="true">
        <div className="relative bg-[#FFF8EC] border-4 border-[#1E2149] rounded-xl px-3 pt-6 pb-4 shadow-[0_6px_0_rgba(30,33,73,0.25)]">
          <div className="absolute -top-2 left-2 right-2 flex justify-between">
            {Array.from({ length: 9 }, (_, i) => (
              <span key={i} className="w-2 h-4 rounded-full bg-[#1E2149]" />
            ))}
          </div>
          <p className="font-display font-black text-2xl leading-tight text-[#1E2149] text-center">Pecahan Kelas V SD</p>
        </div>
      </div>
      <div className="hidden 2xl:block absolute right-6 bottom-44 w-44 rotate-3 z-0 pointer-events-none" aria-hidden="true">
        <div className="bg-white border-4 border-[#1E2149] rounded-xl p-3 shadow-[0_6px_0_rgba(30,33,73,0.25)]">
          <div className="flex items-center justify-center gap-1 font-display font-black text-[#1E2149] text-xl">
            <KartuPecahan atas={1} bawah={4} className="w-7" />
            <span>+</span>
            <KartuPecahan atas={2} bawah={4} className="w-7" />
            <span>=</span>
            <KartuPecahan atas={3} bawah={4} className="w-7" />
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-5 rounded border-2 border-[#1E2149] ${i < 3 ? 'bg-[#8E6CF0]' : 'bg-[#EEE6FF]'}`} />
            ))}
          </div>
        </div>
      </div>
      <div className="hidden lg:block absolute left-[3%] bottom-8 z-0 pointer-events-none" aria-hidden="true">
        <div className="flex items-end -space-x-3">
          <IlustrasiPion warna="#3E7BFA" className="w-14" />
          <IlustrasiPion warna="#E5484D" className="w-11" />
        </div>
      </div>
      <div className="hidden lg:block absolute right-[4%] bottom-8 z-0 pointer-events-none" aria-hidden="true">
        <IlustrasiPion warna="#22A55B" className="w-14" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-40">
        {/* ── FASE 1: HEADER, EMBLEM & MASKOT ───────────────────── */}
        <HeaderArena />

        {/* ── FASE 2: BANNER LANJUTKAN PERMAINAN ────────────────── */}
        {adaGameTersimpan && onLanjutkanGame && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-3 sm:p-4 rounded-[26px] bg-gradient-to-r from-[#FFF3C4] via-[#FFE47A] to-[#FFD23F] border-4 border-[#1E2149] shadow-[0_6px_0_#C79E1A] flex flex-col md:flex-row items-center gap-4"
          >
            <div className="flex items-center gap-3.5 flex-1 min-w-0 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-white border-[3px] border-[#1E2149] flex items-center justify-center shrink-0">
                <RotateCcw className="w-7 h-7 text-[#FF6B35]" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <h2 className="font-display font-black text-lg sm:text-xl text-[#1E2149] leading-tight">
                  Lanjutkan Permainan yang Tersimpan?
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#1E2149]/80">
                  Ada sesi monopoli yang tersimpan di memori perangkat ini.
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-end -space-x-6 shrink-0">
              <IlustrasiPetak className="w-32" />
              <IlustrasiPion warna="#E5484D" className="w-8 -translate-y-3 -translate-x-16" />
            </div>
            <button
              type="button"
              onClick={() => {
                audio.putar('soal_muncul');
                onLanjutkanGame();
              }}
              className="w-full md:w-auto px-6 py-3 rounded-2xl bg-gradient-to-b from-[#FF8A4C] to-[#E8501A] text-white border-[3px] border-[#1E2149] font-display font-black text-base shadow-[0_5px_0_#9E2D07] active:translate-y-1 active:shadow-[0_1px_0_#9E2D07] cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Lanjutkan Sekarang</span>
            </button>
          </motion.div>
        )}

        {/* ── FASE 2: ARENA PERMAINAN UTAMA + PAPAN SKOR ────────── */}
        <section className="mt-7">
          <JudulBagian ikon={<Flame className="w-5 h-5 text-[#FF6B35] fill-[#FFB627]" />}>
            Arena Permainan Utama
          </JudulBagian>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_280px] gap-5">
            {/* HERO 1: TURNAMEN TGT */}
            <motion.button
              type="button"
              whileHover={{ y: -5 }}
              whileTap={{ y: 2 }}
              onClick={() => handlePilih('turnamenTGT', 'turnamen_mulai')}
              className="group relative text-left p-5 sm:p-6 rounded-[28px] bg-gradient-to-br from-[#8B5CF6] via-[#6D3FEA] to-[#4F22CF] border-4 border-[#1E2149] shadow-[0_8px_0_#3F1CA6] text-white cursor-pointer overflow-hidden flex flex-col min-h-[260px]"
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute right-2 top-[30%] w-[36%] max-w-[150px] pointer-events-none group-hover:rotate-3 group-hover:scale-105 transition-transform duration-300">
                <IlustrasiPiala className="w-full drop-shadow-xl" />
                <div className="absolute -bottom-8 -left-4 flex items-end -space-x-2">
                  <IlustrasiPion warna="#E5484D" className="w-9" />
                  <IlustrasiPion warna="#3E7BFA" className="w-9" />
                  <IlustrasiPion warna="#3BC47A" className="w-8" />
                </div>
              </div>

              <span className="relative inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#3F1CA6]/60 border-2 border-white/40 font-display font-extrabold text-[11px] sm:text-xs uppercase tracking-wide">
                <Trophy className="w-3.5 h-3.5 text-[#FFD23F] fill-[#FFD23F]" />
                Mode Turnamen Kooperatif TGT
              </span>

              <h3 className="relative mt-3 font-display font-black text-3xl sm:text-4xl leading-none [text-shadow:0_3px_0_#1E2149]">
                Turnamen TGT
              </h3>
              <p className="relative mt-2 max-w-[58%] text-xs sm:text-sm font-bold text-purple-100 leading-snug">
                Bentuk tim heterogen, berkompetisi di meja turnamen homogen, dan raih predikat Super Team!
              </p>

              <div className="relative mt-auto pt-5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3F1CA6]/60 border-2 border-white/30 text-[11px] sm:text-xs font-display font-black">
                  <Users className="w-4 h-4" />
                  Paket Soal Turnamen A • B • C
                </span>
                <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-gradient-to-b from-[#FFE47A] to-[#FFC21A] text-[#1E2149] font-display font-black text-sm sm:text-base border-[3px] border-[#1E2149] shadow-[0_4px_0_#1E2149] group-hover:translate-x-1 transition-transform">
                  Masuk Turnamen
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </span>
              </div>
            </motion.button>

            {/* HERO 2: MAIN CEPAT / LATIHAN TIM */}
            <motion.button
              type="button"
              whileHover={{ y: -5 }}
              whileTap={{ y: 2 }}
              onClick={() => handlePilih('papanPermainan', 'dadu_lempar')}
              className="group relative text-left p-5 sm:p-6 rounded-[28px] bg-gradient-to-br from-[#FF8A4C] via-[#F25A24] to-[#D9400C] border-4 border-[#1E2149] shadow-[0_8px_0_#9E2D07] text-white cursor-pointer overflow-hidden flex flex-col min-h-[260px]"
            >
              <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/15 blur-2xl pointer-events-none" />
              <div className="absolute right-2 top-6 w-[40%] max-w-[150px] pointer-events-none">
                <IlustrasiDadu className="w-[70%] ml-auto drop-shadow-xl group-hover:-rotate-12 transition-transform duration-300" />
                <div className="relative -mt-2">
                  <IlustrasiPetak className="w-full" warna={['#3BC47A', '#FF7EB6', '#7B5CFA', '#FFD23F']} />
                  <IlustrasiPion warna="#3E7BFA" className="absolute w-8 -top-8 left-[20%]" />
                  <IlustrasiPion warna="#FFC21A" className="absolute w-7 -top-7 left-[55%]" />
                </div>
              </div>

              <span className="relative inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#9E2D07]/50 border-2 border-white/40 font-display font-extrabold text-[11px] sm:text-xs uppercase tracking-wide">
                <Zap className="w-3.5 h-3.5 text-[#FFD23F] fill-[#FFD23F]" />
                Papan Monopoli 28 Petak
              </span>

              <h3 className="relative mt-3 max-w-[62%] font-display font-black text-3xl sm:text-4xl leading-none [text-shadow:0_3px_0_#1E2149]">
                Main Cepat / Latihan Tim
              </h3>
              <p className="relative mt-2 max-w-[58%] text-xs sm:text-sm font-bold text-orange-50 leading-snug">
                Kocok dadu 3D, jelajahi petak kios, jawab kuis pecahan, dan kumpulkan skor kemenangan bersama tim.
              </p>

              <div className="relative mt-auto pt-5 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9E2D07]/50 border-2 border-white/30 text-[11px] sm:text-xs font-display font-black">
                  <Dices className="w-4 h-4" />
                  28 Petak • Kuis Berjenjang C1–C4
                </span>
                <span className="inline-flex items-center gap-1.5 px-5 py-2 rounded-2xl bg-white text-[#1E2149] font-display font-black text-sm sm:text-base border-[3px] border-[#1E2149] shadow-[0_4px_0_#1E2149] group-hover:translate-x-1 transition-transform">
                  Mulai Bermain
                  <ChevronRight className="w-5 h-5" strokeWidth={3} />
                </span>
              </div>
            </motion.button>

            {/* PAPAN SKOR KELOMPOK */}
            <div className="md:col-span-2 lg:col-span-1 md:max-w-sm md:mx-auto lg:max-w-none w-full">
              <PapanSkorKelompok onBuka={() => handlePilih('turnamenTGT', 'turnamen_mulai')} />
            </div>
          </div>
        </section>

        {/* ── FASE 3: RUANG BELAJAR & EKSPLORASI ────────────────── */}
        <section className="mt-8">
          <JudulBagian ikon={<BookOpen className="w-5 h-5 text-[#3E7BFA]" strokeWidth={2.5} />}>
            Ruang Belajar &amp; Eksplorasi
          </JudulBagian>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KartuBelajar
              judul="Materi Kilat"
              deskripsi="Slide konsep bergambar pecahan biasa, senilai, penjumlahan & pengurangan."
              tombol="Pelajari Materi"
              ikon={<BookOpen className="w-5 h-5 text-[#3E7BFA]" strokeWidth={2.5} />}
              ilustrasi={
                <div className="relative w-full">
                  <IlustrasiPizza className="w-full" />
                  <KartuPecahan atas={3} bawah={4} className="absolute w-9 -right-1 -bottom-2 rotate-6" />
                </div>
              }
              latar="bg-gradient-to-br from-[#FFE27A] to-[#FFC21A]"
              bayangan="shadow-[0_6px_0_#C79E1A]"
              warnaTombol="bg-[#FFF6D1]"
              onClick={() => handlePilih('materiKilat')}
            />
            <KartuBelajar
              judul="Eksplorasi Pecahan"
              deskripsi="Laboratorium interaktif visual kue lingkaran, batang cokelat, dan petak sawah."
              tombol="Coba Eksperimen"
              ikon={<FlaskConical className="w-5 h-5 text-[#1DAA9C]" strokeWidth={2.5} />}
              ilustrasi={
                <div className="relative w-full">
                  <IlustrasiEksplorasi className="w-full" />
                  <KartuPecahan atas={1} bawah={2} className="absolute w-8 -right-1 top-1/3 rotate-6" />
                </div>
              }
              latar="bg-gradient-to-br from-[#8EEADF] to-[#3CCFBF]"
              bayangan="shadow-[0_6px_0_#14786E]"
              warnaTombol="bg-[#D9FBF6]"
              onClick={() => handlePilih('eksplorasi')}
            />
            <KartuBelajar
              judul="Tujuan Belajar"
              deskripsi="Capaian Pembelajaran (CP) dan TP1–TP7 Matematika Fase C Kurikulum Merdeka."
              tombol="Lihat Capaian"
              ikon={<Target className="w-5 h-5 text-[#22A55B]" strokeWidth={2.5} />}
              ilustrasi={<IlustrasiTujuan className="w-full" />}
              latar="bg-gradient-to-br from-[#9BE7A8] to-[#4CC76E]"
              bayangan="shadow-[0_6px_0_#1F7D4B]"
              warnaTombol="bg-[#E3FBE6]"
              onClick={() => handlePilih('tujuanBelajar')}
            />
          </div>
        </section>

        {/* ── FASE 3: MENU BANTUAN & PENDIDIK ───────────────────── */}
        <section className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          <KartuMenu
            judul="Cara Bermain"
            deskripsi="Aturan & tutorial 5 langkah"
            ikon={<HelpCircle className="w-7 h-7 text-white" strokeWidth={2.5} />}
            latar="bg-gradient-to-r from-[#4D8DFF] to-[#2F6BEB]"
            bayangan="shadow-[0_5px_0_#1E53B8]"
            teksGelap={false}
            onClick={() => handlePilih('caraBermain')}
          />
          <KartuMenu
            judul="Pengaturan"
            deskripsi="Audio, durasi, kontras tinggi"
            ikon={<Settings className="w-7 h-7 text-[#1E2149]" strokeWidth={2.5} />}
            latar="bg-white"
            bayangan="shadow-[0_5px_0_#B9B3CC]"
            onClick={() => handlePilih('pengaturan')}
          />
          <KartuMenu
            judul="Panel Guru"
            deskripsi="Bank soal, kelas, cetak hasil"
            lencana="Sandi"
            ikon={<GraduationCap className="w-7 h-7 text-[#1E2149]" strokeWidth={2.5} />}
            latar="bg-gradient-to-r from-[#FFF8EC] to-[#FFE8A3]"
            bayangan="shadow-[0_5px_0_#C29E40]"
            onClick={() => handlePilih('loginGuru')}
          />
        </section>

        {/* ── FASE 4: DOK BAWAH — SUARA & LAYAR PENUH ───────────── */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-3 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border-[3px] border-[#1E2149] shadow-[0_4px_0_rgba(30,33,73,0.25)]">
            <span className="w-9 h-9 rounded-full bg-[#FFD23F] border-2 border-[#1E2149] flex items-center justify-center">
              {bisu ? (
                <VolumeX className="w-5 h-5 text-[#1E2149]" strokeWidth={2.5} />
              ) : (
                <Volume2 className="w-5 h-5 text-[#1E2149]" strokeWidth={2.5} />
              )}
            </span>
            <span id="label-efek-suara" className="font-display font-black text-sm text-[#1E2149]">
              Efek suara jawaban benar
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!bisu}
              aria-labelledby="label-efek-suara"
              onClick={handleToggleSuara}
              className="sakelar cursor-pointer"
            />
          </div>

          {layarPenuh.didukung && (
            <button
              type="button"
              onClick={() => {
                audio.putar('klik_tombol');
                layarPenuh.toggle();
              }}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#5B9BFF] to-[#2F6BEB] text-white border-[3px] border-[#1E2149] shadow-[0_5px_0_#1E53B8] font-display font-black text-base active:translate-y-1 active:shadow-[0_1px_0_#1E53B8] cursor-pointer"
            >
              {layarPenuh.aktif ? <Minimize className="w-5 h-5" strokeWidth={2.5} /> : <Maximize className="w-5 h-5" strokeWidth={2.5} />}
              {layarPenuh.aktif ? 'Keluar Layar Penuh' : 'Layar Penuh Proyektor'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
