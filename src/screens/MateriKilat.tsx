import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Check,
  Target,
  Hand,
  Lightbulb,
  ListOrdered,
  MapPin,
  AlertTriangle,
  PencilLine,
  BookMarked,
  Volume2,
  Square,
  Compass,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { MATERI_KILAT, MateriTP } from '../data/materiKilatData';
import { PakPeca } from '../components/PakPeca';
import { renderPecahan, teksLisan } from '../components/materi/PecahanText';
import { AlatPeraga } from '../components/materi/AlatPeraga';
import { KuisAyoCoba } from '../components/materi/KuisAyoCoba';
import { useProgresMateri, tpSelesai } from '../hooks/useProgresMateri';

export interface MateriKilatProps {
  onKembali: () => void;
  onBeranda: () => void;
  onBukaEksplorasi: () => void;
  tpAwalIndex?: number;
}

const JUMLAH_TP = MATERI_KILAT.length;
const INDEX_RANGKUMAN = JUMLAH_TP;

/* ── Bagian bertajuk ───────────────────────────────────────────── */
const Bagian: React.FC<{
  judul: string;
  ikon: React.ReactNode;
  varian?: 'biasa' | 'tujuan' | 'nyata' | 'keliru' | 'tips' | 'ringkasan';
  aksi?: React.ReactNode;
  children: React.ReactNode;
}> = ({ judul, ikon, varian = 'biasa', aksi, children }) => (
  <section className={`bagian-materi bagian-${varian}`}>
    <div className="flex items-center justify-between gap-2 mb-3">
      <h3 className="flex items-center gap-2 font-display font-black text-xl text-[#1E2149]">
        <span className="bagian-ikon" aria-hidden="true">{ikon}</span>
        {judul}
      </h3>
      {aksi}
    </div>
    {children}
  </section>
);

/* ── Tombol "Dengarkan" (Web Speech API) ───────────────────────── */
const TombolDengarkan: React.FC<{ teks: string[] }> = ({ teks }) => {
  const didukung = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const [bicara, setBicara] = useState(false);

  useEffect(() => {
    return () => {
      if (didukung) window.speechSynthesis.cancel();
    };
  }, [didukung]);

  if (!didukung) return null;

  const toggle = () => {
    try {
      if (bicara) {
        window.speechSynthesis.cancel();
        setBicara(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(teks.map(teksLisan).join('. '));
      u.lang = 'id-ID';
      u.rate = 0.95;
      u.onend = () => setBicara(false);
      u.onerror = () => setBicara(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      setBicara(true);
    } catch {
      setBicara(false);
    }
  };

  return (
    <button type="button" onClick={toggle} className="tombol-dengar" aria-pressed={bicara}>
      {bicara ? <Square className="w-4 h-4" /> : <Volume2 className="w-5 h-5" />}
      {bicara ? 'Berhenti' : '🔊 Dengarkan'}
    </button>
  );
};

/* ── Langkah demi langkah ──────────────────────────────────────── */
const LangkahDemiLangkah: React.FC<{ judul: string; langkah: MateriTP['langkah'] }> = ({ judul, langkah }) => {
  const [terbuka, setTerbuka] = useState(1);
  const semua = terbuka >= langkah.length;
  return (
    <div className="space-y-3">
      <p className="teks-materi font-bold">{renderPecahan(judul)}</p>
      <ol className="space-y-2">
        {langkah.slice(0, terbuka).map((l, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 items-start"
          >
            <span className="nomor-langkah" aria-hidden="true">{i + 1}</span>
            <span className="teks-materi pt-1">{renderPecahan(l.teks)}</span>
          </motion.li>
        ))}
      </ol>
      {!semua && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tombol-peraga" onClick={() => setTerbuka((n) => n + 1)}>
            Langkah berikutnya <ArrowRight className="w-4 h-4" />
          </button>
          <button type="button" className="tombol-peraga tombol-peraga-kedua" onClick={() => setTerbuka(langkah.length)}>
            Tampilkan semua
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Isi satu TP ───────────────────────────────────────────────── */
const IsiTP: React.FC<{
  tp: MateriTP;
  status: Record<number, 'benar' | 'pembahasan'>;
  onTuntas: (i: number, s: 'benar' | 'pembahasan') => void;
}> = ({ tp, status, onTuntas }) => (
  <div className="space-y-4">
    <div>
      <p className="text-base font-display font-black text-[#C2410C] uppercase tracking-wide">TP{tp.nomor} dari {JUMLAH_TP}</p>
      <h2 className="font-display font-black text-[24px] sm:text-[26px] leading-tight text-[#1E2149]">{tp.judul}</h2>
    </div>

    <Bagian judul="Tujuan" ikon={<Target className="w-5 h-5" />} varian="tujuan">
      <p className="teks-materi"><strong>Setelah belajar ini,</strong> {renderPecahan(tp.tujuan.replace(/^Kamu/, 'kamu'))}</p>
    </Bagian>

    <Bagian judul="Alat peraga" ikon={<Hand className="w-5 h-5" />}>
      <p className="teks-materi mb-3 text-[#1E2149]/85">{tp.petunjukVisual}</p>
      <AlatPeraga visual={tp.visual} />
    </Bagian>

    <Bagian judul="Konsep inti" ikon={<Lightbulb className="w-5 h-5" />} aksi={<TombolDengarkan teks={tp.konsep} />}>
      <ul className="space-y-2.5">
        {tp.konsep.map((k, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span className="mt-2.5 w-2.5 h-2.5 rounded-full bg-[#FF6B35] shrink-0" aria-hidden="true" />
            <span className="teks-materi">{renderPecahan(k)}</span>
          </li>
        ))}
      </ul>
    </Bagian>

    <Bagian judul="Langkah demi langkah" ikon={<ListOrdered className="w-5 h-5" />}>
      <LangkahDemiLangkah judul={tp.judulLangkah} langkah={tp.langkah} />
    </Bagian>

    <Bagian judul="Contoh nyata" ikon={<MapPin className="w-5 h-5" />} varian="nyata">
      <p className="font-display font-black text-lg text-[#0F5E57]">{tp.contohNyata.judul}</p>
      <p className="teks-materi mt-1">{renderPecahan(tp.contohNyata.cerita)}</p>
      <p className="teks-materi mt-2 rounded-xl bg-white/80 px-3 py-2 font-bold">{renderPecahan(tp.contohNyata.kalimatMatematika)}</p>
      {tp.contohTambahan && (
        <div className="mt-3 pt-3 border-t-2 border-[#2EC4B6]/40">
          <p className="font-display font-black text-lg text-[#0F5E57]">{tp.contohTambahan.judul}</p>
          <p className="teks-materi mt-1">{renderPecahan(tp.contohTambahan.cerita)}</p>
        </div>
      )}
    </Bagian>

    <Bagian judul="Awas keliru!" ikon={<AlertTriangle className="w-5 h-5" />} varian="keliru">
      <div className="space-y-2">
        <p className="teks-materi">
          <span className="label-keliru label-salah">Salah</span>{' '}
          <span className="line-through decoration-[#E5484D] decoration-[3px]">{renderPecahan(tp.awasKeliru.salah)}</span>
        </p>
        <p className="teks-materi">
          <span className="label-keliru label-benar">Benar</span> {renderPecahan(tp.awasKeliru.benar)}
        </p>
        <p className="teks-materi"><strong>Alasannya:</strong> {renderPecahan(tp.awasKeliru.alasan)}</p>
        {tp.awasKeliru.tambahan && <p className="teks-materi">{renderPecahan(tp.awasKeliru.tambahan)}</p>}
      </div>
    </Bagian>

    <Bagian judul="Ayo coba" ikon={<PencilLine className="w-5 h-5" />}>
      <KuisAyoCoba daftarSoal={tp.ayoCoba} status={status} onTuntas={onTuntas} />
    </Bagian>

    <section className="bagian-materi bagian-tips flex items-start gap-3">
      <PakPeca ekspresi="senang" size={72} className="shrink-0" />
      <div>
        <h3 className="font-display font-black text-xl text-[#1E2149]">Tips Pak Peca</h3>
        <p className="teks-materi mt-1">{renderPecahan(tp.tips)}</p>
      </div>
    </section>

    <Bagian judul="Ringkasan" ikon={<BookMarked className="w-5 h-5" />} varian="ringkasan">
      <p className="teks-materi font-bold">{renderPecahan(tp.ringkasan)}</p>
    </Bagian>
  </div>
);

/* ── Kartu Rangkuman ───────────────────────────────────────────── */
const KartuRangkuman: React.FC<{ selesai: boolean[]; onEksplorasi: () => void; onUlangi: () => void; onBuka: (i: number) => void }> = ({
  selesai,
  onEksplorasi,
  onUlangi,
  onBuka,
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <PakPeca ekspresi="semangat" size={84} />
      <div>
        <h2 className="font-display font-black text-[26px] leading-tight text-[#1E2149]">Rangkuman Materi</h2>
        <p className="teks-materi">
          Kamu sudah menyelesaikan {selesai.filter(Boolean).length} dari {JUMLAH_TP} TP. Hebat!
        </p>
      </div>
    </div>
    <ol className="bagian-materi space-y-2">
      {MATERI_KILAT.map((tp, i) => (
        <li key={tp.id}>
          <button type="button" onClick={() => onBuka(i)} className="baris-rangkuman">
            <span className={`nomor-langkah ${selesai[i] ? 'nomor-selesai' : ''}`} aria-hidden="true">
              {selesai[i] ? <Check className="w-4 h-4" strokeWidth={3} /> : tp.nomor}
            </span>
            <span className="text-left">
              <span className="block font-display font-black text-[#1E2149]">TP{tp.nomor} · {tp.judul}</span>
              <span className="teks-materi block">{renderPecahan(tp.ringkasan)}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" className="tombol-nav tombol-nav-utama" onClick={onEksplorasi}>
        <Compass className="w-5 h-5" /> Lanjut ke Mode Eksplorasi / Game
      </button>
      <button type="button" className="tombol-nav" onClick={onUlangi}>
        <RotateCcw className="w-5 h-5" /> Ulangi dari TP1
      </button>
    </div>
  </div>
);

/* ── Halaman ───────────────────────────────────────────────────── */
export const MateriKilat: React.FC<MateriKilatProps> = ({ onKembali, onBeranda, onBukaEksplorasi, tpAwalIndex = 0 }) => {
  const [index, setIndex] = useState(Math.min(Math.max(0, tpAwalIndex), JUMLAH_TP - 1));
  const { progres, tandai } = useProgresMateri();
  const kurangiGerak = useReducedMotion() ?? false;
  const baris = useRef<HTMLDivElement>(null);
  const chip = useRef<(HTMLButtonElement | null)[]>([]);

  const selesai = MATERI_KILAT.map((tp) => tpSelesai(tp, progres));
  const jumlahSelesai = selesai.filter(Boolean).length;
  const diRangkuman = index === INDEX_RANGKUMAN;
  const tp = diRangkuman ? null : MATERI_KILAT[index];

  // Chip aktif digeser ke tengah; halaman kembali ke atas saat ganti TP
  useEffect(() => {
    const wadah = baris.current;
    const el = chip.current[index];
    if (wadah && el) {
      wadah.scrollTo({ left: el.offsetLeft - (wadah.clientWidth - el.clientWidth) / 2, behavior: kurangiGerak ? 'auto' : 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: kurangiGerak ? 'auto' : 'smooth' });
  }, [index, kurangiGerak]);

  const ke = (i: number) => setIndex(Math.min(Math.max(0, i), INDEX_RANGKUMAN));

  const subjudul = diRangkuman ? 'Rangkuman semua TP' : `TP${tp!.nomor} dari ${JUMLAH_TP} · ${tp!.judul}`;

  return (
    <div className="materi-root min-h-[100dvh]">
      {/* ── Header sticky ── */}
      <header className="materi-header">
        <div className="max-w-[1100px] mx-auto px-3 sm:px-5 pt-2.5 pb-2 flex items-center gap-2.5">
          <button type="button" onClick={onKembali} className="tombol-ikon" aria-label="Kembali">
            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#1E2149] leading-tight">Materi Kilat Pecahan</h1>
            <p className="text-sm sm:text-base font-bold text-[#1E2149]/75 leading-snug">{subjudul}</p>
          </div>
          <span className="hidden sm:inline-flex lencana-fase">Fase C · Kelas V</span>
          <button type="button" onClick={onBeranda} className="tombol-ikon" aria-label="Ke Beranda">
            <Home className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>
        <div className="max-w-[1100px] mx-auto px-3 sm:px-5 pb-2">
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-3 rounded-full bg-white border-2 border-[#1E2149] overflow-hidden"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={JUMLAH_TP}
              aria-valuenow={jumlahSelesai}
              aria-label="TP yang sudah selesai"
            >
              <div className="h-full bg-[#22A55B] transition-[width] duration-300" style={{ width: `${(jumlahSelesai / JUMLAH_TP) * 100}%` }} />
            </div>
            <span className="text-sm font-black text-[#1E2149] whitespace-nowrap">{jumlahSelesai}/{JUMLAH_TP} selesai</span>
            <span className="sm:hidden lencana-fase">Fase C · Kelas V</span>
          </div>
        </div>
        {/* Chip TP (HP & tablet) */}
        <div ref={baris} className="lg:hidden flex gap-2 overflow-x-auto px-3 pb-2.5 baris-chip" role="tablist" aria-label="Daftar TP">
          {MATERI_KILAT.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => { chip.current[i] = el; }}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => ke(i)}
              className={`chip-tp ${i === index ? 'chip-tp-aktif' : selesai[i] ? 'chip-tp-selesai' : ''}`}
            >
              {selesai[i] && i !== index && <Check className="w-4 h-4" strokeWidth={3} />}
              {t.nomor} · {t.judulPendek}
            </button>
          ))}
          <button
            ref={(el) => { chip.current[INDEX_RANGKUMAN] = el; }}
            type="button"
            role="tab"
            aria-selected={diRangkuman}
            onClick={() => ke(INDEX_RANGKUMAN)}
            className={`chip-tp ${diRangkuman ? 'chip-tp-aktif' : ''}`}
          >
            <Trophy className="w-4 h-4" /> Rangkuman
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-3 sm:px-5 lg:grid lg:grid-cols-[260px_minmax(0,760px)] lg:gap-6 lg:justify-center">
        {/* ── Sidebar (laptop) ── */}
        <aside className="hidden lg:block pt-5">
          <nav className="materi-sidebar" aria-label="Daftar TP">
            {MATERI_KILAT.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => ke(i)}
                aria-current={i === index ? 'page' : undefined}
                className={`item-sidebar ${i === index ? 'item-sidebar-aktif' : ''}`}
              >
                <span className={`nomor-langkah ${selesai[i] ? 'nomor-selesai' : ''}`} aria-hidden="true">
                  {selesai[i] ? <Check className="w-4 h-4" strokeWidth={3} /> : t.nomor}
                </span>
                <span className="text-left leading-snug">
                  <span className="block text-sm font-black opacity-80">TP{t.nomor}{selesai[i] ? ' · selesai' : ''}</span>
                  <span className="block">{t.judul}</span>
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => ke(INDEX_RANGKUMAN)}
              aria-current={diRangkuman ? 'page' : undefined}
              className={`item-sidebar ${diRangkuman ? 'item-sidebar-aktif' : ''}`}
            >
              <span className="nomor-langkah" aria-hidden="true"><Trophy className="w-4 h-4" /></span>
              <span>Rangkuman Materi</span>
            </button>
          </nav>
        </aside>

        {/* ── Konten ── */}
        <main className="min-w-0 pt-4 lg:pt-5">
          <motion.div
            key={index}
            initial={kurangiGerak ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tp ? (
              <IsiTP tp={tp} status={progres[tp.id] ?? {}} onTuntas={(i, s) => tandai(tp.id, i, s)} />
            ) : (
              <KartuRangkuman selesai={selesai} onEksplorasi={onBukaEksplorasi} onUlangi={() => ke(0)} onBuka={ke} />
            )}
          </motion.div>

          {/* ── Navigasi bawah sticky ── */}
          <nav className="materi-nav-bawah" aria-label="Navigasi TP">
            <button type="button" className="tombol-nav" onClick={() => ke(index - 1)} disabled={index === 0}>
              <ArrowLeft className="w-5 h-5" /> Sebelumnya
            </button>
            {!diRangkuman && (
              <button type="button" className="tombol-nav tombol-nav-utama" onClick={() => ke(index + 1)}>
                {index === JUMLAH_TP - 1 ? 'Rangkuman' : 'Selanjutnya'} <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
};
