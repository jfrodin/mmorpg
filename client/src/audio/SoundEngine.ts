class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambienceStarted = false;
  private lastFootstepFoot = 0;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => undefined);
    }
    return this.ctx;
  }

  /** Must be called from within a user gesture handler (browser autoplay policy). */
  unlock(): void {
    this.ensureContext();
    if (!this.ambienceStarted) {
      this.ambienceStarted = true;
      this.startAmbience();
    }
  }

  private tone(freq: number, duration: number, gainPeak: number, type: OscillatorType = "sine"): void {
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }

  private noiseBurst(duration: number, gainPeak: number, filterFreq: number): void {
    const ctx = this.ensureContext();
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = filterFreq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainPeak, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  playFootstep(): void {
    this.lastFootstepFoot = 1 - this.lastFootstepFoot;
    const pitch = 220 + this.lastFootstepFoot * 25 + (Math.random() * 20 - 10);
    this.noiseBurst(0.07, 0.05, pitch);
  }

  playUiTick(): void {
    this.tone(680, 0.09, 0.12);
  }

  playChatBlip(): void {
    this.tone(820, 0.07, 0.09);
  }

  playHarvest(): void {
    this.tone(520, 0.1, 0.14);
    setTimeout(() => this.tone(760, 0.12, 0.12), 70);
  }

  playTalk(): void {
    this.tone(340, 0.08, 0.07, "triangle");
  }

  private startAmbience(): void {
    const ctx = this.ensureContext();
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;

    const gain = ctx.createGain();
    gain.gain.value = 0.035;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }
}

export const soundEngine = new SoundEngine();
