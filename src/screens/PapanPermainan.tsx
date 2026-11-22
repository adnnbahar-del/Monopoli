import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Papan } from '../components/Papan';
import { PanelPemain } from '../components/papan/PanelPemain';
import { TimerArena, KontrolArena, KartuPetakAktif } from '../components/papan/PanelKontrol';
import { useLayarPenuh } from '../hooks/useLayarPenuh';
import { useSuaraPapan } from '../hooks/useSuaraPapan';
import { usePengaturanStore } from '../store/pengaturanStore';
import { audio } from '../engine/audioManager';
import { useGameStore } from '../store/gameStore';
import { DialogRamah } from '../components/DialogRamah';
import { Toast } from '../components/Toast';
import { DAFTAR_PETAK, PetakData } from '../data/papan';
import { TombolChunky } from '../components/TombolChunky';
import { KartuSoal } from '../components/KartuSoal';
import { PakPeca } from '../components/PakPeca';
import {
  ambilSoalPetak,
  ambilSoalTantangan,
  ambilKartuKesempatan,
  hitungPoinKios,
  Soal
} from '../engine/kartu';
import { KartuKesempatanData } from '../data/kesempatan';
import { Rekap, JawabanDetail } from './Rekap';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  LogOut,
  Users,
  Trophy,
  Flame
} from 'lucide-react';

export interface PapanPermainanProps {
  onKeluarKeBeranda: () => void;
}

export const PapanPermainan: React.FC<PapanPermainanProps> = ({
  onKeluarKeBeranda
}) => {
  const {
    pemain,
    giliranIndex,
    kepemilikan,
    sisaDetik,
    jeda,
    sudahSelesai,
    sedangMelangkah,
    angkaDadu,
    petakAktif,
    pesanNotifikasi,
    soalTerpakai,
    kocokDanJalankan,
    setJeda,
    kurangiTimer,
    resetGame,
    gantiGiliran,
    tambahPoinPemain,
    kurangPoinPemain,
    beliKios,
    tingkatkanKios,
    selesaikanGame,
    aksiPetakTertunda,
    bersihkanAksiPetakTertunda
  } = useGameStore();

  const [dialogJedaOpen, setDialogJedaOpen] = useState(false);
  const [dialogKeluarOpen, setDialogKeluarOpen] = useState(false);
  const [petakDetail, setPetakDetail] = useState<PetakData | null>(null);
  // Petak tempat soal/aksi berasal — dikunci saat bidak mendarat, terpisah dari petak
  // yang sedang dilihat (petakDetail) agar hasil jawaban selalu diterapkan ke petak yang benar.
  const [petakSoal, setPetakSoal] = useState<PetakData | null>(null);

  // State Modal Interaksi Soal & Kesempatan
  const [soalAktif, setSoalAktif] = useState<Soal | null>(null);
  const [opsiAktif, setOpsiAktif] = useState<string[]>([]);
  const [modeSoal, setModeSoal] = useState<'kios_kosong' | 'uji_pemilik' | 'tingkatkan' | 'tantangan' | null>(null);
  const [kartuKesempatanAktif, setKartuKesempatanAktif] = useState<KartuKesempatanData | null>(null);
  const [riwayatJawaban, setRiwayatJawaban] = useState<JawabanDetail[]>([]);

  // Timer Diskusi Tim 30 Detik
  const [sisaDiskusi, setSisaDiskusi] = useState<number | null>(null);
  // Timer Soal Tantangan 90 Detik
  const [sisaTantangan, setSisaTantangan] = useState<number | null>(null);

  // Timer Utama Sesi Permainan
  useEffect(() => {
    if (jeda || sudahSelesai) return;
    const interval = setInterval(() => {
      kurangiTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [jeda, sudahSelesai, kurangiTimer]);

  // Timer Diskusi Tim Countdown
  useEffect(() => {
    if (sisaDiskusi === null || sisaDiskusi <= 0 || jeda) return;
    const t = setInterval(() => {
      setSisaDiskusi((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [sisaDiskusi, jeda]);

  // Timer Tantangan Waktu 90 Detik Countdown
  useEffect(() => {
    if (sisaTantangan === null || sisaTantangan <= 0 || jeda) return;
    const t = setInterval(() => {
      setSisaTantangan((prev) => (prev !== null && prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [sisaTantangan, jeda]);

  const pemainAktif = pemain[giliranIndex];
  const petakDataAktif = petakDetail || (petakAktif !== null ? DAFTAR_PETAK[petakAktif] : DAFTAR_PETAK[0]);

  // ── Lapisan presentasi (tidak menyentuh logika permainan) ──
  const kurangiGerak = useReducedMotion() ?? false;
  const [mode3D, setMode3D] = useState(true);
  const [pesanUtilitas, setPesanUtilitas] = useState<string | null>(null);
  const layarPenuh = useLayarPenuh();
  const bisu = usePengaturanStore((s) => s.bisu);
  const toggleBisu = usePengaturanStore((s) => s.toggleBisu);
  useSuaraPapan(pemain, giliranIndex, sedangMelangkah);

  useEffect(() => {
    if (!pesanUtilitas) return;
    const t = setTimeout(() => setPesanUtilitas(null), 3000);
    return () => clearTimeout(t);
  }, [pesanUtilitas]);

  const handleToggleSuara = () => {
    if (bisu) {
      audio.setBisu(false);
      audio.putar('klik_tombol');
    }
    toggleBisu();
  };

  const handleLayarPenuh = async () => {
    audio.putar('klik_tombol');
    if (!layarPenuh.didukung) {
      setPesanUtilitas('Layar penuh tidak didukung browser ini.');
      return;
    }
    const ok = await layarPenuh.toggle();
    if (!ok) setPesanUtilitas('Browser menolak mode layar penuh.');
  };

  // Trigger Melempar Dadu
  const handleLemparDadu = () => {
    if (sedangMelangkah || jeda || soalAktif || kartuKesempatanAktif) return;

    kocokDanJalankan(
      (_posSementara) => {},
      (posAkhir) => {
        const petakTujuan = DAFTAR_PETAK[posAkhir];
        setPetakDetail(petakTujuan);
        prosesAksiPetak(petakTujuan);
      }
    );
  };

  // Logika Aksi Petak Berdasarkan Jenisnya
  const prosesAksiPetak = (petak: PetakData) => {
    setPetakSoal(petak);
    // 1. PETAK KIOS
    if (petak.jenis === 'kios' && petak.subtopik) {
      const pemilik = kepemilikan[petak.index];

      // A. Kios Kosong
      if (!pemilik) {
        const { soal, opsiAcak } = ambilSoalPetak(petak.subtopik, soalTerpakai);
        setSoalAktif(soal);
        setOpsiAktif(opsiAcak);
        setModeSoal('kios_kosong');
      }
      // B. Kios Milik Sendiri (Tingkatkan Kios)
      else if (pemilik.pemainId === pemainAktif.id) {
        if (pemilik.bintang < 2) {
          const { soal, opsiAcak } = ambilSoalPetak(petak.subtopik, soalTerpakai, 'sukar');
          setSoalAktif(soal);
          setOpsiAktif(opsiAcak);
          setModeSoal('tingkatkan');
        } else {
          // Sudah bintang 2 maksimum
          useGameStore.setState({ pesanNotifikasi: 'Kiosmu sudah mencapai level maksimum (Bintang 2)!' });
        }
      }
      // C. Kios Milik Lawan ("Uji Pemilik")
      else {
        const { soal, opsiAcak } = ambilSoalPetak(petak.subtopik, soalTerpakai);
        setSoalAktif(soal);
        setOpsiAktif(opsiAcak);
        setModeSoal('uji_pemilik');
      }
    }
    // 2. PETAK KESEMPATAN
    else if (petak.jenis === 'kesempatan') {
      const k = ambilKartuKesempatan();
      setKartuKesempatanAktif(k);
    }
    // 3. PETAK TANTANGAN
    else if (petak.jenis === 'tantangan') {
      const { soal, opsiAcak } = ambilSoalTantangan(soalTerpakai);
      setSoalAktif(soal);
      setOpsiAktif(opsiAcak);
      setModeSoal('tantangan');
      setSisaTantangan(90); // 90 detik
    }
    // 4. PETAK SUDUT
    else if (petak.jenis === 'sudut') {
      if (petak.index === 14) {
        // Pojok Baca (+5 poin)
        tambahPoinPemain(pemainAktif.id, 5);
        useGameStore.setState({ pesanNotifikasi: 'Pojok Baca Sukaraja! Membaca ringkasan materi +5 Poin!' });
      } else if (petak.index === 21) {
        // Pantai Semaka (Semua anggota tim +5 poin)
        pemain.forEach((p) => {
          if (p.timId === pemainAktif.timId) {
            tambahPoinPemain(p.id, 5);
          }
        });
        useGameStore.setState({ pesanNotifikasi: `Pantai Semaka! Semua anggota ${pemainAktif.timNama} mendapat +5 Poin!` });
      } else if (petak.index === 7) {
        useGameStore.setState({ pesanNotifikasi: 'Saung Kopi! Beristirahat sejenak dengan aman.' });
      }
    }
  };

  // Pemulihan: bila sesi dimuat ulang di tengah langkah, store menyelesaikan langkahnya
  // dan menandai petak tujuan — jalankan aksi petak itu sama seperti pendaratan normal.
  const aksiPulihDiproses = useRef<number | null>(null);
  useEffect(() => {
    if (aksiPetakTertunda === null || sudahSelesai) return;
    // Cegah pemrosesan ganda (StrictMode menjalankan efek dua kali di mode pengembangan)
    if (aksiPulihDiproses.current === aksiPetakTertunda) return;
    aksiPulihDiproses.current = aksiPetakTertunda;
    const petak = DAFTAR_PETAK[aksiPetakTertunda];
    bersihkanAksiPetakTertunda();
    if (!petak) return;
    setPetakDetail(petak);
    prosesAksiPetak(petak);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aksiPetakTertunda]);

  // Handler Jawaban Soal
  const handleJawabSoal = (pilihan: string, benar: boolean) => {
    if (!soalAktif) return;
    const petakTarget = petakSoal ?? petakDataAktif;

    // Catat ke riwayat untuk bahan review
    setRiwayatJawaban((prev) => [
      ...prev,
      {
        soalId: soalAktif.id,
        pertanyaan: soalAktif.pertanyaan,
        kunci: soalAktif.kunci,
        jawabanDipilih: pilihan,
        benar,
        pembahasan: soalAktif.pembahasan,
        tp: soalAktif.tp
      }
    ]);

    // Tandai soal sebagai terpakai
    useGameStore.setState((s) => ({
      soalTerpakai: [...s.soalTerpakai, soalAktif.id]
    }));

    if (benar) {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });

      if (modeSoal === 'kios_kosong') {
        const poin = hitungPoinKios(soalAktif.level);
        tambahPoinPemain(pemainAktif.id, poin);
        beliKios(petakTarget.index, pemainAktif.id);
        useGameStore.setState({ pesanNotifikasi: `Hebat! Kios ${petakTarget.nama} resmi menjadi milikmu (+${poin} Poin)!` });
      } else if (modeSoal === 'uji_pemilik') {
        tambahPoinPemain(pemainAktif.id, 5);
        useGameStore.setState({ pesanNotifikasi: 'Berhasil menguji pemilik kios! Kamu mendapat +5 Poin!' });
      } else if (modeSoal === 'tingkatkan') {
        tingkatkanKios(petakTarget.index);
        useGameStore.setState({ pesanNotifikasi: `Kiosmu meningkat menjadi Bintang 2!` });
      } else if (modeSoal === 'tantangan') {
        tambahPoinPemain(pemainAktif.id, 40);
        useGameStore.setState({ pesanNotifikasi: 'Tantangan 90 detik berhasil ditaklukkan! +40 Poin!' });
      }
    } else {
      // Salah
      if (modeSoal === 'uji_pemilik') {
        const pemilik = kepemilikan[petakTarget.index];
        const sewa = 5 * (pemilik ? pemilik.bintang : 1);
        kurangPoinPemain(pemainAktif.id, sewa);
        if (pemilik) tambahPoinPemain(pemilik.pemainId, sewa);
        useGameStore.setState({ pesanNotifikasi: `Jawaban belum tepat! Bayar sewa ${sewa} poin ke pemilik kios.` });
      } else {
        useGameStore.setState({ pesanNotifikasi: 'Jawaban belum tepat. Pelajari pembahasannya ya!' });
      }
    }

    setSisaDiskusi(null);
    setSisaTantangan(null);
  };

  // Handler Tutup Kartu Soal / Lanjut Giliran
  const handleTutupSoal = () => {
    setSoalAktif(null);
    setPetakSoal(null);
    setModeSoal(null);
    setSisaDiskusi(null);
    setSisaTantangan(null);
    gantiGiliran();
  };

  // Handler Kartu Kesempatan Selesai
  const handleTutupKesempatan = () => {
    if (kartuKesempatanAktif) {
      if (kartuKesempatanAktif.tipeAksi === 'bonus_poin' && kartuKesempatanAktif.nilai) {
        tambahPoinPemain(pemainAktif.id, kartuKesempatanAktif.nilai);
      } else if (kartuKesempatanAktif.tipeAksi === 'bantu_teman' && kartuKesempatanAktif.nilai) {
        tambahPoinPemain(pemainAktif.id, kartuKesempatanAktif.nilai);
      }
    }
    setKartuKesempatanAktif(null);
    gantiGiliran();
  };

  const handleBukaJeda = () => {
    setJeda(true);
    setDialogJedaOpen(true);
  };

  const handleLanjutkanDariJeda = () => {
    setDialogJedaOpen(false);
    setJeda(false);
  };

  const handleKonfirmasiKeluar = () => {
    setDialogKeluarOpen(false);
    setDialogJedaOpen(false);
    onKeluarKeBeranda();
  };

  const handleUlangPermainan = () => {
    resetGame();
    setDialogJedaOpen(false);
    setPetakDetail(null);
    setPetakSoal(null);
    setSoalAktif(null);
    setKartuKesempatanAktif(null);
  };

  // JIKA SESI BERAKHIR -> TAMPILKAN LAYAR REKAP
  if (sudahSelesai) {
    return (
      <Rekap
        pemain={pemain}
        kepemilikan={kepemilikan}
        riwayatJawaban={riwayatJawaban}
        onMainLagi={handleUlangPermainan}
        onKembaliBeranda={onKeluarKeBeranda}
      />
    );
  }

  return (
    <div className="arena-papan min-h-[100dvh] select-none">
      {/* LAYOUT ARENA: Panel Pemain | Papan | Panel Kontrol */}
      <div className="arena-papan-grid">
        {/* 1. PANEL KIRI — PEMAIN & GILIRAN */}
        <div className="arena-kolom-kiri">
          <PanelPemain pemain={pemain} giliranIndex={giliranIndex} kurangiGerak={kurangiGerak} />
        </div>

        {/* 2. AREA UTAMA: PAPAN PERMAINAN 28 PETAK */}
        <main className="arena-kolom-papan" aria-label="Papan permainan">
          <Papan
            pemain={pemain}
            giliranIndex={giliranIndex}
            kepemilikan={kepemilikan}
            petakAktif={petakAktif}
            angkaDadu={angkaDadu}
            sedangMelangkah={sedangMelangkah}
            onLemparDadu={handleLemparDadu}
            onPilihPetak={(petak) => setPetakDetail(petak)}
            mode3D={mode3D}
            kurangiGerak={kurangiGerak}
          />
        </main>

        {/* 3. PANEL KANAN — TIMER, KONTROL & PETAK AKTIF */}
        <aside className="arena-kolom-kanan panel-arena flex flex-col gap-3" aria-label="Kontrol permainan">
          <TimerArena sisaDetik={sisaDetik} jeda={jeda} />
          <KontrolArena
            onJeda={() => {
              audio.putar('klik_tombol');
              handleBukaJeda();
            }}
            layarPenuhAktif={layarPenuh.aktif}
            onLayarPenuh={handleLayarPenuh}
            suaraAktif={!bisu}
            onSuara={handleToggleSuara}
            mode3D={mode3D}
            onMode3D={() => {
              audio.putar('klik_tombol');
              setMode3D((m) => !m);
            }}
          />
          {pesanUtilitas && (
            <p role="status" className="rounded-xl bg-[#101C48] border-2 border-[#FFD45A] px-3 py-2 text-sm font-bold text-white">
              {pesanUtilitas}
            </p>
          )}
          {/* Informasi petak aktif (kondisi & aksi sama seperti sebelumnya) */}
          {petakDataAktif && (
            <KartuPetakAktif
              petak={petakDataAktif}
              sedangMelangkah={sedangMelangkah}
              onLewatiGiliran={() => {
                audio.putar('klik_tombol');
                gantiGiliran();
              }}
            />
          )}
        </aside>
      </div>

      {/* 3. MODAL KARTU SOAL INTERAKTIF (FLIP 3D) */}
      {soalAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-auto space-y-4">
            {/* Header Timer Diskusi / Tantangan */}
            <div className="flex items-center justify-between gap-2">
              {modeSoal === 'tantangan' && sisaTantangan !== null && (
                <div className="px-4 py-2 rounded-2xl bg-[#7B5CFA] border-2 border-[#1E2149] text-white font-display font-black text-sm flex items-center gap-2 shadow-sm animate-pulse">
                  <Flame className="w-5 h-5 text-amber-300" />
                  <span>Tantangan 90 Detik: {sisaTantangan}s</span>
                </div>
              )}

              {modeSoal !== 'tantangan' && (
                <button
                  type="button"
                  onClick={() => setSisaDiskusi(30)}
                  disabled={sisaDiskusi !== null}
                  className="px-4 py-2 rounded-2xl bg-[#FFD23F] hover:bg-[#EBC032] border-2 border-[#1E2149] text-[#1E2149] font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <Users className="w-4 h-4" />
                  <span>{sisaDiskusi !== null ? `Diskusi Tim: ${sisaDiskusi}s` : 'Diskusi Tim (30s)'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleTutupSoal}
                className="px-4 py-2 rounded-2xl bg-white border-2 border-[#1E2149] font-display font-bold text-xs text-[#1E2149] shadow-sm hover:bg-gray-100"
              >
                Selesai / Lanjut
              </button>
            </div>

            {/* Komponen Kartu Soal 3D */}
            <KartuSoal
              key={soalAktif.id}
              id={soalAktif.id}
              tipe={soalAktif.tipe}
              subtopik={soalAktif.subtopik.toUpperCase()}
              level={soalAktif.level}
              tp={soalAktif.tp}
              pertanyaan={soalAktif.pertanyaan}
              visual={soalAktif.visual}
              konteks={soalAktif.konteks}
              opsi={opsiAktif}
              kunci={soalAktif.kunci}
              pembahasan={soalAktif.pembahasan}
              onJawab={handleJawabSoal}
              onLanjut={handleTutupSoal}
              teksLanjut="Selesai & Lanjut Giliran"
            />
          </div>
        </div>
      )}

      {/* 4. MODAL KARTU KESEMPATAN (KERJA SAMA) */}
      {kartuKesempatanAktif && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card text-center space-y-4 relative overflow-hidden">
            <div className="absolute inset-0 tapis-pattern opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <PakPeca ekspresi="semangat" size={100} />

              <span className="text-xs font-display font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FF7EB6] text-white border border-[#1E2149]">
                Kartu Kesempatan
              </span>

              <h2 className="text-2xl font-display font-black text-[#1E2149] mt-2">
                {kartuKesempatanAktif.judul}
              </h2>

              <p className="text-base font-bold text-gray-800 leading-relaxed bg-pink-50 p-4 rounded-2xl border-2 border-[#FF7EB6]">
                {kartuKesempatanAktif.deskripsi}
              </p>

              <div className="pt-3 w-full">
                <TombolChunky
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleTutupKesempatan}
                >
                  Klaim & Lanjut Giliran
                </TombolChunky>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL DIALOG JEDA */}
      <DialogRamah
        open={dialogJedaOpen}
        judul="Permainan Sedang Dijeda"
        pesan="Waktu dan pergerakan bidak dihentikan sementara. Sesi tersimpan aman."
        ekspresiPakPeca="senang"
        teksKonfirmasi="Lanjutkan Permainan"
        onKonfirmasi={handleLanjutkanDariJeda}
      />

      {dialogJedaOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 p-3 rounded-2xl border-3 border-[#1E2149] shadow-lg">
          <TombolChunky
            variant="paper"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleUlangPermainan}
          >
            Ulang Permainan
          </TombolChunky>
          <TombolChunky
            variant="accent"
            size="sm"
            icon={<Trophy className="w-4 h-4" />}
            onClick={() => {
              setDialogJedaOpen(false);
              selesaikanGame();
            }}
          >
            Lihat Rekap Skor
          </TombolChunky>
          <TombolChunky
            variant="danger"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
            onClick={() => setDialogKeluarOpen(true)}
          >
            Simpan & Keluar
          </TombolChunky>
        </div>
      )}

      {/* 6. MODAL DIALOG SIMPAN & KELUAR */}
      <DialogRamah
        open={dialogKeluarOpen}
        judul="Simpan dan Keluar?"
        pesan="Permainanmu akan disimpan di memori perangkat ini. Kamu bisa melanjutkannya kapan saja dari menu Beranda!"
        ekspresiPakPeca="berpikir"
        teksKonfirmasi="Ya, Simpan & Keluar"
        teksBatal="Tetap Main"
        tipe="bahaya"
        onKonfirmasi={handleKonfirmasiKeluar}
        onBatal={() => setDialogKeluarOpen(false)}
      />

      {/* 7. TOAST NOTIFIKASI */}
      <Toast
        show={Boolean(pesanNotifikasi)}
        pesan={pesanNotifikasi || ''}
        tipe="info"
      />
    </div>
  );
};
