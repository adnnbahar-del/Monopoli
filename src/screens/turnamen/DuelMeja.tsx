import React, { useState, useMemo } from 'react';
import { useKelasStore } from '../../store/kelasStore';
import { SEMUA_SOAL, Soal, acakOpsi } from '../../engine/kartu';
import { encodeKodeHasilMeja, konversiPoinTurnamen, HasilMejaRingkas } from '../../engine/turnamen';
import { KartuSoal } from '../../components/KartuSoal';
import { TombolChunky } from '../../components/TombolChunky';
import { Bidak } from '../../components/Bidak';
import { PakPeca } from '../../components/PakPeca';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { ArrowLeft, CheckCircle, QrCode } from 'lucide-react';

export interface DuelMejaProps {
  mejaId: string;
  onSelesaiDuel: () => void;
  onKembaliKeMeja: () => void;
}

export const DuelMeja: React.FC<DuelMejaProps> = ({
  mejaId,
  onSelesaiDuel,
  onKembaliKeMeja
}) => {
  const { daftarSiswa, daftarTim, daftarMeja, simpanSkorMeja } = useKelasStore();
  const meja = daftarMeja.find((m) => m.id === mejaId) || daftarMeja[0];
  const anggota = daftarSiswa.filter((s) => meja.anggotaIds.includes(s.id));

  // Ambil 5 butir soal turnamen sesuai paket (A, B, atau C)
  const bankSoalPaket = useMemo(() => {
    return SEMUA_SOAL.filter(
      (s) => s.tipe === 'turnamen' && s.paket === meja.paketSoal
    ).slice(0, 5);
  }, [meja.paketSoal]);

  const [nomorSoal, setNomorSoal] = useState(0); // 0 - 4
  const [giliranPemainIndex, setGiliranPemainIndex] = useState(0);
  const [skorDuel, setSkorDuel] = useState<Record<string, number>>({});
  const [poinMonopoli, setPoinMonopoli] = useState<Record<string, number>>({});
  const [sudahSelesai, setSudahSelesai] = useState(false);
  const [kodeHasilMeja, setKodeHasilMeja] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const soalAktif: Soal = bankSoalPaket[nomorSoal];
  const siswaAktif = anggota[giliranPemainIndex % anggota.length];
  const timSiswaAktif = daftarTim.find((t) => t.anggotaIds.includes(siswaAktif?.id));

  // Stabilkan urutan opsi per soal
  const opsiTerkocok = useMemo(() => {
    return soalAktif ? acakOpsi(soalAktif.opsi) : [];
  }, [soalAktif?.id]);

  const handleJawab = (_opsi: string, benar: boolean) => {
    if (!soalAktif || !siswaAktif) return;

    if (benar) {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      const poin = soalAktif.level === 'sukar' ? 30 : 20;
      setSkorDuel((prev) => ({
        ...prev,
        [siswaAktif.id]: (prev[siswaAktif.id] || 0) + poin
      }));
    }
  };

  const handleLanjutKeSoalBerikutnya = () => {
    if (nomorSoal < bankSoalPaket.length - 1) {
      setNomorSoal((prev) => prev + 1);
      setGiliranPemainIndex((prev) => prev + 1);
    } else {
      // Selesai seluruh 5 butir soal duel
      selesaikanSesiDuel();
    }
  };

  const selesaikanSesiDuel = () => {
    const skorList = anggota.map((s) => ({
      siswaId: s.id,
      poinMonopoli: poinMonopoli[s.id] || 40, // default poin monopoli jika tidak diubah
      poinDuel: skorDuel[s.id] || 0
    }));

    simpanSkorMeja(meja.id, skorList);

    // Hitung konversi poin turnamen (60/40/30/20 atau 60/40/20)
    const totalList = skorList.map((s) => ({
      siswaId: s.siswaId,
      totalSkor: s.poinMonopoli + s.poinDuel
    }));
    const hasilKonversi = konversiPoinTurnamen(totalList);

    const hasilRingkas: HasilMejaRingkas = {
      mejaId: meja.id,
      nomorMeja: meja.nomor,
      skorPemain: hasilKonversi.map((k) => {
        const tim = daftarTim.find((t) => t.anggotaIds.includes(k.siswaId));
        return {
          siswaId: k.siswaId,
          timId: tim ? tim.id : '',
          poinTurnamen: k.poinTurnamen
        };
      })
    };

    const kode = encodeKodeHasilMeja(hasilRingkas);
    setKodeHasilMeja(kode);

    // Buat QR Code
    QRCode.toDataURL(kode, { margin: 1, width: 180 }, (_err, url) => {
      if (url) setQrDataUrl(url);
    });

    setSudahSelesai(true);
  };

  // JIKA DUEL SELESAI -> TAMPILKAN HASIL MEJA & KODE QR
  if (sudahSelesai) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-6 text-center select-none">
        <PakPeca ekspresi="ceria" size={100} />
        <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149]">
          Duel {meja.nama} Selesai!
        </h2>
        <p className="text-sm font-bold text-gray-700">
          Seluruh 5 soal duel paket {meja.paketSoal} telah selesai dijawab. Poin turnamen telah otomatis dikonversikan.
        </p>

        {/* Tabel Ringkasan Poin Meja */}
        <div className="space-y-2 text-left bg-white p-4 rounded-2xl border-2 border-[#1E2149]">
          <span className="text-xs font-display font-black uppercase text-gray-500 block">
            Hasil Poin Turnamen Meja Ini:
          </span>
          {anggota.map((s) => {
            const tim = daftarTim.find((t) => t.anggotaIds.includes(s.id));
            const pMono = poinMonopoli[s.id] || 40;
            const pDuel = skorDuel[s.id] || 0;
            const total = pMono + pDuel;

            return (
              <div key={s.id} className="flex items-center justify-between text-xs sm:text-sm font-bold py-1 border-b border-gray-100 last:border-none">
                <div className="flex items-center gap-2">
                  {tim && <Bidak warna={tim.warna} bentuk={tim.bentuk} size={20} />}
                  <span>{s.nama} ({tim ? tim.nama : ''})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Total: {total}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Kode Hasil Meja & QR Code untuk Multi-perangkat offline */}
        <div className="p-4 bg-teal-50 rounded-2xl border-2 border-[#2EC4B6] space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-display font-black text-[#1E2149]">
            <QrCode className="w-5 h-5 text-[#2EC4B6]" />
            <span>Kode Hasil Meja (Multi-Perangkat Offline)</span>
          </div>

          {qrDataUrl && (
            <div className="flex justify-center">
              <img src={qrDataUrl} alt="QR Code Hasil Meja" className="rounded-xl border-2 border-[#1E2149]" />
            </div>
          )}

          <div className="bg-white p-2 rounded-xl border border-gray-300 font-mono text-[11px] break-all select-all">
            {kodeHasilMeja}
          </div>
          <p className="text-[11px] font-bold text-gray-600">
            Pindai QR ini atau salin kodenya ke Panel Guru jika menggunakan perangkat berbeda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <TombolChunky
            variant="paper"
            size="md"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={onKembaliKeMeja}
          >
            Kembali ke Daftar Meja
          </TombolChunky>
          <TombolChunky
            variant="primary"
            size="md"
            icon={<CheckCircle className="w-5 h-5" />}
            onClick={onSelesaiDuel}
          >
            Lihat Penghargaan (Podium)
          </TombolChunky>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 select-none">
      {/* Header Info Duel */}
      <div className="p-4 sm:p-5 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-display font-black uppercase text-[#FF6B35]">
            {meja.nama} • Paket {meja.paketSoal}
          </span>
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1E2149]">
            Duel Turnamen — Soal {nomorSoal + 1} dari 5
          </h2>
        </div>

        {siswaAktif && (
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-[#1E2149]">
            {timSiswaAktif && (
              <Bidak warna={timSiswaAktif.warna} bentuk={timSiswaAktif.bentuk} size={26} />
            )}
            <div>
              <div className="text-[10px] font-bold text-gray-500">Giliran Menjawab:</div>
              <div className="text-xs sm:text-sm font-display font-black text-[#1E2149]">
                {siswaAktif.nama}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tampilan Kartu Soal Duel */}
      {soalAktif && (
        <KartuSoal
          key={`${meja.id}_soal_${nomorSoal}_${soalAktif.id}`}
          id={soalAktif.id}
          tipe="turnamen"
          subtopik={soalAktif.subtopik.toUpperCase()}
          level={soalAktif.level}
          tp={soalAktif.tp}
          pertanyaan={soalAktif.pertanyaan}
          visual={soalAktif.visual}
          opsi={opsiTerkocok}
          kunci={soalAktif.kunci}
          pembahasan={soalAktif.pembahasan}
          isFlippedInitial={true}
          autoLanjutDetik={5}
          onJawab={handleJawab}
          onLanjut={handleLanjutKeSoalBerikutnya}
          teksLanjut={
            nomorSoal < bankSoalPaket.length - 1
              ? `Lanjut: Soal ${nomorSoal + 2} dari 5`
              : 'Selesai & Lihat Hasil Duel Meja'
          }
        />
      )}

      {/* Input Opsional Poin Monopoli */}
      <div className="p-4 rounded-2xl bg-[#FFF8EC] border-3 border-[#1E2149] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-gray-700">
        <span>Skor Ronde Monopoli (Default 40, bisa disesuaikan):</span>
        <div className="flex flex-wrap gap-2">
          {anggota.map((s) => (
            <label key={s.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-300">
              <span className="truncate max-w-[70px]">{s.nama.split(' ')[0]}:</span>
              <input
                type="number"
                min="0"
                value={poinMonopoli[s.id] !== undefined ? poinMonopoli[s.id] : 40}
                onChange={(e) => setPoinMonopoli({ ...poinMonopoli, [s.id]: parseInt(e.target.value) || 0 })}
                className="w-12 text-center border rounded font-black"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
