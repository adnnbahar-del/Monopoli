/**
 * Musik pembuka MONOPECA — melodi orisinal sintetis (Web Audio API).
 * Tidak memakai file/aset eksternal sehingga bebas hak cipta & tetap offline.
 *
 * - Hanya boleh dimulai dari interaksi pengguna (kebijakan autoplay browser).
 * - Satu instance saja: `mulai()` berulang tidak menumpuk suara.
 * - `berhenti()` melakukan fade-out lalu menutup AudioContext.
 */

type Nada = [number | null, number]; // [frekuensi Hz | null untuk jeda, durasi dalam ketukan 1/8]

// Skala C mayor pentatonik — ceria & lembut
const C4 = 261.63, D4 = 293.66, E4 = 329.63, G4 = 392.0, A4 = 440.0;
const C5 = 523.25, D5 = 587.33;
const C3 = 130.81, F3 = 174.61, G3 = 196.0, A3 = 220.0; // bas

/** Melodi 4 birama (32 ketukan 1/8) yang berulang */
const MELODI: Nada[] = [
  [E4, 1], [G4, 1], [C5, 2], [A4, 1], [G4, 1], [E4, 2],
  [D4, 1], [E4, 1], [G4, 2], [E4, 2], [null, 2],
  [G4, 1], [A4, 1], [C5, 2], [D5, 1], [C5, 1], [A4, 2],
  [G4, 1], [E4, 1], [D4, 1], [E4, 1], [C4, 2], [null, 2],
];

/** Bas per birama (8 ketukan 1/8): C – F – G – C */
const BAS = [C3, F3, G3, C3];
const AKOR: number[][] = [
  [C4, E4, G4],
  [F3 * 2, A3 * 2, C5],
  [D4, G4, 493.88], // G mayor (D4–G4–B4)
  [C4, E4, G4],
];

const TEMPO_BPM = 108;
const DETIK_PER_KETUK = 60 / TEMPO_BPM / 2; // 1/8 not
const PANJANG_LOOP = 32; // ketukan 1/8

class MusikPembuka {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private waktuLoopBerikut = 0;
  private volume = 0.3; // 0..1 (mengikuti volumeMusik pengaturan)

  get berjalan() {
    return this.ctx !== null && this.timer !== null;
  }

  setVolume(persen: number) {
    this.volume = Math.max(0, Math.min(100, persen)) / 100;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(this.gainTarget(), this.ctx.currentTime, 0.1);
    }
  }

  private gainTarget() {
    // Volume sengaja rendah agar tidak mengganggu guru
    return this.volume * 0.22;
  }

  /** Mulai musik. Mengembalikan false bila browser menolak / tidak mendukung. */
  async mulai(): Promise<boolean> {
    if (this.berjalan) return true;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return false;
      const ctx = new Ctor();
      if (ctx.state === 'suspended') await ctx.resume();

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(this.gainTarget(), ctx.currentTime + 0.8);
      master.connect(ctx.destination);

      this.ctx = ctx;
      this.master = master;
      this.waktuLoopBerikut = ctx.currentTime + 0.1;
      this.jadwalkan();
      this.timer = setInterval(() => this.jadwalkan(), 250);
      return true;
    } catch {
      this.bersihkan();
      return false;
    }
  }

  /** Fade-out lembut lalu tutup. Aman dipanggil berkali-kali. */
  berhenti(fadeDetik = 0.5) {
    const ctx = this.ctx;
    const master = this.master;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (!ctx || !master) {
      this.bersihkan();
      return;
    }
    try {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.0001, now + fadeDetik);
    } catch {
      /* abaikan */
    }
    this.ctx = null;
    this.master = null;
    setTimeout(() => {
      ctx.close().catch(() => undefined);
    }, fadeDetik * 1000 + 100);
  }

  private bersihkan() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.master = null;
  }

  /** Jadwalkan satu loop ke depan bila mendekati habis (lookahead scheduler). */
  private jadwalkan() {
    const ctx = this.ctx;
    if (!ctx) return;
    while (this.waktuLoopBerikut < ctx.currentTime + 1.5) {
      this.jadwalkanLoop(this.waktuLoopBerikut);
      this.waktuLoopBerikut += PANJANG_LOOP * DETIK_PER_KETUK;
    }
  }

  private jadwalkanLoop(mulai: number) {
    // Melodi
    let t = mulai;
    for (const [f, k] of MELODI) {
      const dur = k * DETIK_PER_KETUK;
      if (f) this.nada(f, t, dur * 0.9, 'triangle', 0.55);
      t += dur;
    }
    // Bas + akor lembut per birama
    for (let b = 0; b < 4; b++) {
      const tb = mulai + b * 8 * DETIK_PER_KETUK;
      this.nada(BAS[b], tb, 4 * DETIK_PER_KETUK, 'sine', 0.6);
      this.nada(BAS[b], tb + 4 * DETIK_PER_KETUK, 4 * DETIK_PER_KETUK, 'sine', 0.45);
      for (const f of AKOR[b]) {
        this.nada(f, tb + 2 * DETIK_PER_KETUK, 1.5 * DETIK_PER_KETUK, 'sine', 0.12);
        this.nada(f, tb + 6 * DETIK_PER_KETUK, 1.5 * DETIK_PER_KETUK, 'sine', 0.12);
      }
    }
  }

  private nada(freq: number, waktu: number, dur: number, tipe: OscillatorType, vol: number) {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = tipe;
    osc.frequency.setValueAtTime(freq, waktu);
    g.gain.setValueAtTime(0.0001, waktu);
    g.gain.linearRampToValueAtTime(vol, waktu + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, waktu + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(waktu);
    osc.stop(waktu + dur + 0.05);
  }
}

export const musikPembuka = new MusikPembuka();
