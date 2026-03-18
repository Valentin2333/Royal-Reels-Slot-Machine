import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioManager } from '../utils/audioManager'

// Mock the Web Audio API
const mockStop = vi.fn()
const mockStart = vi.fn()
const mockConnect = vi.fn()
const mockOscillator = {
  connect: mockConnect,
  type: 'sine' as OscillatorType,
  frequency: { setValueAtTime: vi.fn() },
  start: mockStart,
  stop: mockStop,
}
const mockGain = {
  connect: mockConnect,
  gain: {
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
  },
}
const mockCtx = {
  createOscillator: vi.fn(() => mockOscillator),
  createGain: vi.fn(() => mockGain),
  destination: {},
  currentTime: 0,
}

vi.stubGlobal('AudioContext', vi.fn(() => mockCtx))

describe('AudioManager', () => {
  let manager: AudioManager

  beforeEach(() => {
    manager = new AudioManager()
    vi.clearAllMocks()
  })

  it('is enabled by default', () => {
    expect(manager.isEnabled()).toBe(true)
  })

  it('toggle() disables audio and returns false', () => {
    const result = manager.toggle()
    expect(result).toBe(false)
    expect(manager.isEnabled()).toBe(false)
  })

  it('toggle() re-enables audio and returns true', () => {
    manager.toggle() // disable
    const result = manager.toggle() // re-enable
    expect(result).toBe(true)
    expect(manager.isEnabled()).toBe(true)
  })

  it('does not call AudioContext when disabled', () => {
    manager.toggle() // disable
    manager.spinStart()
    expect(mockCtx.createOscillator).not.toHaveBeenCalled()
  })

  it('spinStart() creates oscillators when enabled', () => {
    manager.spinStart()
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('reelStop() creates an oscillator for each reel index', () => {
    manager.reelStop(0)
    expect(mockCtx.createOscillator).toHaveBeenCalled()
    vi.clearAllMocks()
    manager.reelStop(1)
    expect(mockCtx.createOscillator).toHaveBeenCalled()
    vi.clearAllMocks()
    manager.reelStop(2)
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('smallWin() creates oscillators', () => {
    manager.smallWin()
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('bigWin() creates oscillators', () => {
    manager.bigWin()
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('megaWin() creates oscillators', () => {
    manager.megaWin()
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('buttonClick() creates an oscillator', () => {
    manager.buttonClick()
    expect(mockCtx.createOscillator).toHaveBeenCalled()
  })

  it('freeSpinTrigger() creates multiple oscillators', () => {
    manager.freeSpinTrigger()
    // 5 notes × 2 tones each = 10 oscillators
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(10)
  })

  it('coinDrop() creates 5 oscillators', () => {
    manager.coinDrop()
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(5)
  })
})
