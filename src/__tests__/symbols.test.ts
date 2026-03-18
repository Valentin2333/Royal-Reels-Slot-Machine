import { describe, it, expect } from 'vitest'
import { SYMBOLS, SYMBOL_MAP, PAYLINES, BET_OPTIONS } from '../constants/symbols'

describe('SYMBOLS', () => {
  it('contains exactly 10 symbols', () => {
    expect(SYMBOLS).toHaveLength(10)
  })

  it('every symbol has a positive weight', () => {
    SYMBOLS.forEach((sym) => {
      expect(sym.weight).toBeGreaterThan(0)
    })
  })

  it('all symbols have a non-empty emoji', () => {
    SYMBOLS.forEach((sym) => {
      expect(sym.emoji.length).toBeGreaterThan(0)
    })
  })

  it('scatter payoutMultiplier is 0 (pays via bonus, not payline)', () => {
    const scatter = SYMBOLS.find((s) => s.id === 'scatter')
    expect(scatter?.payoutMultiplier).toBe(0)
  })

  it('wild has the highest payoutMultiplier among non-scatter symbols', () => {
    const nonScatter = SYMBOLS.filter((s) => s.id !== 'scatter')
    const wild = nonScatter.find((s) => s.id === 'wild')
    const maxOther = Math.max(...nonScatter.filter((s) => s.id !== 'wild').map((s) => s.payoutMultiplier))
    expect(wild!.payoutMultiplier).toBeGreaterThanOrEqual(maxOther)
  })

  it('seven has the second-highest payoutMultiplier', () => {
    const nonSpecial = SYMBOLS.filter((s) => s.id !== 'scatter' && s.id !== 'wild')
    const seven = nonSpecial.find((s) => s.id === 'seven')
    const maxOther = Math.max(...nonSpecial.filter((s) => s.id !== 'seven').map((s) => s.payoutMultiplier))
    expect(seven!.payoutMultiplier).toBeGreaterThan(maxOther)
  })

  it('higher-value symbols have equal or lower weight (rarer)', () => {
    const cherry = SYMBOLS.find((s) => s.id === 'cherry')!
    const diamond = SYMBOLS.find((s) => s.id === 'diamond')!
    expect(cherry.weight).toBeGreaterThan(diamond.weight)
  })
})

describe('SYMBOL_MAP', () => {
  it('has an entry for every symbol id', () => {
    SYMBOLS.forEach((sym) => {
      expect(SYMBOL_MAP.has(sym.id)).toBe(true)
    })
  })

  it('each map value matches the symbol definition', () => {
    SYMBOLS.forEach((sym) => {
      const mapped = SYMBOL_MAP.get(sym.id)
      expect(mapped).toBe(sym) // same object reference
    })
  })
})

describe('PAYLINES', () => {
  it('defines exactly 5 paylines', () => {
    expect(PAYLINES).toHaveLength(5)
  })

  it('each payline has a unique id', () => {
    const ids = PAYLINES.map((p) => p.id)
    expect(new Set(ids).size).toBe(PAYLINES.length)
  })

  it('every payline row tuple contains valid row indices (0-2)', () => {
    PAYLINES.forEach((pl) => {
      pl.rows.forEach((row) => {
        expect(row).toBeGreaterThanOrEqual(0)
        expect(row).toBeLessThanOrEqual(2)
      })
    })
  })

  it('every payline has 3 row entries (one per reel)', () => {
    PAYLINES.forEach((pl) => {
      expect(pl.rows).toHaveLength(3)
    })
  })
})

describe('BET_OPTIONS', () => {
  it('contains 6 bet values', () => {
    expect(BET_OPTIONS).toHaveLength(6)
  })

  it('is in ascending order', () => {
    for (let i = 1; i < BET_OPTIONS.length; i++) {
      expect(BET_OPTIONS[i]).toBeGreaterThan(BET_OPTIONS[i - 1])
    }
  })

  it('minimum bet is 1', () => {
    expect(BET_OPTIONS[0]).toBe(1)
  })

  it('maximum bet is 50', () => {
    expect(BET_OPTIONS[BET_OPTIONS.length - 1]).toBe(50)
  })
})
