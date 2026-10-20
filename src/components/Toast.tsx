import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type TipeToast = 'success' | 'error' | 'info';

export interface ToastProps {
  show: boolean;
  pesan: string;
  tipe?: TipeToast;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  pesan,
  tipe = 'info',
  onClose
}) => {
  const config = {
    success: {
      bg: 'bg-[#22A55B]',
      icon: <CheckCircle2 className="w-5 h-5 text-white shrink-0" />,
      border: 'border-[#146938]'
    },
    error: {
      bg: 'bg-[#E5484D]',
      icon: <AlertCircle className="w-5 h-5 text-white shrink-0" />,
      border: 'border-[#A8262A]'
    },
    info: {
      bg: 'bg-[#2EC4B6]',
      icon: <Info className="w-5 h-5 text-white shrink-0" />,
      border: 'border-[#1B8C81]'
    }
  }[tipe];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`
            fixed top-5 left-1/2 -translate-x-1/2 z-50
            flex items-center gap-3 px-4 py-3 rounded-2xl
            ${config.bg} text-white border-2 border-[#1E2149]
            shadow-[0_6px_0_#1E2149] max-w-sm sm:max-w-md w-[90%]
          `}
        >
          {config.icon}
          <p className="text-sm font-bold flex-1 leading-snug">{pesan}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-black/10 rounded-lg text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
