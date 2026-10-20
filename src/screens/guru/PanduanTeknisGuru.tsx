import React from 'react';
import { TombolChunky } from '../../components/TombolChunky';
import { useGuruStore } from '../../store/guruStore';
import { useKelasStore } from '../../store/kelasStore';
import { usePengaturanStore } from '../../store/pengaturanStore';
import {
  Download,
  Upload,
  WifiOff,
  Smartphone,
  HardDrive,
  HelpCircle,
} from 'lucide-react';

export const PanduanTeknisGuru: React.FC = () => {
  const guruState = useGuruStore.getState();
  const kelasState = useKelasStore.getState();
  const pengaturanState = usePengaturanStore.getState();

  // Backup Seluruh Data Aplikasi ke 1 File JSON
  const handleBackupSeluruhData = () => {
    const backupObj = {
      tanggal: new Date().toISOString(),
      versi: '1.0',
      guru: {
        pinGuru: guruState.pinGuru,
        sudahGantiPinAwal: guruState.sudahGantiPinAwal,
        daftarSoal: guruState.daftarSoal,
        kustomNamaKios: guruState.kustomNamaKios,
        kustomNamaZona: guruState.kustomNamaZona
      },
      kelas: {
        daftarSiswa: kelasState.daftarSiswa,
        daftarTim: kelasState.daftarTim,
        daftarMeja: kelasState.daftarMeja,
        skorTurnamen: kelasState.skorTurnamen
      },
      pengaturan: {
        volumeMusik: pengaturanState.volumeMusik,
        volumeSFX: pengaturanState.volumeSFX,
        durasiSesiMenit: pengaturanState.durasiSesiMenit,
        ukuranTeks: pengaturanState.ukuranTeks,
        kontrasTinggi: pengaturanState.kontrasTinggi,
        ambangSuperTeam: pengaturanState.ambangSuperTeam,
        ambangGreatTeam: pengaturanState.ambangGreatTeam,
        ambangGoodTeam: pengaturanState.ambangGoodTeam
      }
    };

    const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObj, null, 2));
    const a = document.createElement('a');
    a.href = str;
    a.download = `monepeca_full_backup_${Date.now()}.json`;
    a.click();
  };

  // Restore Seluruh Data dari File JSON
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (data.guru?.daftarSoal) {
          useGuruStore.setState({
            pinGuru: data.guru.pinGuru || '1234',
            sudahGantiPinAwal: data.guru.sudahGantiPinAwal || false,
            daftarSoal: data.guru.daftarSoal,
            kustomNamaKios: data.guru.kustomNamaKios || {},
            kustomNamaZona: data.guru.kustomNamaZona || {}
          });
        }

        if (data.kelas?.daftarSiswa) {
          useKelasStore.setState({
            daftarSiswa: data.kelas.daftarSiswa,
            daftarTim: data.kelas.daftarTim || [],
            daftarMeja: data.kelas.daftarMeja || [],
            skorTurnamen: data.kelas.skorTurnamen || {}
          });
        }

        alert('Data aplikasi berhasil dipulihkan (Restore Sukses)!');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'File tidak valid';
        alert(`Gagal memulihkan data: ${msg}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* 1. Backup & Restore Data Menyeluruh */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-4">
        <div className="flex items-center gap-2 border-b-2 border-[#1E2149]/20 pb-3">
          <HardDrive className="w-6 h-6 text-[#FF6B35]" />
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Cadangkan & Pulihkan Seluruh Data (Backup & Restore)
          </h2>
        </div>

        <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
          Semua data permainan (bank soal, daftar siswa, tim, meja, skor, dan pengaturan) tersimpan secara lokal di browser perangkat Anda. Simpan salinan cadangan ke satu file JSON agar aman bila browser dibersihkan.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <TombolChunky
            variant="primary"
            size="md"
            icon={<Download className="w-5 h-5" />}
            onClick={handleBackupSeluruhData}
          >
            Cadangkan Semua Data (.json)
          </TombolChunky>

          <label className="cursor-pointer inline-flex items-center">
            <span className="h-14 min-h-[56px] px-6 rounded-[20px] bg-[#2EC4B6] hover:bg-[#25A99D] text-white border-2 border-[#1E2149] shadow-[0_6px_0_#1B8C81] active:shadow-[0_2px_0_#1B8C81] active:translate-y-[4px] inline-flex items-center justify-center gap-2 font-display font-extrabold text-lg select-none transition-all">
              <Upload className="w-5 h-5" />
              <span>Pulihkan Data (.json)</span>
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 2. Panduan Penggunaan Offline & PWA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <Smartphone className="w-5 h-5 text-[#2EC4B6]" />
            <h3 className="font-display font-black text-base text-[#1E2149]">
              Cara Pasang Aplikasi (Install PWA)
            </h3>
          </div>
          <ul className="text-xs font-bold text-gray-700 space-y-2 leading-relaxed">
            <li>1. <strong>Di Laptop/Komputer (Chrome / Edge):</strong> Klik ikon tanda unduh/instal di sisi kanan bilah alamat (address bar), lalu pilih <em>"Instal MONOPECA"</em>.</li>
            <li>2. <strong>Di HP / Tablet Android:</strong> Buka di Google Chrome, ketuk ikon titik tiga (kanan atas), lalu pilih <em>"Tambahkan ke Layar Utama" (Add to Home screen)</em>.</li>
            <li>3. Aplikasi akan memiliki ikon sendiri di desktop/layar HP dan terbuka dalam mode layar penuh tanpa bilah peramban.</li>
          </ul>
        </div>

        <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
            <WifiOff className="w-5 h-5 text-[#FF6B35]" />
            <h3 className="font-display font-black text-base text-[#1E2149]">
              Cara Menggunakan 100% Offline
            </h3>
          </div>
          <ul className="text-xs font-bold text-gray-700 space-y-2 leading-relaxed">
            <li>1. Buka aplikasi MONOPECA satu kali saat ada koneksi internet.</li>
            <li>2. Teknologi Service Worker PWA akan otomatis mengunduh dan menyimpan semua berkas (font Baloo 2, Nunito, SVG, audio, dan soal).</li>
            <li>3. Setelah itu, putuskan koneksi internet. Aplikasi akan tetap berjalan 100% lancar tanpa internet, tanpa kuota, dan tanpa iklan!</li>
          </ul>
        </div>
      </div>

      {/* 3. Kebutuhan Perangkat Minimum */}
      <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-3">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <HelpCircle className="w-5 h-5 text-[#FFB627]" />
          <h3 className="font-display font-black text-base text-[#1E2149]">
            Kebutuhan Perangkat Minimum (Spesifikasi Standar Sekolah)
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-gray-700">
          <div className="p-3 bg-white rounded-xl border border-gray-300">
            <span className="font-black text-[#1E2149] block mb-1">Peramban (Browser):</span>
            Google Chrome v90+, Microsoft Edge v90+, Mozilla Firefox v90+, Chrome Android v90+.
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-300">
            <span className="font-black text-[#1E2149] block mb-1">Perangkat Keras:</span>
            RAM minimal 2 GB, layar sentuh (HP/tablet) atau mouse/touchpad (laptop), resolusi layar min 360 px.
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-300">
            <span className="font-black text-[#1E2149] block mb-1">Penyimpanan:</span>
            Penyimpanan bebas minimal 20 MB di perangkat untuk cache PWA dan database lokal.
          </div>
        </div>
      </div>
    </div>
  );
};
