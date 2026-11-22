import React from 'react';
import { IlustrasiPanji } from './Ilustrasi';

/**
 * Latar panggung "Arena Turnamen": gradasi ungu–merah muda, lampu sorot,
 * bokeh penonton, konfeti, panji di sisi, dan jalur petak papan di bawah.
 * Seluruh layer bersifat dekoratif (pointer-events: none, aria-hidden).
 */

const KONFETI = [
  { l: '6%', t: '8%', w: 10, h: 18, c: '#FF6B35', r: 20 },
  { l: '14%', t: '30%', w: 8, h: 14, c: '#2EC4B6', r: -30 },
  { l: '31%', t: '5%', w: 9, h: 16, c: '#FFD23F', r: 50 },
  { l: '44%', t: '22%', w: 7, h: 12, c: '#7B5CFA', r: -10 },
  { l: '58%', t: '4%', w: 9, h: 16, c: '#E5484D', r: 35 },
  { l: '63%', t: '27%', w: 8, h: 14, c: '#FFD23F', r: -45 },
  { l: '72%', t: '12%', w: 10, h: 18, c: '#4D8DFF', r: 15 },
  { l: '86%', t: '6%', w: 9, h: 16, c: '#FF7EB6', r: -25 },
  { l: '93%', t: '34%', w: 8, h: 14, c: '#3BC47A', r: 40 },
  { l: '22%', t: '52%', w: 7, h: 12, c: '#FF7EB6', r: 60 },
  { l: '78%', t: '55%', w: 7, h: 12, c: '#FFD23F', r: -60 },
];

const BOKEH = Array.from({ length: 22 }, (_, i) => ({
  l: `${(i * 37) % 100}%`,
  t: `${6 + ((i * 53) % 40)}%`,
  s: 6 + ((i * 7) % 14),
  o: 0.25 + ((i * 13) % 40) / 100,
}));

const WARNA_PETAK = ['#FFD23F', '#7B5CFA', '#FF7EB6', '#2EC4B6', '#FF6B35', '#4D8DFF', '#3BC47A', '#B794F6'];

export const ArenaLatar: React.FC = () => (
  <div className="arena-latar" aria-hidden="true">
    {/* Lampu sorot dari atas */}
    <div className="arena-sorot arena-sorot-kiri" />
    <div className="arena-sorot arena-sorot-kanan" />
    <div className="arena-sorot arena-sorot-tengah" />

    {/* Bokeh lampu tribun penonton */}
    {BOKEH.map((b, i) => (
      <span
        key={i}
        className="absolute rounded-full bg-white blur-[2px]"
        style={{ left: b.l, top: b.t, width: b.s, height: b.s, opacity: b.o }}
      />
    ))}

    {/* Konfeti */}
    {KONFETI.map((k, i) => (
      <span
        key={i}
        className="arena-konfeti"
        style={{
          left: k.l,
          top: k.t,
          width: k.w,
          height: k.h,
          background: k.c,
          ['--rot' as string]: `${k.r}deg`,
          animationDelay: `${(i % 5) * 0.7}s`,
        }}
      />
    ))}

    {/* Panji gantung di sisi (layar lebar) */}
    <IlustrasiPanji className="hidden xl:block absolute left-2 top-[18%] w-16 2xl:w-20 -rotate-6 drop-shadow-lg" />
    <IlustrasiPanji className="hidden xl:block absolute right-2 top-[18%] w-16 2xl:w-20 rotate-6 drop-shadow-lg" />

    {/* Jalur petak papan monopoli di lantai */}
    <div className="arena-lantai">
      <div className="arena-jalur">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="arena-petak"
            style={{ background: WARNA_PETAK[i % WARNA_PETAK.length] }}
          />
        ))}
      </div>
    </div>
  </div>
);
