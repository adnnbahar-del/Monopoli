import React, { useEffect, useState } from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { usePengaturanStore } from '../../store/pengaturanStore';
import { hitungPenghargaanTim, PredikatTim } from '../../engine/turnamen';
import { TombolChunky } from '../../components/TombolChunky';
import { PakPeca } from '../../components/PakPeca';
import { Bidak } from '../../components/Bidak';
import confetti from 'canvas-confetti';
import { Trophy, Printer, RotateCcw, Home, QrCode } from 'lucide-react';

export interface PodiumProps {
  onKembaliKeBeranda: () => void;
  onUlangTurnamen: () => void;
  onBukaGabungMeja?: () => void;
}

export const Podium: React.FC<PodiumProps> = ({
  onKembaliKeBeranda,
  onUlangTurnamen,
  onBukaGabungMeja
}) => {
  const { daftarSiswa, daftarTim, skorTurnamen, gabungKodeHasilMeja } = useKelasStore();
  const { ambangSuperTeam, ambangGreatTeam, ambangGoodTeam } = usePengaturanStore();

  const [kodeInput, setKodeInput] = useState('');
  const [modalGabungOpen, setModalGabungOpen] = useState(false);
  const [timSertifikat, setTimSertifikat] = useState<string | null>(null);

  useEffect(() => {
    // Letupan konfeti perayaan kemenangan podium
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
  }, []);

  // Hitung rata-rata dan predikat tiap tim
  const skorSemuaSiswa = Object.values(skorTurnamen).map((s) => ({
    siswaId: s.siswaId,
    poinTurnamen: s.poinTurnamen
  }));

  const rekapTim = daftarTim.map((tim) => {
    const hasil = hitungPenghargaanTim(
      tim,
      skorSemuaSiswa,
      ambangSuperTeam,
      ambangGreatTeam,
      ambangGoodTeam
    );
    return {
      ...tim,
      rataRataPoin: hasil.rataRataPoin,
      predikat: hasil.predikat
    };
  }).sort((a, b) => b.rataRataPoin - a.rataRataPoin);

  const warnaBadge: Record<PredikatTim, string> = {
    'Super Team': 'bg-[#FFD23F] text-[#1E2149] border-[#C79E1A]',
    'Great Team': 'bg-[#2EC4B6] text-white border-[#1B8C81]',
    'Good Team': 'bg-[#FF8A80] text-[#1E2149] border-[#E5484D]'
  };

  const handleCetak = () => {
    window.print();
  };

  const handleGabung = () => {
    if (!kodeInput.trim()) return;
    const res = gabungKodeHasilMeja(kodeInput);
    alert(res.pesan);
    if (res.sukses) {
      setKodeInput('');
      setModalGabungOpen(false);
    }
  };

  const timTerpilihSertifikat = rekapTim.find((t) => t.id === timSertifikat) || rekapTim[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none print:max-w-none print:m-0 print:p-0">
      {/* 1. LAYAR PODIUM JUARA (SCREEN VIEW) */}
      <div className="print:hidden space-y-6">
        <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card text-center flex flex-col items-center relative overflow-hidden">
          <PakPeca ekspresi="ceria" size={120} />
          <span className="text-xs font-display font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149] mt-3">
            🏆 Penghargaan Tim Turnamen TGT
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-[#1E2149] mt-2">
            Podium Juara Tim
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-1 max-w-lg">
            Penghargaan dihitung berdasarkan rata-rata poin turnamen seluruh anggota tim.
          </p>

          {/* Tombol Gabung Meja & Cetak */}
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            <TombolChunky
              variant="paper"
              size="sm"
              icon={<QrCode className="w-4 h-4" />}
              onClick={() => {
                if (onBukaGabungMeja) onBukaGabungMeja();
                else setModalGabungOpen(true);
              }}
            >
              Gabung Kode Meja
            </TombolChunky>
            <TombolChunky
              variant="primary"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={handleCetak}
            >
              Cetak Sertifikat
            </TombolChunky>
          </div>
        </div>

        {/* Visual Podium 3 Besar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
          {rekapTim.slice(0, 3).map((tim, idx) => {
            const tinggiPodium = idx === 0 ? 'h-64 sm:h-72 bg-[#FFD23F]' : idx === 1 ? 'h-52 sm:h-56 bg-gray-200' : 'h-44 sm:h-48 bg-amber-200';
            const urutanPodium = idx === 0 ? 'order-1 sm:order-2' : idx === 1 ? 'order-2 sm:order-1' : 'order-3';

            return (
              <div key={tim.id} className={`flex flex-col items-center ${urutanPodium}`}>
                <div className="mb-2 flex flex-col items-center">
                  <Bidak warna={tim.warna} bentuk={tim.bentuk} size={44} />
                  <span className="font-display font-black text-base text-[#1E2149] mt-1 truncate max-w-[140px]">
                    {tim.nama}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md border text-[11px] font-black uppercase mt-0.5 ${warnaBadge[tim.predikat || 'Good Team']}`}>
                    {tim.predikat}
                  </span>
                </div>

                <div className={`w-full ${tinggiPodium} rounded-t-3xl border-4 border-[#1E2149] p-4 flex flex-col items-center justify-between text-center shadow-soft-card`}>
                  <span className="w-10 h-10 rounded-full bg-[#1E2149] text-white flex items-center justify-center font-display font-black text-xl">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="text-2xl sm:text-3xl font-display font-black text-[#1E2149] block">
                      {tim.rataRataPoin}
                    </span>
                    <span className="text-[11px] font-bold text-gray-700">
                      Rata-Rata Poin
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTimSertifikat(tim.id)}
                    className="text-[11px] font-extrabold text-[#1E2149] underline"
                  >
                    Pilih Sertifikat
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabel Rekap Seluruh Tim */}
        <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#1E2149]/20">
            <span className="font-display font-black text-base text-[#1E2149]">
              Daftar Predikat Seluruh Tim ({rekapTim.length} Tim):
            </span>
            <div className="text-xs font-bold text-gray-600">
              Ambang: Super ≥{ambangSuperTeam} • Great ≥{ambangGreatTeam} • Good ≥{ambangGoodTeam}
            </div>
          </div>

          <div className="space-y-2">
            {rekapTim.map((tim, i) => (
              <div
                key={tim.id}
                className="p-3 bg-white rounded-xl border-2 border-[#1E2149] flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-sm text-gray-500 w-5">
                    #{i + 1}
                  </span>
                  <Bidak warna={tim.warna} bentuk={tim.bentuk} size={28} />
                  <div>
                    <div className="font-display font-black text-sm sm:text-base text-[#1E2149]">
                      {tim.nama}
                    </div>
                    <div className="text-[11px] font-bold text-gray-500">
                      {tim.anggotaIds.length} Siswa: {daftarSiswa.filter(s => tim.anggotaIds.includes(s.id)).map(s => s.nama.split(' ')[0]).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-display font-black uppercase ${warnaBadge[tim.predikat || 'Good Team']}`}>
                    {tim.predikat}
                  </span>
                  <div className="font-display font-black text-lg text-[#FF6B35] min-w-[50px]">
                    {tim.rataRataPoin}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tombol Aksi Bawah */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <TombolChunky
            variant="paper"
            size="lg"
            icon={<Home className="w-6 h-6" />}
            onClick={onKembaliKeBeranda}
          >
            Menu Beranda
          </TombolChunky>
          <TombolChunky
            variant="primary"
            size="lg"
            icon={<RotateCcw className="w-6 h-6" />}
            onClick={onUlangTurnamen}
          >
            Turnamen Baru
          </TombolChunky>
        </div>
      </div>

      {/* 2. LEMBAR SERTIFIKAT TIM (SIAP CETAK / PRINT VIEW) */}
      <div className="hidden print:block bg-white p-8 border-8 border-[#1E2149] rounded-3xl text-center space-y-6 mx-auto my-8 max-w-2xl">
        <div className="border-4 border-dashed border-[#FFB627] p-8 rounded-2xl space-y-4">
          <div className="flex justify-center">
            <Trophy className="w-16 h-16 text-[#FF6B35]" />
          </div>

          <h1 className="text-3xl font-display font-black text-[#1E2149] tracking-tight uppercase">
            Sertifikat Penghargaan Turnamen TGT
          </h1>
          <p className="text-sm font-bold text-gray-600">
            MONOPECA — Monopoli Pecahan
          </p>

          <div className="h-0.5 bg-[#1E2149] w-48 mx-auto my-2" />

          <p className="text-base font-bold text-gray-700">
            Diberikan dengan penuh bangga kepada:
          </p>

          <h2 className="text-4xl font-display font-black text-[#FF6B35]">
            {timTerpilihSertifikat.nama}
          </h2>

          <div className="inline-block px-6 py-2 rounded-full border-2 border-[#1E2149] bg-[#FFD23F] font-display font-black text-xl text-[#1E2149]">
            Predikat: {timTerpilihSertifikat.predikat} ({timTerpilihSertifikat.rataRataPoin} Poin)
          </div>

          <p className="text-xs font-bold text-gray-700 max-w-md mx-auto">
            Atas dedikasi, kerja sama tim kooperatif, dan kecakapan dalam menguasai konsep pecahan Matematika Kelas V SD Kurikulum Merdeka (Fase C).
          </p>

          {/* Anggota Tim */}
          <div className="pt-4 border-t border-gray-300">
            <span className="text-xs font-bold text-gray-500 block mb-1">Anggota Tim:</span>
            <div className="flex flex-wrap justify-center gap-2">
              {daftarSiswa
                .filter((s) => timTerpilihSertifikat.anggotaIds.includes(s.id))
                .map((s) => (
                  <span key={s.id} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-black text-[#1E2149]">
                    {s.nama}
                  </span>
                ))}
            </div>
          </div>

          {/* Tanda Tangan */}
          <div className="flex justify-between pt-8 text-xs font-bold text-gray-700">
            <div>
              <p>Guru Kelas V</p>
              <div className="h-12" />
              <p className="border-t border-black pt-1 w-32">(............................)</p>
            </div>
            <div>
              <p>Sukaraja, {new Date().toLocaleDateString('id-ID')}</p>
              <div className="h-12" />
              <p className="border-t border-black pt-1 w-32">Pak Peca (MONOPECA)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Gabung Kode Hasil Meja */}
      {modalGabungOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/60 backdrop-blur-sm print:hidden">
          <div className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card space-y-4">
            <h3 className="text-xl font-display font-black text-[#1E2149]">
              Gabung Kode Hasil Meja
            </h3>
            <p className="text-xs font-bold text-gray-700 leading-relaxed">
              Jika meja lain menggunakan perangkat berbeda, tempelkan kode hasil meja dari layar meja tersebut di sini:
            </p>

            <textarea
              rows={4}
              value={kodeInput}
              onChange={(e) => setKodeInput(e.target.value)}
              placeholder="Tempel kode hasil meja di sini..."
              className="w-full p-3 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-xs focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <TombolChunky
                variant="paper"
                size="sm"
                onClick={() => setModalGabungOpen(false)}
              >
                Batal
              </TombolChunky>
              <TombolChunky
                variant="primary"
                size="sm"
                onClick={handleGabung}
              >
                Gabungkan Skor
              </TombolChunky>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
