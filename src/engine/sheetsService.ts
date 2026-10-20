/**
 * =====================================================================
 * Google Sheets Service untuk MONOPECA
 * Mengintegrasikan frontend dengan backend Google Apps Script Web App
 * =====================================================================
 */

const DEFAULT_SHEETS_URL =
  import.meta.env.VITE_SHEETS_URL ||
  'https://script.google.com/macros/s/AKfycbxErVQ4V6_co0SVNCeCDt7MemBh1Oh3S8-n7ZxfA4xwpgMYbCAigvVT9l8hjOiFdAmC/exec';

const DEFAULT_SPREADSHEET_URL =
  import.meta.env.VITE_SPREADSHEET_URL ||
  'https://docs.google.com/spreadsheets/d/1qQfn43wBEdoCLBWsuIqN5DiUvoFimT3XX1GYi5Y6TQs/edit';

const STORAGE_KEY_CUSTOM_URL = 'monepeca_custom_sheets_url';

export const getSheetsUrl = (): string => {
  const custom = localStorage.getItem(STORAGE_KEY_CUSTOM_URL);
  return custom ? custom.trim() : DEFAULT_SHEETS_URL;
};

export const setCustomSheetsUrl = (url: string): void => {
  if (url.trim()) {
    localStorage.setItem(STORAGE_KEY_CUSTOM_URL, url.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY_CUSTOM_URL);
  }
};

export const getSpreadsheetUrl = (): string => {
  return DEFAULT_SPREADSHEET_URL;
};

export interface BarisNilaiSiswa {
  waktu?: string;
  nama: string;
  tim: string;
  meja: string;
  poinMonopoli: number;
  poinDuel: number;
  totalPoinSiswa: number;
  poinTurnamen: number;
  peringkatMeja?: string | number;
}

export interface SiswaSync {
  id: string;
  nama: string;
  kemampuan: 'tinggi' | 'sedang' | 'rendah';
}

const DEFAULT_TOKEN = import.meta.env.VITE_SHEETS_TOKEN || 'monopeca123';

/**
 * Uji koneksi ke Web App Apps Script
 */
export async function testKoneksiSheets(): Promise<{ sukses: boolean; pesan: string }> {
  const url = getSheetsUrl();
  if (!url) {
    return { sukses: false, pesan: 'URL Google Apps Script belum dikonfigurasi!' };
  }

  try {
    const res = await fetch(`${url}?token=${DEFAULT_TOKEN}&aksi=ping`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();
    if (data.status === 'success') {
      return {
        sukses: true,
        pesan: data.pesan || 'Koneksi ke Google Spreadsheet berhasil terhubung!',
      };
    } else {
      return {
        sukses: false,
        pesan: data.pesan || 'Koneksi berhasil tetapi server mengembalikan status error.',
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      sukses: false,
      pesan: `Gagal terhubung ke Google Apps Script (${msg}). Pastikan otorisasi akun Google di Apps Script telah diizinkan dan akses diatur ke 'Anyone/Siapa Saja'.`,
    };
  }
}

/**
 * Kirim rekap nilai turnamen ke Spreadsheet
 */
export async function kirimRekapNilaiKeSheets(
  dataRekap: BarisNilaiSiswa[]
): Promise<{ sukses: boolean; pesan: string; jumlah?: number }> {
  const url = getSheetsUrl();
  if (!url) {
    return { sukses: false, pesan: 'URL Google Apps Script belum dikonfigurasi!' };
  }

  if (dataRekap.length === 0) {
    return { sukses: false, pesan: 'Tidak ada data nilai siswa untuk dikirim.' };
  }

  try {
    // Menggunakan text/plain agar tidak memicu preflight CORS OPTIONS pada Apps Script
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'simpanRekap',
        aksi: 'simpanRekap',
        token: DEFAULT_TOKEN,
        data: dataRekap,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const resJson = await res.json();
    if (resJson.status === 'success') {
      return {
        sukses: true,
        pesan: resJson.pesan || `Berhasil mengirim ${dataRekap.length} data nilai ke Spreadsheet!`,
        jumlah: resJson.jumlah,
      };
    } else {
      return {
        sukses: false,
        pesan: resJson.pesan || 'Gagal menyimpan rekap nilai ke Spreadsheet.',
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      sukses: false,
      pesan: `Gagal mengirim data nilai: ${msg}`,
    };
  }
}

/**
 * Sinkronkan seluruh daftar siswa ke Google Spreadsheet
 */
export async function sinkronSiswaKeSheets(
  daftarSiswa: SiswaSync[]
): Promise<{ sukses: boolean; pesan: string }> {
  const url = getSheetsUrl();
  if (!url) {
    return { sukses: false, pesan: 'URL Google Apps Script belum dikonfigurasi!' };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'simpanSiswa',
        aksi: 'simpanSiswa',
        token: DEFAULT_TOKEN,
        data: daftarSiswa,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const resJson = await res.json();
    if (resJson.status === 'success') {
      return {
        sukses: true,
        pesan: resJson.pesan || `Berhasil menyinkronkan ${daftarSiswa.length} siswa ke Spreadsheet!`,
      };
    } else {
      return {
        sukses: false,
        pesan: resJson.pesan || 'Gagal menyinkronkan data siswa ke Spreadsheet.',
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      sukses: false,
      pesan: `Gagal menyinkronkan siswa: ${msg}`,
    };
  }
}

/**
 * Tarik daftar siswa yang ada di Google Spreadsheet
 */
export async function tarikSiswaDariSheets(): Promise<{
  sukses: boolean;
  pesan: string;
  data?: SiswaSync[];
}> {
  const url = getSheetsUrl();
  if (!url) {
    return { sukses: false, pesan: 'URL Google Apps Script belum dikonfigurasi!' };
  }

  try {
    const res = await fetch(`${url}?token=${DEFAULT_TOKEN}&aksi=getSiswa`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const resJson = await res.json();
    if (resJson.status === 'success' && Array.isArray(resJson.data)) {
      const siswaList: SiswaSync[] = resJson.data.map((item: any) => ({
        id: item.id || `s_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        nama: String(item.nama || 'Siswa'),
        kemampuan: (['tinggi', 'sedang', 'rendah'].includes(item.kemampuan)
          ? item.kemampuan
          : 'sedang') as 'tinggi' | 'sedang' | 'rendah',
      }));

      return {
        sukses: true,
        pesan: `Berhasil mengambil ${siswaList.length} data siswa dari Spreadsheet.`,
        data: siswaList,
      };
    } else {
      return {
        sukses: false,
        pesan: resJson.pesan || 'Gagal mengambil data siswa dari Spreadsheet.',
      };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      sukses: false,
      pesan: `Gagal menarik data siswa: ${msg}`,
    };
  }
}
