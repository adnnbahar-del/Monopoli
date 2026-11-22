import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DaduArena } from '../components/papan/DaduArena';
import { LapisanPion, pusatSel } from '../components/papan/LapisanPion';
import { Papan } from '../components/Papan';
import { DAFTAR_PETAK } from '../data/papan';
import type { Pemain } from '../store/gameStore';

const PEMAIN: Pemain[] = [
  { id: 'p1', nama: 'Ahmad', timId: 't1', timNama: 'Tim Merah', warna: '#E5484D', bentuk: 'diamond', posisi: 4, poin: 0, benar: 0, salah: 0 },
  { id: 'p2', nama: 'Siti', timId: 't2', timNama: 'Tim Biru', warna: '#3E7BFA', bentuk: 'circle', posisi: 21, poin: 0, benar: 0, salah: 0 },
];

describe('Lapisan visual papan — mengikuti state existing', () => {
  it('Papan tetap merender 28 petak dengan urutan & nama dari DAFTAR_PETAK', () => {
    const { container } = render(
      <Papan
        pemain={PEMAIN}
        giliranIndex={0}
        kepemilikan={{}}
        petakAktif={4}
        angkaDadu={4}
        sedangMelangkah={false}
        onLemparDadu={vi.fn()}
      />
    );
    const petak = [...container.querySelectorAll('[data-petak]')];
    expect(petak).toHaveLength(28);
    expect(petak.map((e) => Number((e as HTMLElement).dataset.petak))).toEqual(DAFTAR_PETAK.map((p) => p.index));
    expect(petak.map((e) => e.querySelector('.petak-nama')?.textContent)).toEqual(
      DAFTAR_PETAK.map((p) => p.namaSingkat)
    );
    // Hanya petak aktif (state) yang disorot
    const aktif = container.querySelectorAll('.petak-aktif');
    expect(aktif).toHaveLength(1);
    expect((aktif[0] as HTMLElement).dataset.petak).toBe('4');
  });

  it.each([1, 2, 3, 4, 5, 6])('dadu menampilkan wajah %i sesuai nilai store tanpa mengacak', (n) => {
    const randomSpy = vi.spyOn(Math, 'random');
    const { container } = render(
      <DaduArena nilai={n} sedangMelangkah={false} onKocok={vi.fn()} />
    );
    const kubus = container.querySelector('.dadu-papan-kubus') as HTMLElement;
    const target = { 1: [0, 0], 2: [0, 180], 3: [0, -90], 4: [0, 90], 5: [-90, 0], 6: [90, 0] }[n]!;
    expect(kubus.style.transform).toBe(`rotateX(${target[0]}deg) rotateY(${target[1]}deg)`);
    expect(randomSpy).not.toHaveBeenCalled();
    randomSpy.mockRestore();
  });

  it('dadu menambah putaran visual saat kocok dimulai, wajah akhir tetap = nilai', () => {
    const { container, rerender } = render(
      <DaduArena nilai={1} sedangMelangkah={false} onKocok={vi.fn()} />
    );
    rerender(<DaduArena nilai={3} sedangMelangkah={true} onKocok={vi.fn()} />);
    const kubus = container.querySelector('.dadu-papan-kubus') as HTMLElement;
    // 720° (2 putaran penuh) + rotasi wajah 3
    expect(kubus.style.transform).toBe('rotateX(720deg) rotateY(630deg)');
  });

  it('pion diletakkan di titik tengah petak sesuai posisi pemain', () => {
    const { container } = render(
      <LapisanPion pemain={PEMAIN} idPemainAktif="p1" sedangMelangkah={false} />
    );
    const wadah = [...container.querySelectorAll('.pion-wadah')] as HTMLElement[];
    expect(wadah).toHaveLength(2);
    PEMAIN.forEach((p, i) => {
      const petak = DAFTAR_PETAK[p.posisi];
      const pusat = pusatSel(petak.gridRow, petak.gridCol);
      const m = wadah[i].style.transform.match(/translate\(([-\d.]+)%, ([-\d.]+)%\)/)!;
      expect(Math.abs(Number(m[1]) - pusat.x)).toBeLessThan(3);
      expect(Math.abs(Number(m[2]) - pusat.y)).toBeLessThan(4);
    });
    // Pion aktif ditandai
    expect(container.querySelectorAll('.pion-aktif')).toHaveLength(1);
  });
});
