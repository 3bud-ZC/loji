/**
 * Audio Engine for Loji's Vintage Gramophone Experience.
 * Provides dual capabilities:
 * 1. Native HTML5 Audio playback for custom MP3 files.
 * 2. Procedural Web Audio vintage music-box / acoustic tone synthesizer with
 *    subtle vinyl crackle and nostalgic chord harmonies when no external file is loaded.
 * Strict compliance with iOS Safari user-gesture policies and no-autoplay rules.
 */

type PlayStateListener = (isPlaying: boolean) => void;

export class VintageAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private isSynthesizing = false;
  private isPlaying = false;
  private externalAudio: HTMLAudioElement | null = null;
  private listeners: PlayStateListener[] = [];
  private sequenceTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;

  // Nostalgic classical pentatonic / poetic frequencies in Hz (A4 = 440)
  // Gentle melancholic vintage chords: Dm7 -> G7 -> Cmaj7 -> Am
  private chordProgression: number[][] = [
    [146.83, 220.00, 261.63, 349.23, 440.00], // D3, A3, C4, F4, A4
    [196.00, 246.94, 293.66, 392.00, 493.88], // G3, B3, D4, G4, B4
    [130.81, 196.00, 261.63, 329.63, 392.00], // C3, G3, C4, E4, G4
    [110.00, 164.81, 220.00, 261.63, 329.63]  // A2, E3, A3, C4, E4
  ];
  private currentChordIndex = 0;

  constructor(externalSrc?: string) {
    if (externalSrc) {
      this.externalAudio = new Audio(externalSrc);
      this.externalAudio.loop = true;
      this.externalAudio.addEventListener('ended', () => {
        this.setPlaying(false);
      });
      this.externalAudio.addEventListener('pause', () => {
        this.setPlaying(false);
      });
    }
  }

  public subscribe(listener: PlayStateListener): () => void {
    this.listeners.push(listener);
    listener(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private setPlaying(state: boolean): void {
    if (this.isPlaying !== state) {
      this.isPlaying = state;
      this.listeners.forEach(fn => fn(state));
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      await this.play();
      return true;
    }
  }

  public async play(): Promise<void> {
    if (this.externalAudio) {
      try {
        await this.externalAudio.play();
        this.setPlaying(true);
        return;
      } catch (err) {
        console.warn('External audio playback blocked, falling back to Web Audio:', err);
      }
    }

    await this.startProceduralAudio();
    this.setPlaying(true);
  }

  public pause(): void {
    if (this.externalAudio) {
      this.externalAudio.pause();
    }
    this.stopProceduralAudio();
    this.setPlaying(false);
  }

  private initAudioContext(): void {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      // Master output with subtle vintage warmth
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);

      // Lowpass filter to simulate 78 RPM / 33 RPM vintage vinyl warmth (cuts harsh digital highs)
      const lowpass = this.audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1400, this.audioCtx.currentTime);
      lowpass.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

      this.masterGain.connect(lowpass);
      lowpass.connect(this.audioCtx.destination);

      // Setup subtle vinyl noise / crackle loop
      this.setupVinylNoise();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private setupVinylNoise(): void {
    if (!this.audioCtx) return;
    try {
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        // Pink noise approximation for warm vintage surface sound
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.05;
        b1 = 0.96300 * b1 + white * 0.05;
        b2 = 0.57000 * b2 + white * 0.15;
        let sample = (b0 + b1 + b2) * 0.02;

        // Occasional dust click / pop
        if (Math.random() < 0.0008) {
          sample += (Math.random() - 0.5) * 0.18;
        }
        output[i] = sample;
      }

      const noiseSource = this.audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const noiseFilter = this.audioCtx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
      noiseFilter.Q.setValueAtTime(0.8, this.audioCtx.currentTime);

      this.vinylGain = this.audioCtx.createGain();
      this.vinylGain.gain.setValueAtTime(0.0001, this.audioCtx.currentTime);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(this.vinylGain);
      if (this.masterGain) {
        this.vinylGain.connect(this.masterGain);
      }
      noiseSource.start(0);
    } catch (e) {
      // Audio buffer generation failed gracefully
    }
  }

  private async startProceduralAudio(): Promise<void> {
    this.initAudioContext();
    if (!this.audioCtx || !this.masterGain) return;

    if (this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    this.isSynthesizing = true;
    const now = this.audioCtx.currentTime;

    // Fade in master smoothly to prevent clicks
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 1.2);

    if (this.vinylGain) {
      this.vinylGain.gain.cancelScheduledValues(now);
      this.vinylGain.gain.setValueAtTime(this.vinylGain.gain.value, now);
      this.vinylGain.gain.linearRampToValueAtTime(0.08, now + 1.5);
    }

    this.playNextArpeggioStep();
  }

  private playNextArpeggioStep(): void {
    if (!this.isSynthesizing || !this.audioCtx || !this.masterGain) return;

    const chord = this.chordProgression[this.currentChordIndex];
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chordProgression.length;

    // Play an arpeggiated vintage music-box tone for the chord notes
    chord.forEach((freq, idx) => {
      const delay = idx * 0.45;
      const noteTime = this.audioCtx!.currentTime + delay;
      this.playPluckNote(freq, noteTime, 2.2);
    });

    // Schedule next chord after 3.2 seconds
    this.sequenceTimer = window.setTimeout(() => {
      this.playNextArpeggioStep();
    }, 3200);
  }

  private playPluckNote(freq: number, startTime: number, duration: number): void {
    if (!this.audioCtx || !this.masterGain) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      // Triangle + gentle sine blend for soft vintage music box warmth
      osc.type = 'triangle';
      // Subtle vintage detune
      const detuneCents = (Math.random() - 0.5) * 8;
      osc.detune.setValueAtTime(detuneCents, startTime);
      osc.frequency.setValueAtTime(freq, startTime);

      // Acoustic envelope: quick gentle attack, mellow exponential decay
      oscGain.gain.setValueAtTime(0.0001, startTime);
      oscGain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.05);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch {
      // Graceful error ignore on disposed node
    }
  }

  private stopProceduralAudio(): void {
    this.isSynthesizing = false;
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }

    if (this.audioCtx && this.masterGain) {
      const now = this.audioCtx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }
  }

  public dispose(): void {
    this.pause();
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.listeners = [];
  }
}
