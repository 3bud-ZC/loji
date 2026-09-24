/**
 * Loji Old-World Audio Engine
 * Plays either a user-supplied audio file or a browser-generated original
 * Arabic-classic instrumental using Hijaz-inspired melody, oud-like plucks,
 * ney-like lead and soft vinyl texture. No autoplay.
 */

type PlayStateListener = (isPlaying: boolean) => void;

export class VintageAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private externalAudio: HTMLAudioElement | null = null;
  private listeners: PlayStateListener[] = [];
  private timer: number | null = null;
  private master: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private vinyl: GainNode | null = null;
  private step = 0;

  private readonly hijaz = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 523.25, 587.33];
  private readonly melody = [0,1,2,3,2,1,0,4,3,2,1,0,6,5,4,3,2,3,4,5,4,3,2,1];

  constructor(externalSrc?: string) {
    if (externalSrc) {
      this.externalAudio = new Audio(externalSrc);
      this.externalAudio.loop = true;
      this.externalAudio.preload = 'auto';
      this.externalAudio.volume = 0.78;
      this.externalAudio.addEventListener('pause', () => this.setPlaying(false));
      this.externalAudio.addEventListener('ended', () => this.setPlaying(false));
    }
  }

  public subscribe(listener: PlayStateListener): () => void {
    this.listeners.push(listener);
    listener(this.isPlaying);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  public getIsPlaying(): boolean { return this.isPlaying; }

  private setPlaying(state: boolean): void {
    this.isPlaying = state;
    this.listeners.forEach(fn => fn(state));
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
      return false;
    }
    await this.play();
    return true;
  }

  public async play(): Promise<void> {
    if (this.externalAudio) {
      try {
        await this.externalAudio.play();
        this.setPlaying(true);
        return;
      } catch (error) {
        console.warn('Audio file unavailable; using built-in old-world instrumental.', error);
      }
    }

    await this.startInstrumental();
    this.setPlaying(true);
  }

  public pause(): void {
    this.externalAudio?.pause();
    this.stopInstrumental();
    this.setPlaying(false);
  }

  private async ensureContext(): Promise<AudioContext> {
    if (!this.audioCtx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new Ctx();

      const master = this.audioCtx.createGain();
      master.gain.value = 0.0001;

      const warmth = this.audioCtx.createBiquadFilter();
      warmth.type = 'lowpass';
      warmth.frequency.value = 3200;
      warmth.Q.value = 0.5;

      const compressor = this.audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -20;
      compressor.knee.value = 18;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.012;
      compressor.release.value = 0.3;

      const sfxBus = this.audioCtx.createGain();
      sfxBus.gain.value = 0.34;

      master.connect(warmth);
      sfxBus.connect(warmth);
      warmth.connect(compressor);
      compressor.connect(this.audioCtx.destination);
      this.master = master;
      this.sfxBus = sfxBus;

      this.createVinylBed();
    }

    if (this.audioCtx.state !== 'running') {
      await this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private createVinylBed(): void {
    if (!this.audioCtx || !this.master) return;
    const length = this.audioCtx.sampleRate * 2;
    const buffer = this.audioCtx.createBuffer(1, length, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let b = 0;

    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      b = b * 0.965 + white * 0.035;
      let sample = b * 0.16;
      if (Math.random() < 0.0009) sample += (Math.random() - 0.5) * 0.55;
      data[i] = sample;
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1450;
    filter.Q.value = 0.55;

    const gain = this.audioCtx.createGain();
    gain.gain.value = 0.0001;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start();

    this.vinyl = gain;
  }

  private async startInstrumental(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!this.master) return;

    const now = ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.62, now + 0.28);

    if (this.vinyl) {
      this.vinyl.gain.cancelScheduledValues(now);
      this.vinyl.gain.setValueAtTime(Math.max(this.vinyl.gain.value, 0.0001), now);
      this.vinyl.gain.linearRampToValueAtTime(0.055, now + 0.5);
    }

    this.step = 0;
    this.schedulePhrase();
  }

  private schedulePhrase(): void {
    if (!this.audioCtx || !this.master || !this.isPlaying && this.step > 0) return;

    const ctx = this.audioCtx;
    const base = ctx.currentTime + 0.04;

    for (let i = 0; i < 8; i++) {
      const noteIndex = this.melody[(this.step + i) % this.melody.length];
      this.playOud(this.hijaz[noteIndex], base + i * 0.46, i % 4 === 0 ? 0.17 : 0.125);
      if (i === 0 || i === 4) this.playFrameDrum(base + i * 0.46, i === 0 ? 0.10 : 0.075);
    }

    const lead = this.hijaz[this.melody[(this.step + 5) % this.melody.length]];
    this.playNey(lead, base + 1.35, 1.6, 0.055);

    this.step = (this.step + 8) % this.melody.length;
    this.timer = window.setTimeout(() => this.schedulePhrase(), 3500);
  }

  private playOud(freq: number, when: number, amp: number): void {
    if (!this.audioCtx || !this.master) return;
    const ctx = this.audioCtx;
    const gain = ctx.createGain();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();

    osc1.type = 'triangle';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(freq, when);
    osc2.frequency.setValueAtTime(freq * 2.01, when);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(amp, when + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.78);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.master);

    osc1.start(when); osc2.start(when);
    osc1.stop(when + 0.82); osc2.stop(when + 0.82);
  }

  private playNey(freq: number, when: number, duration: number, amp: number): void {
    if (!this.audioCtx || !this.master) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, when);
    vibrato.frequency.value = 5.2;
    vibratoGain.gain.value = 3.2;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(amp, when + 0.18);
    gain.gain.setValueAtTime(amp, when + Math.max(0.2, duration - 0.28));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    osc.connect(gain);
    gain.connect(this.master);
    vibrato.start(when); osc.start(when);
    vibrato.stop(when + duration + 0.05); osc.stop(when + duration + 0.05);
  }

  private playFrameDrum(when: number, amp: number): void {
    if (!this.audioCtx || !this.master) return;
    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, when);
    osc.frequency.exponentialRampToValueAtTime(52, when + 0.16);
    gain.gain.setValueAtTime(amp, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.20);
    osc.connect(gain); gain.connect(this.master);
    osc.start(when); osc.stop(when + 0.22);
  }

  public async playPageTurn(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!this.sfxBus) return;
    const now = ctx.currentTime;
    this.playNoiseSweep(now, 0.42, 720, 2600, 0.16);
    this.playSoftClick(now + 0.08, 150, 0.07);
  }

  public async playWaxCrack(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!this.sfxBus) return;
    const now = ctx.currentTime;
    this.playSoftClick(now, 185, 0.12);
    this.playSoftClick(now + 0.055, 120, 0.08);
    this.playNoiseSweep(now + 0.015, 0.18, 1300, 4200, 0.08);
  }

  public async playNeedleDrop(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!this.sfxBus) return;
    const now = ctx.currentTime;
    this.playSoftClick(now, 260, 0.08);
    this.playNoiseSweep(now + 0.025, 0.22, 1700, 5000, 0.055);
  }

  public async playChime(): Promise<void> {
    const ctx = await this.ensureContext();
    if (!this.sfxBus) return;
    const now = ctx.currentTime;
    this.playBellTone(659.25, now, 0.62, 0.055);
    this.playBellTone(880, now + 0.11, 0.72, 0.04);
  }

  private playBellTone(freq: number, when: number, duration: number, amp: number): void {
    if (!this.audioCtx || !this.sfxBus) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(amp, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain);
    gain.connect(this.sfxBus);
    osc.start(when);
    osc.stop(when + duration + 0.03);
  }

  private playSoftClick(when: number, freq: number, amp: number): void {
    if (!this.audioCtx || !this.sfxBus) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, when);
    osc.frequency.exponentialRampToValueAtTime(Math.max(45, freq * 0.38), when + 0.08);
    gain.gain.setValueAtTime(amp, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.09);
    osc.connect(gain);
    gain.connect(this.sfxBus);
    osc.start(when);
    osc.stop(when + 0.1);
  }

  private playNoiseSweep(
    when: number,
    duration: number,
    startFrequency: number,
    endFrequency: number,
    amp: number
  ): void {
    if (!this.audioCtx || !this.sfxBus) return;
    const length = Math.max(1, Math.floor(this.audioCtx.sampleRate * duration));
    const buffer = this.audioCtx.createBuffer(1, length, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      const envelope = Math.sin((i / length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const source = this.audioCtx.createBufferSource();
    const filter = this.audioCtx.createBiquadFilter();
    const gain = this.audioCtx.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(startFrequency, when);
    filter.frequency.exponentialRampToValueAtTime(endFrequency, when + duration);
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(amp, when + Math.min(0.045, duration * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxBus);
    source.start(when);
    source.stop(when + duration + 0.02);
  }

  private stopInstrumental(): void {
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.audioCtx && this.master) {
      const now = this.audioCtx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
      this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    }
    if (this.audioCtx && this.vinyl) {
      const now = this.audioCtx.currentTime;
      this.vinyl.gain.cancelScheduledValues(now);
      this.vinyl.gain.setValueAtTime(Math.max(this.vinyl.gain.value, 0.0001), now);
      this.vinyl.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    }
  }

  public dispose(): void {
    this.pause();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      void this.audioCtx.close();
    }
    this.audioCtx = null;
    this.master = null;
    this.sfxBus = null;
    this.vinyl = null;
    this.listeners = [];
  }
}
