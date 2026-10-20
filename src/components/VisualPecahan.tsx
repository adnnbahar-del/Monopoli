import React from 'react';

export type BentukVisual = 'lingkaran' | 'persegi' | 'batang' | 'garis_bilangan';

export interface VisualPecahanProps {
  bentuk: BentukVisual;
  pembilang: number;
  penyebut: number;
  warnaArsir?: string;
  className?: string;
  size?: number; // ukuran kotak SVG dalam px
}

export const VisualPecahan: React.FC<VisualPecahanProps> = ({
  bentuk,
  pembilang,
  penyebut,
  warnaArsir = '#FF6B35',
  className = '',
  size = 200
}) => {
  // Validasi nilai dasar
  const validPenyebut = Math.max(1, Math.round(penyebut));
  const validPembilang = Math.max(0, Math.min(validPenyebut, Math.round(pembilang)));
  const patternId = `stripe-${bentuk}-${validPembilang}-${validPenyebut}-${Math.round(Math.random() * 10000)}`;

  // 1. LINGKARAN (PIE CHART)
  if (bentuk === 'lingkaran') {
    const cx = size / 2;
    const cy = size / 2;
    const r = (size / 2) - 10;

    // Helper membuat path irisan pizza
    const buatIrisanPath = (startAngle: number, endAngle: number) => {
      const rad1 = (startAngle - 90) * (Math.PI / 180);
      const rad2 = (endAngle - 90) * (Math.PI / 180);
      const x1 = cx + r * Math.cos(rad1);
      const y1 = cy + r * Math.sin(rad1);
      const x2 = cx + r * Math.cos(rad2);
      const y2 = cy + r * Math.sin(rad2);
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    };

    const angleStep = 360 / validPenyebut;
    const irisan = [];

    for (let i = 0; i < validPenyebut; i++) {
      const startAngle = i * angleStep;
      const endAngle = (i + 1) * angleStep;
      const diarsir = i < validPembilang;

      irisan.push(
        <g key={i}>
          <path
            d={buatIrisanPath(startAngle, endAngle)}
            fill={diarsir ? warnaArsir : '#FFF8EC'}
            stroke="#1E2149"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {diarsir && (
            <path
              d={buatIrisanPath(startAngle, endAngle)}
              fill={`url(#${patternId})`}
              opacity="0.35"
              pointerEvents="none"
            />
          )}
        </g>
      );
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`drop-shadow-md select-none ${className}`}
        aria-label={`Visual pecahan lingkaran ${validPembilang} per ${validPenyebut}`}
      >
        <defs>
          <pattern id={patternId} width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#1E2149" strokeWidth="2.5" />
          </pattern>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="#FFF8EC" />
        {irisan}
        <circle cx={cx} cy={cy} r="4" fill="#1E2149" />
      </svg>
    );
  }

  // 2. PERSEGI / GRID
  if (bentuk === 'persegi') {
    // Tentukan kolom dan baris yang proporsional
    let cols = validPenyebut;
    let rows = 1;
    if (validPenyebut === 4) { cols = 2; rows = 2; }
    else if (validPenyebut === 6) { cols = 3; rows = 2; }
    else if (validPenyebut === 8) { cols = 4; rows = 2; }
    else if (validPenyebut === 9) { cols = 3; rows = 3; }
    else if (validPenyebut === 10) { cols = 5; rows = 2; }
    else if (validPenyebut === 12) { cols = 4; rows = 3; }

    const pad = 10;
    const boxW = (size - 2 * pad) / cols;
    const boxH = (size - 2 * pad) / rows;
    const cells = [];

    let count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const diarsir = count < validPembilang;
        const x = pad + c * boxW;
        const y = pad + r * boxH;

        cells.push(
          <g key={`${r}-${c}`}>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={boxH}
              fill={diarsir ? warnaArsir : '#FFF8EC'}
              stroke="#1E2149"
              strokeWidth="3"
            />
            {diarsir && (
              <rect
                x={x}
                y={y}
                width={boxW}
                height={boxH}
                fill={`url(#${patternId})`}
                opacity="0.35"
                pointerEvents="none"
              />
            )}
          </g>
        );
        count++;
      }
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`drop-shadow-md select-none ${className}`}
        aria-label={`Visual pecahan persegi ${validPembilang} per ${validPenyebut}`}
      >
        <defs>
          <pattern id={patternId} width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#1E2149" strokeWidth="2.5" />
          </pattern>
        </defs>
        {cells}
      </svg>
    );
  }

  // 3. BATANG (STRIP HORIZONTAL)
  if (bentuk === 'batang') {
    const padX = 10;
    const padY = size * 0.25;
    const barW = size - 2 * padX;
    const barH = size * 0.5;
    const segW = barW / validPenyebut;
    const segments = [];

    for (let i = 0; i < validPenyebut; i++) {
      const diarsir = i < validPembilang;
      const x = padX + i * segW;

      segments.push(
        <g key={i}>
          <rect
            x={x}
            y={padY}
            width={segW}
            height={barH}
            fill={diarsir ? warnaArsir : '#FFF8EC'}
            stroke="#1E2149"
            strokeWidth="3"
            rx={i === 0 || i === validPenyebut - 1 ? 8 : 0}
          />
          {diarsir && (
            <rect
              x={x}
              y={padY}
              width={segW}
              height={barH}
              fill={`url(#${patternId})`}
              opacity="0.35"
              pointerEvents="none"
            />
          )}
        </g>
      );
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`drop-shadow-md select-none ${className}`}
        aria-label={`Visual pecahan batang ${validPembilang} per ${validPenyebut}`}
      >
        <defs>
          <pattern id={patternId} width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#1E2149" strokeWidth="2.5" />
          </pattern>
        </defs>
        {segments}
      </svg>
    );
  }

  // 4. GARIS BILANGAN
  // Menampilkan 0, 1, dan titik P
  const padX = 24;
  const lineY = size / 2;
  const lineW = size - 2 * padX;
  const ticks = [];
  const pRatio = validPembilang / validPenyebut;
  const pX = padX + lineW * pRatio;

  for (let i = 0; i <= validPenyebut; i++) {
    const x = padX + (lineW / validPenyebut) * i;
    ticks.push(
      <g key={i}>
        <line x1={x} y1={lineY - 8} x2={x} y2={lineY + 8} stroke="#1E2149" strokeWidth="2.5" />
      </g>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`drop-shadow-md select-none ${className}`}
      aria-label={`Garis bilangan pecahan ${validPembilang} per ${validPenyebut}`}
    >
      {/* Garis Utama */}
      <line
        x1={padX}
        y1={lineY}
        x2={padX + lineW}
        y2={lineY}
        stroke="#1E2149"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Garis Arsir Nilai (0 sampai P) */}
      <line
        x1={padX}
        y1={lineY}
        x2={pX}
        y2={lineY}
        stroke={warnaArsir}
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Ticks */}
      {ticks}

      {/* Titik 0 */}
      <text x={padX} y={lineY + 28} textAnchor="middle" className="font-display font-extrabold text-base fill-[#1E2149]">
        0
      </text>

      {/* Titik 1 */}
      <text x={padX + lineW} y={lineY + 28} textAnchor="middle" className="font-display font-extrabold text-base fill-[#1E2149]">
        1
      </text>

      {/* Titik P */}
      <g transform={`translate(${pX}, ${lineY})`}>
        <circle r="9" fill={warnaArsir} stroke="#1E2149" strokeWidth="3" />
        <circle r="3" fill="#FFF8EC" />
        {/* Label Titik P */}
        <rect x="-14" y="-36" width="28" height="22" rx="6" fill="#1E2149" />
        <text x="0" y="-21" textAnchor="middle" className="font-display font-extrabold text-xs fill-white">
          P
        </text>
        <polygon points="0,-14 -4,-18 4,-18" fill="#1E2149" />
      </g>
    </svg>
  );
};
