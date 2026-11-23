import React, { useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { SoalAyoCoba } from '../../data/materiKilatData';
import { periksaIsian, periksaUrutan, HasilPeriksa, InputIsian } from '../../engine/kuisMateri';
import { renderPecahan } from './PecahanText';
import { AlatPeraga } from './AlatPeraga';

export type StatusSoal = 'benar' | 'pembahasan';

interface KuisSoalProps {
  soal: SoalAyoCoba;
  nomor: number;
  /** Status tersimpan dari progres sebelumnya */
  statusAwal?: StatusSoal;
  onTuntas: (status: StatusSoal) => void;
}

const BATAS_SALAH = 2;

const KotakAngka: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label: string;
  disabled?: boolean;
  besar?: boolean;
}> = ({ value, onChange, label, disabled, besar }) => (
  <input
    type="text"
    inputMode="numeric"
    pattern="[0-9]*"
    autoComplete="off"
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
    aria-label={label}
    className={`kotak-angka ${besar ? 'kotak-angka-besar' : ''}`}
  />
);

export const KuisSoal: React.FC<KuisSoalProps> = ({ soal, nomor, statusAwal, onTuntas }) => {
  const [pilihan, setPilihan] = useState<string | null>(null);
  const [isian, setIsian] = useState<InputIsian>({});
  const [urutan, setUrutan] = useState<string[]>([]);
  const [hasil, setHasil] = useState<HasilPeriksa | null>(null);
  const [salah, setSalah] = useState(0);
  const [kosong, setKosong] = useState(false);
  const [tuntas, setTuntas] = useState<StatusSoal | null>(null);

  const terkunci = hasil?.status === 'benar' || tuntas === 'pembahasan';
  const idPesan = `kuis-pesan-${nomor}-${soal.soal.length}`;

  const periksa = () => {
    let h: HasilPeriksa;
    if (soal.tipe === 'pilihan') {
      h = pilihan === null ? { status: 'kosong' } : pilihan === soal.jawaban ? { status: 'benar' } : { status: 'salah' };
    } else if (soal.tipe === 'isian') {
      h = periksaIsian(soal.bentuk, isian, soal.jawaban, soal.wajib);
    } else {
      h = periksaUrutan(urutan, soal.jawaban);
    }

    if (h.status === 'kosong') {
      setKosong(true);
      setHasil(null);
      return;
    }
    setKosong(false);
    setHasil(h);

    if (h.status === 'benar') {
      setTuntas('benar');
      onTuntas('benar');
    } else {
      const n = salah + 1;
      setSalah(n);
      if (n >= BATAS_SALAH) {
        setTuntas('pembahasan');
        onTuntas('pembahasan');
      }
    }
  };

  const cobaLagi = () => {
    setHasil(null);
    setKosong(false);
    if (soal.tipe === 'pilihan') setPilihan(null);
    if (soal.tipe === 'urutkan') setUrutan([]);
  };

  const ulangSoal = () => {
    cobaLagi();
    setIsian({});
    setSalah(0);
    setTuntas(null);
  };

  /* ── Area jawaban ── */
  let areaJawaban: React.ReactNode = null;
  if (soal.tipe === 'pilihan') {
    const tanda = soal.pilihan.every((p) => p.length <= 2);
    areaJawaban = (
      <div className={`grid gap-2 ${tanda ? 'grid-cols-3' : 'grid-cols-2'}`} role="radiogroup" aria-label="Pilihan jawaban">
        {soal.pilihan.map((p) => {
          const dipilih = pilihan === p;
          return (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={dipilih}
              disabled={terkunci || (hasil !== null && hasil.status !== 'benar')}
              onClick={() => { setPilihan(p); setKosong(false); }}
              className={`pilihan-kuis ${tanda ? 'pilihan-kuis-tanda' : ''} ${dipilih ? 'pilihan-kuis-dipilih' : ''}`}
            >
              {renderPecahan(p)}
            </button>
          );
        })}
      </div>
    );
  } else if (soal.tipe === 'isian') {
    const ubah = (k: keyof InputIsian) => (v: string) => { setIsian((s) => ({ ...s, [k]: v })); setKosong(false); };
    const beku = terkunci || (hasil !== null && hasil.status !== 'benar');
    areaJawaban = (
      <div className="flex flex-wrap items-center gap-3" aria-describedby={kosong ? idPesan : undefined}>
        <span className="text-lg font-bold text-[#1E2149]">Jawaban:</span>
        {soal.bentuk === 'angka' ? (
          <KotakAngka value={isian.angka ?? ''} onChange={ubah('angka')} label="Jawaban angka" disabled={beku} besar />
        ) : (
          <span className="inline-flex items-center gap-2">
            {soal.bentuk === 'campuran' && (
              <KotakAngka value={isian.bulat ?? ''} onChange={ubah('bulat')} label="Bilangan bulat" disabled={beku} besar />
            )}
            <span className="inline-flex flex-col items-center gap-1">
              <KotakAngka value={isian.pembilang ?? ''} onChange={ubah('pembilang')} label="Pembilang" disabled={beku} />
              <span className="block w-full h-[3px] rounded bg-[#1E2149]" aria-hidden="true" />
              <KotakAngka value={isian.penyebut ?? ''} onChange={ubah('penyebut')} label="Penyebut" disabled={beku} />
            </span>
          </span>
        )}
        {soal.satuan && <span className="text-lg font-bold text-[#1E2149]">{soal.satuan}</span>}
        {soal.bentuk === 'campuran' && (
          <span className="w-full text-sm font-bold text-[#1E2149]/70">
            Kotak besar di kiri untuk bilangan bulat (boleh dikosongkan bila tidak ada).
          </span>
        )}
      </div>
    );
  } else {
    const sisa = soal.item.filter((x) => !urutan.includes(x));
    const beku = terkunci || (hasil !== null && hasil.status !== 'benar');
    areaJawaban = (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2" aria-label="Urutan jawabanmu">
          {soal.item.map((_, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="text-xl font-display font-black text-[#1E2149]">{soal.arah === 'naik' ? '<' : '>'}</span>}
              <button
                type="button"
                className={`slot-urut ${urutan[i] ? 'slot-urut-terisi' : ''}`}
                disabled={beku || !urutan[i]}
                onClick={() => setUrutan((u) => u.filter((_, j) => j !== i))}
                aria-label={urutan[i] ? `Urutan ke-${i + 1}, ketuk untuk melepas` : `Urutan ke-${i + 1}, kosong`}
              >
                {urutan[i] ? renderPecahan(urutan[i]) : i + 1}
              </button>
            </React.Fragment>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {sisa.map((x) => (
            <button
              key={x}
              type="button"
              className="kartu-pecahan"
              disabled={beku}
              onClick={() => { setUrutan((u) => [...u, x]); setKosong(false); }}
            >
              {renderPecahan(x)}
            </button>
          ))}
          {sisa.length === 0 && <span className="text-sm font-bold text-[#1E2149]/70">Ketuk kotak di atas untuk melepas kartu.</span>}
        </div>
      </div>
    );
  }

  const tampilPembahasan = hasil?.status === 'benar' || tuntas === 'pembahasan';

  return (
    <div className="kartu-soal">
      <div className="flex items-center justify-between gap-2">
        <span className="lencana-soal">{soal.bonus ? 'Bonus' : `Soal ${nomor}`}</span>
        {(tuntas ?? statusAwal) && (
          <span className="inline-flex items-center gap-1 text-sm font-black text-[#15803D]">
            <Check className="w-4 h-4" strokeWidth={3} />
            {(tuntas ?? statusAwal) === 'benar' ? 'Sudah benar' : 'Sudah dibahas'}
          </span>
        )}
      </div>

      {soal.tipe !== 'urutkan' && soal.visual && (
        <div className="rounded-2xl bg-white border-2 border-[#1E2149]/15 p-2">
          <AlatPeraga visual={soal.visual} />
        </div>
      )}

      <p className="text-lg font-bold text-[#1E2149] leading-relaxed">{renderPecahan(soal.soal)}</p>

      {areaJawaban}

      {kosong && (
        <p id={idPesan} role="alert" className="text-base font-bold text-[#B42318]">
          Isi jawabanmu dulu, ya.
        </p>
      )}

      {!hasil && !tuntas && (
        <button type="button" className="tombol-periksa" onClick={periksa}>
          Periksa
        </button>
      )}

      {hasil && hasil.status === 'benar' && (
        <div className="umpan-benar" role="status">
          <p className="text-xl font-display font-black">Hebat! ✓</p>
          {hasil.pesan && <p className="font-bold">{renderPecahan(hasil.pesan)}</p>}
          <p>{renderPecahan(soal.pembahasan)}</p>
        </div>
      )}

      {hasil && hasil.status !== 'benar' && (
        <div className="umpan-salah" role="status">
          <p className="text-lg font-display font-black flex items-center gap-1.5">
            <X className="w-5 h-5" strokeWidth={3} />
            {hasil.status === 'hampir' ? hasil.pesan : 'Belum tepat.'}
          </p>
          {hasil.status === 'salah' && hasil.pesan && <p className="font-bold">{hasil.pesan}</p>}
          {!tampilPembahasan && soal.tipe === 'isian' && soal.petunjuk && <p>Petunjuk: {renderPecahan(soal.petunjuk)}</p>}
          {!tampilPembahasan && soal.tipe !== 'isian' && (
            <p>Petunjuk: {soal.tipe === 'urutkan' ? 'samakan dulu semua penyebutnya, lalu bandingkan pembilangnya.' : 'perhatikan lagi pembilang dan penyebutnya.'}</p>
          )}
          {tampilPembahasan ? (
            <div className="mt-2 rounded-xl bg-white/80 p-3">
              <p className="font-display font-black">Pembahasan</p>
              <p>{renderPecahan(soal.pembahasan)}</p>
            </div>
          ) : (
            <button type="button" className="tombol-coba-lagi" onClick={cobaLagi}>
              <RotateCcw className="w-4 h-4" /> Coba lagi
            </button>
          )}
        </div>
      )}

      {tuntas === 'pembahasan' && (
        <button type="button" className="tombol-coba-lagi" onClick={ulangSoal}>
          <RotateCcw className="w-4 h-4" /> Kerjakan ulang
        </button>
      )}
    </div>
  );
};

export const KuisAyoCoba: React.FC<{
  daftarSoal: SoalAyoCoba[];
  status: Record<number, StatusSoal>;
  onTuntas: (index: number, status: StatusSoal) => void;
}> = ({ daftarSoal, status, onTuntas }) => {
  let nomor = 0;
  return (
    <div className="space-y-4">
      {daftarSoal.map((s, i) => {
        if (!s.bonus) nomor += 1;
        return (
          <KuisSoal
            key={i}
            soal={s}
            nomor={s.bonus ? i + 1 : nomor}
            statusAwal={status[i]}
            onTuntas={(st) => onTuntas(i, st)}
          />
        );
      })}
    </div>
  );
};
