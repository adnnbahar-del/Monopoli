import React from 'react';
import { buatAriaLabelPecahan } from '../Pecahan';

/**
 * Pecahan bersusun yang menyatu dengan kalimat.
 * Ukurannya mengikuti font teks di sekitarnya (pakai em), jadi aman di HP & laptop.
 */
export interface PecahanBersusunProps {
  pembilang: React.ReactNode;
  penyebut: React.ReactNode;
  bulat?: React.ReactNode;
  className?: string;
}

const keAngka = (v: React.ReactNode) => (typeof v === 'number' ? v : typeof v === 'string' && /^\d+$/.test(v) ? Number(v) : NaN);

export const PecahanBersusun: React.FC<PecahanBersusunProps> = ({ pembilang, penyebut, bulat, className = '' }) => {
  const p = keAngka(pembilang);
  const q = keAngka(penyebut);
  const b = bulat === undefined ? undefined : keAngka(bulat);
  const label =
    Number.isFinite(p) && Number.isFinite(q) && (b === undefined || Number.isFinite(b))
      ? buatAriaLabelPecahan(p, q, b)
      : `${bulat !== undefined ? `${String(bulat)} ` : ''}${String(pembilang)} per ${String(penyebut)}`;

  return (
    <span className={`pecahan-teks ${className}`} role="math" aria-label={label}>
      {bulat !== undefined && <span className="pecahan-teks-bulat" aria-hidden="true">{bulat}</span>}
      <span className="pecahan-teks-susun" aria-hidden="true">
        <span className="pecahan-teks-atas">{pembilang}</span>
        <span className="pecahan-teks-bawah">{penyebut}</span>
      </span>
    </span>
  );
};

/** Penanda pecahan di data: {3/8}, {1 3/4}, {3×2/4×2}, {…/15}. */
const POLA_PECAHAN = /\{(?:(\d+)\s+(?=[^{}]*\/))?([^{}/]+)\/([^{}]+)\}/g;

/** Ubah teks dengan penanda pecahan menjadi elemen React. */
export function renderPecahan(teks: string): React.ReactNode[] {
  const hasil: React.ReactNode[] = [];
  let terakhir = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  POLA_PECAHAN.lastIndex = 0;
  while ((m = POLA_PECAHAN.exec(teks)) !== null) {
    if (m.index > terakhir) hasil.push(teks.slice(terakhir, m.index));
    hasil.push(
      <PecahanBersusun
        key={`p${i++}`}
        bulat={m[1]}
        pembilang={m[2].trim()}
        penyebut={m[3].trim()}
      />
    );
    terakhir = m.index + m[0].length;
  }
  if (terakhir < teks.length) hasil.push(teks.slice(terakhir));
  return hasil;
}

/** Komponen teks: <PecahanText teks="Bagian yang dimakan {3/8}." /> */
export const PecahanText: React.FC<{ teks: string; as?: 'span' | 'p' | 'div'; className?: string }> = ({
  teks,
  as = 'span',
  className,
}) => {
  const Tag = as;
  return <Tag className={className}>{renderPecahan(teks)}</Tag>;
};

/** Versi lisan (untuk "Dengarkan"): {3/8} → "3 per 8", {1 3/4} → "1 3 per 4". */
export function teksLisan(teks: string): string {
  return teks.replace(POLA_PECAHAN, (_s, b, p, q) => {
    const pp = String(p).trim();
    const qq = String(q).trim();
    if (/^\d+$/.test(pp) && /^\d+$/.test(qq)) {
      return buatAriaLabelPecahan(Number(pp), Number(qq), b ? Number(b) : undefined);
    }
    return `${b ? `${b} ` : ''}${pp} per ${qq}`;
  })
    .replace(/×/g, ' kali ')
    .replace(/−/g, ' kurang ')
    .replace(/ : /g, ' dibagi ')
    .replace(/</g, ' kurang dari ')
    .replace(/>/g, ' lebih dari ');
}
