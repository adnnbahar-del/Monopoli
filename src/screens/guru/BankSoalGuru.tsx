import React, { useState } from 'react';
import { useGuruStore } from '../../store/guruStore';
import { Soal, Subtopik, Level } from '../../engine/kartu';
import { jumlahPecahan, kurangPecahan, formatPecahan, apakahSenilai } from '../../engine/pecahan';
import { KartuSoal } from '../../components/KartuSoal';
import { TombolChunky } from '../../components/TombolChunky';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  RotateCcw,
  Download,
  AlertTriangle,
  Search,
  Check
} from 'lucide-react';

export const BankSoalGuru: React.FC = () => {
  const {
    daftarSoal,
    tambahSoal,
    ubahSoal,
    hapusSoal,
    resetKeSoalBawaan,
  } = useGuruStore();

  // Filter state
  const [filterSubtopik, setFilterSubtopik] = useState<string>('semua');
  const [filterLevel, setFilterLevel] = useState<string>('semua');
  const [filterTipe, setFilterTipe] = useState<string>('semua');
  const [filterTP, setFilterTP] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [modalPratinjauOpen, setModalPratinjauOpen] = useState(false);
  const [soalTerpilih, setSoalTerpilih] = useState<Soal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formId, setFormId] = useState('');
  const [formTipe, setFormTipe] = useState<'petak' | 'tantangan' | 'turnamen'>('petak');
  const [formSubtopik, setFormSubtopik] = useState<Subtopik>('mengenal');
  const [formLevel, setFormLevel] = useState<Level>('sedang');
  const [formTP, setFormTP] = useState('TP1');
  const [formPertanyaan, setFormPertanyaan] = useState('');
  const [formOpsi1, setFormOpsi1] = useState('');
  const [formOpsi2, setFormOpsi2] = useState('');
  const [formOpsi3, setFormOpsi3] = useState('');
  const [formOpsi4, setFormOpsi4] = useState('');
  const [formKunci, setFormKunci] = useState('');
  const [formPembahasan, setFormPembahasan] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formWarning, setFormWarning] = useState<string | null>(null);

  // Filter Data
  const soalTersaring = daftarSoal.filter((s) => {
    if (filterSubtopik !== 'semua' && s.subtopik !== filterSubtopik) return false;
    if (filterLevel !== 'semua' && s.level !== filterLevel) return false;
    if (filterTipe !== 'semua' && s.tipe !== filterTipe) return false;
    if (filterTP !== 'semua' && s.tp !== filterTP) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.pertanyaan.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.pembahasan.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleBukaTambah = () => {
    setIsEditing(false);
    setFormId(`soal-${Date.now()}`);
    setFormTipe('petak');
    setFormSubtopik('mengenal');
    setFormLevel('sedang');
    setFormTP('TP1');
    setFormPertanyaan('');
    setFormOpsi1('');
    setFormOpsi2('');
    setFormOpsi3('');
    setFormOpsi4('');
    setFormKunci('');
    setFormPembahasan('');
    setFormError(null);
    setFormWarning(null);
    setModalFormOpen(true);
  };

  const handleBukaEdit = (soal: Soal) => {
    setIsEditing(true);
    setFormId(soal.id);
    setFormTipe(soal.tipe);
    setFormSubtopik(soal.subtopik);
    setFormLevel(soal.level);
    setFormTP(soal.tp);
    setFormPertanyaan(soal.pertanyaan);
    setFormOpsi1(soal.opsi[0] || '');
    setFormOpsi2(soal.opsi[1] || '');
    setFormOpsi3(soal.opsi[2] || '');
    setFormOpsi4(soal.opsi[3] || '');
    setFormKunci(soal.kunci);
    setFormPembahasan(soal.pembahasan);
    setFormError(null);
    setFormWarning(null);
    setModalFormOpen(true);
  };

  // Validasi Matematis Otomatis saat pertanyaan atau kunci berubah
  const cekPeringatanHitungan = (pertanyaan: string, kunci: string) => {
    try {
      const plusMatch = pertanyaan.match(/(\d+\/\d+)\s*\+\s*(\d+\/\d+)/);
      if (plusMatch) {
        const hasil = formatPecahan(jumlahPecahan(plusMatch[1], plusMatch[2]));
        if (!apakahSenilai(kunci, hasil)) {
          return `Peringatan: Berdasarkan hitungan engine, ${plusMatch[1]} + ${plusMatch[2]} = ${hasil}, sedangkan kunci yang Anda masukkan adalah "${kunci}".`;
        }
      }

      const minusMatch = pertanyaan.match(/(\d+\/\d+)\s*[−-]\s*(\d+\/\d+)/);
      if (minusMatch) {
        const hasil = formatPecahan(kurangPecahan(minusMatch[1], minusMatch[2]));
        if (!apakahSenilai(kunci, hasil)) {
          return `Peringatan: Berdasarkan hitungan engine, ${minusMatch[1]} − ${minusMatch[2]} = ${hasil}, sedangkan kunci yang Anda masukkan adalah "${kunci}".`;
        }
      }
    } catch {
      // Abaikan jika bukan format pecahan
    }
    return null;
  };

  const handleSimpanSoal = (e: React.FormEvent) => {
    e.preventDefault();
    const opsiList = [formOpsi1.trim(), formOpsi2.trim(), formOpsi3.trim(), formOpsi4.trim()].filter(Boolean);

    // 1. Validasi Minimal 3 opsi
    if (opsiList.length < 3) {
      setFormError('Minimal harus menyediakan 3 opsi jawaban pilihan ganda!');
      return;
    }

    // 2. Validasi Opsi Tidak Boleh Ganda
    const uniqueOps = new Set(opsiList);
    if (uniqueOps.size !== opsiList.length) {
      setFormError('Pilihan opsi tidak boleh ada yang ganda/sama!');
      return;
    }

    // 3. Validasi Kunci Jawaban Ada di Opsi
    const kunciBersih = formKunci.trim();
    if (!kunciBersih) {
      setFormError('Kunci jawaban tidak boleh kosong!');
      return;
    }
    if (!opsiList.includes(kunciBersih)) {
      setFormError(`Kunci jawaban "${kunciBersih}" harus sama persis dengan salah satu opsi!`);
      return;
    }

    // 4. Validasi Hitungan Pecahan
    const warn = cekPeringatanHitungan(formPertanyaan, kunciBersih);
    if (warn) {
      setFormWarning(warn);
    }

    const dataBaru: Soal = {
      id: formId,
      tipe: formTipe,
      subtopik: formSubtopik,
      level: formLevel,
      tp: formTP,
      pertanyaan: formPertanyaan.trim(),
      opsi: opsiList,
      kunci: kunciBersih,
      pembahasan: formPembahasan.trim() || 'Pembahasan langkah demi langkah.'
    };

    if (isEditing) {
      ubahSoal(formId, dataBaru);
    } else {
      tambahSoal(dataBaru);
    }

    setModalFormOpen(false);
  };

  // Ekspor Bank Soal ke JSON
  const handleEksporJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(daftarSoal, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `bank_soal_monepeca_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#1E2149]/20 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
              Bank Soal ({daftarSoal.length} Soal)
            </h2>
            <p className="text-xs font-bold text-gray-600 mt-0.5">
              Kelola, edit, uji validitas matematis, dan pratinjau kartu soal.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <TombolChunky
              variant="paper"
              size="sm"
              icon={<RotateCcw className="w-4 h-4" />}
              onClick={() => {
                if (confirm('Kembalikan ke 47 butir soal bawaan (default)?')) {
                  resetKeSoalBawaan();
                }
              }}
            >
              Reset Bawaan
            </TombolChunky>
            <TombolChunky
              variant="secondary"
              size="sm"
              icon={<Download className="w-4 h-4" />}
              onClick={handleEksporJSON}
            >
              Ekspor JSON
            </TombolChunky>
            <TombolChunky
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleBukaTambah}
            >
              Tambah Soal
            </TombolChunky>
          </div>
        </div>

        {/* Baris Filter & Pencarian */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {/* Subtopik */}
          <select
            value={filterSubtopik}
            onChange={(e) => setFilterSubtopik(e.target.value)}
            className="p-2 rounded-xl border-2 border-[#1E2149] bg-white font-display font-extrabold text-xs"
          >
            <option value="semua">Semua Subtopik</option>
            <option value="mengenal">Mengenal</option>
            <option value="senilai">Senilai</option>
            <option value="membandingkan">Membandingkan</option>
            <option value="mengurutkan">Mengurutkan</option>
            <option value="penjumlahan">Penjumlahan</option>
            <option value="pengurangan">Pengurangan</option>
          </select>

          {/* Level */}
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="p-2 rounded-xl border-2 border-[#1E2149] bg-white font-display font-extrabold text-xs"
          >
            <option value="semua">Semua Level</option>
            <option value="mudah">Mudah</option>
            <option value="sedang">Sedang</option>
            <option value="sukar">Sukar</option>
          </select>

          {/* Tipe */}
          <select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value)}
            className="p-2 rounded-xl border-2 border-[#1E2149] bg-white font-display font-extrabold text-xs"
          >
            <option value="semua">Semua Tipe</option>
            <option value="petak">Petak</option>
            <option value="tantangan">Tantangan</option>
            <option value="turnamen">Turnamen</option>
          </select>

          {/* TP */}
          <select
            value={filterTP}
            onChange={(e) => setFilterTP(e.target.value)}
            className="p-2 rounded-xl border-2 border-[#1E2149] bg-white font-display font-extrabold text-xs"
          >
            <option value="semua">Semua TP</option>
            <option value="TP1">TP1</option>
            <option value="TP2">TP2</option>
            <option value="TP3">TP3</option>
            <option value="TP4">TP4</option>
            <option value="TP5">TP5</option>
            <option value="TP6">TP6</option>
            <option value="TP7">TP7</option>
          </select>

          {/* Search */}
          <div className="col-span-2 sm:col-span-1 relative">
            <input
              type="text"
              placeholder="Cari teks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-2 rounded-xl border-2 border-[#1E2149] bg-white text-xs font-bold"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Tabel Bank Soal */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
        <div className="flex items-center justify-between pb-1">
          <span className="text-xs font-display font-black text-gray-500">
            Menampilkan {soalTersaring.length} dari {daftarSoal.length} butir soal
          </span>
        </div>

        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1E2149] text-[#1E2149] font-display font-black">
                <th className="py-2 px-2">ID</th>
                <th className="py-2 px-2">Tipe</th>
                <th className="py-2 px-2">Subtopik</th>
                <th className="py-2 px-2">Level</th>
                <th className="py-2 px-2">Pertanyaan</th>
                <th className="py-2 px-2">Kunci</th>
                <th className="py-2 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {soalTersaring.map((soal) => (
                <tr key={soal.id} className="border-b border-gray-200 hover:bg-amber-50 font-bold">
                  <td className="py-2.5 px-2 font-mono text-[11px] font-black">{soal.id}</td>
                  <td className="py-2.5 px-2 uppercase text-[10px]">{soal.tipe}</td>
                  <td className="py-2.5 px-2 capitalize">{soal.subtopik}</td>
                  <td className="py-2.5 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      soal.level === 'mudah' ? 'bg-emerald-100 text-emerald-800' :
                      soal.level === 'sedang' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {soal.level}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 truncate max-w-xs">{soal.pertanyaan}</td>
                  <td className="py-2.5 px-2 font-black text-[#FF6B35]">{soal.kunci}</td>
                  <td className="py-2.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSoalTerpilih(soal);
                          setModalPratinjauOpen(true);
                        }}
                        title="Pratinjau Kartu"
                        className="p-1 hover:bg-amber-200 rounded text-[#1E2149]"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBukaEdit(soal)}
                        title="Edit Soal"
                        className="p-1 hover:bg-amber-200 rounded text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus soal ${soal.id}?`)) {
                            hapusSoal(soal.id);
                          }
                        }}
                        title="Hapus Soal"
                        className="p-1 hover:bg-red-100 rounded text-[#E5484D]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM TAMBAH / UBAH SOAL */}
      {modalFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card space-y-4 my-auto">
            <h3 className="text-xl font-display font-black text-[#1E2149]">
              {isEditing ? `Edit Soal: ${formId}` : 'Tambah Soal Baru'}
            </h3>

            <form onSubmit={handleSimpanSoal} className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block">Tipe Soal:</label>
                  <select
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as any)}
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                  >
                    <option value="petak">Petak</option>
                    <option value="tantangan">Tantangan</option>
                    <option value="turnamen">Turnamen</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block">Subtopik:</label>
                  <select
                    value={formSubtopik}
                    onChange={(e) => setFormSubtopik(e.target.value as any)}
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                  >
                    <option value="mengenal">Mengenal</option>
                    <option value="senilai">Senilai</option>
                    <option value="membandingkan">Membandingkan</option>
                    <option value="mengurutkan">Mengurutkan</option>
                    <option value="penjumlahan">Penjumlahan</option>
                    <option value="pengurangan">Pengurangan</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block">Level:</label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                  >
                    <option value="mudah">Mudah</option>
                    <option value="sedang">Sedang</option>
                    <option value="sukar">Sukar</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-gray-700 block">TP:</label>
                  <input
                    type="text"
                    value={formTP}
                    onChange={(e) => setFormTP(e.target.value)}
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-gray-700 block">Teks Pertanyaan:</label>
                <textarea
                  rows={2}
                  value={formPertanyaan}
                  onChange={(e) => setFormPertanyaan(e.target.value)}
                  placeholder="Contoh: Berapakah hasil dari 1/4 + 1/2 ?"
                  className="w-full p-2.5 border-2 border-[#1E2149] rounded-xl text-xs font-bold"
                  required
                />
              </div>

              {/* Pilihan Opsi A, B, C, D */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold">Opsi A:</label>
                  <input
                    type="text"
                    value={formOpsi1}
                    onChange={(e) => setFormOpsi1(e.target.value)}
                    placeholder="Contoh: 1/4"
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold">Opsi B:</label>
                  <input
                    type="text"
                    value={formOpsi2}
                    onChange={(e) => setFormOpsi2(e.target.value)}
                    placeholder="Contoh: 2/4"
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold">Opsi C:</label>
                  <input
                    type="text"
                    value={formOpsi3}
                    onChange={(e) => setFormOpsi3(e.target.value)}
                    placeholder="Contoh: 3/4"
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold">Opsi D (Opsional):</label>
                  <input
                    type="text"
                    value={formOpsi4}
                    onChange={(e) => setFormOpsi4(e.target.value)}
                    placeholder="Contoh: 4/4"
                    className="w-full p-2 border-2 border-[#1E2149] rounded-lg text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#FF6B35] block">
                  Kunci Jawaban (Wajib Sama Persis dengan Salah Satu Opsi):
                </label>
                <input
                  type="text"
                  value={formKunci}
                  onChange={(e) => setFormKunci(e.target.value)}
                  placeholder="Contoh: 3/4"
                  className="w-full p-2 border-2 border-[#FF6B35] rounded-xl text-xs font-black text-[#FF6B35]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-gray-700 block">Pembahasan Lengkap:</label>
                <textarea
                  rows={2}
                  value={formPembahasan}
                  onChange={(e) => setFormPembahasan(e.target.value)}
                  placeholder="Penjelasan langkah penyelesaian..."
                  className="w-full p-2.5 border-2 border-[#1E2149] rounded-xl text-xs font-bold"
                />
              </div>

              {formWarning && (
                <div className="p-2.5 bg-amber-100 border-2 border-[#FFB627] rounded-xl text-xs font-bold text-amber-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{formWarning}</span>
                </div>
              )}

              {formError && (
                <div className="p-2.5 bg-red-100 border-2 border-[#E5484D] rounded-xl text-xs font-bold text-[#E5484D]">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <TombolChunky
                  variant="paper"
                  size="sm"
                  onClick={() => setModalFormOpen(false)}
                >
                  Batal
                </TombolChunky>
                <TombolChunky
                  variant="primary"
                  size="sm"
                  type="submit"
                  icon={<Check className="w-4 h-4" />}
                >
                  Simpan Soal
                </TombolChunky>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRATINJAU KARTU SOAL */}
      {modalPratinjauOpen && soalTerpilih && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/70 backdrop-blur-sm">
          <div className="w-full max-w-lg my-auto space-y-3">
            <div className="flex justify-between items-center text-white text-xs font-bold">
              <span>Pratinjau Tampilan Siswa:</span>
              <button
                type="button"
                onClick={() => setModalPratinjauOpen(false)}
                className="px-3 py-1 bg-white text-[#1E2149] rounded-xl font-black"
              >
                Tutup
              </button>
            </div>
            <KartuSoal
              id={soalTerpilih.id}
              tipe={soalTerpilih.tipe}
              subtopik={soalTerpilih.subtopik.toUpperCase()}
              level={soalTerpilih.level}
              tp={soalTerpilih.tp}
              pertanyaan={soalTerpilih.pertanyaan}
              visual={soalTerpilih.visual}
              opsi={soalTerpilih.opsi}
              kunci={soalTerpilih.kunci}
              pembahasan={soalTerpilih.pembahasan}
            />
          </div>
        </div>
      )}
    </div>
  );
};
