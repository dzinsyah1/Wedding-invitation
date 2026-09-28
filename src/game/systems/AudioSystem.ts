const MUSIC_SRC = "/audio/wedding-audio.mp3";
const MUSIC_VOLUME = 0.6;
const DUCKED_VOLUME = 0.25;
const FADE_MS = 600;

export class AudioSystem {
  private music: HTMLAudioElement | null = null;
  private fadeTimer: number | null = null;
  private ducked = false;
  private tapCtx: AudioContext | null = null;
  playing = false;

  private ensure() {
    if (this.music || typeof window === "undefined") return this.music;
    const el = new Audio(MUSIC_SRC);
    el.loop = true;
    el.preload = "auto";
    el.volume = 0;
    this.music = el;
    return el;
  }

  private fadeTo(target: number, onDone?: () => void) {
    const el = this.music;
    if (!el) return;
    if (this.fadeTimer !== null) window.clearInterval(this.fadeTimer);
    const start = el.volume;
    const started = performance.now();
    this.fadeTimer = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - started) / FADE_MS);
      el.volume = start + (target - start) * t;
      if (t >= 1) {
        window.clearInterval(this.fadeTimer!);
        this.fadeTimer = null;
        onDone?.();
      }
    }, 30);
  }

  // Called synchronously from a user gesture so browsers allow playback.
  async startMusic() {
    const el = this.ensure();
    if (!el || this.playing) return;
    this.playing = true;
    try {
      await el.play();
      this.fadeTo(this.ducked ? DUCKED_VOLUME : MUSIC_VOLUME);
    } catch {
      this.playing = false;
    }
  }

  stopMusic() {
    const el = this.music;
    if (!el || !this.playing) return;
    this.playing = false;
    this.fadeTo(0, () => {
      if (!this.playing) el.pause();
    });
  }

  setDucked(ducked: boolean) {
    this.ducked = ducked;
    if (this.playing) this.fadeTo(ducked ? DUCKED_VOLUME : MUSIC_VOLUME);
  }

  private sfx() {
    if (!this.tapCtx) {
      const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      this.tapCtx = new Ctx();
    }
    return this.tapCtx;
  }

  // Rising sparkle arpeggio for the teleport; silent when the guest turned music off.
  chime() {
    if (!this.playing) return;
    const ctx = this.sfx();
    if (!ctx) return;
    void ctx.resume();
    [784, 988, 1175, 1568].forEach((freq, i) => {
      const at = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.03, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.55);
    });
  }

  /** Short arpeggio for play feedback; silent when the guest turned music off. */
  private notes(freqs: number[], step: number, peak: number, length: number, type: OscillatorType = "sine") {
    if (!this.playing) return;
    const ctx = this.sfx();
    if (!ctx) return;
    void ctx.resume();
    freqs.forEach((freq, i) => {
      const at = ctx.currentTime + i * step;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(peak, at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + length);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + length + 0.05);
    });
  }

  /** Springy "boing" for the bounce pads: a quick upward pitch sweep. */
  bounce() {
    if (!this.playing) return;
    const ctx = this.sfx();
    if (!ctx) return;
    void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  /** Soft coo-like chirp when a dove hops on. */
  catchDove() {
    this.notes([1175, 1480, 1319], 0.07, 0.028, 0.22, "triangle");
  }

  /** Rising, airy notes as the dove flies off. */
  releaseDove() {
    this.notes([659, 880, 1175, 1568], 0.11, 0.03, 0.7);
  }

  fanfare() {
    this.notes([784, 988, 1175, 1568, 1976], 0.09, 0.035, 0.6);
  }

  tap() {
    const ctx = this.sfx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 680;
    osc.type = "sine";
    gain.gain.value = 0.006;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
    osc.stop(ctx.currentTime + 0.1);
  }
}
