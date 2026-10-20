import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavHeader } from '../components/NavHeader';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import {
  Dice5,
  Store,
  Star,
  Users2,
  Trophy,
  BookCheck,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export interface CaraBermainProps {
  onKembali: () => void;
  onBeranda: () => void;
}

export const CaraBermain: React.FC<CaraBermainProps> = ({
  onKembali,
  onBeranda
}) => {
  const [tabAktif, setTabAktif] = useState<'tutorial' | 'aturan'>('tutorial');
  const [stepIndex, setStepIndex] = useState(0);

  const LANGKAH_TUTORIAL = [
    {
      nomor: 1,
      judul: 'Lempar Dadu & Gerakkan Bidak',
      ikon: <Dice5 className="w-8 h-8 text-[#FF6B35]" />,
      isi: 'Pada giliranmu, ketuk dadu 3D untuk melempar dadu (angka 1–6). Bidak pionmu akan melompat petak demi petak mengelilingi papan monopoli sesuai angka dadu.',
      tips: 'Setiap melewati atau berhenti di petak START (Gerbang Sekolah), kamu mendapat bonus +10 poin!'
    },
    {
      nomor: 2,
      judul: 'Jawab Soal di Kios Monopoli',
      ikon: <Store className="w-8 h-8 text-[#2EC4B6]" />,
      isi: 'Saat mendarat di kios kosong, kartu soal pecahan akan terbuka! Level soal diacak (mudah 10 poin, sedang 20 poin, sukar 30 poin). Diskusikan bersama timmu jika tombol diskusi aktif!',
      tips: 'Jawab dengan cermat! Jika benar, kios tersebut akan resmi menjadi milikmu berhiaskan bendera timmu.'
    },
    {
      nomor: 3,
      judul: 'Uji Pemilik & Tingkatkan Kios',
      ikon: <Star className="w-8 h-8 text-[#FFD23F]" />,
      isi: 'Jika mendarat di kios lawan, kamu akan menguji pemiliknya: jika benar dapat +5 poin, jika salah bayar sewa 5 poin ke pemilik kios. Jika mendarat di kios sendiri, kamu bisa meningkatkan kios hingga bintang 2!',
      tips: 'Bintang pada kios menggandakan sewa yang harus dibayar lawan saat mendarat di kiosmu.'
    },
    {
      nomor: 4,
      judul: 'Kartu Kesempatan & Tantangan',
      ikon: <Users2 className="w-8 h-8 text-[#7B5CFA]" />,
      isi: 'Petak Kesempatan memberi kejutan kerja sama (maju petak, lempar dadu lagi, atau bonus bantu teman). Petak Tantangan menguji kecepatanmu menjawab soal dalam waktu 90 detik untuk meraih +40 poin!',
      tips: 'Kartu Kesempatan bernuansa gotong royong dan kejujuran, bukan perjudian.'
    },
    {
      nomor: 5,
      judul: 'Raih Poin & Juara Super Team!',
      ikon: <Trophy className="w-8 h-8 text-[#E5484D]" />,
      isi: 'Permainan berakhir saat durasi sesi habis (default 20 menit) atau seluruh kios terjual. Poin individumu akan dihitung dan disumbangkan untuk peringkat tim (Super Team, Great Team, Good Team).',
      tips: 'Kemenangan di model TGT diraih melalui kekompakan dan kerja sama seluruh anggota tim!'
    }
  ];

  const langkahAktif = LANGKAH_TUTORIAL[stepIndex];

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Cara Bermain MONOPECA"
        subjudul="Panduan Interaktif 5 Langkah dan Ringkasan Aturan Main"
        onKembali={onKembali}
        onBeranda={onBeranda}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Tombol Tab Pilihan: Tutorial 5 Langkah vs Aturan 1 Halaman */}
        <div className="flex rounded-2xl bg-[#FFF8EC] border-4 border-[#1E2149] p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setTabAktif('tutorial')}
            className={`
              flex-1 py-3 rounded-xl font-display font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all
              ${tabAktif === 'tutorial' ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B]' : 'text-[#1E2149] hover:bg-amber-100'}
            `}
          >
            <BookCheck className="w-5 h-5" />
            <span>Tutorial 5 Langkah</span>
          </button>

          <button
            type="button"
            onClick={() => setTabAktif('aturan')}
            className={`
              flex-1 py-3 rounded-xl font-display font-black text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer transition-all
              ${tabAktif === 'aturan' ? 'bg-[#2EC4B6] text-white shadow-[0_3px_0_#1B8C81]' : 'text-[#1E2149] hover:bg-amber-100'}
            `}
          >
            <CheckCircle className="w-5 h-5" />
            <span>Aturan 1 Halaman Bergambar</span>
          </button>
        </div>

        {/* TAB 1: TUTORIAL INTERAKTIF 5 LANGKAH */}
        {tabAktif === 'tutorial' && (
          <div className="space-y-6">
            {/* Stepper Indikator 1-5 */}
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {LANGKAH_TUTORIAL.map((item, idx) => (
                <button
                  key={item.nomor}
                  type="button"
                  onClick={() => setStepIndex(idx)}
                  className={`
                    w-11 h-11 sm:w-12 sm:h-12 rounded-2xl border-3 border-[#1E2149] font-display font-black text-base sm:text-lg cursor-pointer transition-all
                    ${idx === stepIndex ? 'bg-[#FF6B35] text-white shadow-[0_4px_0_#C4471B] scale-110' : 'bg-[#FFF8EC] text-[#1E2149] hover:bg-amber-100'}
                  `}
                >
                  {item.nomor}
                </button>
              ))}
            </div>

            {/* Kartu Langkah Aktif */}
            <AnimatePresence mode="wait">
              <motion.div
                key={langkahAktif.nomor}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="p-6 sm:p-8 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-6"
              >
                <div className="flex items-center gap-4 border-b-2 border-[#1E2149]/20 pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-[#1E2149] flex items-center justify-center shrink-0">
                    {langkahAktif.ikon}
                  </div>
                  <div>
                    <span className="text-xs font-display font-black uppercase tracking-wider text-[#FF6B35]">
                      Langkah {langkahAktif.nomor} dari 5
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149]">
                      {langkahAktif.judul}
                    </h2>
                  </div>
                </div>

                <p className="text-base sm:text-lg font-bold text-gray-800 leading-relaxed">
                  {langkahAktif.isi}
                </p>

                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-[#FFB627] flex items-center gap-3">
                  <PakPeca ekspresi="senang" size={64} />
                  <p className="text-xs sm:text-sm font-bold text-[#1E2149] leading-snug">
                    💡 <span className="font-extrabold text-[#FF6B35]">Catatan Kunci:</span> {langkahAktif.tips}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tombol Sebelumnya & Selanjutnya */}
            <div className="flex items-center justify-between gap-4">
              <TombolChunky
                variant="paper"
                size="md"
                icon={<ArrowLeft className="w-5 h-5" />}
                disabled={stepIndex === 0}
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                Sebelumnya
              </TombolChunky>

              <TombolChunky
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                disabled={stepIndex === LANGKAH_TUTORIAL.length - 1}
                onClick={() => setStepIndex(stepIndex + 1)}
              >
                Langkah Berikutnya
              </TombolChunky>
            </div>
          </div>
        )}

        {/* TAB 2: ATURAN 1 HALAMAN BERGAMBAR */}
        {tabAktif === 'aturan' && (
          <div className="p-6 sm:p-8 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-6">
            <div className="border-b-2 border-[#1E2149]/20 pb-3">
              <h2 className="text-2xl font-display font-black text-[#1E2149]">
                Ringkasan Aturan Permainan MONOPECA
              </h2>
              <p className="text-sm font-bold text-gray-700">
                Semua hal yang perlu kamu ketahui dalam satu halaman ringkas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Aturan Giliran */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149]">
                <h3 className="font-display font-black text-base text-[#FF6B35] mb-1">
                  1. Giliran & Dadu
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                  Pemain bergiliran melempar dadu 1-6. Bidak berjalan searah jarum jam. Maksimal 4 bidak dapat berada di satu petak secara berdampingan tanpa saling menutupi.
                </p>
              </div>

              {/* Aturan Kios */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149]">
                <h3 className="font-display font-black text-base text-[#2EC4B6] mb-1">
                  2. Membeli & Sewa Kios
                </h3>
                <p className="text-xs sm:text-sm font-bold text-gray-700 leading-relaxed">
                  Kios kosong: jawab benar = miliki kios + poin (10/20/30). Kios lawan: bayar sewa 5 poin jika salah jawab. Kios sendiri: upgrade bintang (maksimal 2 bintang).
                </p>
              </div>

              {/* Petak Sudut */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149]">
                <h3 className="font-display font-black text-base text-[#FFB627] mb-1">
                  3. Empat Petak Sudut Spesial
                </h3>
                <ul className="text-xs font-bold text-gray-700 space-y-1">
                  <li>• <strong>Gerbang Sekolah (START):</strong> Lewat/berhenti dapat +10 poin.</li>
                  <li>• <strong>Saung Kopi:</strong> Istirahat aman tanpa aksi soal.</li>
                  <li>• <strong>Pojok Baca:</strong> Ringkasan materi zona berikutnya +5 poin.</li>
                  <li>• <strong>Pantai Semaka:</strong> Seluruh anggota tim mendapat +5 poin!</li>
                </ul>
              </div>

              {/* Kartu Khusus */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1E2149]">
                <h3 className="font-display font-black text-base text-[#7B5CFA] mb-1">
                  4. Kartu Kesempatan & Tantangan
                </h3>
                <ul className="text-xs font-bold text-gray-700 space-y-1">
                  <li>• <strong>Kartu Kesempatan:</strong> Aksi kerja sama & kejujuran gotong royong.</li>
                  <li>• <strong>Kartu Tantangan:</strong> Soal waktu 90 detik, benar mendapat +40 poin!</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-[#FFB627] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PakPeca ekspresi="ceria" size={70} />
                <p className="text-xs sm:text-sm font-bold text-[#1E2149]">
                  Ingat, dalam turnamen TGT, poin individumu akan menentukan gelar penghargaan tim: <strong>Super Team (≥50)</strong>, <strong>Great Team (45–49)</strong>, dan <strong>Good Team (40–44)</strong>!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
