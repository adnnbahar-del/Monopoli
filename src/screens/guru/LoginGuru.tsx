import React, { useState } from 'react';
import { useGuruStore } from '../../store/guruStore';
import { PakPeca } from '../../components/PakPeca';
import { TombolChunky } from '../../components/TombolChunky';
import { Lock, KeyRound, ArrowLeft, ShieldCheck } from 'lucide-react';

export interface LoginGuruProps {
  onLoginBerhasil: () => void;
  onKembali: () => void;
}

export const LoginGuru: React.FC<LoginGuruProps> = ({
  onLoginBerhasil,
  onKembali
}) => {
  const { pinGuru, sudahGantiPinAwal, verifikasiPin, setPinPertamaKali } = useGuruStore();
  const [inputPin, setInputPin] = useState('');
  const [pinBaru, setPinBaru] = useState('');
  const [konfirmasiPin, setKonfirmasiPin] = useState('');
  const [pesanError, setPesanError] = useState<string | null>(null);

  // Cek apakah ini pertama kali login (PIN masih bawaan 1234)
  const perluGantiPinAwal = !sudahGantiPinAwal && pinGuru === '1234';

  const handleLoginBiasa = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifikasiPin(inputPin)) {
      setPesanError(null);
      onLoginBerhasil();
    } else {
      setPesanError('PIN salah! Silakan coba lagi.');
    }
  };

  const handleGantiPinAwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPin !== '1234') {
      setPesanError('PIN bawaan salah! Gunakan "1234" untuk verifikasi awal.');
      return;
    }
    if (pinBaru.length < 4) {
      setPesanError('PIN baru minimal harus 4 digit!');
      return;
    }
    if (pinBaru === '1234') {
      setPesanError('PIN baru tidak boleh sama dengan PIN bawaan (1234)!');
      return;
    }
    if (pinBaru !== konfirmasiPin) {
      setPesanError('Konfirmasi PIN baru tidak cocok!');
      return;
    }

    const res = setPinPertamaKali(pinBaru);
    if (res.sukses) {
      setPesanError(null);
      alert(res.pesan);
      onLoginBerhasil();
    } else {
      setPesanError(res.pesan);
    }
  };

  return (
    <div className="min-h-screen pb-16 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <div className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 sm:p-8 shadow-soft-card space-y-6 text-center relative overflow-hidden">
        <div className="flex justify-center">
          <PakPeca ekspresi={perluGantiPinAwal ? 'berpikir' : 'ceria'} size={110} />
        </div>

        <div>
          <span className="text-xs font-display font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149]">
            Akses Khusus Guru
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149] mt-2">
            {perluGantiPinAwal ? 'Aktivasi & Ganti PIN Baru' : 'Masuk Panel Guru'}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
            {perluGantiPinAwal
              ? 'Demi keamanan data kelas dan bank soal, masukkan PIN bawaan (1234) lalu tentukan PIN baru Anda.'
              : 'Masukkan PIN Guru untuk mengelola bank soal, data siswa, dan rekap penilaian.'}
          </p>
        </div>

        {/* Form Login Biasa (Setelah PIN diubah) */}
        {!perluGantiPinAwal ? (
          <form onSubmit={handleLoginBiasa} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-display font-extrabold text-[#1E2149]">
                PIN Guru:
              </label>
              <div className="relative">
                <input
                  type="password"
                  maxLength={8}
                  placeholder="Masukkan PIN..."
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
        ) : (
          /* Form Wajib Ganti PIN di Awal */
          <form onSubmit={handleGantiPinAwal} className="space-y-3 text-left">
            <div>
              <label className="text-xs font-display font-extrabold text-[#1E2149]">
                PIN Bawaan (Default: 1234):
              </label>
              <input
                type="password"
                placeholder="1234"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-center text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-display font-extrabold text-[#1E2149]">
                Buat PIN Baru (Min 4 Karakter):
              </label>
              <input
                type="password"
                placeholder="Contoh: 5678"
                value={pinBaru}
                onChange={(e) => setPinBaru(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-center text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-display font-extrabold text-[#1E2149]">
                Konfirmasi PIN Baru:
              </label>
              <input
                type="password"
                placeholder="Ulangi PIN baru"
                value={konfirmasiPin}
                onChange={(e) => setKonfirmasiPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-center text-sm font-bold focus:outline-none"
              />
            </div>

            {pesanError && (
              <p className="text-xs font-bold text-[#E5484D] bg-red-100 p-2.5 rounded-xl border border-red-300">
                {pesanError}
              </p>
            )}

            <div className="pt-2">
              <TombolChunky
                variant="primary"
                size="md"
                fullWidth
                type="submit"
                icon={<KeyRound className="w-5 h-5" />}
              >
                Simpan PIN Baru & Masuk
              </TombolChunky>
            </div>
          </form>
        )}

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
