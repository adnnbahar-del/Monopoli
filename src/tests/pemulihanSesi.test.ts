import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { pulihkanSesi, useGameStore, GameState } from '../store/gameStore';

const awal = () => useGameStore.getState();

describe('Pemulihan sesi yang terputus di tengah langkah bidak', () => {
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  it('sesi normal (tidak sedang melangkah) dikembalikan apa adanya', () => {
    const tersimpan: Partial<GameState> = { giliranIndex: 2, sisaDetik: 500, sedangMelangkah: false };
    const hasil = pulihkanSesi(tersimpan, awal());
    expect(hasil.giliranIndex).toBe(2);
    expect(hasil.sisaDetik).toBe(500);
    expect(hasil.sedangMelangkah).toBe(false);
    expect(hasil.aksiPetakTertunda).toBeNull();
  });

  it('menyelesaikan langkah: bidak ke petak tujuan, kunci dilepas, aksi petak ditandai', () => {
    const s = awal();
    const pemain = s.pemain.map((p, i) => (i === 1 ? { ...p, posisi: 6 } : p)); // posisi sementara
    const hasil = pulihkanSesi(
      {
        pemain,
        giliranIndex: 1,
        sedangMelangkah: true,
        petakAktif: 6,
        langkahBerjalan: { pemainIndex: 1, posisiAkhir: 8, bonusPoin: 0, melewatiStart: false },
      },
      s
    );
    expect(hasil.sedangMelangkah).toBe(false);
    expect(hasil.langkahBerjalan).toBeNull();
    expect(hasil.pemain[1].posisi).toBe(8);
    expect(hasil.petakAktif).toBe(8);
    expect(hasil.aksiPetakTertunda).toBe(8);
    expect(hasil.pemain[1].poin).toBe(s.pemain[1].poin); // tanpa bonus
    expect(hasil.pemain[0].posisi).toBe(s.pemain[0].posisi); // pemain lain tak tersentuh
  });

  it('memberi bonus START bila langkah yang terputus melewati START', () => {
    const s = awal();
    const pemain = s.pemain.map((p, i) => (i === 0 ? { ...p, posisi: 27, poin: 30 } : p));
    const hasil = pulihkanSesi(
      {
        pemain,
        giliranIndex: 0,
        sedangMelangkah: true,
        langkahBerjalan: { pemainIndex: 0, posisiAkhir: 2, bonusPoin: 10, melewatiStart: true },
      },
      s
    );
    expect(hasil.pemain[0].posisi).toBe(2);
    expect(hasil.pemain[0].poin).toBe(40);
  });

  it('data lama tanpa info langkah: hanya melepas kunci sedangMelangkah', () => {
    const s = awal();
    const hasil = pulihkanSesi({ sedangMelangkah: true, giliranIndex: 3 }, s);
    expect(hasil.sedangMelangkah).toBe(false);
    expect(hasil.giliranIndex).toBe(3);
    expect(hasil.aksiPetakTertunda ?? null).toBeNull();
  });
});

describe('kocokDanJalankan mencatat & membersihkan langkahBerjalan', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useGameStore.getState().resetGame();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('tujuan tercatat selama melangkah dan sama dengan posisi akhir', () => {
    useGameStore.getState().kocokDanJalankan();
    const selama = useGameStore.getState();
    expect(selama.sedangMelangkah).toBe(true);
    expect(selama.langkahBerjalan).not.toBeNull();
    const tujuan = selama.langkahBerjalan!.posisiAkhir;
    expect(tujuan).toBe((0 + selama.angkaDadu) % 28);

    vi.advanceTimersByTime(280 * 8);
    const sesudah = useGameStore.getState();
    expect(sesudah.sedangMelangkah).toBe(false);
    expect(sesudah.langkahBerjalan).toBeNull();
    expect(sesudah.pemain[0].posisi).toBe(tujuan);
  });
});
