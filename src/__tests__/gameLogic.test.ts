import { describe, it, expect } from 'vitest'
import { spinReels, calculateResult, getWinTier, isJackpot } from '../utils/gameLogic'
import type { SymbolId, SpinResult } from '../types'

// ─── spinReels ───────────────────────────────────────────────────────────────

describe('spinReels', () => {
  it('returns a 3×3 grid', () => {
    const grid = spinReels()
    expect(grid).toHaveLength(3)
    grid.forEach((reel) => expect(reel).toHaveLength(3))
  })

  it('every cell is a valid SymbolId', () => {
    const validIds: SymbolId[] = [
      'cherry', 'lemon', 'orange', 'grape',
      'bell', 'star', 'diamond', 'seven', 'wild', 'scatter',
    ]
    const grid = spinReels()
    grid.flat().forEach((sym) => expect(validIds).toContain(sym))
  })

  it('produces different grids across multiple calls (probabilistic)', () => {
    const grids = Array.from({ length: 20 }, () => spinReels())
    const serialised = grids.map((g) => JSON.stringify(g))
    const unique = new Set(serialised)
    expect(unique.size).toBeGreaterThan(1)
  })
})

// ─── calculateResult ─────────────────────────────────────────────────────────

describe('calculateResult', () => {
  const BET = 10

  it('detects a centre-line match (payline 0, rows [1,1,1])', () => {
    // Reel columns: [top, mid, bot]
    const grid: SymbolId[][] = [
      ['cherry', 'bell', 'lemon'],   // reel 0 – row 1 = bell
      ['orange', 'bell', 'star'],    // reel 1 – row 1 = bell
      ['grape',  'bell', 'seven'],   // reel 2 – row 1 = bell
    ]
    const result = calculateResult(grid, BET)
    const win = result.wins.find((w) => w.paylineId === 0)
    expect(win).toBeDefined()
    expect(win!.symbolId).toBe('bell')
    expect(win!.amount).toBeGreaterThan(0)
    expect(result.totalWin).toBeGreaterThan(0)
  })

  it('detects a top-row match (payline 1, rows [0,0,0])', () => {
    const grid: SymbolId[][] = [
      ['star',   'cherry', 'lemon'],
      ['star',   'orange', 'grape'],
      ['star',   'bell',   'seven'],
    ]
    const result = calculateResult(grid, BET)
    const win = result.wins.find((w) => w.paylineId === 1)
    expect(win).toBeDefined()
    expect(win!.symbolId).toBe('star')
  })

  it('detects a diagonal ↘ match (payline 3, rows [0,1,2])', () => {
    const grid: SymbolId[][] = [
      ['diamond', 'cherry', 'lemon'],
      ['orange',  'diamond', 'star'],
      ['grape',   'bell',   'diamond'],
    ]
    const result = calculateResult(grid, BET)
    const win = result.wins.find((w) => w.paylineId === 3)
    expect(win).toBeDefined()
    expect(win!.symbolId).toBe('diamond')
  })

  it('wild substitutes for a matching symbol', () => {
    // Payline 0 = rows [1,1,1] → grid[reel][row=1]
    // Need: reel0[1]=cherry, reel1[1]=wild, reel2[1]=cherry
    const grid: SymbolId[][] = [
      ['lemon',  'cherry', 'orange'],  // reel 0: row 1 = cherry
      ['orange', 'wild',   'grape'],   // reel 1: row 1 = wild  (substitutes cherry)
      ['bell',   'cherry', 'seven'],   // reel 2: row 1 = cherry
    ]
    const result = calculateResult(grid, BET)
    // Payline 0 = rows [1,1,1] → cherry, wild, cherry → should match cherry
    const win = result.wins.find((w) => w.paylineId === 0)
    expect(win).toBeDefined()
    expect(win!.symbolId).toBe('cherry')
  })

  it('returns zero wins for a losing grid', () => {
    const grid: SymbolId[][] = [
      ['cherry', 'lemon',   'orange'],
      ['grape',  'bell',    'star'],
      ['seven',  'diamond', 'wild'],
    ]
    const result = calculateResult(grid, BET)
    expect(result.wins).toHaveLength(0)
    expect(result.totalWin).toBe(0)
  })

  it('awards 10 free spins when 3 scatters appear anywhere', () => {
    const grid: SymbolId[][] = [
      ['scatter', 'lemon',   'orange'],
      ['grape',   'scatter', 'star'],
      ['seven',   'diamond', 'scatter'],
    ]
    const result = calculateResult(grid, BET)
    expect(result.scatterCount).toBe(3)
    expect(result.isScatterWin).toBe(true)
    expect(result.freeSpinsAwarded).toBe(10)
  })

  it('awards 3 free spins when exactly 2 scatters appear', () => {
    const grid: SymbolId[][] = [
      ['scatter', 'lemon', 'orange'],
      ['grape',   'scatter', 'star'],
      ['seven',   'diamond', 'cherry'],
    ]
    const result = calculateResult(grid, BET)
    expect(result.scatterCount).toBe(2)
    expect(result.freeSpinsAwarded).toBe(3)
  })

  it('does not award free spins for a single scatter', () => {
    const grid: SymbolId[][] = [
      ['scatter', 'lemon', 'orange'],
      ['grape',   'bell',  'star'],
      ['seven',   'diamond', 'cherry'],
    ]
    const result = calculateResult(grid, BET)
    expect(result.scatterCount).toBe(1)
    expect(result.freeSpinsAwarded).toBe(0)
  })

  it('totalWin equals sum of individual win amounts', () => {
    const grid: SymbolId[][] = [
      ['seven', 'cherry', 'lemon'],
      ['seven', 'seven',  'grape'],  // top row: seven,seven,seven & centre: cherry,seven,grape (no)
      ['lemon', 'bell',   'orange'],
    ]
    const result = calculateResult(grid, BET)
    const expected = result.wins.reduce((sum, w) => sum + w.amount, 0)
    expect(result.totalWin).toBe(expected)
  })

  it('payout amount equals bet × symbol multiplier', () => {
    const grid: SymbolId[][] = [
      ['bell', 'cherry', 'lemon'],
      ['bell', 'orange', 'grape'],
      ['bell', 'star',   'seven'],
    ]
    const result = calculateResult(grid, BET)
    // Top row payline (payline 1)
    const win = result.wins.find((w) => w.paylineId === 1)
    expect(win).toBeDefined()
    // bell payoutMultiplier = 20
    expect(win!.amount).toBe(BET * 20)
  })
})

// ─── getWinTier ──────────────────────────────────────────────────────────────

describe('getWinTier', () => {
  it('returns "none" for zero win', () => {
    expect(getWinTier(0, 10)).toBe('none')
  })

  it('returns "small" for 1× multiplier win', () => {
    expect(getWinTier(10, 10)).toBe('small') // 1× bet
  })

  it('returns "medium" for 10× multiplier win', () => {
    expect(getWinTier(100, 10)).toBe('medium')
  })

  it('returns "big" for 30× multiplier win', () => {
    expect(getWinTier(300, 10)).toBe('big')
  })

  it('returns "mega" for 80×+ multiplier win', () => {
    expect(getWinTier(800, 10)).toBe('mega')
  })

  it('threshold boundaries: 9× is small, 10× is medium', () => {
    expect(getWinTier(90, 10)).toBe('small')
    expect(getWinTier(100, 10)).toBe('medium')
  })

  it('threshold boundaries: 29× is medium, 30× is big', () => {
    expect(getWinTier(290, 10)).toBe('medium')
    expect(getWinTier(300, 10)).toBe('big')
  })

  it('threshold boundaries: 79× is big, 80× is mega', () => {
    expect(getWinTier(790, 10)).toBe('big')
    expect(getWinTier(800, 10)).toBe('mega')
  })
})

// ─── isJackpot ───────────────────────────────────────────────────────────────

describe('isJackpot', () => {
  it('returns true when a "seven" win is present', () => {
    const result: SpinResult = {
      grid: [['seven','seven','seven'],['lemon','bell','star'],['orange','grape','diamond']],
      wins: [{ paylineId: 1, symbolId: 'seven', count: 3, multiplier: 150, amount: 1500 }],
      totalWin: 1500,
      isScatterWin: false,
      freeSpinsAwarded: 0,
      scatterCount: 0,
    }
    expect(isJackpot(result)).toBe(true)
  })

  it('returns false when no seven win exists', () => {
    const result: SpinResult = {
      grid: [['bell','bell','bell'],['lemon','star','grape'],['orange','cherry','diamond']],
      wins: [{ paylineId: 1, symbolId: 'bell', count: 3, multiplier: 20, amount: 200 }],
      totalWin: 200,
      isScatterWin: false,
      freeSpinsAwarded: 0,
      scatterCount: 0,
    }
    expect(isJackpot(result)).toBe(false)
  })

  it('returns false when there are no wins at all', () => {
    const result: SpinResult = {
      grid: [['cherry','bell','seven'],['lemon','diamond','star'],['orange','grape','wild']],
      wins: [],
      totalWin: 0,
      isScatterWin: false,
      freeSpinsAwarded: 0,
      scatterCount: 0,
    }
    expect(isJackpot(result)).toBe(false)
  })
})
