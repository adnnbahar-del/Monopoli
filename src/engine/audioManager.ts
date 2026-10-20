/**
 * audioManager.ts — Engine Audio Terpusat MONOPECA
 * Menggunakan Web Audio API untuk SFX sintetis programatik.
 * Tidak memerlukan file audio eksternal — bekerja 100% offline.
 * Volume dikontrol via pengaturanStore.
 */

// ── Tipe SFX yang tersedia ──────────────────────────────────────
export type SFXKunci =
  | 'dadu_lempar'
  | 'bidak_jalan'
  | 'bidak_landing'
  | 'soal_muncul'
  | 'jawab_benar'
  | 'jawab_salah'
  | 'poin_naik'
  | 'kios_beli'
  | 'kios_upgrade'
  | 'kesempatan'
  | 'tantangan'
  | 'start_bonus'
  | 'turnamen_mulai'
  | 'turnamen_selesai'
  | 'podium_juara'
  | 'login_sukses'
  | 'notif_info'
  | 'klik_tombol';

class AudioManager {
  private volumeSFX = 80;
  private bisu = false;
  private audioCtx: AudioContext | null = null;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const init = () => {
        this.initAudioCtx();
        window.removeEventListener('pointerdown', init);
        window.removeEventListener('keydown', init);
      };
      window.addEventListener('pointerdown', init, { once: true });
      window.addEventListener('keydown', init, { once: true });
    }
  }

  private initAudioCtx() {
    if (this.initialized) return;
    try {
      this.audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )();
      this.initialized = true;
    } catch {
      // AudioContext tidak tersedia
    }
  }

  /**
   * Putar tone sintetis menggunakan Web Audio API.
   */
  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = 'sine',
    vol = 0.25,
    envelope: 'decay' | 'attack' | 'flat' = 'decay',
    delayMs = 0
  ) {
    if (this.bisu || !this.audioCtx) return;
    const v = (this.volumeSFX / 100) * vol;
    if (v <= 0) return;

    const ctx = this.audioCtx;
    const play = () => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        if (envelope === 'attack') {
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(v, now + dur * 0.5);
          gain.gain.linearRampToValueAtTime(0.001, now + dur);
        } else if (envelope === 'decay') {
          gain.gain.setValueAtTime(v, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
        } else {
          gain.gain.setValueAtTime(v, now);
          gain.gain.setValueAtTime(0.001, now + dur);
        }
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch {
        // ignore
      }
    };

    if (delayMs > 0) {
      setTimeout(play, delayMs);
    } else {
      play();
    }
  }

  /**
   * Putar urutan nada (arpeggio / fanfare).
   * notes: [[frekuensi, durasi, delayMs], ...]
   */
  private seq(notes: Array<[number, number, number]>) {
    notes.forEach(([f, d, del]) => this.tone(f, d, 'sine', 0.3, 'decay', del));
  }

  // ── API Publik ──────────────────────────────────────────────────

  putar(kunci: SFXKunci) {
    if (this.bisu) return;
    this.initAudioCtx();

    switch (kunci) {
      case 'klik_tombol':
        this.tone(880, 0.07, 'sine', 0.12);
        break;
      case 'dadu_lempar':
        this.seq([[200,0.05,0],[350,0.05,55],[250,0.05,110],[420,0.06,170],[280,0.08,240]]);
        break;
      case 'bidak_jalan':
        this.tone(440, 0.06, 'square', 0.10);
        break;
      case 'bidak_landing':
        this.seq([[523,0.08,0],[659,0.10,90]]);
        break;
      case 'soal_muncul':
        this.seq([[392,0.08,0],[494,0.08,90],[587,0.12,180]]);
        break;
      case 'jawab_benar':
        this.seq([[523,0.10,0],[659,0.10,100],[784,0.10,200],[1047,0.20,300]]);
        break;
      case 'jawab_salah':
        this.seq([[300,0.15,0],[220,0.25,160]]);
        break;
      case 'poin_naik':
        this.seq([[660,0.08,0],[880,0.08,90],[1100,0.15,180]]);
        break;
      case 'kios_beli':
        this.seq([[440,0.10,0],[550,0.10,110],[660,0.15,220]]);
        break;
      case 'kios_upgrade':
        this.seq([[440,0.08,0],[554,0.08,90],[659,0.08,180],[880,0.20,270]]);
        break;
      case 'kesempatan':
        this.tone(698, 0.25, 'sine', 0.35, 'attack');
        break;
      case 'tantangan':
        this.seq([[800,0.10,0],[600,0.10,110],[900,0.20,220]]);
        break;
      case 'start_bonus':
        this.seq([[523,0.10,0],[784,0.10,110],[1047,0.20,220]]);
        break;
      case 'turnamen_mulai':
        this.seq([[392,0.10,0],[494,0.10,110],[587,0.10,220],[784,0.20,330]]);
        break;
      case 'turnamen_selesai':
        this.seq([[523,0.12,0],[659,0.12,130],[784,0.12,260],[1047,0.30,390]]);
        break;
      case 'podium_juara':
        this.seq([
          [523,0.12,0],[659,0.12,110],[784,0.12,220],
          [1047,0.10,350],[880,0.10,460],[1047,0.30,560]
        ]);
        break;
      case 'login_sukses':
        this.seq([[440,0.10,0],[660,0.15,120]]);
        break;
      case 'notif_info':
        this.tone(600, 0.12, 'sine', 0.18);
        break;
      default:
        break;
    }
  }

  // ── Kontrol Volume ──────────────────────────────────────────────

  setVolumeSFX(vol: number) {
    this.volumeSFX = Math.max(0, Math.min(100, vol));
  }

  setBisu(aktif: boolean) {
    this.bisu = aktif;
  }

  /**
   * Sinkronkan semua setting audio dari pengaturanStore.
   */
  sinkronDariStore(volSFX: number, bisuu: boolean) {
    this.setVolumeSFX(volSFX);
    this.setBisu(bisuu);
  }
}

// ── Singleton global ────────────────────────────────────────────
export const audio = new AudioManager();
