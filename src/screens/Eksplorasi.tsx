import React, { useState } from 'react';
import { NavHeader } from '../components/NavHeader';
import { VisualPecahan, BentukVisual } from '../components/VisualPecahan';
import { Pecahan } from '../components/Pecahan';
import { sederhanakan } from '../engine/pecahan';
import { PakPeca } from '../components/PakPeca';


export interface EksplorasiProps {
  onKembali: () => void;
  onBeranda: () => void;
}

export const Eksplorasi: React.FC<EksplorasiProps> = ({
  onKembali,
  onBeranda
}) => {
  const [penyebut, setPenyebut] = useState(4);
  const [pembilang, setPembilang] = useState(2);
  const [bentuk, setBentuk] = useState<BentukVisual>('lingkaran');

  // Validasi pembilang tidak melebihi penyebut
  const pembilangAman = Math.min(pembilang, penyebut);
  const bentukSederhana = sederhanakan({ pembilang: pembilangAman, penyebut });

  // Cari daftar pecahan senilai
  const daftarSenilai = [1, 2, 3, 4, 5, 6].map((pengali) => ({
    pembilang: bentukSederhana.pembilang * pengali,
    penyebut: bentukSederhana.penyebut * pengali
  })).filter(p => p.penyebut <= 24);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-[#FFE3B3] to-[#FFB8A1] tapis-pattern select-none">
      <NavHeader
        judul="Mode Eksplorasi Pecahan"
        subjudul="Eksperimen Bagian, Bentuk Sederhana, dan Pecahan Senilai"
        onKembali={onKembali}
        onBeranda={onBeranda}
      />

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Panel Kontrol Slider & Bentuk */}
        <div className="p-5 sm:p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card space-y-5">
          {/* Pemilihan Bentuk Visual */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#1E2149]/20 pb-4">
            <span className="font-display font-extrabold text-base text-[#1E2149]">
              Pilih Representasi Visual:
            </span>
            <div className="flex flex-wrap gap-2">
              {(['lingkaran', 'persegi', 'batang', 'garis_bilangan'] as BentukVisual[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBentuk(b)}
                  className={`
                    px-3.5 py-1.5 rounded-xl border-2 border-[#1E2149] text-xs sm:text-sm font-display font-extrabold capitalize cursor-pointer transition-all
                    ${bentuk === b ? 'bg-[#FF6B35] text-white shadow-[0_3px_0_#C4471B]' : 'bg-white text-[#1E2149] hover:bg-amber-100'}
                  `}
                >
                  {b.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Jumlah Bagian (Penyebut) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-display font-black text-[#1E2149]">
              <span>Jumlah Bagian Seluruhnya (Penyebut):</span>
              <span className="px-3 py-0.5 rounded-lg bg-[#FFD23F] border border-[#1E2149] text-base">
                {penyebut}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              value={penyebut}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setPenyebut(val);
                if (pembilang > val) setPembilang(val);
              }}
              className="w-full h-3 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-[#FF6B35]"
            />
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>1</span>
              <span>4</span>
              <span>8</span>
              <span>12</span>
            </div>
          </div>

          {/* Slider Bagian Diarsir (Pembilang) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-display font-black text-[#1E2149]">
              <span>Bagian yang Diarsir / Diambil (Pembilang):</span>
              <span className="px-3 py-0.5 rounded-lg bg-[#2EC4B6] border border-[#1E2149] text-white text-base">
                {pembilangAman}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={penyebut}
              value={pembilangAman}
              onChange={(e) => setPembilang(parseInt(e.target.value, 10))}
              className="w-full h-3 bg-teal-200 rounded-lg appearance-none cursor-pointer accent-[#2EC4B6]"
            />
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>0</span>
              <span>{Math.floor(penyebut / 2)}</span>
              <span>{penyebut}</span>
            </div>
          </div>
        </div>

        {/* Tampilan Visualisasi Langsung & Hasil Analisis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kotak Visual SVG */}
          <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col items-center justify-center text-center">
            <VisualPecahan
              bentuk={bentuk}
              pembilang={pembilangAman}
              penyebut={penyebut}
              size={210}
            />
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-bold text-gray-600">Nilai Pecahan:</span>
              <Pecahan value={{ pembilang: pembilangAman, penyebut }} size="xl" />
            </div>
          </div>

          {/* Kotak Analisis Bentuk Sederhana & Pecahan Senilai */}
          <div className="p-6 rounded-card bg-[#FFF8EC] border-4 border-[#1E2149] shadow-soft-card flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-display font-black uppercase text-[#FF6B35] tracking-wider block">
                ✨ Bentuk Paling Sederhana:
              </span>
              <div className="mt-2 p-3 bg-amber-50 rounded-2xl border-2 border-[#FFB627] flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">
                  {pembilangAman}/{penyebut} disederhanakan:
                </span>
                <Pecahan value={bentukSederhana} size="lg" />
              </div>
            </div>

            <div>
              <span className="text-xs font-display font-black uppercase text-[#2EC4B6] tracking-wider block mb-2">
                🔗 Daftar Pecahan Senilai:
              </span>
              <div className="p-3 bg-teal-50 rounded-2xl border-2 border-[#2EC4B6] flex flex-wrap items-center gap-3">
                {daftarSenilai.map((p, idx) => (
                  <span key={idx} className="flex items-center gap-1 font-bold">
                    <Pecahan value={p} size="sm" />
                    {idx < daftarSenilai.length - 1 && <span className="text-gray-400 font-extrabold">=</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Tips Maskot */}
            <div className="flex items-center gap-3 pt-2">
              <PakPeca ekspresi="ceria" size={60} />
              <p className="text-xs font-bold text-gray-700 leading-snug">
                Geser slider untuk melihat bagaimana pecahan dan bentuk senilainya berubah secara langsung!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
