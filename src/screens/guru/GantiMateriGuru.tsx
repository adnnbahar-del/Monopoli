import React, { useState } from 'react';
import { useGuruStore } from '../../store/guruStore';
import { DAFTAR_PETAK } from '../../data/papan';
import { TombolChunky } from '../../components/TombolChunky';
import { RotateCcw, Save, MapPin } from 'lucide-react';

export const GantiMateriGuru: React.FC = () => {
  const { kustomNamaKios, simpanKustomKios, resetKustomMateri } = useGuruStore();
  const [editedKios, setEditedKios] = useState<Record<number, string>>(kustomNamaKios);

  const handleSimpan = (idx: number) => {
    if (editedKios[idx] !== undefined) {
      simpanKustomKios(idx, editedKios[idx]);
      alert(`Nama kios petak ${idx} berhasil diperbarui!`);
    }
  };

  const handleSimpanSemua = () => {
    Object.entries(editedKios).forEach(([idxStr, nama]) => {
      simpanKustomKios(parseInt(idxStr), nama);
    });
    alert('Seluruh nama kios kustom berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#FF6B35] tracking-wider block">
            Adaptasi Konteks Lokal
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Kustomisasi Nama Kios & Zona Papan
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Ubah nama kios agar sesuai dengan lingkungan sekitar sekolah Anda.
          </p>
        </div>

        <div className="flex gap-2">
          <TombolChunky
            variant="paper"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              if (confirm('Kembalikan ke nama kios bawaan monopoli?')) {
                resetKustomMateri();
                setEditedKios({});
              }
            }}
          >
            Reset Bawaan
          </TombolChunky>
          <TombolChunky
            variant="primary"
            size="sm"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSimpanSemua}
          >
            Simpan Semua
          </TombolChunky>
        </div>
      </div>

      {/* Grid Petak Kios */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
        <h3 className="font-display font-black text-base text-[#1E2149] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#FF6B35]" />
          <span>Daftar Nama Kios Permainan:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {DAFTAR_PETAK.filter((p) => p.jenis === 'kios').map((petak) => {
            const namaSekarang = editedKios[petak.index] !== undefined
              ? editedKios[petak.index]
              : petak.nama;

            return (
              <div
                key={petak.index}
                className="p-3 bg-white rounded-xl border-2 border-[#1E2149] flex items-center gap-3 shadow-xs"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-white text-xs shrink-0"
                  style={{ backgroundColor: petak.warna }}
                >
                  #{petak.index}
                </div>

                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    Bawaan: {petak.nama} ({petak.subtopik})
                  </span>
                  <input
                    type="text"
                    value={namaSekarang}
                    onChange={(e) => setEditedKios({ ...editedKios, [petak.index]: e.target.value })}
                    className="w-full px-2.5 py-1 text-xs font-bold border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FF6B35]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSimpan(petak.index)}
                  className="p-1.5 hover:bg-amber-100 rounded-lg text-[#FF6B35] font-black text-xs"
                  title="Simpan Kios Ini"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
