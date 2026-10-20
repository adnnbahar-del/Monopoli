import React from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { TombolChunky } from '../../components/TombolChunky';
import { Bidak } from '../../components/Bidak';
import { PakPeca } from '../../components/PakPeca';
import { Play, ArrowLeft, RotateCw } from 'lucide-react';

export interface BentukMejaProps {
  onKembali: () => void;
  onMulaiDuelMeja: (mejaId: string) => void;
}

export const BentukMeja: React.FC<BentukMejaProps> = ({
  onKembali,
  onMulaiDuelMeja
}) => {
  const { daftarSiswa, daftarTim, daftarMeja, bentukMejaOtomatis } = useKelasStore();

  return (
    <div className="space-y-6">
      {/* Header Kontrol Meja Turnamen */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#2EC4B6] tracking-wider block">
            Meja Turnamen Homogen TGT
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Daftar Meja Turnamen ({daftarMeja.length} Meja)
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Siswa berlaga dengan teman berkemampuan setara dan berasal dari tim yang berbeda (anti-bentrok).
          </p>
        </div>

        <TombolChunky
          variant="secondary"
          size="md"
          icon={<RotateCw className="w-5 h-5" />}
          onClick={() => bentukMejaOtomatis(4)}
        >
          Susun Ulang Meja
        </TombolChunky>
      </div>

      {/* Grid Meja-Meja Turnamen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {daftarMeja.map((meja) => {
          const anggotaList = daftarSiswa.filter((s) => meja.anggotaIds.includes(s.id));

          return (
            <div
              key={meja.id}
              className="p-5 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header Meja & Paket Soal */}
                <div className="flex items-center justify-between border-b-2 border-[#1E2149]/20 pb-3">
                  <div>
                    <h3 className="font-display font-black text-xl text-[#1E2149]">
                      {meja.nama}
                    </h3>
                    <span className="text-xs font-bold text-gray-500 capitalize">
                      Tingkat: {meja.tingkatKemampuan}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-[#FFD23F] border-2 border-[#1E2149] font-display font-black text-xs text-[#1E2149]">
                    Paket {meja.paketSoal}
                  </span>
                </div>

                {/* Anggota Siswa di Meja Ini */}
                <div className="space-y-2 mt-4">
                  {anggotaList.map((siswa) => {
                    const tim = daftarTim.find((t) => t.anggotaIds.includes(siswa.id));

                    return (
                      <div
                        key={siswa.id}
                        className="p-2.5 bg-white rounded-xl border-2 border-[#1E2149] flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          {tim && (
                            <Bidak warna={tim.warna} bentuk={tim.bentuk} size={24} />
                          )}
                          <span className="font-display font-extrabold text-sm text-[#1E2149] truncate max-w-[130px]">
                            {siswa.nama}
                          </span>
                        </div>

                        <span className="text-[10px] font-black text-gray-500">
                          {tim ? tim.nama : 'Tanpa Tim'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Selesai / Tombol Mulai Duel Meja */}
              <div className="pt-2">
                {meja.selesai ? (
                  <div className="p-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-center text-xs font-display font-black text-emerald-800">
                    ✓ Meja Selesai Bertanding
                  </div>
                ) : (
                  <TombolChunky
                    variant="primary"
                    size="md"
                    fullWidth
                    icon={<Play className="w-5 h-5 fill-white" />}
                    onClick={() => onMulaiDuelMeja(meja.id)}
                  >
                    Mulai Duel Meja
                  </TombolChunky>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi Bawah */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card shadow-soft-card">
        <PakPeca
          ekspresi="ceria"
          size={70}
          pesan="Pilih salah satu meja di atas untuk memulai pertandingan turnamen!"
        />

        <TombolChunky
          variant="paper"
          size="lg"
          icon={<ArrowLeft className="w-5 h-5" />}
          onClick={onKembali}
        >
          Kembali ke Bentuk Tim
        </TombolChunky>
      </div>
    </div>
  );
};
