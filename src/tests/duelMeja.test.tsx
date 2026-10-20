import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { DuelMeja } from '../screens/turnamen/DuelMeja';
import { useKelasStore } from '../store/kelasStore';

// Mock canvas-confetti dan qrcode
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn((_text, _opts, cb) => cb(null, 'data:image/png;base64,mock')),
  },
}));

describe('DuelMeja State Machine & Navigation', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useKelasStore.getState().resetTurnamen();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('1. klik Kunci -> yang tampil umpan balik + pembahasan soal 1 (indeks tetap 0)', async () => {
    const { getByTestId, queryByTestId } = render(
      <DuelMeja
        mejaId="meja-1"
        onSelesaiDuel={vi.fn()}
        onKembaliKeMeja={vi.fn()}
      />
    );

    // Pastikan HUD menampilkan Soal 1
    const hud = getByTestId('hud-duel');
    expect(hud.textContent).toContain('Soal 1 dari 5');

    // Belum ada pembahasan
    expect(queryByTestId('pembahasan-box')).toBeNull();

    // Pilih opsi jawaban pertama
    const opsi0 = getByTestId('opsi-jawaban-0');
    fireEvent.click(opsi0);

    // Tombol Kunci Jawaban aktif
    const tombolKunci = getByTestId('tombol-kunci-jawaban');
    expect((tombolKunci as HTMLButtonElement).disabled).toBe(false);

    // Klik Kunci Jawaban
    fireEvent.click(tombolKunci);

    // Pembahasan dan umpan balik harus tampil
    expect(getByTestId('pembahasan-box')).toBeDefined();

    // Indeks soal harus TETAP Soal 1 dari 5 (tidak boleh pindah ke soal 2)
    expect(getByTestId('hud-duel').textContent).toContain('Soal 1 dari 5');

    // Tombol Lanjut harus tampil tetapi nonaktif selama guard 500ms
    const tombolLanjut = getByTestId('tombol-lanjut');
    expect((tombolLanjut as HTMLButtonElement).disabled).toBe(true);

    // Majukan timer 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Sekarang tombol Lanjut sudah aktif
    expect((getByTestId('tombol-lanjut') as HTMLButtonElement).disabled).toBe(false);
  });

  it('2. double-click Kunci -> hanya terkunci sekali, tidak pindah soal', async () => {
    const { getByTestId } = render(
      <DuelMeja
        mejaId="meja-1"
        onSelesaiDuel={vi.fn()}
        onKembaliKeMeja={vi.fn()}
      />
    );

    // Pilih opsi jawaban
    act(() => {
      fireEvent.click(getByTestId('opsi-jawaban-0'));
    });

    const tombolKunci = getByTestId('tombol-kunci-jawaban');

    // Simulasikan double-click cepat
    act(() => {
      fireEvent.click(tombolKunci);
      fireEvent.click(tombolKunci);
    });

    // Indeks tetap soal 1
    expect(getByTestId('hud-duel').textContent).toContain('Soal 1 dari 5');
    // Pembahasan tampil
    expect(getByTestId('pembahasan-box')).toBeDefined();
  });

  it('3. klik Lanjut -> soal 2 tampil tanpa pilihan & belum terkunci', async () => {
    const { getByTestId, queryByTestId } = render(
      <DuelMeja
        mejaId="meja-1"
        onSelesaiDuel={vi.fn()}
        onKembaliKeMeja={vi.fn()}
      />
    );

    // Jawab soal 1
    act(() => {
      fireEvent.click(getByTestId('opsi-jawaban-0'));
    });
    act(() => {
      fireEvent.click(getByTestId('tombol-kunci-jawaban'));
    });

    // Lewati guard 500ms
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Klik tombol Lanjut
    const tombolLanjut = getByTestId('tombol-lanjut');
    act(() => {
      fireEvent.click(tombolLanjut);
    });

    // HUD harus berpindah ke Soal 2
    expect(getByTestId('hud-duel').textContent).toContain('Soal 2 dari 5');

    // Pada Soal 2: pembahasan harus bersih/hilang
    expect(queryByTestId('pembahasan-box')).toBeNull();

    // Tombol Kunci Jawaban harus tampil lagi dan DALAM STATUS NONAKTIF (karena belum ada opsi dipilih)
    const tombolKunciSoal2 = getByTestId('tombol-kunci-jawaban');
    expect((tombolKunciSoal2 as HTMLButtonElement).disabled).toBe(true);
  });

  it('4. skor duel bertambah tepat sekali per jawaban benar', async () => {
    const { getByTestId } = render(
      <DuelMeja
        mejaId="meja-1"
        onSelesaiDuel={vi.fn()}
        onKembaliKeMeja={vi.fn()}
      />
    );

    // Cari opsi yang sesuai dengan kunci jawaban ">"
    const opsi0 = getByTestId('opsi-jawaban-0');
    const opsi1 = getByTestId('opsi-jawaban-1');
    const opsi2 = getByTestId('opsi-jawaban-2');
    const opsiTarget = [opsi0, opsi1, opsi2].find((btn) => btn.textContent?.includes('>')) || opsi0;

    act(() => {
      fireEvent.click(opsiTarget);
    });

    const tombolKunci = getByTestId('tombol-kunci-jawaban');

    // Klik Kunci berkali-kali
    act(() => {
      fireEvent.click(tombolKunci);
      fireEvent.click(tombolKunci);
      fireEvent.click(tombolKunci);
    });

    // Pastikan status tetap stabil pada umpan_balik (tidak melonjak pindah soal)
    expect(getByTestId('pembahasan-box')).toBeDefined();
    expect(getByTestId('hud-duel').textContent).toContain('Soal 1 dari 5');

    // Pastikan tombol Kunci sudah tidak ada (digantikan pembahasan & tombol Lanjut)
    expect(document.querySelector('[data-testid="tombol-kunci-jawaban"]')).toBeNull();
    expect(getByTestId('tombol-lanjut')).toBeDefined();
  });
});
