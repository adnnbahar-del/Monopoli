import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useGameStore, adaSesiBerjalan } from '../store/gameStore';
import { useGuruStore } from '../store/guruStore';
import { ambilSoalPetak, ambilSoalTantangan, ambilSoalTurnamen, SEMUA_SOAL, Soal } from '../engine/kartu';
import { bagiTimPolaUlar, bagiMejaTurnamen, Siswa } from '../engine/turnamen';

const g = () => useGameStore.getState();

describe('Papan: satu kocokan per giliran', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    g().resetGame();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('kocokan kedua pada giliran yang sama diabaikan; giliran baru membuka kunci', () => {
    g().kocokDanJalankan();
    vi.advanceTimersByTime(280 * 8);
    const posSetelahPertama = g().pemain[0].posisi;
    expect(g().sudahLempar).toBe(true);

    g().kocokDanJalankan(); // harus diabaikan
    vi.advanceTimersByTime(280 * 8);
    expect(g().pemain[0].posisi).toBe(posSetelahPertama);

    g().gantiGiliran();
    expect(g().giliranIndex).toBe(1);
    expect(g().sudahLempar).toBe(false);
  });

  it('kartu "lempar lagi" mengizinkan satu kocokan tambahan', () => {
    g().kocokDanJalankan();
    vi.advanceTimersByTime(280 * 8);
    g().izinkanLemparLagi();
    const pos = g().pemain[0].posisi;
    g().kocokDanJalankan();
    expect(g().sedangMelangkah).toBe(true);
    vi.advanceTimersByTime(280 * 8);
    expect(g().pemain[0].posisi).toBe((pos + g().angkaDadu) % 28);
  });
});

describe('Papan: efek kartu Kesempatan menggerakkan bidak', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    g().resetGame();
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('maju melewati START memberi bonus; mundur dari START tidak', () => {
    useGameStore.setState((s) => ({ pemain: s.pemain.map((p, i) => (i === 0 ? { ...p, posisi: 26 } : p)) }));
    const selesai = vi.fn();
    g().gerakkanPemain(2, selesai);
    expect(g().sumberLangkah).toBe('kartu');
    vi.advanceTimersByTime(280 * 4);
    expect(g().pemain[0].posisi).toBe(0);
    expect(g().pemain[0].poin).toBe(10);
    expect(selesai).toHaveBeenCalledWith(0, true);

    g().gerakkanPemain(-1, selesai);
    vi.advanceTimersByTime(280 * 3);
    expect(g().pemain[0].posisi).toBe(27);
    expect(g().pemain[0].poin).toBe(10); // tidak ada bonus saat mundur
    expect(selesai).toHaveBeenLastCalledWith(27, false);
  });
});

describe('Statistik jawaban terpisah dari poin', () => {
  beforeEach(() => g().resetGame());

  it('bonus poin tidak menambah "benar"; jawaban salah menambah "salah" + riwayat', () => {
    g().tambahPoinPemain('p1', 5);
    expect(g().pemain[0].poin).toBe(5);
    expect(g().pemain[0].benar).toBe(0);

    const detail = { soalId: 'x', pertanyaan: 'q', kunci: 'a', jawabanDipilih: 'b', benar: false, pembahasan: '', tp: 'TP1' };
    g().catatJawaban('p1', detail);
    g().catatJawaban('p1', { ...detail, benar: true, jawabanDipilih: 'a' });
    expect(g().pemain[0].salah).toBe(1);
    expect(g().pemain[0].benar).toBe(1);
    expect(g().riwayatJawaban).toHaveLength(2);
  });

  it('kurangPoinPemain tidak membuat poin negatif & mengembalikan jumlah yang dibayar', () => {
    g().tambahPoinPemain('p1', 3);
    expect(g().kurangPoinPemain('p1', 10)).toBe(3);
    expect(g().pemain[0].poin).toBe(0);
  });

  it('resetGame memakai durasi dari Pengaturan & mengosongkan riwayat', () => {
    g().catatJawaban('p1', { soalId: 'x', pertanyaan: '', kunci: '', jawabanDipilih: '', benar: true, pembahasan: '', tp: '' });
    g().resetGame(35);
    expect(g().sisaDetik).toBe(35 * 60);
    expect(g().riwayatJawaban).toHaveLength(0);
  });

  it('adaSesiBerjalan hanya true bila sesi benar-benar sudah dimainkan', () => {
    expect(adaSesiBerjalan(g())).toBe(false);
    g().tambahPoinPemain('p2', 10);
    expect(adaSesiBerjalan(g())).toBe(true);
    g().selesaikanGame();
    expect(adaSesiBerjalan(g())).toBe(false);
  });
});

describe('Bank soal Panel Guru dipakai permainan', () => {
  const awal = useGuruStore.getState().daftarSoal;
  afterEach(() => useGuruStore.setState({ daftarSoal: awal }));

  it('soal petak, tantangan & turnamen diambil dari bank guru', () => {
    const soalGuru: Soal[] = [
      { id: 'g-petak', tipe: 'petak', subtopik: 'senilai', level: 'mudah', tp: 'TP2', pertanyaan: 'Soal guru?', opsi: ['1', '2'], kunci: '1', pembahasan: '' },
      { id: 'g-tantangan', tipe: 'tantangan', subtopik: 'campuran', level: 'sukar', tp: 'TP7', pertanyaan: 'Tantangan guru?', opsi: ['a', 'b'], kunci: 'a', pembahasan: '' },
      { id: 'g-turnamen', tipe: 'turnamen', subtopik: 'mengenal', level: 'sedang', tp: 'TP1', pertanyaan: 'Duel guru?', opsi: ['x', 'y'], kunci: 'x', pembahasan: '', paket: 'A' },
    ];
    useGuruStore.setState({ daftarSoal: soalGuru });
    expect(ambilSoalPetak('senilai', [], 'mudah').soal.id).toBe('g-petak');
    expect(ambilSoalTantangan([]).soal.id).toBe('g-tantangan');
    expect(ambilSoalTurnamen('A').map((s) => s.id)).toEqual(['g-turnamen']);
  });

  it('subtopik yang dihapus guru tidak membuat permainan crash (fallback soal bawaan)', () => {
    useGuruStore.setState({ daftarSoal: awal.filter((s) => s.subtopik !== 'pengurangan') });
    const { soal } = ambilSoalPetak('pengurangan', []);
    expect(SEMUA_SOAL.some((s) => s.id === soal.id)).toBe(true);
  });
});

describe('PIN Panel Guru', () => {
  afterEach(() => useGuruStore.setState({ pinGuru: '12345' }));

  it('setelah PIN diganti, PIN bawaan 12345 tidak lagi diterima', () => {
    useGuruStore.setState({ pinGuru: '12345' });
    expect(useGuruStore.getState().gantiPin('12345', '8642').sukses).toBe(true);
    expect(useGuruStore.getState().verifikasiPin('12345')).toBe(false);
    expect(useGuruStore.getState().verifikasiPin('8642')).toBe(true);
    // PIN lama bawaan tidak bisa dipakai untuk mengganti PIN
    expect(useGuruStore.getState().gantiPin('12345', '1111').sukses).toBe(false);
  });
});

describe('Pembagian meja turnamen seimbang', () => {
  const buatSiswa = (n: number): Siswa[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `s${i}`,
      nama: `Siswa ${i}`,
      kemampuan: (['tinggi', 'sedang', 'rendah'] as const)[i % 3],
    }));

  it.each([5, 9, 13, 14, 17])('%i siswa → tidak ada meja berisi 1 siswa, selisih ukuran maks 1', (n) => {
    const siswa = buatSiswa(n);
    const tim = bagiTimPolaUlar(siswa, 4);
    const meja = bagiMejaTurnamen(siswa, tim, 4);
    const ukuran = meja.map((m) => m.anggotaIds.length);
    expect(ukuran.reduce((a, b) => a + b, 0)).toBe(n);
    expect(Math.min(...ukuran)).toBeGreaterThanOrEqual(2);
    expect(Math.max(...ukuran) - Math.min(...ukuran)).toBeLessThanOrEqual(1);
    expect(Math.max(...ukuran)).toBeLessThanOrEqual(4);
  });

  it.each([8, 12, 13, 16])('%i siswa (4 tim) → tidak ada meja berisi dua anggota tim yang sama', (n) => {
    const pola = ['tinggi', 'tinggi', 'tinggi', 'tinggi', 'sedang', 'sedang', 'sedang', 'sedang', 'rendah', 'rendah', 'rendah', 'rendah', 'sedang', 'rendah', 'tinggi', 'sedang'] as const;
    const siswa: Siswa[] = Array.from({ length: n }, (_, i) => ({ id: `s${i}`, nama: `S${i}`, kemampuan: pola[i % pola.length] }));
    const tim = bagiTimPolaUlar(siswa, 4);
    const meja = bagiMejaTurnamen(siswa, tim, 4);
    const timDari = (id: string) => tim.find((t) => t.anggotaIds.includes(id))?.id;
    for (const m of meja) {
      const daftarTim = m.anggotaIds.map(timDari);
      expect(new Set(daftarTim).size).toBe(daftarTim.length);
    }
    expect(meja.flatMap((m) => m.anggotaIds).sort()).toEqual(siswa.map((s) => s.id).sort());
  });
});
