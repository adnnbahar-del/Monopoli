/**
 * =====================================================================
 * BACKEND GOOGLE APPS SCRIPT - MONOPECA
 * Monopoli Pecahan: Media Edukatif Matematika SD Berbasis TGT
 * =====================================================================
 */

// ID Spreadsheet yang dibuat clasp
const SPREADSHEET_ID = "1qQfn43wBEdoCLBWsuIqN5DiUvoFimT3XX1GYi5Y6TQs";

// Token verifikasi sederhana untuk memfilter request iseng
const TOKEN_RAHASIA = "monepeca123";

/**
 * Helper untuk mendapatkan instance Spreadsheet
 * Mendukung container-bound maupun standalone execution
 */
function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active && active.getId()) {
      return active;
    }
  } catch (e) {
    Logger.log("getActiveSpreadsheet() error: " + e);
  }
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * Inisialisasi otomatis tab Spreadsheet dan styling header
 */
function siapkanSheet() {
  const ss = getSpreadsheet();

  // 1. Tab Rekap Nilai
  let sheetRekap = ss.getSheetByName("Rekap Nilai");
  if (!sheetRekap) {
    sheetRekap = ss.insertSheet("Rekap Nilai");
  }
  const headersRekap = [
    "Waktu Selesai",
    "Nama Siswa",
    "Tim Turnamen",
    "Meja Turnamen",
    "Poin Monopoli",
    "Poin Duel",
    "Total Poin Siswa",
    "Poin Turnamen Tim",
    "Peringkat Meja"
  ];
  sheetRekap.getRange(1, 1, 1, headersRekap.length).setValues([headersRekap]);
  const headerRekapRange = sheetRekap.getRange(1, 1, 1, headersRekap.length);
  headerRekapRange.setFontWeight("bold");
  headerRekapRange.setBackground("#1E2149");
  headerRekapRange.setFontColor("#FFFFFF");
  sheetRekap.setFrozenRows(1);

  // 2. Tab Data Siswa
  let sheetSiswa = ss.getSheetByName("Daftar Siswa");
  if (!sheetSiswa) {
    sheetSiswa = ss.insertSheet("Daftar Siswa");
  }
  const headersSiswa = ["ID Siswa", "Nama Lengkap", "Tingkat Kemampuan", "Terakhir Diperbarui"];
  sheetSiswa.getRange(1, 1, 1, headersSiswa.length).setValues([headersSiswa]);
  const headerSiswaRange = sheetSiswa.getRange(1, 1, 1, headersSiswa.length);
  headerSiswaRange.setFontWeight("bold");
  headerSiswaRange.setBackground("#2EC4B6");
  headerSiswaRange.setFontColor("#FFFFFF");
  sheetSiswa.setFrozenRows(1);

  // 3. Tab Log Aktivitas
  let sheetLog = ss.getSheetByName("Log Aktivitas");
  if (!sheetLog) {
    sheetLog = ss.insertSheet("Log Aktivitas");
  }
  const headersLog = ["Waktu", "Aksi", "Keterangan", "Jumlah Data"];
  sheetLog.getRange(1, 1, 1, headersLog.length).setValues([headersLog]);
  const headerLogRange = sheetLog.getRange(1, 1, 1, headersLog.length);
  headerLogRange.setFontWeight("bold");
  headerLogRange.setBackground("#FF6B35");
  headerLogRange.setFontColor("#FFFFFF");
  sheetLog.setFrozenRows(1);

  // Hapus tab bawaan (Sheet1 / Lembar1) jika kosong
  const sheetBawaan = ss.getSheetByName("Sheet1") || ss.getSheetByName("Lembar1");
  if (sheetBawaan && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(sheetBawaan);
    } catch (e) {
      Logger.log("Sheet default tidak dihapus: " + e);
    }
  }

  // Rapikan lebar kolom
  sheetRekap.autoResizeColumns(1, headersRekap.length);
  sheetSiswa.autoResizeColumns(1, headersSiswa.length);
  sheetLog.autoResizeColumns(1, headersLog.length);

  Logger.log("Semua tab MONOPECA berhasil disiapkan!");
  return "Struktur Spreadsheet MONOPECA Berhasil Disiapkan!";
}

/**
 * Handle GET Request (Tes Koneksi & Ambil Data)
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? (e.parameter.action || e.parameter.aksi || "ping") : "ping";

    if (action === "ping" || !action) {
      return kirimResponse({
        status: "success",
        pesan: "Koneksi backend Google Apps Script MONOPECA Berhasil Terhubung!",
        waktu: new Date().toISOString()
      });
    }

    if (action === "getSiswa" || action === "ambilSiswa") {
      const ss = getSpreadsheet();
      const sheet = ss.getSheetByName("Daftar Siswa");
      if (!sheet) {
        return kirimResponse({ status: "error", pesan: "Sheet 'Daftar Siswa' belum disiapkan." });
      }
      const data = sheet.getDataRange().getValues();
      const rows = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i][0] || data[i][1]) {
          rows.push({
            id: String(data[i][0]),
            nama: String(data[i][1]),
            kemampuan: String(data[i][2] || "sedang")
          });
        }
      }
      return kirimResponse({ status: "success", data: rows });
    }

    return kirimResponse({ status: "success", pesan: "Aksi GET tidak dikenal: " + action });
  } catch (err) {
    return kirimResponse({ status: "error", pesan: err.toString() });
  }
}

/**
 * Handle POST Request (Simpan Rekap Nilai & Sinkron Siswa)
 */
function doPost(e) {
  try {
    let payload;
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      payload = e.parameter;
    } else {
      payload = {};
    }

    // Verifikasi Token (opsional bila token disertakan di frontend)
    const validTokens = ["monepeca123", "monopeca123"];
    if (payload.token && !validTokens.includes(payload.token)) {
      return kirimResponse({ status: "error", pesan: "Token otentikasi tidak valid." });
    }

    const action = payload.action || payload.aksi || "simpanRekap";
    const ss = getSpreadsheet();
    const now = new Date();
    const formattedTime = Utilities.formatDate(now, "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

    // 1. Simpan Rekap Nilai Turnamen
    if (action === "simpanRekap" || action === "eksporNilai") {
      let sheet = ss.getSheetByName("Rekap Nilai");
      if (!sheet) {
        siapkanSheet();
        sheet = ss.getSheetByName("Rekap Nilai");
      }

      const barisBaru = [];
      const listData = payload.data || [];

      for (let i = 0; i < listData.length; i++) {
        const item = listData[i];
        barisBaru.push([
          item.waktu || formattedTime,
          item.nama || "-",
          item.tim || "-",
          item.meja || "-",
          Number(item.poinMonopoli || 0),
          Number(item.poinDuel || 0),
          Number(item.totalPoinSiswa || 0),
          Number(item.poinTurnamen || 0),
          item.peringkatMeja || "-"
        ]);
      }

      if (barisBaru.length > 0) {
        sheet.getRange(sheet.getLastRow() + 1, 1, barisBaru.length, barisBaru[0].length).setValues(barisBaru);
      }

      catatLog(ss, "Simpan Rekap Nilai", "Tersimpan " + barisBaru.length + " baris nilai", barisBaru.length);

      return kirimResponse({
        status: "success",
        pesan: "Berhasil menyimpan " + barisBaru.length + " data nilai ke Spreadsheet!",
        jumlah: barisBaru.length
      });
    }

    // 2. Sinkronkan Daftar Siswa
    if (action === "simpanSiswa") {
      let sheet = ss.getSheetByName("Daftar Siswa");
      if (!sheet) {
        siapkanSheet();
        sheet = ss.getSheetByName("Daftar Siswa");
      }

      const listSiswa = payload.data || [];
      // Kosongkan data lama kecuali header
      const lastRow = sheet.getLastRow();
      if (lastRow > 1) {
        sheet.getRange(2, 1, lastRow - 1, 4).clearContent();
      }

      const barisSiswa = [];
      for (let i = 0; i < listSiswa.length; i++) {
        const s = listSiswa[i];
        barisSiswa.push([
          s.id || Utilities.getUuid(),
          s.nama || "Siswa",
          s.kemampuan || "sedang",
          formattedTime
        ]);
      }

      if (barisSiswa.length > 0) {
        sheet.getRange(2, 1, barisSiswa.length, 4).setValues(barisSiswa);
      }

      catatLog(ss, "Sinkron Siswa", "Tersinkron " + barisSiswa.length + " data siswa", barisSiswa.length);

      return kirimResponse({
        status: "success",
        pesan: "Berhasil menyinkronkan " + barisSiswa.length + " data siswa ke Spreadsheet!",
        jumlah: barisSiswa.length
      });
    }

    // 3. Tes Ping via POST
    if (action === "ping" || action === "test") {
      return kirimResponse({
        status: "success",
        pesan: "Tes POST backend Google Apps Script MONOPECA berhasil!",
        waktu: formattedTime
      });
    }

    return kirimResponse({ status: "error", pesan: "Aksi tidak dikenali: " + action });
  } catch (err) {
    return kirimResponse({ status: "error", pesan: err.toString() });
  }
}

/**
 * Pencatatan riwayat aktivitas di tab Log Aktivitas
 */
function catatLog(ss, aksi, keterangan, jumlah) {
  try {
    const sheetLog = ss.getSheetByName("Log Aktivitas");
    if (!sheetLog) return;
    const now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    sheetLog.appendRow([now, aksi, keterangan, jumlah]);
  } catch (e) {
    Logger.log("Gagal mencatat log: " + e.toString());
  }
}

/**
 * Helper pengirim JSON response
 */
function kirimResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
