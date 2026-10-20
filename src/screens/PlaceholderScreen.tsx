import React from 'react';
import { NavHeader } from '../components/NavHeader';
import { PakPeca } from '../components/PakPeca';
import { TombolChunky } from '../components/TombolChunky';
import { ArrowLeft, Play } from 'lucide-react';

export interface PlaceholderScreenProps {
  judul: string;
  subjudul: string;
  pesanPakPeca: string;
  faseRilis: string;
  onKembali: () => void;
  onBeranda: () => void;
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({
  judul,
  subjudul,
  pesanPakPeca,
  faseRilis,
  onKembali,
  onBeranda
}) => {
  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul={judul}
        subjudul={subjudul}
        onKembali={onKembali}
        onBeranda={onBeranda}
      />

      <div className="max-w-xl mx-auto px-4 pt-12 flex flex-col items-center text-center">
        <div className="p-8 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col items-center space-y-4 w-full">
          <PakPeca ekspresi="semangat" size={130} />
          <h2 className="text-2xl sm:text-3xl font-display font-black text-[#1E2149]">
            {judul}
          </h2>
          <span className="text-xs font-display font-extrabold uppercase px-3 py-1 rounded-full bg-[#FFD23F] border border-[#1E2149] text-[#1E2149]">
            {faseRilis}
          </span>
          <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed max-w-md">
            {pesanPakPeca}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
            <TombolChunky
              variant="paper"
              size="md"
              icon={<ArrowLeft className="w-5 h-5" />}
              onClick={onKembali}
            >
              Kembali
            </TombolChunky>
            <TombolChunky
              variant="primary"
              size="md"
              icon={<Play className="w-5 h-5 fill-white" />}
              onClick={onBeranda}
            >
              Menu Beranda
            </TombolChunky>
          </div>
        </div>
      </div>
    </div>
  );
};
