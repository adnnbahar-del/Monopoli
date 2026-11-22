import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Play,
  Star,
  Music,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2
} from 'lucide-react';
import { PakPeca } from '../components/PakPeca';
import { DaduKubus, PortalPecahan, JalurPion, KepingPecahan } from '../components/splash/DekorasiSplash';
import { audio } from '../engine/audioManager';
import { musikPembuka } from '../engine/musikPembuka';
import { usePengaturanStore } from '../store/pengaturanStore';
import { useLayarPenuh } from '../hooks/useLayarPenuh';

export interface SplashProps {
  onMulai: () => void;
}

/** idle → membuka (portal melebar) → menuju (kilatan cahaya) → onMulai() */
type FaseSplash = 'idle' | 'membuka' | 'menuju';

const DURASI_MEMBUKA_MS = 500;
const DURASI_TOTAL_MS = 1050;
const DURASI_REDUCED_MS = 150;
/** Bila setelah onMulai() layar ini masih tampil, pulihkan tombol (jaring pengaman). */
const BATAS_TUNGGU_NAVIGASI_MS = 4000;

const BINTANG_LATAR = Array.from({ length: 34 }, (_, i) => ({
  left: `${(i * 29 + 7) % 100}%`,
  top: `${(i * 47 + 11) % 82}%`,
  ukuran: 2 + (i % 3),
  delay: `${(i % 9) * 0.4}s`,
}));

/* ── Tombol ikon kecil dengan tooltip ─────────────────────────── */
interface TombolKontrolProps {
  label: string;
  aktif: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TombolKontrol: React.FC<TombolKontrolProps> = ({ label, aktif, onClick, children }) => (
  <div className="relative group">
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={aktif}
      title={label}
      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-[3px] border-[#101C48] flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_0_#101C48] active:translate-y-1 active:shadow-[0_1px_0_#101C48] ${
        aktif
          ? 'bg-gradient-to-b from-[#FFE58A] to-[#FFB938] text-[#101C48]'
          : 'bg-[#EAE5FF]/90 text-[#32166F]/70'
      }`}
    >
      {children}
    </button>
    <span
      role="tooltip"
      className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-lg bg-[#101C48] px-2.5 py-1 text-xs font-bold text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-30"
    >
      {label}
    </span>
  </div>
);

export const Splash: React.FC<SplashProps> = ({ onMulai }) => {
  const kurangiGerak = useReducedMotion() ?? false;
  const [fase, setFase] = useState<FaseSplash>('idle');
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanInfo, setPesanInfo] = useState<string | null>(null);
  const [musikAktif, setMusikAktif] = useState(false);

  const bisu = usePengaturanStore((s) => s.bisu);
  const toggleBisu = usePengaturanStore((s) => s.toggleBisu);
  const volumeMusik = usePengaturanStore((s) => s.volumeMusik);
  const layarPenuh = useLayarPenuh();

  const sedangMemulai = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const tunda = useCallback((fn: () => void, ms: number) => {
    timerRef.current.push(setTimeout(fn, ms));
  }, []);

  // ── Bersihkan timer & musik saat komponen dilepas ──────────
  useEffect(() => {
    return () => {
      timerRef.current.forEach(clearTimeout);
      timerRef.current = [];
      musikPembuka.berhenti(0.3);
    };
  }, []);

  // Volume musik mengikuti Pengaturan existing
  useEffect(() => {
    musikPembuka.setVolume(volumeMusik);
  }, [volumeMusik]);

  // Pesan info otomatis hilang
  useEffect(() => {
    if (!pesanInfo) return;
    const id = setTimeout(() => setPesanInfo(null), 3500);
    return () => clearTimeout(id);
  }, [pesanInfo]);

  // ── Kontrol ────────────────────────────────────────────────
  const handleMusik = async () => {
    if (musikAktif) {
      musikPembuka.berhenti(0.4);
      setMusikAktif(false);
      return;
    }
    if (volumeMusik <= 0) {
      setPesanInfo('Volume musik 0%. Naikkan di menu Pengaturan.');
      return;
    }
    const berhasil = await musikPembuka.mulai();
    if (berhasil) {
      setMusikAktif(true);
    } else {
      setPesanInfo('Musik tidak dapat diputar di browser ini.');
    }
  };

  const handleSuara = () => {
    if (bisu) {
      audio.setBisu(false);
      audio.putar('klik_tombol');
    }
    toggleBisu();
  };

  const handleLayarPenuh = async () => {
    if (!layarPenuh.didukung) {
      setPesanInfo('Layar penuh tidak didukung browser ini.');
      return;
    }
    const ok = await layarPenuh.toggle();
    if (!ok) setPesanInfo('Browser menolak mode layar penuh.');
  };

  // ── Mulai: transisi portal lalu navigasi existing ──────────
  const pulihkan = useCallback((pesan: string) => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    sedangMemulai.current = false;
    setFase('idle');
    setPesanError(pesan);
  }, []);

  const jalankanNavigasi = useCallback(() => {
    try {
      onMulai();
      tunda(
        () => pulihkan('Halaman utama belum terbuka. Ketuk tombol sekali lagi, ya!'),
        BATAS_TUNGGU_NAVIGASI_MS
      );
    } catch {
      pulihkan('Ups! Gagal membuka halaman utama. Coba ketuk sekali lagi, ya.');
    }
  }, [onMulai, pulihkan, tunda]);

  const handleMulai = () => {
    if (sedangMemulai.current) return; // cegah aktivasi ganda
    sedangMemulai.current = true;
    setPesanError(null);
    audio.putar('start_bonus');
    if (musikAktif) {
      musikPembuka.berhenti(0.6);
      setMusikAktif(false);
    }

    if (kurangiGerak) {
      tunda(jalankanNavigasi, DURASI_REDUCED_MS);
      return;
    }
    setFase('membuka');
    tunda(() => setFase('menuju'), DURASI_MEMBUKA_MS);
    tunda(jalankanNavigasi, DURASI_TOTAL_MS);
  };

  const transisi = fase !== 'idle';

  return (
    <div className="splash-root relative min-h-[100dvh] flex flex-col overflow-hidden select-none">
      {/* ── Latar bintang ─────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {BINTANG_LATAR.map((b, i) => (
          <span
            key={i}
            className="splash-bintang-latar"
            style={{ left: b.left, top: b.top, width: b.ukuran, height: b.ukuran, animationDelay: b.delay }}
          />
        ))}
      </div>

      {/* ── Area D (dekor): jalur petak & pion ────────────────── */}
      <JalurPion animasi={!kurangiGerak && !transisi} mendekatPortal={transisi} />

      {/* ── Area A: Header ────────────────────────────────────── */}
      <header className="relative z-20 px-3 sm:px-6 pt-3 sm:pt-5 flex flex-col-reverse items-center gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-start">
        <div className="hidden sm:block" />
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-[#EAE5FF] border-[3px] border-[#101C48] px-3 sm:px-5 py-1.5 rounded-full text-[13px] sm:text-base font-display font-extrabold text-[#101C48] shadow-[0_4px_0_#101C48] text-center leading-tight">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 fill-[#FFD45A] text-[#101C48]" strokeWidth={2.5} />
            Matematika Kelas V SD — Kurikulum Merdeka (Fase C)
          </span>
        </motion.div>

        <div className="w-full sm:w-auto flex justify-end gap-2">
          <TombolKontrol
            label={musikAktif ? 'Matikan musik pembuka' : 'Putar musik pembuka'}
            aktif={musikAktif}
            onClick={handleMusik}
          >
            <span className="relative">
              <Music className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              {!musikAktif && (
                <span className="absolute left-1/2 top-1/2 w-[130%] h-[3px] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
              )}
            </span>
          </TombolKontrol>
          <TombolKontrol
            label={bisu ? 'Nyalakan efek suara' : 'Matikan efek suara'}
            aktif={!bisu}
            onClick={handleSuara}
          >
            {bisu ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />}
          </TombolKontrol>
          <TombolKontrol
            label={layarPenuh.aktif ? 'Keluar layar penuh' : 'Layar penuh proyektor'}
            aktif={layarPenuh.aktif}
            onClick={handleLayarPenuh}
          >
            {layarPenuh.aktif ? <Minimize className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} /> : <Maximize className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />}
          </TombolKontrol>
        </div>

        {pesanInfo && (
          <p role="status" className="absolute right-3 sm:right-6 top-full mt-3 max-w-[260px] rounded-xl bg-[#101C48] border-2 border-[#FFD45A] px-3 py-2 text-sm font-bold text-white shadow-lg">
            {pesanInfo}
          </p>
        )}
      </header>

      {/* ── Area B + C: Petualangan utama & tombol mulai ──────── */}
      <main
        className={`splash-konten ${fase === 'menuju' ? 'splash-konten-masuk' : ''} relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-2 pb-2`}
      >
        <div className="relative flex flex-col items-center">
          <PortalPecahan terbuka={transisi} />

          {/* Dadu (kiri) & keping pecahan (kanan) — dekoratif */}
          <div className="hidden md:block absolute right-full top-[38%] mr-[clamp(24px,6vw,110px)]" aria-hidden="true">
            <DaduKubus />
          </div>
          <div className="hidden md:flex absolute left-full top-[24%] ml-[clamp(24px,6vw,120px)] flex-col items-center gap-4" aria-hidden="true">
            <KepingPecahan atas={1} bawah={2} className="rotate-6" />
            <KepingPecahan atas={3} bawah={4} className="-rotate-6 ml-10 [animation-delay:1.2s]" />
          </div>

          {/* Maskot asli Pak Peca */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.7 }}
            className="relative"
          >
            <div className="splash-maskot splash-maskot-idle w-[clamp(84px,20vh,240px)]">
              <PakPeca ekspresi="ceria" size={160} melambai={!kurangiGerak} />
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <h1 className="splash-judul font-display font-black mt-1">MONOPECA</h1>
            <p className="mt-2 font-display font-black text-[clamp(1.2rem,3.6vh,2.4rem)] text-white leading-none [text-shadow:0_3px_0_#101C48]">
              Monopoli Pecahan
            </p>
            <p className="mt-2 inline-block rounded-full bg-[#101C48]/55 px-4 py-1 font-display font-extrabold text-[clamp(0.85rem,2.2vh,1.3rem)] text-[#FFD45A] tracking-wide">
              Belajar • Bermain • Berkompetisi
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mt-[clamp(10px,2.4vh,28px)] flex flex-col items-center w-full"
        >
          <p className="max-w-2xl rounded-2xl bg-[#101C48]/50 px-4 py-1.5 text-[clamp(0.85rem,2vh,1.2rem)] font-bold text-[#EAE5FF] leading-snug">
            Media Belajar Kolaboratif Model Teams Games Tournament (TGT)
          </p>

          <button
            type="button"
            data-testid="tombol-mulai"
            onClick={handleMulai}
            disabled={transisi}
            aria-busy={transisi}
            className="splash-tombol relative mt-[clamp(12px,2.4vh,26px)] w-full max-w-[min(540px,92vw)] min-h-[64px] px-6 sm:px-8 py-[clamp(12px,2vh,20px)] rounded-full font-display font-black whitespace-nowrap text-[clamp(1.05rem,min(3.4vh,5.6vw),2rem)] text-white uppercase tracking-wide flex items-center justify-center gap-3 cursor-pointer [text-shadow:0_2px_0_#101C48]"
          >
            {transisi ? (
              <>
                <Loader2 className="w-7 h-7 animate-spin" strokeWidth={3} />
                <span>Membuka Gerbang…</span>
              </>
            ) : (
              <>
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white" strokeWidth={2.5} />
                <span>Ketuk Untuk Mulai</span>
              </>
            )}
          </button>

          {pesanError && (
            <p role="alert" className="mt-3 rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#E5484D] border-2 border-[#E5484D]">
              {pesanError}
            </p>
          )}
        </motion.div>
      </main>

      {/* ── Area D: Footer ────────────────────────────────────── */}
      <footer className="relative z-10 flex justify-center pb-[calc(var(--sp-jalur)+4px)] pt-1 sm:pt-2">
        <p className="rounded-full bg-[#101C48]/60 px-4 py-1 text-[clamp(0.8rem,1.8vh,1rem)] font-bold text-[#EAE5FF]">
          Ramah Anak • Tanpa Iklan
        </p>
      </footer>

      {/* Kilatan cahaya akhir transisi */}
      <div className={`splash-kilat ${fase === 'menuju' ? 'splash-kilat-aktif' : ''}`} aria-hidden="true" />
    </div>
  );
};
