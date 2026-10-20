import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PakPeca, EkspresiPakPeca } from './PakPeca';
import { TombolChunky } from './TombolChunky';

export interface DialogRamahProps {
  open: boolean;
  judul: string;
  pesan: string;
  ekspresiPakPeca?: EkspresiPakPeca;
  teksKonfirmasi?: string;
  teksBatal?: string;
  onKonfirmasi: () => void;
  onBatal?: () => void;
  tipe?: 'info' | 'konfirmasi' | 'bahaya';
}

export const DialogRamah: React.FC<DialogRamahProps> = ({
  open,
  judul,
  pesan,
  ekspresiPakPeca = 'senang',
  teksKonfirmasi = 'Oke, Mengerti!',
  teksBatal,
  onKonfirmasi,
  onBatal,
  tipe = 'konfirmasi'
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2149]/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-md bg-[#FFF8EC] border-4 border-[#1E2149] rounded-card p-6 shadow-soft-card relative overflow-hidden text-center"
          >
            {/* Latar Belakang Ornamen Tapis */}
            <div className="absolute inset-0 tapis-pattern opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              {/* Maskot Pak Peca */}
              <div className="mb-2">
                <PakPeca ekspresi={ekspresiPakPeca} size={110} />
              </div>

              {/* Judul Dialog */}
              <h3 className="text-2xl font-display font-extrabold text-[#1E2149] mb-2">
                {judul}
              </h3>

              {/* Isi Pesan */}
              <p className="text-sm sm:text-base font-bold text-gray-700 leading-relaxed mb-6 max-w-sm">
                {pesan}
              </p>

              {/* Tombol Aksi */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                {teksBatal && onBatal && (
                  <TombolChunky
                    variant="paper"
                    size="md"
                    onClick={onBatal}
                    className="w-full sm:w-auto min-w-[120px]"
                  >
                    {teksBatal}
                  </TombolChunky>
                )}
                <TombolChunky
                  variant={tipe === 'bahaya' ? 'danger' : 'primary'}
                  size="md"
                  onClick={onKonfirmasi}
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  {teksKonfirmasi}
                </TombolChunky>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
