import React from 'react';

export type VarianTombol = 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'paper';
export type UkuranTombol = 'sm' | 'md' | 'lg';

export interface TombolChunkyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VarianTombol;
  size?: UkuranTombol;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  shadowColor?: string;
}

const VARIAN_STYLES: Record<VarianTombol, {
  bg: string;
  text: string;
  border: string;
  shadow: string;
  activeShadow: string;
}> = {
  primary: {
    bg: 'bg-[#FF6B35] hover:bg-[#F25C24]',
    text: 'text-white',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#C4471B]',
    activeShadow: 'active:shadow-[0_2px_0_#C4471B]'
  },
  secondary: {
    bg: 'bg-[#2EC4B6] hover:bg-[#25A99D]',
    text: 'text-white',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#1B8C81]',
    activeShadow: 'active:shadow-[0_2px_0_#1B8C81]'
  },
  accent: {
    bg: 'bg-[#FFD23F] hover:bg-[#EBC032]',
    text: 'text-[#1E2149]',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#C79E1A]',
    activeShadow: 'active:shadow-[0_2px_0_#C79E1A]'
  },
  danger: {
    bg: 'bg-[#E5484D] hover:bg-[#D13B40]',
    text: 'text-white',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#A8262A]',
    activeShadow: 'active:shadow-[0_2px_0_#A8262A]'
  },
  success: {
    bg: 'bg-[#22A55B] hover:bg-[#1C8D4D]',
    text: 'text-white',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#146938]',
    activeShadow: 'active:shadow-[0_2px_0_#146938]'
  },
  paper: {
    bg: 'bg-[#FFF8EC] hover:bg-[#F7EEDC]',
    text: 'text-[#1E2149]',
    border: 'border-2 border-[#1E2149]',
    shadow: 'shadow-[0_6px_0_#D4C4A8]',
    activeShadow: 'active:shadow-[0_2px_0_#D4C4A8]'
  }
};

const UKURAN_STYLES: Record<UkuranTombol, {
  container: string;
  text: string;
  iconSize: string;
}> = {
  sm: {
    container: 'h-12 min-h-[48px] px-4 rounded-2xl',
    text: 'text-base font-display font-bold',
    iconSize: 'w-5 h-5'
  },
  md: {
    container: 'h-14 min-h-[56px] px-6 rounded-[20px]',
    text: 'text-lg font-display font-extrabold',
    iconSize: 'w-6 h-6'
  },
  lg: {
    container: 'h-16 min-h-[64px] px-8 rounded-[22px]',
    text: 'text-xl font-display font-extrabold tracking-wide',
    iconSize: 'w-7 h-7'
  }
};

export const TombolChunky: React.FC<TombolChunkyProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const vStyle = VARIAN_STYLES[variant];
  const uStyle = UKURAN_STYLES[size];

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-3
        ${uStyle.container}
        ${uStyle.text}
        ${vStyle.bg}
        ${vStyle.text}
        ${vStyle.border}
        ${!disabled ? `${vStyle.shadow} ${vStyle.activeShadow} active:translate-y-[4px]` : 'opacity-50 cursor-not-allowed shadow-[0_2px_0_#999]'}
        transition-all duration-150 select-none cursor-pointer
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={`shrink-0 flex items-center justify-center ${uStyle.iconSize}`}>
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {icon && iconPosition === 'right' && (
        <span className={`shrink-0 flex items-center justify-center ${uStyle.iconSize}`}>
          {icon}
        </span>
      )}
    </button>
  );
};
