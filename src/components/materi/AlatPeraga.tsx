import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import type { VisualMateri } from '../../data/materiKilatData';
import { hitungKPK } from '../../engine/pecahan';
import { buatAriaLabelPecahan } from '../Pecahan';
import { PecahanBersusun, renderPecahan } from './PecahanText';
import {
  PecahanLingkaran,
  PecahanBatang,
  GarisBilangan,
  BandingBatang,
  WARNA,
} from './VisualDasar';

/* ── Kontrol kecil yang dipakai bersama ────────────────────────── */
const Penghitung: React.FC<{
  label: string;
  nilai: number;
  min: number;
  max: number;
  onUbah: (n: number) => void;
}> = ({ label, nilai, min, max, onUbah }) => (
  <div className="flex items-center gap-2">
    <span className="text-base font-bold text-[#1E2149]">{label}</span>
    <button
      type="button"
      className="tombol-bulat"
      onClick={() => onUbah(Math.max(min, nilai - 1))}
      disabled={nilai <= min}
      aria-label={`Kurangi ${label.toLowerCase()}`}
    >
      <Minus className="w-5 h-5" strokeWidth={3} />
    </button>
    <span className="min-w-[2.5ch] text-center text-2xl font-display font-black text-[#1E2149]" aria-live="polite">
      {nilai}
    </span>
    <button
      type="button"
      className="tombol-bulat"
      onClick={() => onUbah(Math.min(max, nilai + 1))}
      disabled={nilai >= max}
      aria-label={`Tambah ${label.toLowerCase()}`}
    >
      <Plus className="w-5 h-5" strokeWidth={3} />
    </button>
  </div>
);

const TombolPeraga: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { varian?: 'utama' | 'kedua' }> = ({
  varian = 'utama',
  className = '',
  ...rest
}) => <button type="button" className={`tombol-peraga ${varian === 'kedua' ? 'tombol-peraga-kedua' : ''} ${className}`} {...rest} />;

const HasilBesar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-center text-2xl sm:text-3xl font-display font-black text-[#1E2149] leading-snug" aria-live="polite">
    {children}
  </p>
);

const kurangiGerak = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/* ── TP1: lingkaran yang bisa diketuk ──────────────────────────── */
const LingkaranInteraktif: React.FC<{ penyebut: number; terarsir: number }> = ({ penyebut, terarsir }) => {
  const [n, setN] = useState(penyebut);
  const [status, setStatus] = useState<boolean[]>(() => Array.from({ length: penyebut }, (_, i) => i < terarsir));
  const jumlah = status.filter(Boolean).length;

  const ubahPenyebut = (baru: number) => {
    const sisa = Math.min(jumlah, baru);
    setN(baru);
    setStatus(Array.from({ length: baru }, (_, i) => i < sisa));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <PecahanLingkaran
        penyebut={n}
        terarsir={status}
        ukuran={240}
        onKetuk={(i) => setStatus((s) => s.map((v, j) => (j === i ? !v : v)))}
      />
      <Penghitung label="Banyak potongan" nilai={n} min={2} max={12} onUbah={ubahPenyebut} />
      <HasilBesar>
        <PecahanBersusun pembilang={jumlah} penyebut={n} />
      </HasilBesar>
      <p className="text-lg font-bold text-[#1E2149]">
        Dibaca: <span className="text-[#C2410C]">"{buatAriaLabelPecahan(jumlah, n)}"</span>
      </p>
    </div>
  );
};

/* ── TP2: pecahan senilai dengan slider pengali ────────────────── */
const SenilaiBatang: React.FC<{ pembilang: number; penyebut: number; pengaliMaks: number }> = ({
  pembilang,
  penyebut,
  pengaliMaks,
}) => {
  const [k, setK] = useState(1);
  const rantai = Array.from({ length: k }, (_, i) => `{${pembilang * (i + 1)}/${penyebut * (i + 1)}}`).join(' = ');
  return (
    <div className="space-y-4">
      <PecahanBatang penyebut={penyebut} terarsir={pembilang} label={`Batang atas ${pembilang} per ${penyebut}`} />
      <PecahanBatang
        penyebut={penyebut * k}
        terarsir={pembilang * k}
        warnaBagian={Array.from({ length: penyebut * k }, (_, i) => (i < pembilang * k ? WARNA.arsir2 : null))}
        label={`Batang bawah ${pembilang * k} per ${penyebut * k}`}
      />
      <label className="block">
        <span className="flex justify-between text-base font-bold text-[#1E2149]">
          <span>Pengali</span>
          <span className="font-display font-black text-xl">× {k}</span>
        </span>
        <input
          type="range"
          min={1}
          max={pengaliMaks}
          step={1}
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          className="slider-materi w-full"
          aria-label="Pengali pecahan senilai"
        />
      </label>
      <HasilBesar>{renderPecahan(rantai)}</HasilBesar>
    </div>
  );
};

/* ── TP3: dua batang yang bisa diubah ──────────────────────────── */
const BandingInteraktif: React.FC<{ a: [number, number]; b: [number, number] }> = ({ a, b }) => {
  const [pa, setPa] = useState(a);
  const [pb, setPb] = useState(b);
  const kontrol = (nama: string, v: [number, number], set: (x: [number, number]) => void) => (
    <div className="rounded-2xl border-2 border-[#1E2149]/20 bg-white/70 p-3 space-y-2">
      <p className="text-base font-display font-black text-[#1E2149]">{nama}</p>
      <Penghitung label="Pembilang" nilai={v[0]} min={0} max={v[1]} onUbah={(x) => set([x, v[1]])} />
      <Penghitung label="Penyebut" nilai={v[1]} min={1} max={12} onUbah={(x) => set([Math.min(v[0], x), x])} />
    </div>
  );
  return (
    <div className="space-y-4">
      <BandingBatang a={pa} b={pb} />
      <div className="grid gap-3 sm:grid-cols-2">
        {kontrol('Pecahan atas (oranye)', pa, setPa)}
        {kontrol('Pecahan bawah (hijau toska)', pb, setPb)}
      </div>
    </div>
  );
};

/* ── TP4: seret kartu ke garis bilangan ────────────────────────── */
const GarisUrut: React.FC<{ pecahan: [number, number][] }> = ({ pecahan }) => {
  const pembagian = useMemo(() => pecahan.reduce((k, [, q]) => hitungKPK(k, q), 1), [pecahan]);
  // Kartu diacak tetap (bukan random) agar tidak langsung berurutan
  const urutanKartu = useMemo(() => pecahan.map((_, i) => (i + 1) % pecahan.length), [pecahan]);
  const [terpasang, setTerpasang] = useState<Record<number, boolean>>({});
  const [dipilih, setDipilih] = useState<number | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const [seret, setSeret] = useState<{ kartu: number; x: number; y: number; dx: number; dy: number } | null>(null);
  const awal = useRef<{ x: number; y: number } | null>(null);

  const pasang = (kartu: number, target: number) => {
    if (kartu === target) {
      setTerpasang((t) => ({ ...t, [kartu]: true }));
      setPesan(null);
    } else {
      const [p, q] = pecahan[kartu];
      setPesan(`Belum tepat. Cari titik untuk {${p}/${q}} = {${(p * pembagian) / q}/${pembagian}}.`);
    }
    setDipilih(null);
  };

  const selesai = pecahan.every((_, i) => terpasang[i]);
  const urutNaik = [...pecahan].sort((x, y) => x[0] / x[1] - y[0] / y[1]).map(([p, q]) => `{${p}/${q}}`).join(' < ');

  return (
    <div className="space-y-3">
      <div className="relative">
        <GarisBilangan
          pembagian={pembagian}
          titik={pecahan.map(([p, q], i) => ({
            nilai: [p, q] as [number, number],
            warna: terpasang[i] ? '#22A55B' : '#FFFFFF',
            labelTeks: terpasang[i] ? undefined : '?',
          }))}
          label={`Garis bilangan 0 sampai 1 dibagi ${pembagian}, dengan ${pecahan.length} titik`}
        />
        {/* Target sentuh besar di atas setiap titik */}
        <div className="absolute inset-x-5 top-0 h-full pointer-events-none">
          {pecahan.map(([p, q], i) =>
            terpasang[i] ? null : (
              <button
                key={i}
                type="button"
                data-target={i}
                onClick={() => (dipilih !== null ? pasang(dipilih, i) : setPesan('Ketuk salah satu kartu pecahan dulu, ya.'))}
                className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-24 rounded-2xl pointer-events-auto ${dipilih !== null ? 'ring-4 ring-[#FFD23F]/70' : ''}`}
                style={{ left: `${(p / q) * 100}%` }}
                aria-label={`Titik ke-${(p * pembagian) / q} dari ${pembagian}`}
              />
            )
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 min-h-[64px]">
        {urutanKartu.map((i) => {
          if (terpasang[i]) return null;
          const [p, q] = pecahan[i];
          const sedangDiseret = seret?.kartu === i;
          return (
            <button
              key={i}
              type="button"
              className={`kartu-pecahan ${dipilih === i ? 'kartu-pecahan-dipilih' : ''}`}
              style={sedangDiseret ? { transform: `translate(${seret.dx}px, ${seret.dy}px)`, zIndex: 30 } : undefined}
              aria-pressed={dipilih === i}
              aria-label={`Kartu ${buatAriaLabelPecahan(p, q)}`}
              onPointerDown={(e) => {
                awal.current = { x: e.clientX, y: e.clientY };
                e.currentTarget.setPointerCapture?.(e.pointerId);
                setSeret({ kartu: i, x: e.clientX, y: e.clientY, dx: 0, dy: 0 });
              }}
              onPointerMove={(e) => {
                if (!seret || seret.kartu !== i || !awal.current) return;
                setSeret({ ...seret, dx: e.clientX - awal.current.x, dy: e.clientY - awal.current.y });
              }}
              onPointerUp={(e) => {
                const geser = awal.current ? Math.hypot(e.clientX - awal.current.x, e.clientY - awal.current.y) : 0;
                setSeret(null);
                awal.current = null;
                if (geser < 8) {
                  setDipilih((d) => (d === i ? null : i));
                  return;
                }
                const target = document
                  .elementsFromPoint(e.clientX, e.clientY)
                  .find((el) => (el as HTMLElement).dataset?.target !== undefined) as HTMLElement | undefined;
                if (target) pasang(i, Number(target.dataset.target));
              }}
              onPointerCancel={() => {
                setSeret(null);
                awal.current = null;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setDipilih((d) => (d === i ? null : i));
                }
              }}
            >
              <PecahanBersusun pembilang={p} penyebut={q} />
            </button>
          );
        })}
      </div>

      {pesan && <p className="text-center text-base font-bold text-[#B42318]" role="status">{renderPecahan(pesan)}</p>}
      {selesai ? (
        <HasilBesar>Urutan naik: {renderPecahan(urutNaik)}</HasilBesar>
      ) : (
        <p className="text-center text-sm font-bold text-[#1E2149]/70">
          {dipilih !== null ? 'Sekarang ketuk titik yang tepat di garis bilangan.' : 'Garis dibagi menjadi ' + pembagian + ' bagian sama panjang.'}
        </p>
      )}
      {Object.keys(terpasang).length > 0 && (
        <div className="flex justify-center">
          <TombolPeraga varian="kedua" onClick={() => { setTerpasang({}); setPesan(null); }}>
            <RotateCcw className="w-4 h-4" /> Ulangi
          </TombolPeraga>
        </div>
      )}
    </div>
  );
};

/* ── TP5: tambah/kurang seperempat ─────────────────────────────── */
const CampuranLingkaran: React.FC<{ penyebut: number; jumlahBagian: number }> = ({ penyebut, jumlahBagian }) => {
  const [n, setN] = useState(jumlahBagian);
  const utuh = Math.floor(n / penyebut);
  const sisa = n % penyebut;
  const banyakLingkaran = Math.max(1, Math.ceil(n / penyebut));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {Array.from({ length: banyakLingkaran }, (_, i) => (
          <PecahanLingkaran key={i} penyebut={penyebut} terarsir={Math.max(0, Math.min(penyebut, n - i * penyebut))} ukuran={120} />
        ))}
      </div>
      <div className="flex justify-center">
        <Penghitung label="Banyak seperempat" nilai={n} min={1} max={penyebut * 3} onUbah={setN} />
      </div>
      <HasilBesar>
        <PecahanBersusun pembilang={n} penyebut={penyebut} />
        {utuh > 0 && (
          <>
            {' = '}
            {sisa === 0 ? utuh : <PecahanBersusun bulat={utuh} pembilang={sisa} penyebut={penyebut} />}
          </>
        )}
      </HasilBesar>
      <p className="text-center text-base font-bold text-[#1E2149]">
        {n < penyebut ? 'Pecahan biasa (kurang dari 1).' : n === penyebut ? 'Pembilang = penyebut, nilainya tepat 1.' : 'Lebih dari 1: bisa ditulis sebagai pecahan campuran.'}
      </p>
    </div>
  );
};

/* ── TP6: samakan penyebut lalu gabungkan ──────────────────────── */
const JumlahBatang: React.FC<{ a: [number, number]; b: [number, number] }> = ({ a, b }) => {
  const [tahap, setTahap] = useState<0 | 1 | 2>(0);
  const kpk = hitungKPK(a[1], b[1]);
  const pa = (a[0] * kpk) / a[1];
  const pb = (b[0] * kpk) / b[1];
  const batang = (pemb: number, peny: number, warna: string) =>
    Array.from({ length: peny }, (_, i) => (i < pemb ? warna : null));

  return (
    <div className="space-y-4">
      {tahap < 2 ? (
        <>
          <div className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-center text-xl font-display font-black">
              {tahap === 0 ? <PecahanBersusun pembilang={a[0]} penyebut={a[1]} /> : <PecahanBersusun pembilang={pa} penyebut={kpk} />}
            </span>
            <PecahanBatang penyebut={tahap === 0 ? a[1] : kpk} warnaBagian={tahap === 0 ? batang(a[0], a[1], WARNA.arsir) : batang(pa, kpk, WARNA.arsir)} />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 shrink-0 text-center text-xl font-display font-black">
              {tahap === 0 ? <PecahanBersusun pembilang={b[0]} penyebut={b[1]} /> : <PecahanBersusun pembilang={pb} penyebut={kpk} />}
            </span>
            <PecahanBatang penyebut={tahap === 0 ? b[1] : kpk} warnaBagian={tahap === 0 ? batang(b[0], b[1], WARNA.arsir2) : batang(pb, kpk, WARNA.arsir2)} />
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-center text-xl font-display font-black">
            <PecahanBersusun pembilang={pa + pb} penyebut={kpk} />
          </span>
          <PecahanBatang
            penyebut={kpk}
            warnaBagian={Array.from({ length: kpk }, (_, i) => (i < pa ? WARNA.arsir : i < pa + pb ? WARNA.arsir2 : null))}
          />
        </div>
      )}
      <HasilBesar>
        {tahap === 0 && renderPecahan(`{${a[0]}/${a[1]}} + {${b[0]}/${b[1]}} = ?`)}
        {tahap === 1 && renderPecahan(`{${pa}/${kpk}} + {${pb}/${kpk}}`)}
        {tahap === 2 && renderPecahan(`{${pa}/${kpk}} + {${pb}/${kpk}} = {${pa + pb}/${kpk}}`)}
      </HasilBesar>
      <div className="flex flex-wrap justify-center gap-2">
        <TombolPeraga onClick={() => setTahap(1)} disabled={tahap !== 0}>Samakan penyebut</TombolPeraga>
        <TombolPeraga onClick={() => setTahap(2)} disabled={tahap !== 1}>Gabungkan</TombolPeraga>
        <TombolPeraga varian="kedua" onClick={() => setTahap(0)} disabled={tahap === 0}>
          <RotateCcw className="w-4 h-4" /> Ulangi
        </TombolPeraga>
      </div>
    </div>
  );
};

/* ── TP7: ambil sebagian dari lingkaran ────────────────────────── */
const KurangLingkaran: React.FC<{ awal: [number, number]; ambil: [number, number] }> = ({ awal, ambil }) => {
  const [tahap, setTahap] = useState<0 | 1 | 2>(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const q = awal[1];
  const ambilSenilai = (ambil[0] * q) / ambil[1]; // 1/2 → 2/4
  const sisa = awal[0] - ambilSenilai;
  const dicoret = Array.from({ length: q }, (_, i) => tahap === 2 && i >= sisa && i < awal[0]);

  const jalankan = () => {
    setTahap(1);
    timer.current = setTimeout(() => setTahap(2), kurangiGerak() ? 0 : 900);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <PecahanLingkaran penyebut={q} terarsir={awal[0]} dicoret={dicoret} ukuran={220} />
      <HasilBesar>
        {tahap === 0 && renderPecahan(`{${awal[0]}/${q}}`)}
        {tahap === 1 && renderPecahan(`{${ambil[0]}/${ambil[1]}} = {${ambilSenilai}/${q}}`)}
        {tahap === 2 && renderPecahan(`{${awal[0]}/${q}} − {${ambilSenilai}/${q}} = {${sisa}/${q}}`)}
      </HasilBesar>
      <div className="flex flex-wrap justify-center gap-2">
        <TombolPeraga onClick={jalankan} disabled={tahap !== 0}>
          Ambil <PecahanBersusun pembilang={ambil[0]} penyebut={ambil[1]} />
        </TombolPeraga>
        <TombolPeraga varian="kedua" onClick={() => setTahap(0)} disabled={tahap === 0}>
          <RotateCcw className="w-4 h-4" /> Ulangi
        </TombolPeraga>
      </div>
    </div>
  );
};

/* ── TP8: kumpulkan kue utuh dan potongannya ───────────────────── */
const OperasiCampuran: React.FC<{ a: [number, number, number]; b: [number, number, number] }> = ({ a, b }) => {
  const [kumpul, setKumpul] = useState(false);
  const kpk = hitungKPK(a[2], b[2]);
  const pa = (a[1] * kpk) / a[2];
  const pb = (b[1] * kpk) / b[2];
  const utuh = a[0] + b[0];
  const lingkaranUtuh = (n: number, warna: string, kunci: string) =>
    Array.from({ length: n }, (_, i) => (
      <PecahanLingkaran key={`${kunci}${i}`} penyebut={1} terarsir={1} warnaBagian={[warna]} ukuran={84} label="Satu kue utuh" />
    ));

  return (
    <div className="space-y-4">
      {!kumpul ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[{ v: a, w: WARNA.arsir, n: 'a' }, { v: b, w: WARNA.arsir2, n: 'b' }].map(({ v, w, n }) => (
            <div key={n} className="rounded-2xl border-2 border-[#1E2149]/20 bg-white/70 p-3 text-center space-y-2">
              <p className="text-2xl font-display font-black"><PecahanBersusun bulat={v[0]} pembilang={v[1]} penyebut={v[2]} /></p>
              <div className="flex flex-wrap justify-center gap-2">
                {lingkaranUtuh(v[0], w, n)}
                <PecahanLingkaran penyebut={v[2]} terarsir={v[1]} warnaBagian={Array.from({ length: v[2] }, () => w)} ukuran={84} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-[#1E2149]/20 bg-white/70 p-3 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-base font-bold text-[#1E2149] w-full text-center">Kue utuh: {a[0]} + {b[0]} = {utuh}</span>
            {lingkaranUtuh(a[0], WARNA.arsir, 'ka')}
            {lingkaranUtuh(b[0], WARNA.arsir2, 'kb')}
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base font-bold text-[#1E2149]">
              Potongan: {renderPecahan(`{${pa}/${kpk}} + {${pb}/${kpk}} = {${pa + pb}/${kpk}}`)}
            </span>
            <PecahanLingkaran
              penyebut={kpk}
              terarsir={pa + pb}
              warnaBagian={Array.from({ length: kpk }, (_, i) => (i < pa ? WARNA.arsir : WARNA.arsir2))}
              ukuran={110}
            />
          </div>
        </div>
      )}
      <HasilBesar>
        <PecahanBersusun bulat={a[0]} pembilang={a[1]} penyebut={a[2]} /> + <PecahanBersusun bulat={b[0]} pembilang={b[1]} penyebut={b[2]} />
        {kumpul && <> = <PecahanBersusun bulat={utuh} pembilang={pa + pb} penyebut={kpk} /></>}
      </HasilBesar>
      <div className="flex justify-center gap-2">
        <TombolPeraga onClick={() => setKumpul(true)} disabled={kumpul}>Kumpulkan</TombolPeraga>
        <TombolPeraga varian="kedua" onClick={() => setKumpul(false)} disabled={!kumpul}>
          <RotateCcw className="w-4 h-4" /> Ulangi
        </TombolPeraga>
      </div>
    </div>
  );
};

/* ── TP9: batang dengan dua warna ──────────────────────────────── */
const BatangCerita: React.FC<{ penyebut: number; bagian: { nilai: number; label: string }[] }> = ({ penyebut, bagian }) => {
  const [sorot, setSorot] = useState<number | null>(null);
  const warnaList = [WARNA.arsir, WARNA.arsir2, WARNA.arsir3];
  const warnaBagian: (string | null)[] = [];
  const indeksBagian: number[][] = [];
  bagian.forEach((b, j) => {
    indeksBagian[j] = [];
    for (let k = 0; k < b.nilai; k++) {
      indeksBagian[j].push(warnaBagian.length);
      warnaBagian.push(warnaList[j % warnaList.length]);
    }
  });
  while (warnaBagian.length < penyebut) warnaBagian.push(null);
  const total = bagian.reduce((s, b) => s + b.nilai, 0);
  return (
    <div className="space-y-4">
      <PecahanBatang penyebut={penyebut} warnaBagian={warnaBagian} tinggi={64} sorot={sorot === null ? undefined : indeksBagian[sorot]} />
      <div className="flex flex-wrap justify-center gap-2">
        {bagian.map((b, j) => (
          <button
            key={j}
            type="button"
            onClick={() => setSorot((s) => (s === j ? null : j))}
            aria-pressed={sorot === j}
            className={`legenda-peraga ${sorot === j ? 'legenda-peraga-aktif' : ''}`}
          >
            <span className="w-6 h-6 rounded-md border-2 border-[#1E2149]" style={{ backgroundColor: warnaList[j % warnaList.length] }} />
            {b.label}: <PecahanBersusun pembilang={b.nilai} penyebut={penyebut} />
          </button>
        ))}
      </div>
      <HasilBesar>
        {renderPecahan(bagian.map((b) => `{${b.nilai}/${penyebut}}`).join(' + ') + ` = {${total}/${penyebut}}`)}
      </HasilBesar>
    </div>
  );
};

/* ── Pemilih komponen sesuai data ──────────────────────────────── */
export const AlatPeraga: React.FC<{ visual: VisualMateri }> = ({ visual }) => {
  switch (visual.tipe) {
    case 'lingkaranInteraktif':
      return <LingkaranInteraktif {...visual.props} />;
    case 'senilaiBatang':
      return <SenilaiBatang {...visual.props} />;
    case 'bandingBatang':
      return <BandingInteraktif {...visual.props} />;
    case 'garisUrut':
      return <GarisUrut {...visual.props} />;
    case 'campuranLingkaran':
      return <CampuranLingkaran {...visual.props} />;
    case 'jumlahBatang':
      return <JumlahBatang {...visual.props} />;
    case 'kurangLingkaran':
      return <KurangLingkaran {...visual.props} />;
    case 'operasiCampuran':
      return <OperasiCampuran {...visual.props} />;
    case 'batangCerita':
      return <BatangCerita {...visual.props} />;
    case 'lingkaran':
      return (
        <div className="flex justify-center">
          <PecahanLingkaran penyebut={visual.props.penyebut} terarsir={visual.props.terarsir} ukuran={170} />
        </div>
      );
    case 'garisBilangan':
      return (
        <GarisBilangan
          pembagian={visual.props.pembagian}
          titik={[{ nilai: [visual.props.titikKe, visual.props.pembagian], labelTeks: '?' }]}
          label={`Garis bilangan 0 sampai 1 dibagi ${visual.props.pembagian} bagian, ada titik di tanda ke-${visual.props.titikKe}`}
        />
      );
    default:
      return null;
  }
};
