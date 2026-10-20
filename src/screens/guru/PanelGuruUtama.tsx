import React, { useState } from 'react';
import { NavHeader } from '../../components/NavHeader';
import { BankSoalGuru } from './BankSoalGuru';
import { HasilEksporGuru } from './HasilEksporGuru';
import { GantiMateriGuru } from './GantiMateriGuru';
import { PanduanTeknisGuru } from './PanduanTeknisGuru';
import { DaftarSiswa } from '../turnamen/DaftarSiswa';
import { useGuruStore } from '../../store/guruStore';
import {
  BookOpen,
  Users,
  BarChart2,
  MapPin,
  HelpCircle,
  KeyRound,
  LogOut
} from 'lucide-react';

export interface PanelGuruUtamaProps {
  onKembaliKeBeranda: () => void;
}

export type TabGuru = 'bank_soal' | 'kelas_siswa' | 'hasil_ekspor' | 'ganti_materi' | 'panduan_teknis';

export const PanelGuruUtama: React.FC<PanelGuruUtamaProps> = ({
  onKembaliKeBeranda
}) => {
  const [tabAktif, setTabAktif] = useState<TabGuru>('bank_soal');
  const [modalGantiPinOpen, setModalGantiPinOpen] = useState(false);
  const [pinLama, setPinLama] = useState('');
  const [pinBaru, setPinBaru] = useState('');
  const [pesanPin, setPesanPin] = useState<{ sukses: boolean; pesan: string } | null>(null);

  const { gantiPin } = useGuruStore();

  const DAFTAR_TAB = [
    { id: 'bank_soal', label: 'Bank Soal (47)', ikon: <BookOpen className="w-4 h-4" /> },
    { id: 'kelas_siswa', label: 'Kelas & Siswa', ikon: <Users className="w-4 h-4" /> },
    { id: 'hasil_ekspor', label: 'Hasil & Ekspor', ikon: <BarChart2 className="w-4 h-4" /> },
    { id: 'ganti_materi', label: 'Ganti Materi', ikon: <MapPin className="w-4 h-4" /> },
    { id: 'panduan_teknis', label: 'Panduan & Backup', ikon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleProsesGantiPin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = gantiPin(pinLama, pinBaru);
    setPesanPin(res);
    if (res.sukses) {
      setPinLama('');
      setPinBaru('');
      setTimeout(() => {
        setModalGantiPinOpen(false);
        setPesanPin(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Panel Guru MONOPECA"
        subjudul="Kelola Pembelajaran, Asesmen, Bank Soal, dan Konfigurasi"
        onBeranda={onKembaliKeBeranda}
        rightAction={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalGantiPinOpen(true)}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1E2149] bg-white hover:bg-amber-100 text-xs font-display font-extrabold flex items-center gap-1.5 text-[#1E2149]"
            >
              <KeyRound className="w-4 h-4 text-[#FF6B35]" />
              <span className="hidden sm:inline">Ganti PIN</span>
            </button>
            <button
              type="button"
              onClick={onKembaliKeBeranda}
              className="px-3 py-1.5 rounded-xl border-2 border-[#1E2149] bg-[#E5484D] text-white hover:bg-[#D13B40] text-xs font-display font-extrabold flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        }
      />

      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">
        {/* Tab Navigasi Panel Guru */}
        <div className="p-2 rounded-2xl bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex items-center justify-between gap-1 overflow-x-auto">
          {DAFTAR_TAB.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTabAktif(t.id as TabGuru)}
              className={`
                flex-1 min-w-[130px] py-2 px-3 rounded-xl border-2 border-[#1E2149] font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all
                ${tabAktif === t.id ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B]' : 'bg-white text-[#1E2149] hover:bg-amber-100'}
              `}
            >
              {t.ikon}
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Konten Tab Aktif */}
        {tabAktif === 'bank_soal' && <BankSoalGuru />}
        {tabAktif === 'kelas_siswa' && <DaftarSiswa onLanjut={() => setTabAktif('hasil_ekspor')} />}
        {tabAktif === 'hasil_ekspor' && <HasilEksporGuru />}
        {tabAktif === 'ganti_materi' && <GantiMateriGuru />}
        {tabAktif === 'panduan_teknis' && <PanduanTeknisGuru />}
      </div>

      {/* Modal Ganti PIN */}
      {modalGantiPinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card space-y-4">
            <h3 className="text-xl font-display font-black text-[#1E2149] text-center">
              Ganti PIN Guru
            </h3>

            <form onSubmit={handleProsesGantiPin} className="space-y-3">
              <div>
                <label className="text-xs font-extrabold text-gray-700 block">PIN Lama:</label>
                <input
                  type="password"
                  value={pinLama}
                  onChange={(e) => setPinLama(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-center text-sm font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-gray-700 block">PIN Baru (Min 4 Karakter):</label>
                <input
                  type="password"
                  value={pinBaru}
                  onChange={(e) => setPinBaru(e.target.value)}
                  className="w-full p-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-center text-sm font-bold focus:outline-none"
                  required
                />
              </div>

              {pesanPin && (
                <p className={`text-xs font-bold p-2 rounded-lg text-center ${
                  pesanPin.sukses ? 'bg-green-100 text-[#22A55B]' : 'bg-red-100 text-[#E5484D]'
                }`}>
                  {pesanPin.pesan}
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setModalGantiPinOpen(false);
                    setPesanPin(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-200 text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF6B35] text-white text-xs font-extrabold"
                >
                  Simpan PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default PanelGuruUtama;
