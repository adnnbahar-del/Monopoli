import React from 'react';
import { parsePecahan } from '../engine/pecahan';

export type UkuranPecahan = 'sm' | 'md' | 'lg' | 'xl';

export interface PecahanProps {
  value: string | { pembilang: number; penyebut: number };
  size?: UkuranPecahan;
  className?: string;
}

const NAMA_ANGKA: Record<number, string> = {
  0: 'nol',
  1: 'satu',
  2: 'dua',
  3: 'tiga',
  4: 'empat',
  5: 'lima',
  6: 'enam',
  7: 'tujuh',
  8: 'delapan',
  9: 'sembilan',
  10: 'sepuluh',
  11: 'sebelas',
  12: 'dua belas',
};

function bilangAngka(n: number): string {
  const absN = Math.abs(n);
  if (NAMA_ANGKA[absN]) return (n < 0 ? 'minus ' : '') + NAMA_ANGKA[absN];
  if (absN < 20) return (n < 0 ? 'minus ' : '') + NAMA_ANGKA[absN - 10] + ' belas';
  return `${n}`;
}

export function buatAriaLabelPecahan(pembilang: number, penyebut: number, bulat?: number): string {
  if (bulat !== undefined && bulat !== 0) {
    return `${bilangAngka(bulat)} ${bilangAngka(pembilang)} per ${bilangAngka(penyebut)}`;
  }
  if (penyebut === 1) return bilangAngka(pembilang);
  if (pembilang === 1 && penyebut === 2) return 'satu per dua atau setengah';
  if (pembilang === 1 && penyebut === 4) return 'satu per empat atau seperempat';
  return `${bilangAngka(pembilang)} per ${bilangAngka(penyebut)}`;
}

const SIZE_STYLES: Record<UkuranPecahan, {
  container: string;
  number: string;
  line: string;
  lineHeight: string;
}> = {
  sm: {
    container: 'inline-flex items-center text-sm font-display align-middle mx-1',
    number: 'text-xs font-bold leading-none px-1',
    line: 'border-b-[2px] border-current w-full my-[1px]',
    lineHeight: 'py-[1px]'
  },
  md: {
    container: 'inline-flex items-center text-base font-display align-middle mx-1.5',
    number: 'text-base font-bold leading-none px-1.5',
    line: 'border-b-[3px] border-current w-full my-[2px]',
    lineHeight: 'py-[2px]'
  },
  lg: {
    container: 'inline-flex items-center text-xl font-display align-middle mx-2',
    number: 'text-2xl font-bold leading-none px-2',
    line: 'border-b-[3px] border-current w-full my-[2px]',
    lineHeight: 'py-[2px]'
  },
  xl: {
    container: 'inline-flex items-center text-3xl font-display align-middle mx-2.5',
    number: 'text-4xl font-extrabold leading-none px-2.5',
    line: 'border-b-[4px] border-current w-full my-[3px]',
    lineHeight: 'py-[3px]'
  }
};

export const Pecahan: React.FC<PecahanProps> = ({
  value,
  size = 'md',
  className = ''
}) => {
  let pembilang = 1;
  let penyebut = 1;
  let bulat: number | undefined = undefined;

  if (typeof value === 'object') {
    pembilang = value.pembilang;
    penyebut = value.penyebut;
  } else {
    // Cek pecahan campuran string "c a/b"
    const campMatch = value.trim().match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
    if (campMatch) {
      bulat = parseInt(campMatch[1], 10);
      pembilang = parseInt(campMatch[2], 10);
      penyebut = parseInt(campMatch[3], 10);
    } else {
      const parsed = parsePecahan(value);
      pembilang = parsed.pembilang;
      penyebut = parsed.penyebut;
    }
  }

  // Jika penyebut 1 dan bukan bentuk a/b, cukup tampilkan angka
  if (penyebut === 1 && bulat === undefined) {
    return (
      <span className={`font-display font-bold ${className}`} aria-label={bilangAngka(pembilang)}>
        {pembilang}
      </span>
    );
  }

  const styles = SIZE_STYLES[size];
  const ariaLabel = buatAriaLabelPecahan(pembilang, penyebut, bulat);

  return (
    <span
      className={`${styles.container} ${className}`}
      role="math"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {bulat !== undefined && (
        <span className={`${styles.number} mr-1 text-ink font-extrabold`}>
          {bulat}
        </span>
      )}
      <span className="inline-flex flex-col items-center justify-center text-center">
        <span className={`${styles.number} ${styles.lineHeight}`}>
          {pembilang}
        </span>
        <span className={styles.line} aria-hidden="true" />
        <span className={`${styles.number} ${styles.lineHeight}`}>
          {penyebut}
        </span>
      </span>
    </span>
  );
};

/**
 * Helper untuk mengubah pola teks "a/b" atau "c a/b" dalam teks biasa
 * menjadi elemen React yang menyisipkan komponen <Pecahan />.
 */
export function renderTeksDenganPecahan(teks: string, size: UkuranPecahan = 'md'): React.ReactNode {
  if (!teks) return '';

  // Regex mencari pecahan campuran "1 1/2" atau pecahan biasa "3/4"
  // Menghindari pola URL atau tanggal
  const regex = /(\b\d+\s+\d+\/\d+\b|\b\d+\/\d+\b)/g;
  const parts = teks.split(regex);

  return parts.map((part, index) => {
    if (part.match(/^\d+\s+\d+\/\d+$/) || part.match(/^\d+\/\d+$/)) {
      return <Pecahan key={index} value={part} size={size} />;
    }
    return <span key={index}>{part}</span>;
  });
}
