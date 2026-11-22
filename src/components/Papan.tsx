import React from 'react';
import { DAFTAR_PETAK, PetakData } from '../data/papan';
import { TombolChunky } from './TombolChunky';
import { Pemain, KepemilikanKios } from '../store/gameStore';
import { LapisanPion, GAP_GRID_PERSEN } from './papan/LapisanPion';
import { DaduArena } from './papan/DaduArena';
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
  Dices
} from 'lucide-react';

const IKON_MAP: Record<string, React.ReactNode> = {
  School: <School />,
  Cake: <Cake />,
  Pizza: <Pizza />,
  Sparkles: <Sparkles />,
  Utensils: <Utensils />,
  Flame: <Flame />,
  Apple: <Apple />,
  Coffee: <Coffee />,
  Trees: <Trees />,
  Leaf: <Leaf />,
  Sparkle: <Sparkle />,
  Flower2: <Flower2 />,
  BookOpen: <BookOpen />,
  Anchor: <Anchor />,
  Fish: <Fish />,
  Ship: <Ship />,
  Navigation: <Navigation />,
  Sun: <Sun />,
  Shirt: <Shirt />,
  Package: <Package />,
  Scissors: <Scissors />,
  Sprout: <Sprout />
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
  /** Perspektif 3D ringan (default aktif). */
  mode3D?: boolean;
  /** Matikan animasi dekoratif (prefers-reduced-motion). */
  kurangiGerak?: boolean;
  /** Dadu berputar hanya untuk langkah hasil kocokan (bukan langkah dari kartu). Default: sedangMelangkah. */
  daduBerputar?: boolean;
  /** Pemain aktif sudah mengocok pada giliran ini — tombol kocok dikunci. */
  sudahLempar?: boolean;
  /** Label petak yang ditampilkan (mis. nama kios kustom dari Panel Guru). */
  namaPetak?: (petak: PetakData) => string;
  className?: string;
}

/**
 * Papan Monopoli 3D Premium — 28 petak dirender apa adanya dari DAFTAR_PETAK
 * (urutan, nomor, nama, jenis, warna, ikon & posisi grid tidak diubah).
 * Komponen ini murni presentasi: semua aksi diteruskan ke handler existing.
 */
export const Papan: React.FC<PapanProps> = ({
  pemain,
  giliranIndex,
  kepemilikan,
  petakAktif,
  angkaDadu,
  sedangMelangkah,
  onLemparDadu,
  onPilihPetak,
  mode3D = true,
  kurangiGerak = false,
  daduBerputar,
  sudahLempar = false,
  namaPetak,
  className = ''
}) => {
  const pemainAktif = pemain[giliranIndex];
  const kocokTerkunci = sedangMelangkah || sudahLempar;

  return (
    <div className={`papan-panggung ${mode3D ? 'papan-panggung-3d' : ''} ${className}`}>
      <div className="papan-bingkai">
        <div className="papan-permukaan">
          <div
            className="relative grid grid-cols-8 grid-rows-8 w-full h-full"
            style={{ gap: `${GAP_GRID_PERSEN}%` }}
          >
            {/* ── 28 PETAK KELILING ─────────────────────────── */}
            {DAFTAR_PETAK.map((petak) => {
              const isSudut = petak.jenis === 'sudut';
              const isAktif = petakAktif === petak.index;
              const milik = kepemilikan[petak.index];

              return (
                <button
                  type="button"
                  key={petak.index}
                  data-petak={petak.index}
                  onClick={() => onPilihPetak && onPilihPetak(petak)}
                  aria-label={`Petak ${petak.index}: ${namaPetak ? namaPetak(petak) : petak.nama}`}
                  title={namaPetak ? namaPetak(petak) : petak.nama}
                  aria-current={isAktif ? 'location' : undefined}
                  style={{
                    gridRowStart: petak.gridRow + 1,
                    gridColumnStart: petak.gridCol + 1,
                    backgroundColor: petak.warna
                  }}
                  className={`petak-premium ${isSudut ? 'petak-sudut' : ''} ${isAktif ? 'petak-aktif' : ''}`}
                >
                  <span className="petak-kepala">
                    <span className="petak-nomor">{petak.index}</span>
                    {milik && (
                      <span className="petak-milik" title="Kios dimiliki">
                        <span className="petak-milik-warna" style={{ backgroundColor: milik.timWarna }} />
                        {Array.from({ length: milik.bintang }).map((_, i) => (
                          <Star key={i} className="petak-bintang fill-amber-400 text-amber-600" />
                        ))}
                      </span>
                    )}
                  </span>

                  <span className="petak-ikon">{IKON_MAP[petak.ikon] || <Sparkles />}</span>

                  <span className="petak-nama">{namaPetak ? namaPetak(petak) : petak.namaSingkat}</span>
                </button>
              );
            })}

            {/* ── AREA TENGAH PAPAN (6x6) ───────────────────── */}
            <div
              style={{ gridRowStart: 2, gridRowEnd: 8, gridColumnStart: 2, gridColumnEnd: 8 }}
              className="papan-tengah"
            >
              <div className="relative z-10 text-center">
                <h2 className="papan-logo font-display font-black">MONOPECA</h2>
                <p className="papan-tagline font-display font-extrabold">
                  MONOPOLI PECAHAN • TGT MATEMATIKA FASE C
                </p>
              </div>

              <div className="relative z-10 my-auto flex flex-col items-center gap-[2.2cqw]">
                <DaduArena
                  nilai={angkaDadu}
                  sedangMelangkah={daduBerputar ?? sedangMelangkah}
                  disabled={kocokTerkunci}
                  onKocok={onLemparDadu}
                  kurangiGerak={kurangiGerak}
                />
                <TombolChunky
                  variant="primary"
                  size="md"
                  disabled={kocokTerkunci}
                  icon={<Dices className="w-5 h-5 fill-white" />}
                  onClick={onLemparDadu}
                  className="papan-tombol-kocok"
                >
                  {sedangMelangkah ? 'Melangkah...' : sudahLempar ? 'Sudah Dikocok' : 'Kocok Dadu'}
                </TombolChunky>
              </div>

              <div className="papan-tengah-bawah relative z-10">
                <span className="papan-dek papan-dek-kesempatan">
                  <span className="papan-dek-kartu" />
                  Kesempatan
                </span>

                {pemainAktif && (
                  <span className="papan-giliran-chip" key={pemainAktif.id}>
                    <span className="papan-giliran-warna" style={{ backgroundColor: pemainAktif.warna }} />
                    <span className="truncate">
                      {pemainAktif.nama} ({pemainAktif.timNama})
                    </span>
                  </span>
                )}

                <span className="papan-dek papan-dek-tantangan">
                  <span className="papan-dek-kartu" />
                  Tantangan
                </span>
              </div>
            </div>

            {/* ── PION (lapisan visual mengikuti state) ─────── */}
            <LapisanPion
              pemain={pemain}
              idPemainAktif={pemainAktif?.id}
              sedangMelangkah={sedangMelangkah}
              kurangiGerak={kurangiGerak}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
