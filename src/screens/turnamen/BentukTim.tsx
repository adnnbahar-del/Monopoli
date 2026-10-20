import React, { useState } from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { TombolChunky } from '../../components/TombolChunky';
import { Bidak } from '../../components/Bidak';
import { PakPeca } from '../../components/PakPeca';
import { Shuffle, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';

export interface BentukTimProps {
  onKembali: () => void;
  onLanjut: () => void;
}

export const BentukTim: React.FC<BentukTimProps> = ({ onKembali, onLanjut }) => {
  const { daftarSiswa, daftarTim, bentukTimOtomatis, ubahNamaTim, pindahSiswaKeTim } = useKelasStore();
  const [editingTimId, setEditingTimId] = useState<string | null>(null);
  const [namaTimInput, setNamaTimInput] = useState('');

  const handleSimpanNama = (timId: string) => {
    if (namaTimInput.trim()) {
      ubahNamaTim(timId, namaTimInput);
    }
    setEditingTimId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Kontrol */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#FF6B35] tracking-wider block">
            Kelompok Heterogen TGT
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Bentuk Tim Belajar ({daftarTim.length} Tim)
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Siswa dengan kemampuan beragam (Tinggi, Sedang, Rendah) bekerja sama dalam satu tim.
          </p>
        </div>

        <TombolChunky
          variant="secondary"
          size="md"
          icon={<Shuffle className="w-5 h-5" />}
          onClick={() => bentukTimOtomatis(4)}
        >
          Bagi Otomatis (Pola Ular)
        </TombolChunky>
      </div>

      {/* Grid Tim Turnamen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {daftarTim.map((tim) => {
          const anggotaList = daftarSiswa.filter((s) => tim.anggotaIds.includes(s.id));

          return (
            <div
              key={tim.id}
              className="p-5 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4"
            >
              {/* Header Tim: Warna, Bentuk, dan Nama */}
              <div className="flex items-center justify-between border-b-2 border-[#1E2149]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <Bidak warna={tim.warna} bentuk={tim.bentuk} size={36} />
                  {editingTimId === tim.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={namaTimInput}
                        onChange={(e) => setNamaTimInput(e.target.value)}
                        className="px-2 py-1 rounded-lg border-2 border-[#1E2149] font-display font-black text-sm w-36"
                      />
                      <button
                        type="button"
                        onClick={() => handleSimpanNama(tim.id)}
                        className="px-2 py-1 bg-[#22A55B] text-white rounded-lg text-xs font-bold"
                      >
                        OK
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-lg text-[#1E2149]">
                        {tim.nama}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTimId(tim.id);
                          setNamaTimInput(tim.nama);
                        }}
                        className="p-1 hover:bg-gray-100 rounded text-gray-500"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-xs font-display font-black bg-white px-2.5 py-1 rounded-lg border border-[#1E2149]">
                  {anggotaList.length} Siswa
                </span>
              </div>

              {/* Daftar Anggota Tim */}
              <div className="space-y-2 min-h-[140px]">
                {anggotaList.map((siswa) => (
                  <div
                    key={siswa.id}
                    className="p-2.5 bg-white rounded-xl border-2 border-[#1E2149] flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-sm text-[#1E2149]">
                        {siswa.nama}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`
                          px-2 py-0.2 rounded text-[10px] font-black uppercase
                          ${siswa.kemampuan === 'tinggi' ? 'bg-emerald-100 text-emerald-800' : ''}
                          ${siswa.kemampuan === 'sedang' ? 'bg-amber-100 text-amber-800' : ''}
                          ${siswa.kemampuan === 'rendah' ? 'bg-orange-100 text-orange-800' : ''}
                        `}
                      >
                        {siswa.kemampuan}
                      </span>

                      {/* Dropdown Pindah Tim */}
                      <select
                        value={tim.id}
                        onChange={(e) => pindahSiswaKeTim(siswa.id, e.target.value)}
                        className="text-[11px] font-bold border border-gray-300 rounded px-1 py-0.5 bg-gray-50 text-gray-700"
                        title="Pindahkan siswa ke tim lain"
                      >
                        {daftarTim.map((t) => (
                          <option key={t.id} value={t.id}>
                            Pindah ke {t.nama}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigasi Bawah */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card shadow-soft-card">
        <div className="flex items-center gap-3">
          <PakPeca
            ekspresi="ceria"
            size={70}
            pesan="Komposisi tim sudah siap! Sekarang kita bagi meja turnamen homogen."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <TombolChunky
            variant="paper"
            size="lg"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={onKembali}
          >
            Kembali
          </TombolChunky>
          <TombolChunky
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={onLanjut}
          >
            Lanjut: Bentuk Meja
          </TombolChunky>
        </div>
      </div>
    </div>
  );
};
