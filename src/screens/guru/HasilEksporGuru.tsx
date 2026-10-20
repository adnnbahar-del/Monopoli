import React, { useState } from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { TombolChunky } from '../../components/TombolChunky';
import {
  Download,
  AlertCircle,
  CloudUpload,
  ExternalLink,
  Wifi,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import {
  kirimRekapNilaiKeSheets,
  testKoneksiSheets,
  getSpreadsheetUrl,
  BarisNilaiSiswa
} from '../../engine/sheetsService';

export const HasilEksporGuru: React.FC = () => {
  const { daftarSiswa, daftarTim, daftarMeja, skorTurnamen } = useKelasStore();
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [testingKoneksi, setTestingKoneksi] = useState(false);
  const [statusSheets, setStatusSheets] = useState<{
    tipe: 'success' | 'error' | 'info';
    pesan: string;
  } | null>(null);

  const spreadsheetUrl = getSpreadsheetUrl();

  // Perhitungan Soal Tersulit (Simulasi / Berdasarkan riwayat)
  const soalTersulitList = [
    { tp: 'TP6', topik: 'Pengurangan Pecahan Berbeda Penyebut', benarPersen: 45 },
    { tp: 'TP5', topik: 'Penjumlahan Pecahan Berbeda Penyebut', benarPersen: 55 },
    { tp: 'TP3', topik: 'Membandingkan Pecahan', benarPersen: 68 }
  ];

  // Siapkan Data Baris Siswa
  const susunBarisSiswa = (): BarisNilaiSiswa[] => {
    const nowStr = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    return daftarSiswa.map((siswa) => {
      const tim = daftarTim.find((t) => t.anggotaIds.includes(siswa.id));
      const meja = daftarMeja.find((m) => m.anggotaIds.includes(siswa.id));
      const skor = skorTurnamen[siswa.id];

      return {
        waktu: nowStr,
        nama: siswa.nama,
        tim: tim ? tim.nama : '-',
        meja: meja ? meja.nama : '-',
        poinMonopoli: skor ? skor.poinMonopoli : 0,
        poinDuel: skor ? skor.poinDuel : 0,
        totalPoinSiswa: skor ? skor.totalPoinSiswa : 0,
        poinTurnamen: skor ? skor.poinTurnamen : 0,
        peringkatMeja: skor ? skor.peringkatMeja || '-' : '-'
      };
    });
  };

  // Handler Ekspor CSV Lokal
  const handleEksporCSV = () => {
    const headers = ['Nama Siswa', 'Tim', 'Meja', 'Poin Monopoli', 'Poin Duel', 'Total Poin', 'Poin Turnamen', 'Peringkat Meja'];
    const baris = susunBarisSiswa().map((b) => [
      `"${b.nama}"`,
      `"${b.tim}"`,
      `"${b.meja}"`,
      b.poinMonopoli,
      b.poinDuel,
      b.totalPoinSiswa,
      b.poinTurnamen,
      b.peringkatMeja
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...baris].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_monepeca_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handler Tes Koneksi Apps Script
  const handleTestKoneksi = async () => {
    setTestingKoneksi(true);
    setStatusSheets(null);
    try {
      const res = await testKoneksiSheets();
      setStatusSheets({
        tipe: res.sukses ? 'success' : 'error',
        pesan: res.pesan
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusSheets({
        tipe: 'error',
        pesan: `Gagal menguji koneksi: ${msg}`
      });
    } finally {
      setTestingKoneksi(false);
    }
  };

  // Handler Kirim ke Google Spreadsheet
  const handleKirimKeSpreadsheet = async () => {
    const data = susunBarisSiswa();
    if (data.length === 0) {
      setStatusSheets({
        tipe: 'error',
        pesan: 'Belum ada data siswa untuk dikirim ke Spreadsheet.'
      });
      return;
    }

    setLoadingSheets(true);
    setStatusSheets(null);
    try {
      const res = await kirimRekapNilaiKeSheets(data);
      setStatusSheets({
        tipe: res.sukses ? 'success' : 'error',
        pesan: res.pesan
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setStatusSheets({
        tipe: 'error',
        pesan: `Terjadi kendala saat mengirim data: ${msg}`
      });
    } finally {
      setLoadingSheets(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Aksi Ekspor */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#2EC4B6] tracking-wider block">
            Analisis Asesmen Formatif & Sinkronisasi Cloud
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Rekap Nilai & Analisis Hasil Belajar
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Pantau ketercapaian TP1–TP7 per siswa dan per tim turnamen secara offline & daring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <TombolChunky
            variant="secondary"
            size="md"
            icon={<Download className="w-5 h-5" />}
            onClick={handleEksporCSV}
          >
            Ekspor CSV
          </TombolChunky>

          <TombolChunky
            variant="primary"
            size="md"
            icon={loadingSheets ? <Loader2 className="w-5 h-5 animate-spin" /> : <CloudUpload className="w-5 h-5" />}
            onClick={handleKirimKeSpreadsheet}
            disabled={loadingSheets}
          >
            {loadingSheets ? 'Mengirim...' : 'Kirim ke Spreadsheet'}
          </TombolChunky>
        </div>
      </div>

      {/* Kartu Integrasi Google Sheets Backend (FASE 5B) */}
      <div className="p-5 sm:p-6 rounded-card bg-gradient-to-r from-emerald-50 to-teal-50 border-4 border-[#2EC4B6] shadow-soft-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2EC4B6]/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2EC4B6] text-white flex items-center justify-center shadow-xs">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-[#1E2149]">
                Koneksi Google Spreadsheet & Apps Script
              </h3>
              <p className="text-xs font-bold text-gray-600">
                Penyimpanan nilai otomatis ke Google Sheets guru tanpa server berbayar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestKoneksi}
              disabled={testingKoneksi}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-gray-50 text-[#1E2149] border-2 border-[#1E2149] font-display font-black text-xs flex items-center gap-1.5 shadow-xs transition-all active:translate-y-0.5"
            >
              {testingKoneksi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5 text-[#2EC4B6]" />}
              <span>{testingKoneksi ? 'Menguji...' : 'Tes Koneksi'}</span>
            </button>

            <a
              href={spreadsheetUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#1E2149] hover:bg-[#2b2f66] text-white font-display font-black text-xs flex items-center gap-1.5 shadow-xs transition-all active:translate-y-0.5"
            >
              <span>Buka Spreadsheet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Status Alert Banner jika ada interaksi */}
        {statusSheets && (
          <div
            className={`p-3 rounded-xl border-2 flex items-start gap-2.5 text-xs font-bold ${
              statusSheets.tipe === 'success'
                ? 'bg-emerald-100/80 border-emerald-500 text-emerald-900'
                : 'bg-red-100/80 border-red-500 text-red-900'
            }`}
          >
            {statusSheets.tipe === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 leading-relaxed">
              {statusSheets.pesan}
            </div>
          </div>
        )}
      </div>

      {/* Kartu Ringkasan Soal Tersulit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {soalTersulitList.map((item, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border-2 border-[#1E2149] shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-black">
                {item.tp}
              </span>
              <span className="text-xs font-black text-[#E5484D] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {item.benarPersen}% Benar
              </span>
            </div>
            <h4 className="font-display font-black text-xs text-[#1E2149] leading-snug">
              {item.topik}
            </h4>
            <p className="text-[11px] font-bold text-gray-500">
              Perlu penguatan konsep penyamaan penyebut dengan KPK.
            </p>
          </div>
        ))}
      </div>

      {/* Tabel Lengkap Rekap Nilai Siswa */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
        <h3 className="font-display font-black text-base text-[#1E2149]">
          Rekap Nilai Siswa ({daftarSiswa.length} Siswa):
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1E2149] text-[#1E2149] font-display font-black">
                <th className="py-2 px-2">Nama</th>
                <th className="py-2 px-2">Kemampuan</th>
                <th className="py-2 px-2">Tim</th>
                <th className="py-2 px-2">Meja</th>
                <th className="py-2 px-2 text-right">Poin Monopoli</th>
                <th className="py-2 px-2 text-right">Poin Duel</th>
                <th className="py-2 px-2 text-right">Poin Turnamen</th>
              </tr>
            </thead>
            <tbody>
              {daftarSiswa.map((siswa) => {
                const tim = daftarTim.find((t) => t.anggotaIds.includes(siswa.id));
                const meja = daftarMeja.find((m) => m.anggotaIds.includes(siswa.id));
                const skor = skorTurnamen[siswa.id];

                return (
                  <tr key={siswa.id} className="border-b border-gray-200 hover:bg-amber-50 font-bold">
                    <td className="py-2.5 px-2 font-display font-black text-[#1E2149]">{siswa.nama}</td>
                    <td className="py-2.5 px-2 capitalize">{siswa.kemampuan}</td>
                    <td className="py-2.5 px-2">{tim ? tim.nama : '-'}</td>
                    <td className="py-2.5 px-2">{meja ? meja.nama : '-'}</td>
                    <td className="py-2.5 px-2 text-right">{skor ? skor.poinMonopoli : 0}</td>
                    <td className="py-2.5 px-2 text-right">{skor ? skor.poinDuel : 0}</td>
                    <td className="py-2.5 px-2 text-right font-black text-[#FF6B35]">
                      {skor ? skor.poinTurnamen : 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
