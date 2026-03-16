/**
 * AudioManager – synthesises casino sound effects via the Web Audio API.
 * All sounds are generated procedurally, so no audio files are needed.
 */
export class AudioManager {
  private ctx: AudioContext | null = null
  private enabled = true

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    return this.ctx
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled() { return this.enabled }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    gain = 0.15,
    startDelay = 0
  ) {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()
      osc.connect(gainNode)
      gainNode.connect(ctx.destination)
      osc.type = type
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + startDelay)
      gainNode.gain.setValueAtTime(0, ctx.currentTime + startDelay)
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + startDelay + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startDelay + duration)
      osc.start(ctx.currentTime + startDelay)
      osc.stop(ctx.currentTime + startDelay + duration)
    } catch { /* AudioContext may be suspended */ }
  }

  spinStart() {
    for (let i = 0; i < 3; i++) {
      this.playTone(200 + i * 40, 0.08, 'sawtooth', 0.05, i * 0.06)
    }
  }

  reelStop(reelIndex: number) {
    const freq = [300, 340, 380][reelIndex]
    this.playTone(freq, 0.12, 'square', 0.08)
  }

  smallWin() {
    const notes = [523, 659, 784]
    notes.forEach((f, i) => this.playTone(f, 0.2, 'sine', 0.12, i * 0.1))
  }

  bigWin() {
    const notes = [523, 659, 784, 1047]
    notes.forEach((f, i) => this.playTone(f, 0.3, 'triangle', 0.15, i * 0.08))
  }

  megaWin() {
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((f, i) => {
      this.playTone(f, 0.4, 'sine', 0.18, i * 0.07)
      this.playTone(f * 2, 0.2, 'triangle', 0.06, i * 0.07 + 0.03)
    })
  }

  buttonClick() {
    this.playTone(440, 0.05, 'square', 0.04)
  }

  coinDrop() {
    for (let i = 0; i < 5; i++) {
      this.playTone(800 + Math.random() * 400, 0.08, 'square', 0.04, i * 0.05)
    }
  }

  freeSpinTrigger() {
    const notes = [392, 494, 587, 740, 880]
    notes.forEach((f, i) => {
      this.playTone(f, 0.5, 'sine', 0.12, i * 0.12)
      this.playTone(f * 1.5, 0.25, 'triangle', 0.05, i * 0.12 + 0.06)
    })
  }
}

export const audio = new AudioManager()
