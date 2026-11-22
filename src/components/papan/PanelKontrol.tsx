import React from 'react';
import {
  Clock,
  Pause,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Layers,
  ArrowRight,
  Footprints
} from 'lucide-react';
import type { PetakData } from '../../data/papan';

const LABEL_JENIS: Record<PetakData['jenis'], string> = {
  sudut: 'Petak Sudut',
  kios: 'Kios',
  kesempatan: 'Kesempatan',
  tantangan: 'Tantangan',
};

const LABEL_SUBTOPIK: Record<string, string> = {
  mengenal: 'Mengenal Pecahan',
  senilai: 'Pecahan Senilai',
  membandingkan: 'Membandingkan',
  mengurutkan: 'Mengurutkan',
  penjumlahan: 'Penjumlahan',
  pengurangan: 'Pengurangan',
  campuran: 'Pecahan Campuran',
};

/* ── Timer ────────────────────────────────────────────────────── */
export const TimerArena: React.FC<{ sisaDetik: number; jeda: boolean }> = ({ sisaDetik, jeda }) => {
  const menit = Math.floor(sisaDetik / 60);
  const detik = sisaDetik % 60;
  const teks = `${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`;
  const kritis = sisaDetik <= 60;
  return (
    <div className={`timer-arena ${kritis ? 'timer-kritis' : ''}`} role="timer" aria-label={`Sisa waktu ${menit} menit ${detik} detik`}>
      <span className="flex items-center gap-1.5 text-xs font-display font-black uppercase tracking-wider text-[#EAE5FF]">
        <Clock className="w-4 h-4 text-[#FFD45A]" />
        Sisa Waktu
        {jeda && <span className="ml-1 px-1.5 rounded bg-[#FFD45A] text-[#101C48]">Dijeda</span>}
      </span>
      <span className="timer-angka font-display font-black tabular-nums">{teks}</span>
    </div>
  );
};

/* ── Tombol utilitas ──────────────────────────────────────────── */
interface TombolUtilitasProps {
  label: string;
  teks: string;
  aktif?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TombolUtilitas: React.FC<TombolUtilitasProps> = ({ label, teks, aktif, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    aria-pressed={aktif}
    title={label}
    className={`tombol-utilitas ${aktif ? 'tombol-utilitas-aktif' : ''}`}
  >
    {children}
    <span className="text-[11px] leading-none">{teks}</span>
  </button>
);

export interface KontrolArenaProps {
  onJeda: () => void;
  layarPenuhAktif: boolean;
  onLayarPenuh: () => void;
  suaraAktif: boolean;
  onSuara: () => void;
  mode3D: boolean;
  onMode3D: () => void;
}

export const KontrolArena: React.FC<KontrolArenaProps> = ({
  onJeda,
  layarPenuhAktif,
  onLayarPenuh,
  suaraAktif,
  onSuara,
  mode3D,
  onMode3D,
}) => (
  <div className="flex flex-col gap-2">
    <button type="button" onClick={onJeda} className="tombol-jeda-arena">
      <Pause className="w-5 h-5 fill-current" />
      Jeda Permainan
    </button>
    <div className="grid grid-cols-3 gap-2">
      <TombolUtilitas
        label={layarPenuhAktif ? 'Keluar layar penuh' : 'Layar penuh proyektor'}
        teks={layarPenuhAktif ? 'Keluar' : 'Layar Penuh'}
        aktif={layarPenuhAktif}
        onClick={onLayarPenuh}
      >
        {layarPenuhAktif ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
      </TombolUtilitas>
      <TombolUtilitas
        label={suaraAktif ? 'Matikan efek suara' : 'Nyalakan efek suara'}
        teks={suaraAktif ? 'Suara On' : 'Suara Off'}
        aktif={suaraAktif}
        onClick={onSuara}
      >
        {suaraAktif ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </TombolUtilitas>
      <TombolUtilitas
        label={mode3D ? 'Ganti ke papan datar' : 'Ganti ke perspektif 3D'}
        teks={mode3D ? 'Papan 3D' : 'Datar'}
        aktif={mode3D}
        onClick={onMode3D}
      >
        <Layers className="w-5 h-5" />
      </TombolUtilitas>
    </div>
  </div>
);

/* ── Kartu petak aktif ────────────────────────────────────────── */
export interface KartuPetakAktifProps {
  petak: PetakData;
  sedangMelangkah: boolean;
  onLewatiGiliran: () => void;
}

export const KartuPetakAktif: React.FC<KartuPetakAktifProps> = ({ petak, sedangMelangkah, onLewatiGiliran }) => {
  if (sedangMelangkah) {
    return (
      <div className="kartu-petak-aktif items-center justify-center text-center" aria-live="polite">
        <Footprints className="w-8 h-8 text-[#6539D8] animate-bounce" />
        <p className="font-display font-black text-lg text-[#101C48]">Bidak sedang melangkah…</p>
      </div>
    );
  }

  return (
    <div className="kartu-petak-aktif" aria-live="polite">
      <div className="flex items-start gap-3">
        <span
          className="kartu-petak-nomor font-display font-black"
          style={{ backgroundColor: petak.warna }}
          aria-label={`Petak nomor ${petak.index}`}
        >
          {petak.index}
        </span>
        <div className="min-w-0">
          <span className="block text-[11px] font-display font-black uppercase tracking-wider text-[#6539D8]">
            Petak Aktif • {LABEL_JENIS[petak.jenis]}
            {petak.subtopik ? ` • ${LABEL_SUBTOPIK[petak.subtopik] ?? petak.subtopik}` : ''}
          </span>
          <h2 className="font-display font-black text-[clamp(1.05rem,1.35vw,1.4rem)] leading-tight text-[#101C48]">
            {petak.nama}
          </h2>
        </div>
      </div>
      <p className="text-sm font-bold text-[#101C48]/80 leading-snug">{petak.deskripsi}</p>
      <button type="button" onClick={onLewatiGiliran} className="tombol-lewati-arena">
        Lewati Giliran
        <ArrowRight className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );
};
