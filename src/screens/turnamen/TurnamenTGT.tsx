import React, { useState } from 'react';
import { NavHeader } from '../../components/NavHeader';
import { useKelasStore } from '../../store/kelasStore';
import { DaftarSiswa } from './DaftarSiswa';
import { BentukTim } from './BentukTim';
import { BentukMeja } from './BentukMeja';
import { DuelMeja } from './DuelMeja';
import { Podium } from './Podium';
import { Presentation, Users, Swords, Trophy, Check } from 'lucide-react';

export interface TurnamenTGTProps {
  onKembaliKeBeranda: () => void;
  onBukaMateriKilat: () => void;
  onBukaLatihanTim: () => void;
}

export type SesiTGT = 'presentasi' | 'belajar_tim' | 'turnamen' | 'penghargaan';
export type SubTahapTurnamen = 'siswa' | 'tim' | 'meja' | 'duel' | 'podium';

export const TurnamenTGT: React.FC<TurnamenTGTProps> = ({
  onKembaliKeBeranda,
  onBukaMateriKilat,
  onBukaLatihanTim
}) => {
  const { resetTurnamen } = useKelasStore();
  const [sesiAktif, setSesiAktif] = useState<SesiTGT>('turnamen');
  const [subTahap, setSubTahap] = useState<SubTahapTurnamen>('siswa');
  const [mejaDuelId, setMejaDuelId] = useState<string | null>(null);

  const TAHAP_STEPPER: { id: SesiTGT; label: string; ikon: React.ReactNode }[] = [
    { id: 'presentasi', label: '1. Presentasi Kelas', ikon: <Presentation className="w-4 h-4" /> },
    { id: 'belajar_tim', label: '2. Belajar Tim', ikon: <Users className="w-4 h-4" /> },
    { id: 'turnamen', label: '3. Turnamen Meja', ikon: <Swords className="w-4 h-4" /> },
    { id: 'penghargaan', label: '4. Penghargaan Tim', ikon: <Trophy className="w-4 h-4" /> },
  ];

  const handleKlikStepper = (id: SesiTGT) => {
    if (id === 'presentasi') {
      onBukaMateriKilat();
    } else if (id === 'belajar_tim') {
      onBukaLatihanTim();
    } else {
      setSesiAktif(id);
      if (id === 'penghargaan') setSubTahap('podium');
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Mode Turnamen TGT"
        subjudul="Teams Games Tournament — Pecahan Kelas V SD"
        onBeranda={onKembaliKeBeranda}
      />

      <div className="max-w-5xl mx-auto px-4 pt-4 sm:pt-6 space-y-6">
        {/* STEPPER SESI TGT DI ATAS LAYAR */}
        <div className="p-2 sm:p-3 rounded-2xl bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex items-center justify-between gap-1 overflow-x-auto print:hidden">
          {TAHAP_STEPPER.map((t, idx) => {
            const isCurrent = sesiAktif === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleKlikStepper(t.id)}
                className={`
                  flex-1 min-w-[140px] py-2 px-3 rounded-xl border-2 border-[#1E2149] font-display font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all
                  ${isCurrent ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B] scale-102' : 'bg-white text-[#1E2149] hover:bg-amber-100'}
                `}
              >
                <span>{t.ikon}</span>
                <span className="truncate">{t.label}</span>
                {idx < 2 && <Check className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            );
          })}
        </div>

        {/* SUB-TAHAP DI DALAM SESI TURNAMEN */}
        {sesiAktif === 'turnamen' && subTahap !== 'podium' && (
          <div className="flex items-center justify-center gap-2 print:hidden">
            {[
              { id: 'siswa', label: '1. Daftar Siswa' },
              { id: 'tim', label: '2. Bentuk Tim' },
              { id: 'meja', label: '3. Bentuk Meja' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSubTahap(st.id as SubTahapTurnamen)}
                className={`
                  px-3 py-1 rounded-lg border-2 border-[#1E2149] text-xs font-display font-extrabold cursor-pointer
                  ${subTahap === st.id ? 'bg-[#2EC4B6] text-white shadow-xs' : 'bg-white text-gray-600'}
                `}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        {/* KONTEN TAHAP AKTIF */}
        {subTahap === 'siswa' && (
          <DaftarSiswa onLanjut={() => setSubTahap('tim')} />
        )}

        {subTahap === 'tim' && (
          <BentukTim
            onKembali={() => setSubTahap('siswa')}
            onLanjut={() => setSubTahap('meja')}
          />
        )}

        {subTahap === 'meja' && (
          <BentukMeja
            onKembali={() => setSubTahap('tim')}
            onMulaiDuelMeja={(mId) => {
              setMejaDuelId(mId);
              setSubTahap('duel');
            }}
          />
        )}

        {subTahap === 'duel' && mejaDuelId && (
          <DuelMeja
            mejaId={mejaDuelId}
            onKembaliKeMeja={() => setSubTahap('meja')}
            onSelesaiDuel={() => {
              setSesiAktif('penghargaan');
              setSubTahap('podium');
            }}
          />
        )}

        {subTahap === 'podium' && (
          <Podium
            onKembaliKeBeranda={onKembaliKeBeranda}
            onUlangTurnamen={() => {
              resetTurnamen();
              setSesiAktif('turnamen');
              setSubTahap('siswa');
            }}
          />
        )}
      </div>
    </div>
  );
};
