import React, { useState } from 'react';
import { DAFTAR_PETAK, PetakData } from '../data/papan';
import { Bidak } from './Bidak';
import { Dadu3D } from './Dadu3D';
import { TombolChunky } from './TombolChunky';
import { Pemain, KepemilikanKios } from '../store/gameStore';
import {
  School,
  Cake,
  Pizza,
  Sparkles,
  Utensils,
  Flame,
  Apple,
  Coffee,
  Trees,
  Leaf,
  Sparkle,
  Flower2,
  BookOpen,
  Anchor,
  Fish,
  Ship,
  Navigation,
  Sun,
  Shirt,
  Package,
  Scissors,
  Sprout,
  Star,
  Layers,
  Dices
} from 'lucide-react';

const IKON_MAP: Record<string, React.ReactNode> = {
  School: <School className="w-5 h-5" />,
  Cake: <Cake className="w-4 h-4" />,
  Pizza: <Pizza className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
  Utensils: <Utensils className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Apple: <Apple className="w-4 h-4" />,
  Coffee: <Coffee className="w-5 h-5" />,
  Trees: <Trees className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
  Sparkle: <Sparkle className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  Anchor: <Anchor className="w-4 h-4" />,
  Fish: <Fish className="w-4 h-4" />,
  Ship: <Ship className="w-4 h-4" />,
  Navigation: <Navigation className="w-4 h-4" />,
  Sun: <Sun className="w-5 h-5" />,
  Shirt: <Shirt className="w-4 h-4" />,
  Package: <Package className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  Sprout: <Sprout className="w-4 h-4" />
};

export interface PapanProps {
  pemain: Pemain[];
  giliranIndex: number;
  kepemilikan: Record<number, KepemilikanKios>;
  petakAktif: number | null;
  angkaDadu: number;
  sedangMelangkah: boolean;
  onLemparDadu: () => void;
  onPilihPetak?: (petak: PetakData) => void;
  className?: string;
}

export const Papan: React.FC<PapanProps> = ({
  pemain,
  giliranIndex,
  kepemilikan,
  petakAktif,
  angkaDadu,
  sedangMelangkah,
  onLemparDadu,
  onPilihPetak,
  className = ''
}) => {
  const [mode3D, setMode3D] = useState(true);
  const pemainAktif = pemain[giliranIndex];

  return (
    <div className={`relative flex flex-col items-center select-none w-full ${className}`}>
      {/* Tombol Toggle Kemiringan Perspektif 3D Papan (Khusus Desktop/Tablet) */}
      <div className="hidden sm:flex justify-end w-full max-w-4xl mb-2 px-2">
        <button
          type="button"
          onClick={() => setMode3D(!mode3D)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/80 hover:bg-white border-2 border-[#1E2149] text-xs font-display font-extrabold text-[#1E2149] shadow-sm cursor-pointer transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-[#FF6B35]" />
          <span>{mode3D ? 'Mode Perspektif 3D Aktif' : 'Mode Papan Datar'}</span>
        </button>
      </div>

      {/* Kontainer Grid Papan Permainan (8 x 8) */}
      <div
        className={`
          w-full max-w-[760px] aspect-square p-2 sm:p-3 bg-[#FFF8EC]
          border-4 sm:border-6 border-[#1E2149] rounded-[24px] sm:rounded-[36px]
          shadow-[0_16px_36px_rgba(30,33,73,0.18)] transition-transform duration-500
          ${mode3D ? 'sm:[transform:perspective(1200px)_rotateX(14deg)]' : ''}
        `}
      >
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full gap-1 sm:gap-1.5 relative">
          {/* RENDER 28 PETAK KELILING */}
          {DAFTAR_PETAK.map((petak) => {
            const isSudut = petak.jenis === 'sudut';
            const isAktif = petakAktif === petak.index;
            const milik = kepemilikan[petak.index];

            // Filter pemain yang sedang berada di petak ini
            const pemainDiPetak = pemain.filter((p) => p.posisi === petak.index);

            return (
              <div
                key={petak.index}
                onClick={() => onPilihPetak && onPilihPetak(petak)}
                style={{
                  gridRowStart: petak.gridRow + 1,
                  gridColumnStart: petak.gridCol + 1,
                  backgroundColor: petak.warna
                }}
                className={`
                  relative rounded-lg sm:rounded-xl border-2 sm:border-3 border-[#1E2149]
                  p-1 flex flex-col justify-between items-center text-center cursor-pointer
                  transition-all duration-150 overflow-hidden
                  ${isAktif ? 'ring-4 ring-[#FFD23F] ring-offset-1 z-20 scale-105' : 'hover:brightness-105'}
                  ${isSudut ? 'shadow-inner font-black' : 'shadow-sm'}
                `}
              >
                {/* Header Petak / Indikator Kepemilikan Kios */}
                <div className="w-full flex items-center justify-between text-[8px] sm:text-[10px] font-black text-[#1E2149] px-0.5">
                  <span>{petak.index}</span>
                  {milik && (
                    <div className="flex items-center gap-0.5 bg-white/90 px-1 py-0.2 rounded-md border border-[#1E2149]">
                      <div
                        className="w-2 h-2 rounded-full border border-black"
                        style={{ backgroundColor: milik.timWarna }}
                      />
                      {Array.from({ length: milik.bintang }).map((_, i) => (
                        <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-500" />
                      ))}
                    </div>
                  )}
                </div>

                {/* Ikon Petak */}
                <div className="my-auto text-[#1E2149] shrink-0 flex items-center justify-center">
                  {IKON_MAP[petak.ikon] || <Sparkles className="w-4 h-4" />}
                </div>

                {/* Nama Singkat Petak */}
                <div className="w-full truncate text-[8px] sm:text-[10px] font-display font-extrabold text-[#1E2149] leading-tight">
                  {petak.namaSingkat}
                </div>

                {/* Bidak Pion Pemain yang Berada di Petak Ini (Maks 4 Anti-Tumpuk) */}
                {pemainDiPetak.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {pemainDiPetak.map((p, idx) => (
                        <Bidak
                          key={p.id}
                          namaPemain={p.nama}
                          warna={p.warna}
                          bentuk={p.bentuk}
                          slotIndex={idx}
                          isAktif={p.id === pemainAktif?.id && sedangMelangkah}
                          size={24}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* AREA TENGAH PAPAN (6x6) */}
          <div
            style={{
              gridRowStart: 2,
              gridRowEnd: 8,
              gridColumnStart: 2,
              gridColumnEnd: 8
            }}
            className="rounded-2xl bg-gradient-to-br from-[#FFE3B3] to-[#FFCA28]/30 border-3 border-dashed border-[#1E2149]/30 p-3 sm:p-5 flex flex-col items-center justify-between text-center relative overflow-hidden"
          >
            {/* Latar Belakang Tapis Lampung Halus */}
            <div className="absolute inset-0 tapis-pattern opacity-30 pointer-events-none" />

            {/* Bagian Atas Tengah: Logo MONOPECA & Tagline */}
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-4xl font-display font-black text-[#FF6B35] tracking-tight drop-shadow-[0_2px_0_#1E2149]">
                MONOPECA
              </h1>
              <p className="text-[10px] sm:text-xs font-display font-extrabold text-[#1E2149] tracking-wide">
                MONOPOLI PECAHAN • TGT MATEMATIKA FASE C
              </p>
            </div>

            {/* Bagian Tengah: Dadu 3D & Tombol Lempar */}
            <div className="relative z-10 my-auto flex flex-col items-center gap-3">
              <Dadu3D
                nilai={angkaDadu}
                isRolling={sedangMelangkah}
                disabled={sedangMelangkah}
                onLempar={() => onLemparDadu()}
                size={76}
              />

              <TombolChunky
                variant="primary"
                size="md"
                disabled={sedangMelangkah}
                icon={<Dices className="w-5 h-5 fill-white" />}
                onClick={onLemparDadu}
                className="w-44 sm:w-52"
              >
                {sedangMelangkah ? 'Melangkah...' : 'Kocok Dadu'}
              </TombolChunky>
            </div>

            {/* Bagian Bawah Tengah: Tumpukan Kartu & Giliran Pemain */}
            <div className="relative z-10 w-full flex items-center justify-between gap-2 border-t-2 border-[#1E2149]/20 pt-2 text-[10px] sm:text-xs font-bold text-gray-700">
              {/* Tumpukan Kartu Kesempatan */}
              <div className="flex items-center gap-1.5 bg-[#FF7EB6]/20 border border-[#FF7EB6] px-2.5 py-1 rounded-xl">
                <div className="w-3.5 h-3.5 rounded bg-[#FF7EB6] border border-[#1E2149]" />
                <span className="font-extrabold text-[#1E2149]">Kesempatan</span>
              </div>

              {/* Status Giliran */}
              {pemainAktif && (
                <div className="flex items-center gap-1.5 bg-white/90 border border-[#1E2149] px-2.5 py-1 rounded-xl shadow-xs">
                  <div
                    className="w-3 h-3 rounded-full border border-black"
                    style={{ backgroundColor: pemainAktif.warna }}
                  />
                  <span className="font-extrabold text-[#1E2149]">
                    {pemainAktif.nama} ({pemainAktif.timNama})
                  </span>
                </div>
              )}

              {/* Tumpukan Kartu Tantangan */}
              <div className="flex items-center gap-1.5 bg-[#7B5CFA]/20 border border-[#7B5CFA] px-2.5 py-1 rounded-xl">
                <div className="w-3.5 h-3.5 rounded bg-[#7B5CFA] border border-[#1E2149]" />
                <span className="font-extrabold text-[#1E2149]">Tantangan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
