import { BentukVisual } from '../components/VisualPecahan';

export interface MateriItem {
  id: string;
  kodeTP: string;
  judul: string;
  ringkasan: string;
  penjelasan: string[];
  visual: {
    bentuk: BentukVisual;
    pembilang: number;
    penyebut: number;
  };
  konteksLokal: {
    judul: string;
    cerita: string;
    pecahan: string;
  };
  tipsPakPeca: string;
}

export const CP_FASE_C = {
  fase: 'Fase C (Kelas V SD)',
  elemen: 'Bilangan',
  capaian: 'Peserta didik dapat membandingkan dan mengurutkan berbagai pecahan, serta melakukan operasi penjumlahan dan pengurangan pecahan.',
  alurTujuan: [
    'TP1: Mengenal pecahan, pembilang, dan penyebut melalui representasi visual konkret.',
    'TP2: Menemukan pecahan senilai dan menyederhanakan pecahan ke bentuk paling sederhana.',
    'TP3: Membandingkan pecahan berpenyebut berbeda dengan tanda perbandingan (<, >, =).',
    'TP4: Mengurutkan berbagai pecahan dari nilai terkecil ke terbesar atau sebaliknya.',
    'TP5: Melakukan operasi penjumlahan pecahan berpenyebut berbeda menggunakan KPK.',
    'TP6: Melakukan operasi pengurangan pecahan berpenyebut berbeda menggunakan KPK.',
    'TP7: Memecahkan masalah kehidupan sehari-hari (soal cerita) menggunakan operasi pecahan.',
  ]
};

export const DAFTAR_MATERI: MateriItem[] = [
  {
    id: 'tp1',
    kodeTP: 'TP1',
    judul: 'Mengenal Pecahan, Pembilang, dan Penyebut',
    ringkasan: 'Pecahan adalah bagian dari keseluruhan yang dibagi menjadi bagian-bagian sama besar.',
    penjelasan: [
      'Pecahan ditulis dalam bentuk a/b, di mana a adalah pembilang dan b adalah penyebut.',
      'Pembilang (angka atas): menunjukkan berapa banyak bagian yang diambil atau diarsir.',
      'Penyebut (angka bawah): menunjukkan total seluruh bagian sama besar yang ada.',
      'Garis di tengah pecahan dibaca "per".'
    ],
    visual: {
      bentuk: 'lingkaran',
      pembilang: 3,
      penyebut: 8
    },
    konteksLokal: {
      judul: 'Kue Bolu Sukaraja',
      cerita: 'Ibu memotong 1 loyang kue bolu khas Sukaraja menjadi 8 potong sama rata. Ahmad memakan 3 potong bolu tersebut.',
      pecahan: '3/8'
    },
    tipsPakPeca: 'Ingat! Pembilang ada di atas, penyebut ada di bawah. Jangan sampai terbalik ya!'
  },
  {
    id: 'tp2',
    kodeTP: 'TP2',
    judul: 'Pecahan Senilai dan Menyederhanakan',
    ringkasan: 'Pecahan senilai memiliki nilai yang sama besar meskipun angka pembilang dan penyebutnya berbeda.',
    penjelasan: [
      'Pecahan senilai didapat dengan mengalikan pembilang dan penyebut dengan angka yang sama (selain 0).',
      'Contoh: 1/2 = (1×2)/(2×2) = 2/4 = (1×3)/(2×3) = 3/6.',
      'Menyederhanakan pecahan: membagi pembilang dan penyebut dengan FPB (faktor persekutuan terbesar) yang sama sampai tidak bisa dibagi lagi.'
    ],
    visual: {
      bentuk: 'batang',
      pembilang: 2,
      penyebut: 4
    },
    konteksLokal: {
      judul: 'Lapak Semangka Manis',
      cerita: 'Pak Kardi membelah semangka menjadi 4 bagian dan menjual 2 bagian (2/4). Nilai ini sama persis dengan setengah (1/2) semangka utuh!',
      pecahan: '2/4 senilai dengan 1/2'
    },
    tipsPakPeca: 'Kalau pembilang dikali 2, penyebut juga harus dikali 2 agar nilainya tetap adil dan senilai!'
  },
  {
    id: 'tp3',
    kodeTP: 'TP3',
    judul: 'Membandingkan Dua Pecahan Berbeda Penyebut',
    ringkasan: 'Gunakan tanda < (kurang dari), > (lebih dari), atau = (sama dengan) setelah menyamakan penyebut.',
    penjelasan: [
      'Jika penyebutnya sama, cukup bandingkan pembilangnya: pembilang lebih besar berarti nilai pecahannya lebih besar.',
      'Jika penyebutnya berbeda, samakan penyebutnya terlebih dahulu menggunakan KPK dari kedua penyebut.',
      'Cara cepat: perkalian silang (a/b dibandingkan c/d -> bandingkan a×d dengan b×c).'
    ],
    visual: {
      bentuk: 'garis_bilangan',
      pembilang: 2,
      penyebut: 3
    },
    konteksLokal: {
      judul: 'Kebun Kopi & Lada Sukaraja',
      cerita: 'Hasil panen kopi Pak Wayan mencapai 2/3 kuintal, sedangkan panen lada mencapai 3/4 kuintal. Panen lada lebih banyak karena 3/4 > 2/3 (9/12 > 8/12).',
      pecahan: '2/3 < 3/4'
    },
    tipsPakPeca: 'Gunakan trik caplok! Tanda < atau > selalu membuka ke arah pecahan yang nilainya lebih besar!'
  },
  {
    id: 'tp4',
    kodeTP: 'TP4',
    judul: 'Mengurutkan Tiga atau Empat Pecahan',
    ringkasan: 'Urutkan pecahan dari nilai terkecil ke terbesar atau sebaliknya dengan menyamakan semua penyebut.',
    penjelasan: [
      'Langkah 1: Tentukan KPK dari seluruh penyebut pecahan yang ada.',
      'Langkah 2: Ubah semua pecahan menjadi pecahan senilai dengan penyebut KPK tersebut.',
      'Langkah 3: Urutkan nilai pembilangnya sesuai permintaan (naik atau turun).'
    ],
    visual: {
      bentuk: 'persegi',
      pembilang: 3,
      penyebut: 6
    },
    konteksLokal: {
      judul: 'Dermaga Perahu Nelayan Semaka',
      cerita: 'Tiga perahu jukung membawa ikan: Perahu A membawa 1/2 ton, Perahu B membawa 1/4 ton, dan Perahu C membawa 2/3 ton. Urutan dari yang paling ringan: 1/4 ton, 1/2 ton, 2/3 ton.',
      pecahan: '1/4 < 1/2 < 2/3'
    },
    tipsPakPeca: 'Samakan semua penyebutnya dulu ya, baru bandingkan angka pembilang yang di atas!'
  },
  {
    id: 'tp5',
    kodeTP: 'TP5',
    judul: 'Penjumlahan Pecahan Berbeda Penyebut',
    ringkasan: 'Untuk menjumlahkan pecahan yang berbeda penyebut, samakan dahulu penyebutnya menggunakan KPK.',
    penjelasan: [
      'Pecahan tidak bisa langsung dijumlahkan jika penyebutnya belum sama.',
      'Cari KPK penyebut, ubah pembilang masing-masing pecahan.',
      'Jumlahkan kedua pembilang, sedangkan penyebutnya tetap sama.',
      'Sederhanakan hasil akhir jika masih bisa dibagi.'
    ],
    visual: {
      bentuk: 'batang',
      pembilang: 5,
      penyebut: 6
    },
    konteksLokal: {
      judul: 'Toko Kain Tapis Lampung',
      cerita: 'Pengrajin membutuhkan 1/2 meter benang emas untuk tepi selendang dan 1/3 meter untuk motif pucuk rebung. Total benang = 1/2 + 1/3 = 3/6 + 2/6 = 5/6 meter.',
      pecahan: '1/2 + 1/3 = 5/6'
    },
    tipsPakPeca: 'Ingat! Yang dijumlahkan HANYA pembilangnya saja, penyebutnya tidak boleh dijumlahkan!'
  },
  {
    id: 'tp6',
    kodeTP: 'TP6',
    judul: 'Pengurangan Pecahan Berbeda Penyebut',
    ringkasan: 'Pengurangan pecahan memerlukan penyamaan penyebut terlebih dahulu dengan KPK.',
    penjelasan: [
      'Samakan penyebut kedua pecahan dengan mencari kelipatan persekutuan terkecil (KPK).',
      'Kurangkan pembilang pecahan pertama dengan pembilang pecahan kedua.',
      'Penyebut tetap sama, jangan dikurangkan.',
      'Sederhanakan hasil jika memungkinkan.'
    ],
    visual: {
      bentuk: 'lingkaran',
      pembilang: 1,
      penyebut: 4
    },
    konteksLokal: {
      judul: 'Toko Gula Aren Murni',
      cerita: 'Pedagang memiliki 3/4 kg gula aren. Seorang pembeli membeli 1/2 kg gula aren. Sisa gula aren = 3/4 − 1/2 = 3/4 − 2/4 = 1/4 kg.',
      pecahan: '3/4 - 1/2 = 1/4'
    },
    tipsPakPeca: 'Sama seperti penjumlahan, pastikan penyebutnya sudah sama sebelum mengurangkan angka atas!'
  },
  {
    id: 'tp7',
    kodeTP: 'TP7',
    judul: 'Soal Cerita dan Penerapan Sehari-hari',
    ringkasan: 'Menghubungkan operasi pecahan dengan situasi nyata di lingkungan pasar dan kehidupan sehari-hari.',
    penjelasan: [
      'Baca cerita secara saksama dan temukan kata kunci: "membeli lagi / menambahkan" (penjumlahan), atau "diberikan / berkurang / sisa" (pengurangan).',
      'Tuliskan kalimat matematika pecahan dari cerita tersebut.',
      'Selesaikan operasi hitung sesuai aturan pecahan.',
      'Tuliskan kesimpulan jawaban lengkap dengan satuan (kg, meter, potong, dll).'
    ],
    visual: {
      bentuk: 'persegi',
      pembilang: 7,
      penyebut: 8
    },
    konteksLokal: {
      judul: 'Belanja Bersama di Pasar Tradisional',
      cerita: 'Siti berbelanja bersama timnya di pasar: membeli 1/4 kg cabai merah dan 1/2 kg bawang putih. Berat total belanjaan = 1/4 + 2/4 = 3/4 kg.',
      pecahan: 'Total = 3/4 kg'
    },
    tipsPakPeca: 'Selalu tuliskan kalimat matematikanya terlebih dahulu agar tidak bingung saat menghitung ya!'
  }
];
