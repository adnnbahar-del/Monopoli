import React from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { TombolChunky } from '../../components/TombolChunky';
import { Download, AlertCircle } from 'lucide-react';

export const HasilEksporGuru: React.FC = () => {
  const { daftarSiswa, daftarTim, daftarMeja, skorTurnamen } = useKelasStore();


  // Perhitungan Soal Tersulit (Simulasi / Berdasarkan riwayat)
  const soalTersulitList = [
    { tp: 'TP6', topik: 'Pengurangan Pecahan Berbeda Penyebut', benarPersen: 45 },
    { tp: 'TP5', topik: 'Penjumlahan Pecahan Berbeda Penyebut', benarPersen: 55 },
    { tp: 'TP3', topik: 'Membandingkan Pecahan', benarPersen: 68 }
  ];

  // Handler Ekspor CSV
  const handleEksporCSV = () => {
    const headers = ['Nama Siswa', 'Tim', 'Meja', 'Poin Monopoli', 'Poin Duel', 'Total Poin', 'Poin Turnamen', 'Peringkat Meja'];
    const rows = daftarSiswa.map((siswa) => {
      const tim = daftarTim.find((t) => t.anggotaIds.includes(siswa.id));
      const meja = daftarMeja.find((m) => m.anggotaIds.includes(siswa.id));
      const skor = skorTurnamen[siswa.id];

      return [
        `"${siswa.nama}"`,
        `"${tim ? tim.nama : '-'}"`,
        `"${meja ? meja.nama : '-'}"`,
        skor ? skor.poinMonopoli : 0,
        skor ? skor.poinDuel : 0,
        skor ? skor.totalPoinSiswa : 0,
        skor ? skor.poinTurnamen : 0,
        skor ? skor.peringkatMeja || '-' : '-'
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_nilai_monepeca_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Aksi Ekspor CSV */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#2EC4B6] tracking-wider block">
            Analisis Asesmen Formatif
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Rekap Nilai & Analisis Hasil Belajar
          </h2>
          <p className="text-xs font-bold text-gray-600 mt-1">
            Pantau ketercapaian TP1–TP7 per siswa dan per tim turnamen.
          </p>
        </div>

        <TombolChunky
          variant="primary"
          size="md"
          icon={<Download className="w-5 h-5" />}
          onClick={handleEksporCSV}
        >
          Ekspor CSV (Excel)
        </TombolChunky>
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
