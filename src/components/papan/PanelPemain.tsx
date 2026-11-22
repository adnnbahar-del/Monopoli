import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, MapPin, Crown } from 'lucide-react';
import type { Pemain } from '../../store/gameStore';
import { DAFTAR_PETAK } from '../../data/papan';

export interface PanelPemainProps {
  pemain: Pemain[];
  giliranIndex: number;
  kurangiGerak?: boolean;
}

/**
 * Panel kiri: "Giliran Saat Ini" + daftar seluruh pemain.
 * Hanya membaca state existing (pemain, giliranIndex) — tidak mengubah apa pun.
 */
export const PanelPemain: React.FC<PanelPemainProps> = ({ pemain, giliranIndex, kurangiGerak = false }) => {
  const aktif = pemain[giliranIndex];
  const poinTertinggi = Math.max(0, ...pemain.map((p) => p.poin));

  return (
    <section aria-label="Pemain dan giliran" className="panel-arena flex flex-col gap-3">
      {/* Giliran saat ini */}
      <div className="panel-giliran" style={{ ['--warna-tim' as string]: aktif?.warna }}>
        <span className="panel-giliran-badge">Giliran Saat Ini</span>
        <AnimatePresence mode="wait" initial={false}>
          {aktif && (
            <motion.div
              key={aktif.id}
              initial={kurangiGerak ? false : { opacity: 0, x: -16, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={kurangiGerak ? undefined : { opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 mt-2"
              aria-live="polite"
            >
              <span
                className="panel-avatar panel-avatar-besar"
                style={{ backgroundColor: aktif.warna }}
              >
                {aktif.nama.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block font-display font-black text-[clamp(1.15rem,1.6vw,1.6rem)] leading-tight text-white truncate">
                  {aktif.nama}
                </span>
                <span
                  className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-black text-white border-2 border-[#101C48]"
                  style={{ backgroundColor: aktif.warna }}
                >
                  {aktif.timNama}
                </span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Daftar pemain */}
      <ul className="grid grid-cols-2 xl:grid-cols-1 gap-2">
        {pemain.map((p, i) => {
          const isAktif = i === giliranIndex;
          const petak = DAFTAR_PETAK[p.posisi];
          return (
            <li
              key={p.id}
              className={`kartu-pemain ${isAktif ? 'kartu-pemain-aktif' : ''}`}
              style={{ ['--warna-tim' as string]: p.warna }}
              aria-current={isAktif ? 'true' : undefined}
            >
              <span className="panel-avatar" style={{ backgroundColor: p.warna }}>
                {p.nama.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1">
                  <span className="font-display font-black text-sm sm:text-base text-[#101C48] truncate">{p.nama}</span>
                  {p.poin > 0 && p.poin === poinTertinggi && (
                    <Crown className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-300" aria-label="Poin tertinggi" />
                  )}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-[#101C48]/70 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  Petak {p.posisi}
                  <span className="hidden xl:inline truncate">· {petak?.namaSingkat}</span>
                </span>
              </span>
              <span className="kartu-pemain-poin">
                <Trophy className="w-3.5 h-3.5" />
                {p.poin}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
