export class AudioSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private nodes: OscillatorNode[] = [];
  playing = false;

  async ensure() {
    if (this.ctx) return;
    const Ctx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.18;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 1;
    this.musicGain.connect(this.master);
  }

  async startMusic() {
    await this.ensure();
    if (!this.ctx || !this.musicGain || this.playing) return;
    await this.ctx.resume();
    this.playing = true;
    const notes = [261.63, 329.63, 392.0, 523.25];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = freq / (i > 1 ? 2 : 1);
      gain.gain.value = 0.04 - i * 0.006;
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.08 + i * 0.02;
      lfoGain.gain.value = 4;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      osc.connect(gain);
      gain.connect(this.musicGain!);
      osc.start();
      lfo.start();
      this.nodes.push(osc, lfo);
    });
  }

  stopMusic() {
    this.nodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    });
    this.nodes = [];
    this.playing = false;
  }

  setDucked(ducked: boolean) {
    if (!this.musicGain || !this.ctx) return;
    this.musicGain.gain.setTargetAtTime(ducked ? 0.4 : 1, this.ctx.currentTime, 0.12);
  }

  tap() {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = 680;
    osc.type = "sine";
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(this.master);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.08);
    osc.stop(this.ctx.currentTime + 0.1);
  }
}
