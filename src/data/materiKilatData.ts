/**
 * DATA MATERI KILAT PECAHAN — Fase C (Kelas V)
 * ------------------------------------------------------------------
 * File ini sengaja dibuat terpisah agar mudah diedit guru.
 * Penulisan pecahan di semua teks memakai penanda:
 *   {3/8}    → pecahan biasa bersusun
 *   {1 3/4}  → pecahan campuran (bilangan bulat di kiri)
 *   {3×2/4×2} → pembilang/penyebut berupa ekspresi juga boleh
 * Tanda kurung kurawal akan otomatis ditampilkan bersusun.
 */
import type { BentukIsian, WajibBentuk } from '../engine/kuisMateri';

/** Gambar/alat peraga. `tipe` menentukan komponen yang dipakai. */
export type VisualMateri =
  | { tipe: 'lingkaranInteraktif'; props: { penyebut: number; terarsir: number } }
  | { tipe: 'senilaiBatang'; props: { pembilang: number; penyebut: number; pengaliMaks: number } }
  | { tipe: 'bandingBatang'; props: { a: [number, number]; b: [number, number] } }
  | { tipe: 'garisUrut'; props: { pecahan: [number, number][] } }
  | { tipe: 'campuranLingkaran'; props: { penyebut: number; jumlahBagian: number } }
  | { tipe: 'jumlahBatang'; props: { a: [number, number]; b: [number, number] } }
  | { tipe: 'kurangLingkaran'; props: { awal: [number, number]; ambil: [number, number] } }
  | { tipe: 'operasiCampuran'; props: { a: [number, number, number]; b: [number, number, number] } }
  | { tipe: 'batangCerita'; props: { penyebut: number; bagian: { nilai: number; label: string }[] } }
  /** Gambar statis untuk soal kuis */
  | { tipe: 'lingkaran'; props: { penyebut: number; terarsir: number } }
  | { tipe: 'garisBilangan'; props: { pembagian: number; titikKe: number } };

export type SoalAyoCoba =
  | {
      tipe: 'pilihan';
      soal: string;
      pilihan: string[];
      jawaban: string;
      pembahasan: string;
      visual?: VisualMateri;
      bonus?: boolean;
    }
  | {
      tipe: 'isian';
      soal: string;
      bentuk: BentukIsian;
      jawaban: string;
      wajib?: WajibBentuk;
      satuan?: string;
      petunjuk?: string;
      pembahasan: string;
      visual?: VisualMateri;
      bonus?: boolean;
    }
  | {
      tipe: 'urutkan';
      soal: string;
      arah: 'naik' | 'turun';
      item: string[];
      jawaban: string[];
      pembahasan: string;
      bonus?: boolean;
    };

export interface LangkahMateri {
  teks: string;
}

export interface MateriTP {
  id: string;
  nomor: number;
  judulPendek: string;
  judul: string;
  tujuan: string;
  visual: VisualMateri;
  /** Petunjuk singkat cara memakai alat peraga */
  petunjukVisual: string;
  konsep: string[];
  /** Judul contoh yang dikerjakan langkah demi langkah */
  judulLangkah: string;
  langkah: LangkahMateri[];
  contohNyata: { judul: string; cerita: string; kalimatMatematika: string };
  contohTambahan?: { judul: string; cerita: string };
  awasKeliru: { salah: string; benar: string; alasan: string; tambahan?: string };
  ayoCoba: SoalAyoCoba[];
  tips: string;
  ringkasan: string;
}

export const MATERI_KILAT: MateriTP[] = [
  // ─────────────────────────────── TP1 ───────────────────────────────
  {
    id: 'tp1',
    nomor: 1,
    judulPendek: 'Kenal',
    judul: 'Mengenal Pecahan, Pembilang, dan Penyebut',
    tujuan:
      'Kamu bisa menjelaskan arti pecahan, menunjukkan pembilang dan penyebut, serta menuliskan pecahan dari gambar, kumpulan benda, dan garis bilangan.',
    visual: { tipe: 'lingkaranInteraktif', props: { penyebut: 8, terarsir: 3 } },
    petunjukVisual: 'Pilih banyak potongan (2–12), lalu ketuk potongan kue untuk mengarsirnya.',
    konsep: [
      'Pecahan adalah bagian dari satu keseluruhan yang dibagi menjadi bagian-bagian sama besar.',
      'Ditulis {a/b}. Pembilang (a, di atas) = banyak bagian yang diambil/diarsir. Penyebut (b, di bawah) = banyak seluruh bagian. Penyebut tidak boleh 0.',
      'Pecahan bisa digambarkan dengan tiga cara: bagian dari bangun (kue), bagian dari kumpulan (kelereng), dan titik pada garis bilangan.',
      '{3/8} dibaca "tiga per delapan".',
    ],
    judulLangkah: 'Ibu memotong bolu menjadi 8 potong sama besar, lalu Ahmad memakan 3 potong.',
    langkah: [
      { teks: 'Seluruh potongan ada 8, jadi penyebutnya 8.' },
      { teks: 'Potongan yang dimakan ada 3, jadi pembilangnya 3.' },
      { teks: 'Bagian yang dimakan = {3/8}.' },
      { teks: 'Sisa bolu = 8 − 3 = 5 potong, yaitu {5/8}.' },
    ],
    contohNyata: {
      judul: 'Kue Bolu Sukaraja',
      cerita: 'Ibu memotong 1 loyang bolu menjadi 8 potong sama rata dan Ahmad memakan 3 potong.',
      kalimatMatematika: 'Bagian yang dimakan {3/8}, sisanya {5/8}.',
    },
    contohTambahan: {
      judul: 'Model kumpulan: Buah Kopi',
      cerita: 'Dari 12 buah kopi merah yang dipetik, {1/4}-nya busuk. 12 dibagi 4 = 3, jadi ada 3 buah yang busuk.',
    },
    awasKeliru: {
      salah: 'Kue dipotong 4 bagian yang tidak sama besar, 1 bagian = {1/4}.',
      benar: 'Itu bukan {1/4}.',
      alasan: 'Pecahan hanya berlaku jika bagian-bagiannya sama besar.',
      tambahan: 'Jangan tertukar, pembilang di atas dan penyebut di bawah.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: 'Pecahan bagian yang diarsir adalah …',
        bentuk: 'pecahan',
        jawaban: '2/6',
        visual: { tipe: 'lingkaran', props: { penyebut: 6, terarsir: 2 } },
        petunjuk: 'Hitung semua potongan untuk penyebut, lalu hitung potongan yang diarsir untuk pembilang.',
        pembahasan: 'Ada 6 bagian sama besar dan 2 bagian diarsir, jadi {2/6} (sama dengan {1/3}).',
      },
      {
        tipe: 'isian',
        soal: 'Ada 12 kelereng dan {1/4}-nya merah. Berapa kelereng merah?',
        bentuk: 'angka',
        jawaban: '3',
        satuan: 'kelereng',
        petunjuk: 'Bagi 12 kelereng menjadi 4 kelompok sama banyak.',
        pembahasan: '12 : 4 = 3, jadi ada 3 kelereng merah.',
      },
      {
        tipe: 'pilihan',
        soal: 'Titik pada garis bilangan itu menunjukkan …',
        visual: { tipe: 'garisBilangan', props: { pembagian: 5, titikKe: 2 } },
        pilihan: ['{2/5}', '{1/2}', '{2/3}', '{5/2}'],
        jawaban: '{2/5}',
        pembahasan: 'Garis dari 0 sampai 1 dibagi 5 bagian sama panjang dan titiknya ada di tanda ke-2, jadi {2/5}.',
      },
    ],
    tips: 'Penyebut = banyak semua potongan, pembilang = potongan yang dipilih. Pastikan potongannya sama besar dulu, ya!',
    ringkasan: 'Pecahan {a/b} berarti a bagian dari b bagian yang sama besar.',
  },

  // ─────────────────────────────── TP2 ───────────────────────────────
  {
    id: 'tp2',
    nomor: 2,
    judulPendek: 'Senilai',
    judul: 'Pecahan Senilai dan Menyederhanakan',
    tujuan: 'Kamu bisa mencari pecahan senilai dan menyederhanakan pecahan sampai bentuk paling sederhana.',
    visual: { tipe: 'senilaiBatang', props: { pembilang: 1, penyebut: 2, pengaliMaks: 5 } },
    petunjukVisual: 'Geser "pengali". Potongan batang bawah makin kecil, tetapi panjang arsirannya tetap sama.',
    konsep: [
      'Pecahan senilai adalah pecahan yang nilainya sama walaupun angkanya berbeda, misalnya {1/2} = {2/4} = {3/6}.',
      'Cara mencarinya: kalikan pembilang dan penyebut dengan bilangan yang sama (bukan 0).',
      'Menyederhanakan pecahan: bagi pembilang dan penyebut dengan FPB-nya.',
      'Bentuk paling sederhana tercapai jika pembilang dan penyebut tidak bisa dibagi lagi dengan bilangan yang sama selain 1.',
    ],
    judulLangkah: 'A. Tiga pecahan senilai dengan {3/4}. B. Menyederhanakan {12/18}.',
    langkah: [
      { teks: 'A. {3×2/4×2} = {6/8}' },
      { teks: 'A. {3×3/4×3} = {9/12}' },
      { teks: 'A. {3×4/4×4} = {12/16}' },
      { teks: 'B. Faktor 12: 1, 2, 3, 4, 6, 12. Faktor 18: 1, 2, 3, 6, 9, 18.' },
      { teks: 'B. FPB = 6.' },
      { teks: 'B. {12:6/18:6} = {2/3}' },
    ],
    contohNyata: {
      judul: 'Lapak Semangka Pak Kardi',
      cerita: 'Semangka dibelah 4 bagian dan 2 bagian dijual.',
      kalimatMatematika: '{2/4} semangka sama dengan {1/2} semangka.',
    },
    contohTambahan: {
      judul: 'Melipat kertas',
      cerita:
        'Selembar kertas dilipat 2 dan 1 bagian diwarnai. Setelah dilipat lagi, bagian yang berwarna menjadi {2/4}, lalu {4/8}. Luas warnanya tidak berubah.',
    },
    awasKeliru: {
      salah: '{1/2} = {1+1/2+1} = {2/3}',
      benar: '{1/2} = {1×2/2×2} = {2/4}',
      alasan:
        'Untuk mencari pecahan senilai, pembilang dan penyebut dikali atau dibagi, bukan ditambah. Mengalikan pembilangnya saja juga salah.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: '{2/5} = {…/15}. Berapa angka yang tepat?',
        bentuk: 'angka',
        jawaban: '6',
        petunjuk: '5 dikali berapa supaya menjadi 15? Kalikan pembilangnya dengan angka yang sama.',
        pembahasan: '5 × 3 = 15, jadi 2 × 3 = 6. Hasilnya {2/5} = {6/15}.',
      },
      {
        tipe: 'isian',
        soal: 'Sederhanakan {8/12} sampai bentuk paling sederhana.',
        bentuk: 'pecahan',
        jawaban: '2/3',
        wajib: 'sederhana',
        petunjuk: 'Cari FPB dari 8 dan 12, lalu bagi pembilang dan penyebutnya.',
        pembahasan: 'FPB 8 dan 12 = 4. {8:4/12:4} = {2/3}.',
      },
      {
        tipe: 'pilihan',
        soal: 'Mana yang tidak senilai dengan {1/3}?',
        pilihan: ['{2/6}', '{3/9}', '{3/6}', '{4/12}'],
        jawaban: '{3/6}',
        pembahasan: '{3/6} = {1/2}, bukan {1/3}. Pecahan lainnya bisa disederhanakan menjadi {1/3}.',
      },
    ],
    tips: 'Kalau pembilang dikali 2, penyebut juga harus dikali 2 supaya adil. Kali atau bagi, jangan tambah!',
    ringkasan: 'Kalikan atau bagi pembilang dan penyebut dengan bilangan yang sama. Nilainya tetap.',
  },

  // ─────────────────────────────── TP3 ───────────────────────────────
  {
    id: 'tp3',
    nomor: 3,
    judulPendek: 'Banding',
    judul: 'Membandingkan Dua Pecahan',
    tujuan: 'Kamu bisa membandingkan dua pecahan dengan tanda <, >, atau =.',
    visual: { tipe: 'bandingBatang', props: { a: [2, 3], b: [3, 4] } },
    petunjukVisual: 'Ubah pembilang dan penyebut kedua batang. Tandanya muncul otomatis.',
    konsep: [
      'Penyebut sama: pembilang yang lebih besar berarti pecahannya lebih besar ({5/8} > {3/8}).',
      'Pembilang sama: penyebut yang lebih kecil berarti pecahannya lebih besar, karena potongannya lebih besar ({1/2} > {1/3} > {1/4}).',
      'Penyebut berbeda: samakan penyebut dengan KPK, lalu bandingkan pembilangnya.',
      'Cara cepat dengan perkalian silang: untuk {a/b} dan {c/d}, bandingkan a × d dengan b × c.',
    ],
    judulLangkah: 'Bandingkan {2/3} dan {3/4}.',
    langkah: [
      { teks: 'KPK 3 dan 4 = 12.' },
      { teks: '{2/3} = {8/12} dan {3/4} = {9/12}.' },
      { teks: '8 < 9, jadi {2/3} < {3/4}.' },
      { teks: 'Cek dengan perkalian silang: 2 × 4 = 8 dan 3 × 3 = 9, jadi 8 < 9 ✓.' },
    ],
    contohNyata: {
      judul: 'Kebun Kopi dan Lada Sukaraja',
      cerita: 'Panen kopi Pak Wayan {2/3} kuintal dan panen lada {3/4} kuintal.',
      kalimatMatematika: 'Karena {3/4} > {2/3} ({9/12} > {8/12}), panen lada lebih banyak.',
    },
    awasKeliru: {
      salah: '{1/4} > {1/2} karena 4 lebih besar dari 2.',
      benar: '{1/4} < {1/2}',
      alasan: 'Kue yang dibagi 4 menghasilkan potongan yang lebih kecil daripada kue yang dibagi 2.',
    },
    ayoCoba: [
      {
        tipe: 'pilihan',
        soal: '{5/8} … {3/8}',
        pilihan: ['<', '>', '='],
        jawaban: '>',
        pembahasan: 'Penyebutnya sama (8), jadi bandingkan pembilangnya: 5 > 3. Jadi {5/8} > {3/8}.',
      },
      {
        tipe: 'pilihan',
        soal: '{1/5} … {1/3}',
        pilihan: ['<', '>', '='],
        jawaban: '<',
        pembahasan: 'Pembilangnya sama. Penyebut yang lebih besar berarti potongannya lebih kecil, jadi {1/5} < {1/3}.',
      },
      {
        tipe: 'pilihan',
        soal: '{3/5} … {4/7}',
        pilihan: ['<', '>', '='],
        jawaban: '>',
        pembahasan: '{3/5} = {21/35} dan {4/7} = {20/35}. Karena {21/35} > {20/35}, maka {3/5} > {4/7}.',
      },
      {
        tipe: 'pilihan',
        soal: '{2/4} … {3/6}',
        pilihan: ['<', '>', '='],
        jawaban: '=',
        bonus: true,
        pembahasan: '{2/4} = {1/2} dan {3/6} = {1/2}, jadi {2/4} = {3/6}.',
      },
    ],
    tips: 'Ingat mulut buaya! Tanda < atau > selalu membuka ke arah pecahan yang lebih besar.',
    ringkasan: 'Samakan penyebutnya dulu, lalu bandingkan pembilangnya.',
  },

  // ─────────────────────────────── TP4 ───────────────────────────────
  {
    id: 'tp4',
    nomor: 4,
    judulPendek: 'Urut',
    judul: 'Mengurutkan Tiga atau Empat Pecahan',
    tujuan: 'Kamu bisa mengurutkan beberapa pecahan dari terkecil ke terbesar (naik) atau sebaliknya (turun).',
    visual: { tipe: 'garisUrut', props: { pecahan: [[1, 4], [1, 2], [2, 3]] } },
    petunjukVisual: 'Seret kartu pecahan ke titiknya di garis bilangan, atau ketuk kartu lalu ketuk titiknya.',
    konsep: [
      'Langkah 1: cari KPK semua penyebut.',
      'Langkah 2: ubah setiap pecahan menjadi pecahan senilai dengan penyebut KPK tersebut.',
      'Langkah 3: urutkan berdasarkan pembilangnya.',
      'Langkah 4: tulis kembali dengan pecahan aslinya.',
    ],
    judulLangkah: 'Urutkan naik {3/4}, {2/3}, {5/6}, {1/2}.',
    langkah: [
      { teks: 'KPK 4, 3, 6, 2 = 12.' },
      { teks: '{3/4} = {9/12}; {2/3} = {8/12}; {5/6} = {10/12}; {1/2} = {6/12}.' },
      { teks: 'Urutan pembilang: 6 < 8 < 9 < 10.' },
      { teks: 'Hasil: {1/2}, {2/3}, {3/4}, {5/6}.' },
    ],
    contohNyata: {
      judul: 'Dermaga Perahu Nelayan Semaka',
      cerita: 'Perahu A membawa {1/2} ton ikan, perahu B {1/4} ton, dan perahu C {2/3} ton.',
      kalimatMatematika:
        'Dengan KPK 12 diperoleh {6/12}, {3/12}, dan {8/12}. Urutan dari yang paling ringan: {1/4} ton (B), {1/2} ton (A), {2/3} ton (C).',
    },
    awasKeliru: {
      salah: 'Mengurutkan berdasarkan penyebut saja, sehingga {1/2}, {2/3}, {3/4} dianggap naik karena 2 < 3 < 4.',
      benar: 'Kebetulan hasil ini benar, tetapi caranya keliru dan bisa menipu. Contohnya {1/2}, {1/3}, {1/4} justru turun.',
      alasan: 'Selalu samakan penyebutnya dulu. Perhatikan juga apakah soal meminta urutan naik atau turun.',
    },
    ayoCoba: [
      {
        tipe: 'urutkan',
        soal: 'Urutkan turun (dari yang terbesar).',
        arah: 'turun',
        item: ['{2/5}', '{1/2}', '{3/10}'],
        jawaban: ['{1/2}', '{2/5}', '{3/10}'],
        pembahasan: 'Dengan KPK 10: {1/2} = {5/10}, {2/5} = {4/10}, {3/10}. Urutan turun: {1/2}, {2/5}, {3/10}.',
      },
      {
        tipe: 'urutkan',
        soal: 'Urutkan naik (dari yang terkecil).',
        arah: 'naik',
        item: ['{5/6}', '{7/12}', '{3/4}'],
        jawaban: ['{7/12}', '{3/4}', '{5/6}'],
        pembahasan: 'Dengan KPK 12: {7/12}, {3/4} = {9/12}, {5/6} = {10/12}. Urutan naik: {7/12}, {3/4}, {5/6}.',
      },
      {
        tipe: 'urutkan',
        soal: 'Urutkan naik (dari yang terkecil).',
        arah: 'naik',
        item: ['{1/3}', '{1/8}', '{1/5}'],
        jawaban: ['{1/8}', '{1/5}', '{1/3}'],
        pembahasan: 'Pembilangnya sama (1). Penyebut terbesar berarti potongan terkecil: {1/8} < {1/5} < {1/3}.',
      },
    ],
    tips: 'Samakan semua penyebut, urutkan pembilangnya, lalu tulis lagi pecahan aslinya!',
    ringkasan: 'Setelah penyebutnya disamakan, mengurutkan pecahan sama mudahnya dengan mengurutkan bilangan biasa.',
  },

  // ─────────────────────────────── TP5 ───────────────────────────────
  {
    id: 'tp5',
    nomor: 5,
    judulPendek: 'Campuran',
    judul: 'Pecahan Biasa, Pecahan Lebih dari 1, dan Pecahan Campuran',
    tujuan:
      'Kamu bisa membedakan pecahan biasa dan pecahan campuran, serta mengubah bentuk yang satu ke bentuk yang lain.',
    visual: { tipe: 'campuranLingkaran', props: { penyebut: 4, jumlahBagian: 7 } },
    petunjukVisual: 'Tekan + atau − untuk menambah atau mengurangi seperempat bagian.',
    konsep: [
      'Pecahan biasa (sejati): pembilang < penyebut, nilainya kurang dari 1 (contoh {3/4}).',
      'Jika pembilang = penyebut, nilainya 1 ({4/4} = 1). Jika pembilang > penyebut, nilainya lebih dari 1 ({7/4}).',
      'Pecahan campuran terdiri atas bilangan bulat dan pecahan ({1 3/4}, dibaca "satu tiga per empat").',
      'Ubah ke campuran: pembilang dibagi penyebut, hasilnya menjadi bilangan bulat dan sisanya menjadi pembilang. Ubah ke pecahan biasa: {(bulat × penyebut + pembilang)/penyebut}.',
    ],
    judulLangkah: 'A. Ubah {7/4} ke pecahan campuran. B. Ubah {2 1/3} ke pecahan biasa.',
    langkah: [
      { teks: 'A. 7 : 4 = 1 sisa 3.' },
      { teks: 'A. Jadi {7/4} = {1 3/4}.' },
      { teks: 'B. {2 1/3} = {2×3 + 1/3}' },
      { teks: 'B. = {7/3}' },
    ],
    contohNyata: {
      judul: 'Kue Lapis di Warung Bu Sri',
      cerita: 'Satu loyang kue lapis dipotong menjadi 4 potong sama besar. Hari ini terjual 7 potong.',
      kalimatMatematika: '7 potong = {7/4} loyang = {1 3/4} loyang.',
    },
    awasKeliru: {
      salah: '{2 1/3} = {2+1/3} = {3/3}',
      benar: '{2 1/3} = {2×3 + 1/3} = {7/3}',
      alasan: 'Bilangan bulat harus dikali penyebut dulu, baru ditambah pembilang.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: '{9/4} = … (tulis sebagai pecahan campuran)',
        bentuk: 'campuran',
        jawaban: '2 1/4',
        wajib: 'campuran',
        petunjuk: 'Bagi 9 dengan 4. Hasil baginya menjadi bilangan bulat, sisanya menjadi pembilang.',
        pembahasan: '9 : 4 = 2 sisa 1, jadi {9/4} = {2 1/4}.',
      },
      {
        tipe: 'isian',
        soal: '{3 2/5} = {…/5}. Berapa pembilangnya?',
        bentuk: 'angka',
        jawaban: '17',
        petunjuk: 'Kalikan bilangan bulat dengan penyebut, lalu tambah pembilangnya.',
        pembahasan: '3 × 5 + 2 = 17, jadi {3 2/5} = {17/5}.',
      },
      {
        tipe: 'pilihan',
        soal: 'Mana yang nilainya lebih dari 1?',
        pilihan: ['{3/4}', '{5/5}', '{8/5}', '{1/2}'],
        jawaban: '{8/5}',
        pembahasan: 'Pembilang 8 lebih besar dari penyebut 5, jadi {8/5} = {1 3/5}, lebih dari 1. {5/5} tepat sama dengan 1.',
      },
    ],
    tips: 'Kalau pembilangnya lebih besar dari penyebut, artinya ada satu kue utuh atau lebih!',
    ringkasan: 'Pecahan yang nilainya lebih dari 1 bisa ditulis sebagai pecahan campuran, dan sebaliknya.',
  },

  // ─────────────────────────────── TP6 ───────────────────────────────
  {
    id: 'tp6',
    nomor: 6,
    judulPendek: 'Jumlah',
    judul: 'Penjumlahan Pecahan',
    tujuan: 'Kamu bisa menjumlahkan pecahan berpenyebut sama dan berpenyebut berbeda, lalu menyederhanakan hasilnya.',
    visual: { tipe: 'jumlahBatang', props: { a: [1, 2], b: [1, 3] } },
    petunjukVisual: 'Tekan "Samakan penyebut", lalu "Gabungkan" untuk melihat hasil penjumlahannya.',
    konsep: [
      'Penyebut sama: jumlahkan pembilangnya, penyebutnya tetap ({2/8} + {3/8} = {5/8}).',
      'Penyebut berbeda: samakan penyebut dengan KPK, lalu jumlahkan pembilangnya.',
      'Sederhanakan hasil akhirnya.',
      'Jika hasilnya lebih dari 1, ubah menjadi pecahan campuran.',
    ],
    judulLangkah: 'Tiga contoh penjumlahan pecahan.',
    langkah: [
      { teks: 'A. {1/2} + {1/3} → KPK 6 → {3/6} + {2/6} = {5/6}.' },
      { teks: 'B. {1/6} + {1/3} → {1/6} + {2/6} = {3/6} = {1/2}.' },
      { teks: 'C. {3/4} + {2/3} → KPK 12 → {9/12} + {8/12} = {17/12} = {1 5/12}.' },
    ],
    contohNyata: {
      judul: 'Toko Kain Tapis Lampung',
      cerita:
        'Pengrajin memakai {1/2} meter benang emas untuk tepi selendang dan {1/3} meter untuk motif pucuk rebung.',
      kalimatMatematika: 'Totalnya {1/2} + {1/3} = {3/6} + {2/6} = {5/6} meter.',
    },
    awasKeliru: {
      salah: '{1/2} + {1/3} = {2/5}',
      benar: '{1/2} + {1/3} = {5/6}',
      alasan:
        'Penyebut tidak ikut dijumlahkan. Perhatikan juga bahwa {2/5} lebih kecil dari {1/2}. Mana mungkin hasil penjumlahan lebih kecil dari salah satu bilangan yang dijumlahkan?',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: '{2/7} + {3/7} = …',
        bentuk: 'pecahan',
        jawaban: '5/7',
        petunjuk: 'Penyebutnya sudah sama. Jumlahkan pembilangnya saja.',
        pembahasan: 'Penyebutnya sama, jumlahkan pembilangnya: 2 + 3 = 5. Hasilnya {5/7}.',
      },
      {
        tipe: 'isian',
        soal: '{1/4} + {2/3} = …',
        bentuk: 'pecahan',
        jawaban: '11/12',
        petunjuk: 'Samakan penyebutnya dulu dengan KPK 4 dan 3.',
        pembahasan: 'KPK 4 dan 3 = 12. {3/12} + {8/12} = {11/12}.',
      },
      {
        tipe: 'isian',
        soal: '{5/6} + {1/2} = … (tulis dalam bentuk pecahan campuran)',
        bentuk: 'campuran',
        jawaban: '1 1/3',
        petunjuk: 'Samakan penyebutnya menjadi 6, jumlahkan, lalu ubah ke pecahan campuran.',
        pembahasan: 'KPK 6: {5/6} + {3/6} = {8/6} = {4/3} = {1 1/3}.',
      },
    ],
    tips: 'Samakan penyebutnya dulu. Setelah penyebutnya sama, baru jumlahkan pembilangnya. Penyebutnya tidak ikut dijumlah!',
    ringkasan: 'Samakan penyebut, jumlahkan pembilang, lalu sederhanakan.',
  },

  // ─────────────────────────────── TP7 ───────────────────────────────
  {
    id: 'tp7',
    nomor: 7,
    judulPendek: 'Kurang',
    judul: 'Pengurangan Pecahan',
    tujuan: 'Kamu bisa mengurangkan pecahan berpenyebut sama dan berbeda, termasuk 1 dikurangi pecahan.',
    visual: { tipe: 'kurangLingkaran', props: { awal: [3, 4], ambil: [1, 2] } },
    petunjukVisual: 'Tekan "Ambil ½" dan lihat berapa yang tersisa.',
    konsep: [
      'Penyebut sama: kurangkan pembilangnya, penyebutnya tetap.',
      'Penyebut berbeda: samakan penyebut dengan KPK terlebih dahulu.',
      'Bilangan 1 bisa ditulis sebagai pecahan berpenyebut apa saja (1 = {8/8}).',
      'Sederhanakan hasilnya.',
    ],
    judulLangkah: 'Tiga contoh pengurangan pecahan.',
    langkah: [
      { teks: 'A. {5/6} − {2/6} = {3/6} = {1/2}.' },
      { teks: 'B. {5/6} − {1/4} → KPK 12 → {10/12} − {3/12} = {7/12}.' },
      { teks: 'C. 1 − {3/8} = {8/8} − {3/8} = {5/8}.' },
    ],
    contohNyata: {
      judul: 'Toko Gula Aren Murni',
      cerita: 'Pedagang memiliki {3/4} kg gula aren dan pembeli membeli {1/2} kg.',
      kalimatMatematika: 'Sisanya {3/4} − {2/4} = {1/4} kg.',
    },
    awasKeliru: {
      salah: '{3/4} − {1/2} = {2/2}',
      benar: '{3/4} − {2/4} = {1/4}',
      alasan: 'Penyebut tidak ikut dikurangkan.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: '{7/9} − {4/9} = … (bentuk paling sederhana)',
        bentuk: 'pecahan',
        jawaban: '1/3',
        wajib: 'sederhana',
        petunjuk: 'Kurangkan pembilangnya, lalu sederhanakan hasilnya.',
        pembahasan: '{7/9} − {4/9} = {3/9}. FPB 3 dan 9 = 3, jadi {3/9} = {1/3}.',
      },
      {
        tipe: 'isian',
        soal: '{2/3} − {1/4} = …',
        bentuk: 'pecahan',
        jawaban: '5/12',
        petunjuk: 'Samakan penyebutnya dulu dengan KPK 3 dan 4.',
        pembahasan: 'KPK 3 dan 4 = 12. {8/12} − {3/12} = {5/12}.',
      },
      {
        tipe: 'isian',
        soal: '1 − {2/5} = …',
        bentuk: 'pecahan',
        jawaban: '3/5',
        petunjuk: 'Tulis 1 sebagai pecahan berpenyebut 5.',
        pembahasan: '1 = {5/5}, jadi {5/5} − {2/5} = {3/5}.',
      },
    ],
    tips: 'Sama seperti penjumlahan, samakan penyebutnya dulu sebelum mengurangkan pembilangnya!',
    ringkasan: 'Samakan penyebut, kurangkan pembilang, lalu sederhanakan.',
  },

  // ─────────────────────────────── TP8 ───────────────────────────────
  {
    id: 'tp8',
    nomor: 8,
    judulPendek: 'Operasi Campuran',
    judul: 'Penjumlahan dan Pengurangan Pecahan Campuran',
    tujuan: 'Kamu bisa menjumlahkan dan mengurangkan pecahan campuran.',
    visual: { tipe: 'operasiCampuran', props: { a: [1, 1, 2], b: [2, 1, 4] } },
    petunjukVisual: 'Tekan "Kumpulkan" untuk mengumpulkan kue utuh dan potongannya.',
    konsep: [
      'Cara 1: jumlahkan bilangan bulat dengan bilangan bulat dan pecahan dengan pecahan (penyebutnya disamakan dulu).',
      'Cara 2: ubah semuanya ke pecahan biasa, hitung, lalu ubah kembali ke pecahan campuran.',
      'Cara 2 lebih aman untuk pengurangan, terutama jika pecahan pertama lebih kecil dari pecahan kedua.',
    ],
    judulLangkah: 'A. {1 1/2} + {2 1/4}. B. {3 1/4} − {1 1/2}.',
    langkah: [
      { teks: 'A. Bulat: 1 + 2 = 3.' },
      { teks: 'A. Pecahan: {2/4} + {1/4} = {3/4}.' },
      { teks: 'A. Hasilnya {3 3/4}.' },
      { teks: 'B. {3 1/4} − {1 1/2} → {13/4} − {6/4} = {7/4} = {1 3/4}.' },
    ],
    contohNyata: {
      judul: 'Kopi Sangrai Pak Wayan',
      cerita: 'Pak Wayan punya {2 1/2} kg kopi sangrai dan terjual {1 3/4} kg.',
      kalimatMatematika: 'Sisanya {10/4} − {7/4} = {3/4} kg.',
    },
    awasKeliru: {
      salah: '{3 1/4} − {1 1/2} = 2 … lalu {1/4} − {1/2} "tidak bisa", sehingga jawabannya ditulis asal.',
      benar: 'Ubah dulu ke pecahan biasa: {13/4} − {6/4} = {7/4} = {1 3/4}.',
      alasan: 'Kalau pecahan pertama lebih kecil dari pecahan kedua, ubah semuanya ke pecahan biasa lebih dulu.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: '{2 1/3} + {1 1/2} = …',
        bentuk: 'campuran',
        jawaban: '3 5/6',
        petunjuk: 'Jumlahkan bilangan bulatnya, lalu jumlahkan pecahannya setelah penyebutnya disamakan.',
        pembahasan: 'Bulat: 2 + 1 = 3. Pecahan: {2/6} + {3/6} = {5/6}. Hasilnya {3 5/6}.',
      },
      {
        tipe: 'isian',
        soal: '{4 1/2} − {2 3/4} = …',
        bentuk: 'campuran',
        jawaban: '1 3/4',
        petunjuk: 'Ubah keduanya ke pecahan biasa berpenyebut 4 dulu.',
        pembahasan: '{18/4} − {11/4} = {7/4} = {1 3/4}.',
      },
      {
        tipe: 'isian',
        soal: '{1 2/3} + {2/3} = …',
        bentuk: 'campuran',
        jawaban: '2 1/3',
        petunjuk: 'Jumlahkan pecahannya dulu. Kalau hasilnya lebih dari 1, tambahkan ke bilangan bulat.',
        pembahasan: '{2/3} + {2/3} = {4/3} = {1 1/3}. Ditambah 1 menjadi {2 1/3}.',
      },
    ],
    tips: 'Bingung karena pecahannya tidak cukup untuk dikurangi? Ubah saja semuanya jadi pecahan biasa!',
    ringkasan: 'Kerjakan bilangan bulat dan pecahannya secara terpisah, atau ubah ke pecahan biasa dulu.',
  },

  // ─────────────────────────────── TP9 ───────────────────────────────
  {
    id: 'tp9',
    nomor: 9,
    judulPendek: 'Soal Cerita',
    judul: 'Soal Cerita dan Penerapan Sehari-hari',
    tujuan: 'Kamu bisa menyelesaikan soal cerita yang memakai penjumlahan dan pengurangan pecahan.',
    visual: {
      tipe: 'batangCerita',
      props: { penyebut: 4, bagian: [{ nilai: 1, label: 'Cabai merah' }, { nilai: 2, label: 'Bawang putih' }] },
    },
    petunjukVisual: 'Ketuk keterangan warna untuk menyorot bagiannya.',
    konsep: [
      'Baca dengan teliti, lalu tulis apa yang diketahui dan apa yang ditanya.',
      'Cari kata kunci: "membeli lagi / ditambah / total / seluruhnya" berarti +. "Dipakai / diberikan / sisa / selisih / berkurang" berarti −.',
      'Tulis kalimat matematikanya, lalu hitung dengan aturan pecahan.',
      'Tulis kesimpulan lengkap dengan satuan dan periksa apakah jawabannya masuk akal.',
    ],
    judulLangkah:
      'Bu Ani punya {3/4} liter minyak dan membeli lagi {1/2} liter. Ia memakai {2/3} liter untuk menggoreng. Berapa sisa minyaknya?',
    langkah: [
      { teks: 'Diketahui: {3/4}, +{1/2}, −{2/3}. Ditanya: sisa.' },
      { teks: 'Kalimat matematika: {3/4} + {1/2} − {2/3}.' },
      { teks: 'KPK 12 → {9/12} + {6/12} − {8/12} = {7/12}.' },
      { teks: 'Kesimpulan: sisa minyak {7/12} liter.' },
    ],
    contohNyata: {
      judul: 'Belanja Bersama di Pasar Tradisional',
      cerita: 'Siti membeli {1/4} kg cabai merah dan {1/2} kg bawang putih.',
      kalimatMatematika: 'Berat total belanjaan {1/4} + {2/4} = {3/4} kg.',
    },
    awasKeliru: {
      salah: 'Langsung menghitung tanpa menulis kalimat matematika, lalu menjawab tanpa satuan ("{7/12}").',
      benar: '"Sisa minyak {7/12} liter."',
      alasan: 'Kalimat matematika membantu agar tidak salah hitung, dan satuan membuat jawaban lengkap.',
    },
    ayoCoba: [
      {
        tipe: 'isian',
        soal: 'Andi berlari {2/5} km di pagi hari dan {1/2} km di sore hari. Berapa total jaraknya?',
        bentuk: 'pecahan',
        jawaban: '9/10',
        satuan: 'km',
        petunjuk: 'Kata "total" berarti dijumlahkan. Samakan penyebutnya dengan KPK 5 dan 2.',
        pembahasan: '{2/5} + {1/2} = {4/10} + {5/10} = {9/10}. Total jaraknya {9/10} km.',
      },
      {
        tipe: 'isian',
        soal: 'Ibu punya pita 3 meter, lalu memakai {1 1/4} m dan {3/4} m. Berapa sisa pitanya?',
        bentuk: 'campuran',
        jawaban: '1',
        satuan: 'm',
        petunjuk: 'Jumlahkan dulu pita yang dipakai, lalu kurangkan dari 3 meter.',
        pembahasan: 'Pita yang dipakai {1 1/4} + {3/4} = 2 m. Sisa pita 3 − 2 = 1 m.',
      },
      {
        tipe: 'isian',
        soal: 'Kebun Pak Rahmat ditanami kopi {1/3} bagian, lada {1/4} bagian, dan sisanya pisang. Berapa bagian kebun yang ditanami pisang?',
        bentuk: 'pecahan',
        jawaban: '5/12',
        satuan: 'bagian',
        petunjuk: 'Seluruh kebun = 1. Kurangkan bagian kopi dan lada dari 1.',
        pembahasan: 'Kopi + lada = {4/12} + {3/12} = {7/12}. Pisang = 1 − {7/12} = {5/12} bagian kebun.',
      },
    ],
    tips: 'Tulis kalimat matematikanya dulu supaya tidak bingung, dan jangan lupa satuannya!',
    ringkasan: 'Pahami ceritanya, ubah menjadi kalimat matematika, hitung, lalu simpulkan dengan satuan.',
  },
];
