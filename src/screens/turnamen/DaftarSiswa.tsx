import React, { useState } from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { TombolChunky } from '../../components/TombolChunky';
import { PakPeca } from '../../components/PakPeca';
import { UserPlus, Upload, Trash2, ArrowRight } from 'lucide-react';

export interface DaftarSiswaProps {
  onLanjut: () => void;
}

export const DaftarSiswa: React.FC<DaftarSiswaProps> = ({ onLanjut }) => {
  const { daftarSiswa, tambahSiswa, hapusSiswa, imporSiswaDariTeks } = useKelasStore();
  const [namaBaru, setNamaBaru] = useState('');
  const [kemampuanBaru, setKemampuanBaru] = useState<'tinggi' | 'sedang' | 'rendah'>('sedang');
  const [teksImpor, setTeksImpor] = useState('');
  const [modalImporOpen, setModalImporOpen] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);

  const handleTambah = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = namaBaru.trim();
    if (!clean) {
      setPesanError('Nama siswa tidak boleh kosong!');
      return;
    }
    const sudahAda = daftarSiswa.some((s) => s.nama.toLowerCase() === clean.toLowerCase());
    if (sudahAda) {
      setPesanError(`Siswa dengan nama "${clean}" sudah terdaftar!`);
      return;
    }

    tambahSiswa(clean, kemampuanBaru);
    setNamaBaru('');
    setPesanError(null);
  };

  const handleProsesImpor = () => {
    if (!teksImpor.trim()) return;
    const res = imporSiswaDariTeks(teksImpor);
    alert(res.pesan);
    setTeksImpor('');
    setModalImporOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Form Tambah Siswa & Impor */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#1E2149]/20 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
              Daftar Siswa Kelas V
            </h2>
            <p className="text-xs font-bold text-gray-600">
              Total {daftarSiswa.length} siswa terdaftar. Atur kemampuan awal untuk pembagian tim seimbang.
            </p>
          </div>

          <TombolChunky
            variant="paper"
            size="sm"
            icon={<Upload className="w-4 h-4" />}
            onClick={() => setModalImporOpen(true)}
          >
            Impor Nama (CSV/Teks)
          </TombolChunky>
        </div>

        {/* Input Manual */}
        <form onSubmit={handleTambah} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-display font-extrabold text-[#1E2149]">
              Nama Lengkap Siswa:
            </label>
            <input
              type="text"
              placeholder="Contoh: Ahmad Dahlan"
              value={namaBaru}
              onChange={(e) => {
                setNamaBaru(e.target.value);
                if (pesanError) setPesanError(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-xs font-display font-extrabold text-[#1E2149]">
              Kemampuan:
            </label>
            <select
              value={kemampuanBaru}
              onChange={(e) => setKemampuanBaru(e.target.value as 'tinggi' | 'sedang' | 'rendah')}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[#1E2149] bg-white font-display font-extrabold text-sm focus:outline-none"
            >
              <option value="tinggi">Tinggi (🟢)</option>
              <option value="sedang">Sedang (🟡)</option>
              <option value="rendah">Rendah (🟠)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <TombolChunky
              variant="primary"
              size="md"
              fullWidth
              icon={<UserPlus className="w-5 h-5" />}
              type="submit"
            >
              Tambah
            </TombolChunky>
          </div>
        </form>

        {pesanError && (
          <div className="p-3 bg-red-100 border-2 border-[#E5484D] rounded-xl text-xs font-bold text-[#E5484D]">
            ⚠️ {pesanError}
          </div>
        )}
      </div>

      {/* Tabel Daftar Siswa */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
        <div className="flex items-center justify-between pb-2">
          <span className="font-display font-black text-base text-[#1E2149]">
            Data Siswa ({daftarSiswa.length}):
          </span>
          <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1">🟢 Tinggi: {daftarSiswa.filter(s => s.kemampuan === 'tinggi').length}</span>
            <span className="flex items-center gap-1">🟡 Sedang: {daftarSiswa.filter(s => s.kemampuan === 'sedang').length}</span>
            <span className="flex items-center gap-1">🟠 Rendah: {daftarSiswa.filter(s => s.kemampuan === 'rendah').length}</span>
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {daftarSiswa.map((siswa, idx) => (
            <div
              key={siswa.id}
              className="p-3 bg-white rounded-xl border-2 border-[#1E2149] flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 border border-[#1E2149] text-[11px] font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="font-display font-extrabold text-sm text-[#1E2149]">
                  {siswa.nama}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`
                    px-2.5 py-0.5 rounded-lg border text-xs font-display font-extrabold capitalize
                    ${siswa.kemampuan === 'tinggi' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : ''}
                    ${siswa.kemampuan === 'sedang' ? 'bg-amber-100 text-amber-800 border-amber-300' : ''}
                    ${siswa.kemampuan === 'rendah' ? 'bg-orange-100 text-orange-800 border-orange-300' : ''}
                  `}
                >
                  {siswa.kemampuan}
                </span>

                <button
                  type="button"
                  onClick={() => hapusSiswa(siswa.id)}
                  title="Hapus siswa"
                  className="p-1.5 hover:bg-red-50 text-[#E5484D] rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Tempel / Impor Nama */}
      {modalImporOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card space-y-4">
            <h3 className="text-xl font-display font-black text-[#1E2149]">
              Impor Daftar Siswa (Teks / CSV)
            </h3>
            <p className="text-xs font-bold text-gray-700 leading-relaxed">
              Tempel nama siswa satu per baris. Contoh format:
              <br />
              <code className="bg-amber-100 px-2 py-0.5 rounded text-[11px] text-[#1E2149] block mt-1">
                Ahmad Dahlan, tinggi<br />
                Siti Rahma, sedang<br />
                Budi Santoso, rendah
              </code>
            </p>

            <textarea
              rows={6}
              value={teksImpor}
              onChange={(e) => setTeksImpor(e.target.value)}
              placeholder="Tempel daftar nama di sini..."
              className="w-full p-3 rounded-xl border-2 border-[#1E2149] bg-white font-mono text-xs focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <TombolChunky
                variant="paper"
                size="sm"
                onClick={() => setModalImporOpen(false)}
              >
                Batal
              </TombolChunky>
              <TombolChunky
                variant="primary"
                size="sm"
                onClick={handleProsesImpor}
              >
                Impor Sekarang
              </TombolChunky>
            </div>
          </div>
        </div>
      )}

      {/* Tombol Lanjut ke Tahap Bentuk Tim */}
      <div className="flex items-center justify-between p-4 bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card shadow-soft-card">
        <PakPeca
          ekspresi="semangat"
          size={70}
          pesan="Semua nama sudah lengkap? Lanjut bagi tim heterogen!"
        />
        <TombolChunky
          variant="primary"
          size="lg"
          icon={<ArrowRight className="w-6 h-6" />}
          iconPosition="right"
          disabled={daftarSiswa.length < 3}
          onClick={onLanjut}
        >
          Lanjut: Bentuk Tim
        </TombolChunky>
      </div>
    </div>
  );
};
