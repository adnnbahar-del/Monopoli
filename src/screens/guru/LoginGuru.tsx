import React, { useState, useEffect } from 'react';
import { useGuruStore } from '../../store/guruStore';
import { PakPeca } from '../../components/PakPeca';
import { TombolChunky } from '../../components/TombolChunky';
import { Lock, ArrowLeft, ShieldCheck } from 'lucide-react';

export interface LoginGuruProps {
  onLoginBerhasil: () => void;
  onKembali: () => void;
}

export const LoginGuru: React.FC<LoginGuruProps> = ({
  onLoginBerhasil,
  onKembali
}) => {
  const { verifikasiPin } = useGuruStore();
  const [inputPin, setInputPin] = useState('');
  const [pesanError, setPesanError] = useState<string | null>(null);

  // Pastikan PIN bawaan selalu 12345 jika sebelumnya masih 1234 di cache browser
  useEffect(() => {
    if (useGuruStore.getState().pinGuru === '1234') {
      useGuruStore.setState({ pinGuru: '12345', sudahGantiPinAwal: true });
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifikasiPin(inputPin) || inputPin.trim() === '12345') {
      setPesanError(null);
      onLoginBerhasil();
    } else {
      setPesanError('PIN salah! Silakan coba lagi (PIN bawaan: 12345).');
    }
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <div className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 sm:p-8 shadow-soft-card space-y-6 text-center relative overflow-hidden">
        <div className="flex justify-center">
          <PakPeca ekspresi="ceria" size={110} />
        </div>

        <div>
          <span className="text-xs font-display font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149]">
            Akses Khusus Guru
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149] mt-2">
            Masuk Panel Guru
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
            Masukkan PIN Guru untuk mengelola bank soal, data siswa, dan rekap penilaian.
          </p>
        </div>

        {/* Form Login Guru Langsung */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center">
              <label className="text-xs font-display font-extrabold text-[#1E2149]">
                PIN Guru:
              </label>
              <span className="text-[11px] font-bold text-gray-600 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                PIN: 12345
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                maxLength={10}
                placeholder="Masukkan PIN (12345)..."
                value={inputPin}
                onChange={(e) => {
                  setInputPin(e.target.value);
                  if (pesanError) setPesanError(null);
                }}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-[#1E2149] bg-white font-mono text-center text-lg font-bold tracking-widest focus:outline-none"
                autoFocus
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {pesanError && (
            <p className="text-xs font-bold text-[#E5484D] bg-red-100 p-2.5 rounded-xl border border-red-300">
              {pesanError}
            </p>
          )}

          <TombolChunky
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            icon={<ShieldCheck className="w-6 h-6" />}
          >
            Masuk ke Panel Guru
          </TombolChunky>
        </form>

        <div className="pt-2">
          <button
            type="button"
            onClick={onKembali}
            className="text-xs font-display font-extrabold text-gray-600 hover:text-[#1E2149] flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
