import React from 'react';
import { PecahanBersusun } from './PecahanText';

/**
 * Komponen visual pecahan yang bisa dipakai ulang (SVG/HTML ringan, tanpa library).
 * Warna mengikuti identitas MONOPECA: garis gelap tebal, arsir oranye/teal.
 */

export const WARNA = {
  garis: '#1E2149',
  arsir: '#FF6B35',
  arsir2: '#2EC4B6',
  arsir3: '#7B5CFA',
  kosong: '#FFF8EC',
  coret: '#9AA3B8',
};

/* ── Lingkaran (kue/pizza) ─────────────────────────────────────── */
export interface PecahanLingkaranProps {
  penyebut: number;
  /** Banyak bagian diarsir (dari atas, searah jarum jam) atau status per bagian. */
  terarsir: number | boolean[];
  onKetuk?: (index: number) => void;
  /** Bagian yang dicoret (mis. diambil pada pengurangan). */
  dicoret?: boolean[];
  warnaBagian?: (string | null)[];
  ukuran?: number;
  label?: string;
  className?: string;
}

function irisan(i: number, n: number, r: number, c: number) {
  if (n === 1) return `M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - 0.01} ${c - r} Z`;
  const a0 = (i / n) * 2 * Math.PI - Math.PI / 2;
  const a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
  const besar = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${c} ${c} L ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 ${besar} 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)} Z`;
}

export const PecahanLingkaran: React.FC<PecahanLingkaranProps> = ({
  penyebut,
  terarsir,
  onKetuk,
  dicoret,
  warnaBagian,
  ukuran = 200,
  label,
  className = '',
}) => {
  const n = Math.max(1, penyebut);
  const status = Array.from({ length: n }, (_, i) => (Array.isArray(terarsir) ? !!terarsir[i] : i < terarsir));
  const jumlahArsir = status.filter(Boolean).length;
  const c = 100;
  const r = 92;
  return (
    <svg
      viewBox="0 0 200 200"
      width={ukuran}
      height={ukuran}
      className={`max-w-full h-auto ${className}`}
      role="img"
      aria-label={label ?? `Lingkaran dibagi ${n} bagian sama besar, ${jumlahArsir} bagian diarsir`}
    >
      {status.map((aktif, i) => {
        const coret = dicoret?.[i];
        const warna = warnaBagian?.[i] ?? (aktif ? WARNA.arsir : WARNA.kosong);
        const isi = coret ? WARNA.coret : aktif ? warna : WARNA.kosong;
        const tengah = ((i + 0.5) / n) * 2 * Math.PI - Math.PI / 2;
        return (
          <g key={i}>
            <path
              d={irisan(i, n, r, c)}
              fill={isi}
              stroke={WARNA.garis}
              strokeWidth={3}
              strokeLinejoin="round"
              className={onKetuk ? 'cursor-pointer transition-[fill] duration-150 hover:opacity-90 focus:outline-none' : 'transition-[fill] duration-200'}
              role={onKetuk ? 'button' : undefined}
              tabIndex={onKetuk ? 0 : undefined}
              aria-pressed={onKetuk ? aktif : undefined}
              aria-label={onKetuk ? `Potongan ${i + 1} dari ${n}${aktif ? ', diarsir' : ''}` : undefined}
              onClick={onKetuk ? () => onKetuk(i) : undefined}
              onKeyDown={
                onKetuk
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onKetuk(i);
                      }
                    }
                  : undefined
              }
            />
            {coret && n > 1 && (
              <line
                x1={c + r * 0.25 * Math.cos(tengah - 0.3)}
                y1={c + r * 0.25 * Math.sin(tengah - 0.3)}
                x2={c + r * 0.85 * Math.cos(tengah + 0.15)}
                y2={c + r * 0.85 * Math.sin(tengah + 0.15)}
                stroke="#E5484D"
                strokeWidth={6}
                strokeLinecap="round"
                pointerEvents="none"
              />
            )}
          </g>
        );
      })}
      <circle cx={c} cy={c} r={r} fill="none" stroke={WARNA.garis} strokeWidth={5} pointerEvents="none" />
    </svg>
  );
};

/* ── Batang ────────────────────────────────────────────────────── */
export interface PecahanBatangProps {
  penyebut: number;
  terarsir?: number;
  /** Warna per bagian (null = kosong). Mengalahkan `terarsir`. */
  warnaBagian?: (string | null)[];
  tinggi?: number;
  label?: string;
  sorot?: number[];
  className?: string;
}

export const PecahanBatang: React.FC<PecahanBatangProps> = ({
  penyebut,
  terarsir = 0,
  warnaBagian,
  tinggi = 52,
  label,
  sorot,
  className = '',
}) => {
  const n = Math.max(1, penyebut);
  const warna = Array.from({ length: n }, (_, i) => (warnaBagian ? warnaBagian[i] : i < terarsir ? WARNA.arsir : null));
  return (
    <div
      className={`flex w-full rounded-xl border-[3px] border-[#1E2149] overflow-hidden bg-[#FFF8EC] ${className}`}
      style={{ height: tinggi }}
      role="img"
      aria-label={label ?? `Batang dibagi ${n} bagian sama besar, ${warna.filter(Boolean).length} bagian diarsir`}
    >
      {warna.map((w, i) => (
        <span
          key={i}
          className="flex-1 transition-[background-color,opacity] duration-200"
          style={{
            backgroundColor: w ?? WARNA.kosong,
            borderLeft: i === 0 ? 'none' : `2px solid ${WARNA.garis}`,
            opacity: sorot && sorot.length > 0 && !sorot.includes(i) ? 0.35 : 1,
          }}
        />
      ))}
    </div>
  );
};

/* ── Garis bilangan ────────────────────────────────────────────── */
export interface TitikGaris {
  /** Nilai sebagai [pembilang, penyebut] (pembilang boleh > penyebut). */
  nilai: [number, number];
  warna?: string;
  /** Tampilkan label pecahan di atas titik (default true). */
  tampilLabel?: boolean;
  labelTeks?: string;
}

export interface GarisBilanganProps {
  maks?: number;
  pembagian: number;
  titik?: TitikGaris[];
  /** Tampilkan label pecahan pada setiap tanda. */
  labelTanda?: boolean;
  label?: string;
}

export const GarisBilangan: React.FC<GarisBilanganProps> = ({ maks = 1, pembagian, titik = [], labelTanda = false, label }) => {
  const jumlahTanda = pembagian * maks;
  const posisi = (p: number, q: number) => `${((p / q) / maks) * 100}%`;
  return (
    <div className="w-full px-5 pt-14 pb-10" role="img" aria-label={label ?? `Garis bilangan 0 sampai ${maks} dibagi ${pembagian} bagian setiap satu satuan`}>
      <div className="relative h-1.5 rounded-full bg-[#1E2149]">
        {Array.from({ length: jumlahTanda + 1 }, (_, i) => {
          const bulat = i % pembagian === 0;
          return (
            <span
              key={i}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] rounded bg-[#1E2149]"
              style={{ left: posisi(i, pembagian), height: bulat ? 28 : 18 }}
            >
              <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-base font-display font-black text-[#1E2149] whitespace-nowrap">
                {bulat ? i / pembagian : labelTanda ? <PecahanBersusun pembilang={i} penyebut={pembagian} /> : null}
              </span>
            </span>
          );
        })}
        {titik.map((t, i) => (
          <span
            key={i}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: posisi(t.nilai[0], t.nilai[1]) }}
          >
            <span
              className="block w-5 h-5 rounded-full border-[3px] border-[#1E2149]"
              style={{ backgroundColor: t.warna ?? WARNA.arsir }}
            />
            {t.tampilLabel !== false && (
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-1.5 rounded-lg bg-white border-2 border-[#1E2149] text-lg font-display font-black text-[#1E2149] whitespace-nowrap">
                {t.labelTeks ?? <PecahanBersusun pembilang={t.nilai[0]} penyebut={t.nilai[1]} />}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Kumpulan benda ────────────────────────────────────────────── */
export const PecahanKumpulan: React.FC<{ jumlah: number; diwarnai: number; warna?: string; label?: string }> = ({
  jumlah,
  diwarnai,
  warna = '#E5484D',
  label,
}) => (
  <div
    className="grid grid-cols-6 gap-2 w-fit mx-auto"
    role="img"
    aria-label={label ?? `${jumlah} benda, ${diwarnai} di antaranya diwarnai`}
  >
    {Array.from({ length: jumlah }, (_, i) => (
      <span
        key={i}
        className="w-9 h-9 rounded-full border-[3px] border-[#1E2149] shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: i < diwarnai ? warna : '#F3E7D3' }}
      />
    ))}
  </div>
);

/* ── Banding dua batang ────────────────────────────────────────── */
export function tandaBanding(a: [number, number], b: [number, number]): '<' | '>' | '=' {
  const kiri = a[0] * b[1];
  const kanan = b[0] * a[1];
  return kiri < kanan ? '<' : kiri > kanan ? '>' : '=';
}

export const BandingBatang: React.FC<{ a: [number, number]; b: [number, number] }> = ({ a, b }) => {
  const tanda = tandaBanding(a, b);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-center text-2xl font-display font-black text-[#1E2149]">
          <PecahanBersusun pembilang={a[0]} penyebut={a[1]} />
        </span>
        <PecahanBatang penyebut={a[1]} terarsir={a[0]} />
      </div>
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-center text-2xl font-display font-black text-[#1E2149]">
          <PecahanBersusun pembilang={b[0]} penyebut={b[1]} />
        </span>
        <PecahanBatang penyebut={b[1]} terarsir={b[0]} warnaBagian={Array.from({ length: b[1] }, (_, i) => (i < b[0] ? WARNA.arsir2 : null))} />
      </div>
      <p className="text-center text-3xl font-display font-black text-[#1E2149]" aria-live="polite">
        <PecahanBersusun pembilang={a[0]} penyebut={a[1]} />{' '}
        <span className="inline-flex items-center justify-center w-12 h-12 mx-1 rounded-2xl bg-[#FFD23F] border-[3px] border-[#1E2149] align-middle">
          {tanda}
        </span>{' '}
        <PecahanBersusun pembilang={b[0]} penyebut={b[1]} />
      </p>
    </div>
  );
};
