import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { Splash } from '../screens/Splash';

describe('Splash — transisi portal & navigasi', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('menampilkan identitas MONOPECA dan teks wajib', () => {
    const { getByText, getByTestId } = render(<Splash onMulai={vi.fn()} />);
    expect(getByText('MONOPECA')).toBeTruthy();
    expect(getByText('Monopoli Pecahan')).toBeTruthy();
    expect(getByText('Matematika Kelas V SD — Kurikulum Merdeka (Fase C)')).toBeTruthy();
    expect(getByText('Media Belajar Kolaboratif Model Teams Games Tournament (TGT)')).toBeTruthy();
    expect(getByText('Ramah Anak • Tanpa Iklan')).toBeTruthy();
    expect(getByTestId('tombol-mulai').textContent).toContain('Ketuk Untuk Mulai');
  });

  it('memanggil onMulai tepat satu kali walau tombol diklik berulang', () => {
    const onMulai = vi.fn();
    const { getByTestId } = render(<Splash onMulai={onMulai} />);
    const tombol = getByTestId('tombol-mulai');

    fireEvent.click(tombol);
    fireEvent.click(tombol);
    fireEvent.click(tombol);
    expect(onMulai).not.toHaveBeenCalled();
    expect((tombol as HTMLButtonElement).disabled).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(onMulai).toHaveBeenCalledTimes(1);
  });

  it('memulihkan tombol & menampilkan pesan bila navigasi gagal', () => {
    const onMulai = vi.fn(() => {
      throw new Error('gagal');
    });
    const { getByTestId, getByRole } = render(<Splash onMulai={onMulai} />);
    const tombol = getByTestId('tombol-mulai') as HTMLButtonElement;

    fireEvent.click(tombol);
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(onMulai).toHaveBeenCalledTimes(1);
    expect(getByRole('alert').textContent).toContain('Coba ketuk sekali lagi');
    expect(tombol.disabled).toBe(false);

    // Bisa mencoba lagi
    fireEvent.click(tombol);
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(onMulai).toHaveBeenCalledTimes(2);
  });

  it('tidak memanggil onMulai bila komponen dilepas sebelum transisi selesai', () => {
    const onMulai = vi.fn();
    const { getByTestId, unmount } = render(<Splash onMulai={onMulai} />);
    fireEvent.click(getByTestId('tombol-mulai'));
    unmount();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(onMulai).not.toHaveBeenCalled();
  });
});
