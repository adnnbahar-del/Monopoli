import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { Splash } from '../screens/Splash';
import { Beranda, Layar } from '../screens/Beranda';
import { TujuanBelajar } from '../screens/TujuanBelajar';
import { MateriKilat } from '../screens/MateriKilat';
import { Eksplorasi } from '../screens/Eksplorasi';
import { CaraBermain } from '../screens/CaraBermain';
import { Pengaturan } from '../screens/Pengaturan';
import { Styleguide } from '../screens/Styleguide';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';
import { PapanPermainan } from '../screens/PapanPermainan';
import { TurnamenTGT } from '../screens/turnamen/TurnamenTGT';
import { LoginGuru } from '../screens/guru/LoginGuru';
import { usePengaturanStore } from '../store/pengaturanStore';
import { audio } from '../engine/audioManager';

const PanelGuruUtama = React.lazy(() => import('../screens/guru/PanelGuruUtama'));

export const App: React.FC = () => {
  const [layarSekarang, setLayarSekarang] = useState<Layar>('splash');
  const [riwayat, setRiwayat] = useState<Layar[]>(['splash']);

  // ── Aksesibilitas Reaktif ───────────────────────────────────
  const { kontrasTinggi, ukuranTeks, volumeSFX, bisu } = usePengaturanStore();

  useEffect(() => {
    if (kontrasTinggi) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [kontrasTinggi]);

  useEffect(() => {
    if (ukuranTeks === 'besar') {
      document.documentElement.classList.add('text-besar');
    } else {
      document.documentElement.classList.remove('text-besar');
    }
  }, [ukuranTeks]);

  // ── Sinkron Audio Engine dari Store ────────────────────────
  useEffect(() => {
    audio.sinkronDariStore(volumeSFX, bisu);
  }, [volumeSFX, bisu]);

  // ── Navigasi ────────────────────────────────────────────────
  const navigasiKe = (layarBaru: Layar) => {
    audio.putar('klik_tombol');
    setRiwayat((prev) => [...prev, layarBaru]);
    setLayarSekarang(layarBaru);
  };

  const kembali = () => {
    audio.putar('klik_tombol');
    if (riwayat.length > 1) {
      const riwayatBaru = [...riwayat];
      riwayatBaru.pop();
      const layarSebelumnya = riwayatBaru[riwayatBaru.length - 1];
      setRiwayat(riwayatBaru);
      setLayarSekarang(layarSebelumnya);
    } else {
      setLayarSekarang('beranda');
    }
  };

  const keBeranda = () => {
    audio.putar('klik_tombol');
    setRiwayat(['beranda']);
    setLayarSekarang('beranda');
  };

  return (
    <ErrorBoundary>
      {/* Skip to Content — Aksesibilitas Keyboard */}
      <a href="#konten-utama" className="skip-to-content">
        Langsung ke Konten
      </a>

      <main
        id="konten-utama"
        className="min-h-screen text-[#1E2149] font-sans antialiased overflow-x-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={layarSekarang}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="w-full min-h-screen"
          >
            {layarSekarang === 'splash' && (
              <Splash onMulai={() => navigasiKe('beranda')} />
            )}

            {layarSekarang === 'beranda' && (
              <Beranda
                onNavigasi={(layar) => navigasiKe(layar)}
                adaGameTersimpan={true}
                onLanjutkanGame={() => navigasiKe('papanPermainan')}
              />
            )}

            {layarSekarang === 'tujuanBelajar' && (
              <TujuanBelajar
                onKembali={kembali}
                onBeranda={keBeranda}
                onMulaiMateri={() => navigasiKe('materiKilat')}
              />
            )}

            {layarSekarang === 'materiKilat' && (
              <MateriKilat
                onKembali={kembali}
                onBeranda={keBeranda}
                onBukaEksplorasi={() => navigasiKe('eksplorasi')}
              />
            )}

            {layarSekarang === 'eksplorasi' && (
              <Eksplorasi
                onKembali={kembali}
                onBeranda={keBeranda}
              />
            )}

            {layarSekarang === 'caraBermain' && (
              <CaraBermain
                onKembali={kembali}
                onBeranda={keBeranda}
              />
            )}

            {layarSekarang === 'pengaturan' && (
              <Pengaturan
                onKembali={kembali}
                onBeranda={keBeranda}
              />
            )}

            {layarSekarang === 'papanPermainan' && (
              <PapanPermainan onKeluarKeBeranda={keBeranda} />
            )}

            {layarSekarang === 'latihanTim' && (
              <PlaceholderScreen
                judul="Mode Latihan Tim"
                subjudul="Papan Permainan Monopoli Pecahan — Mode Latihan"
                faseRilis="Tersedia di Mode Latihan"
                pesanPakPeca="Pilih Mode Latihan Tim untuk memulai sesi latihan papan monopoli bersama tim!"
                onKembali={kembali}
                onBeranda={keBeranda}
              />
            )}

            {layarSekarang === 'turnamenTGT' && (
              <TurnamenTGT
                onKembaliKeBeranda={keBeranda}
                onBukaMateriKilat={() => navigasiKe('materiKilat')}
                onBukaLatihanTim={() => navigasiKe('papanPermainan')}
              />
            )}

            {layarSekarang === 'loginGuru' && (
              <LoginGuru
                onLoginBerhasil={() => {
                  audio.putar('login_sukses');
                  navigasiKe('panelGuru');
                }}
                onKembali={kembali}
              />
            )}

            {layarSekarang === 'panelGuru' && (
              <React.Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1]">
                  <p className="font-display font-black text-[#1E2149] text-xl animate-pulse">
                    Memuat Panel Guru…
                  </p>
                </div>
              }>
                <PanelGuruUtama onKembaliKeBeranda={keBeranda} />
              </React.Suspense>
            )}

            {layarSekarang === 'styleguide' && (
              <div className="relative">
                <div className="fixed top-3 right-4 z-50">
                  <button
                    onClick={keBeranda}
                    className="px-3 py-1.5 rounded-xl bg-[#FF6B35] text-white border-2 border-[#1E2149] font-display font-extrabold text-xs shadow-sm cursor-pointer"
                  >
                    Ke Beranda
                  </button>
                </div>
                <Styleguide />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
};

export default App;
