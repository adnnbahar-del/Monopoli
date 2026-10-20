import React, { useState } from 'react';
import { Pecahan, renderTeksDenganPecahan } from '../components/Pecahan';
import { VisualPecahan, BentukVisual } from '../components/VisualPecahan';
import { TombolChunky, VarianTombol } from '../components/TombolChunky';
import { KartuSoal } from '../components/KartuSoal';
import { Dadu3D } from '../components/Dadu3D';
import { Bidak, BentukTim } from '../components/Bidak';
import { HUD } from '../components/HUD';
import { PakPeca, EkspresiPakPeca } from '../components/PakPeca';
import { Toast } from '../components/Toast';
import { DialogRamah } from '../components/DialogRamah';
import { Sparkles, Dice5, Eye, Palette, CheckCircle, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Styleguide: React.FC = () => {
  const [highContrast, setHighContrast] = useState(false);
  const [visualBentuk, setVisualBentuk] = useState<BentukVisual>('lingkaran');
  const [pembilang, setPembilang] = useState(3);
  const [penyebut, setPenyebut] = useState(4);
  const [daduVal, setDaduVal] = useState(6);
  const [toastShow, setToastShow] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const dummyPemain = [
    { id: '1', nama: 'Ahmad', timNama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond' as BentukTim, poin: 80 },
    { id: '2', nama: 'Siti', timNama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle' as BentukTim, poin: 95 },
    { id: '3', nama: 'Budi', timNama: 'Tim Hijau', warna: '#22A55B', bentuk: 'triangle' as BentukTim, poin: 60 },
    { id: '4', nama: 'Dewi', timNama: 'Tim Oranye', warna: '#F08C00', bentuk: 'square' as BentukTim, poin: 70 },
  ];

  return (
    <div className="min-h-screen pb-20 tapis-pattern">
      {/* Sticky Header untuk Navigasi Styleguide */}
      <div className="sticky top-0 z-40 bg-[#FFF8EC]/95 backdrop-blur-md border-b-4 border-[#1E2149] px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF6B35] border-2 border-[#1E2149] flex items-center justify-center text-white font-display font-extrabold text-xl shadow-[0_2px_0_#1E2149]">
            M
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#1E2149] leading-tight">
              MONOPECA Design System & Styleguide
            </h1>
            <p className="text-xs font-bold text-gray-600">
              Materi Pecahan Kelas V SD — Fase 0 Fondasi
            </p>
          </div>
        </div>

        <button
          onClick={toggleHighContrast}
          className="px-3.5 py-2 rounded-xl border-2 border-[#1E2149] bg-[#FFD23F] font-display font-extrabold text-xs sm:text-sm text-[#1E2149] shadow-[0_3px_0_#C79E1A] flex items-center gap-1.5 cursor-pointer active:translate-y-0.5"
        >
          <Eye className="w-4 h-4" />
          <span>{highContrast ? 'Mode Normal' : 'Kontras Tinggi'}</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 space-y-12">
        {/* 1. TOKEN WARNA & TEMA */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <Palette className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              1. Token Warna (Pasar Senja Ceria)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[
              { label: 'Ink (Teks)', code: '#1E2149', bg: 'bg-[#1E2149]', text: 'text-white' },
              { label: 'Paper (Panel)', code: '#FFF8EC', bg: 'bg-[#FFF8EC]', text: 'text-[#1E2149]' },
              { label: 'Primary', code: '#FF6B35', bg: 'bg-[#FF6B35]', text: 'text-white' },
              { label: 'Secondary', code: '#2EC4B6', bg: 'bg-[#2EC4B6]', text: 'text-white' },
              { label: 'Accent (Koin)', code: '#FFD23F', bg: 'bg-[#FFD23F]', text: 'text-[#1E2149]' },
              { label: 'Success', code: '#22A55B', bg: 'bg-[#22A55B]', text: 'text-white' },
              { label: 'Danger', code: '#E5484D', bg: 'bg-[#E5484D]', text: 'text-white' },
              { label: 'Zona 1 (Coral)', code: '#FF8A80', bg: 'bg-[#FF8A80]', text: 'text-[#1E2149]' },
              { label: 'Zona 2 (Kuning)', code: '#FFB627', bg: 'bg-[#FFB627]', text: 'text-[#1E2149]' },
              { label: 'Zona 3 (Hijau)', code: '#3BC47A', bg: 'bg-[#3BC47A]', text: 'text-white' },
              { label: 'Zona 4 (Biru)', code: '#4D8DFF', bg: 'bg-[#4D8DFF]', text: 'text-white' },
              { label: 'Kesempatan', code: '#FF7EB6', bg: 'bg-[#FF7EB6]', text: 'text-white' },
              { label: 'Tantangan', code: '#7B5CFA', bg: 'bg-[#7B5CFA]', text: 'text-white' },
            ].map((c, i) => (
              <div key={i} className="border-2 border-[#1E2149] rounded-2xl overflow-hidden shadow-sm">
                <div className={`h-16 ${c.bg} flex items-center justify-center font-display font-extrabold text-sm ${c.text}`}>
                  {c.code}
                </div>
                <div className="p-2 bg-white text-xs font-bold text-[#1E2149] text-center">
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          {/* Token Warna & Bentuk Tim */}
          <h3 className="text-lg font-display font-bold mt-6 mb-3 text-[#1E2149]">
            Identitas Tim (Warna + Bentuk Wajib):
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { nama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond' as BentukTim, simbol: '◆ Diamond' },
              { nama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle' as BentukTim, simbol: '● Circle' },
              { nama: 'Tim Hijau', warna: '#22A55B', bentuk: 'triangle' as BentukTim, simbol: '▲ Triangle' },
              { nama: 'Tim Oranye', warna: '#F08C00', bentuk: 'square' as BentukTim, simbol: '■ Square' },
              { nama: 'Tim Ungu', warna: '#8E4EC6', bentuk: 'star' as BentukTim, simbol: '★ Star' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl border-2 border-[#1E2149] bg-white shadow-sm">
                <Bidak warna={t.warna} bentuk={t.bentuk} size={36} />
                <div>
                  <div className="font-display font-extrabold text-sm">{t.nama}</div>
                  <div className="text-xs text-gray-600 font-bold">{t.simbol}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. TIPOGRAFI & KOMPONEN PECAHAN */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <Sparkles className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              2. Tipografi & Komponen &lt;Pecahan /&gt;
            </h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-700">
              Pecahan bertingkat dengan pembilang di atas garis dan penyebut di bawah garis, lengkap dengan aria-label ramah pembaca layar (screen reader).
            </p>

            <div className="p-4 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-wrap items-center gap-8">
              <div>
                <span className="text-xs font-bold text-gray-500 block">Ukuran SM:</span>
                <Pecahan value="1/2" size="sm" />
                <Pecahan value="3/4" size="sm" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 block">Ukuran MD (Default):</span>
                <Pecahan value="2/3" size="md" />
                <Pecahan value="5/6" size="md" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 block">Ukuran LG:</span>
                <Pecahan value="3/8" size="lg" />
                <Pecahan value="7/10" size="lg" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 block">Ukuran XL:</span>
                <Pecahan value="1 3/4" size="xl" />
              </div>
            </div>

            {/* Helper Auto-Render Dalam Kalimat */}
            <div className="p-4 bg-amber-50 border-2 border-[#FFB627] rounded-2xl">
              <span className="text-xs font-extrabold text-[#FF6B35] uppercase block mb-1">
                Otomatis Mengubah Format Teks "a/b" Menjadi &lt;Pecahan /&gt;:
              </span>
              <p className="text-lg font-bold text-[#1E2149] leading-relaxed">
                {renderTeksDenganPecahan('Ibu membeli 1/2 kg gula dan 3/4 kg tepung terigu di pasar.', 'md')}
              </p>
            </div>
          </div>
        </section>

        {/* 3. VISUAL PECAHAN (4 BENTUK) */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <Eye className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              3. Visual Pecahan Interaktif (4 Bentuk SVG + Pola Arsir)
            </h2>
          </div>

          {/* Kontrol Interaktif */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white border-2 border-[#1E2149] rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">Bentuk:</span>
              {(['lingkaran', 'persegi', 'batang', 'garis_bilangan'] as BentukVisual[]).map((b) => (
                <button
                  key={b}
                  onClick={() => setVisualBentuk(b)}
                  className={`px-3 py-1.5 rounded-xl border-2 border-[#1E2149] text-xs font-extrabold capitalize cursor-pointer transition-all ${
                    visualBentuk === b ? 'bg-[#FF6B35] text-white shadow-[0_2px_0_#C4471B]' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {b.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <label className="text-sm font-bold flex items-center gap-1">
                Pembilang:
                <input
                  type="number"
                  min="0"
                  max={penyebut}
                  value={pembilang}
                  onChange={(e) => setPembilang(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-16 px-2 py-1 border-2 border-[#1E2149] rounded-lg font-display font-bold text-center"
                />
              </label>

              <label className="text-sm font-bold flex items-center gap-1">
                Penyebut:
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={penyebut}
                  onChange={(e) => setPenyebut(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 px-2 py-1 border-2 border-[#1E2149] rounded-lg font-display font-bold text-center"
                />
              </label>
            </div>
          </div>

          {/* Grid Tampilan 4 Bentuk Sekaligus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center">
              <span className="font-display font-extrabold text-base mb-2">Lingkaran</span>
              <VisualPecahan bentuk="lingkaran" pembilang={pembilang} penyebut={penyebut} size={180} />
              <div className="mt-3">
                <Pecahan value={{ pembilang, penyebut }} size="lg" />
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center">
              <span className="font-display font-extrabold text-base mb-2">Persegi / Grid</span>
              <VisualPecahan bentuk="persegi" pembilang={pembilang} penyebut={penyebut} size={180} />
              <div className="mt-3">
                <Pecahan value={{ pembilang, penyebut }} size="lg" />
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center">
              <span className="font-display font-extrabold text-base mb-2">Batang</span>
              <VisualPecahan bentuk="batang" pembilang={pembilang} penyebut={penyebut} size={180} />
              <div className="mt-3">
                <Pecahan value={{ pembilang, penyebut }} size="lg" />
              </div>
            </div>

            <div className="p-4 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center">
              <span className="font-display font-extrabold text-base mb-2">Garis Bilangan</span>
              <VisualPecahan bentuk="garis_bilangan" pembilang={pembilang} penyebut={penyebut} size={180} />
              <div className="mt-3">
                <Pecahan value={{ pembilang, penyebut }} size="lg" />
              </div>
            </div>
          </div>
        </section>

        {/* 4. TOMBOL CHUNKY & INTERAKSI */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <CheckCircle className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              4. Tombol Chunky (Target Sentuh Anak 56–64 px)
            </h2>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {(['primary', 'secondary', 'accent', 'success', 'danger', 'paper'] as VarianTombol[]).map((v) => (
              <TombolChunky
                key={v}
                variant={v}
                size="md"
                onClick={() => {
                  setToastShow(true);
                  setTimeout(() => setToastShow(false), 2500);
                }}
              >
                Varian {v}
              </TombolChunky>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 items-center mt-6">
            <TombolChunky size="sm" variant="primary">Ukuran SM (48px)</TombolChunky>
            <TombolChunky size="md" variant="secondary">Ukuran MD (56px)</TombolChunky>
            <TombolChunky size="lg" variant="accent" icon={<Sparkles className="w-6 h-6" />}>
              Ukuran LG (64px) Utama
            </TombolChunky>
          </div>
        </section>

        {/* 5. DADU 3D & BIDAK PERMAINAN */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <Dice5 className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              5. Dadu 3D & Bidak Permainan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Dadu 3D */}
            <div className="p-6 bg-amber-50/80 border-2 border-[#1E2149] rounded-2xl flex flex-col items-center gap-4 text-center">
              <span className="font-display font-extrabold text-lg text-[#1E2149]">
                Ketuk Dadu 3D untuk Mengocok (Animasi 1.2 Detik)
              </span>
              <Dadu3D
                nilai={daduVal}
                onLempar={(hasil) => setDaduVal(hasil)}
                size={96}
              />
              <span className="font-display font-black text-xl text-[#FF6B35]">
                Hasil: {daduVal}
              </span>
            </div>

            {/* Bidak Permainan */}
            <div className="p-6 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center gap-4 text-center">
              <span className="font-display font-extrabold text-lg text-[#1E2149]">
                Simulasi Bidak dalam Satu Petak (Maks 4 Bidak Anti-Tumpuk)
              </span>
              <div className="w-28 h-28 bg-[#FF8A80] border-4 border-[#1E2149] rounded-2xl relative flex items-center justify-center shadow-inner">
                <span className="text-[11px] font-extrabold uppercase text-[#1E2149]/40 absolute top-1">
                  Petak 1
                </span>
                <Bidak namaPemain="Ahmad" warna="#E5484D" bentuk="diamond" slotIndex={0} isAktif={true} />
                <Bidak namaPemain="Siti" warna="#3E7BFA" bentuk="circle" slotIndex={1} />
                <Bidak namaPemain="Budi" warna="#22A55B" bentuk="triangle" slotIndex={2} />
                <Bidak namaPemain="Dewi" warna="#F08C00" bentuk="square" slotIndex={3} />
              </div>
              <span className="text-xs font-bold text-gray-500">
                Pion melompat & memiliki cincin sorot berkedip jika aktif
              </span>
            </div>
          </div>
        </section>

        {/* 6. KARTU SOAL FLIP 3D */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1E2149]/20 pb-2">
            <Volume2 className="w-6 h-6 text-[#FF6B35]" />
            <h2 className="text-2xl font-display font-extrabold text-[#1E2149]">
              6. Kartu Soal 3D Flip
            </h2>
          </div>

          <div className="max-w-md mx-auto">
            <KartuSoal
              tipe="petak"
              subtopik="Mengenal Pecahan"
              level="sedang"
              tp="TP1"
              pertanyaan="Berapakah nilai pecahan dari gambar yang diarsir berikut?"
              visual={{
                bentuk: 'lingkaran',
                pembilang: 3,
                penyebut: 4
              }}
              opsi={['1/4', '2/4', '3/4', '4/4']}
              kunci="3/4"
              pembahasan="Dari 4 bagian yang sama besar, 3 bagian diarsir. Maka nilai pecahannya adalah 3/4 (tiga per empat)."
              onJawab={(_pilihan, benar) => {
                if (benar) {
                  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                }
              }}
            />
          </div>
        </section>

        {/* 7. HUD BAR ATAS */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <h2 className="text-2xl font-display font-extrabold text-[#1E2149] mb-4">
            7. HUD (Heads-Up Display)
          </h2>
          <div className="border-2 border-[#1E2149] rounded-2xl overflow-hidden shadow-sm">
            <HUD
              pemainAktif={dummyPemain[0]}
              semuaPemain={dummyPemain}
              sisaDetik={1140}
              onJeda={() => setDialogOpen(true)}
            />
          </div>
        </section>

        {/* 8. MASKOT PAK PECA & DIALOG RAMAH */}
        <section className="bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card">
          <h2 className="text-2xl font-display font-extrabold text-[#1E2149] mb-4">
            8. Maskot "Pak Peca" (Kue Bolu Ramah Sukaraja)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
            {(['ceria', 'semangat', 'berpikir', 'bingung', 'senang'] as EkspresiPakPeca[]).map((e) => (
              <div key={e} className="p-3 bg-white border-2 border-[#1E2149] rounded-2xl flex flex-col items-center">
                <PakPeca ekspresi={e} size={90} />
                <span className="font-display font-bold text-sm mt-2 capitalize text-[#1E2149]">
                  {e}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-amber-50 border-2 border-[#FFB627] rounded-2xl">
            <PakPeca
              ekspresi="semangat"
              size={90}
              pesan="Ayo coba buka dialog ramah konfirmasi dengan menekan tombol di samping!"
            />
            <TombolChunky
              variant="primary"
              size="md"
              onClick={() => setDialogOpen(true)}
            >
              Buka Dialog Ramah
            </TombolChunky>
          </div>
        </section>
      </div>

      {/* Modal Dialog Ramah Demo */}
      <DialogRamah
        open={dialogOpen}
        judul="Permainan Sedang Dijeda"
        pesan="Waktu permainan dihentikan sementara. Kamu bisa beristirahat sejenak atau berdiskusi strategi bersama timmu!"
        ekspresiPakPeca="senang"
        teksKonfirmasi="Lanjutkan Permainan"
        teksBatal="Simpan & Keluar"
        onKonfirmasi={() => setDialogOpen(false)}
        onBatal={() => setDialogOpen(false)}
      />

      {/* Toast Demo */}
      <Toast
        show={toastShow}
        pesan="Tombol berhasil ditekan! Umpan balik visual & taktil aktif."
        tipe="success"
        onClose={() => setToastShow(false)}
      />
    </div>
  );
};
