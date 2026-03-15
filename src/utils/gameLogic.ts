import type { SymbolId, SpinResult, WinResult, WinTier } from '../types'
import { SYMBOLS, PAYLINES, SYMBOL_MAP } from '../constants/symbols'

const TOTAL_WEIGHT = SYMBOLS.reduce((sum, s) => sum + s.weight, 0)

function pickSymbol(): SymbolId {
  let r = Math.random() * TOTAL_WEIGHT
  for (const sym of SYMBOLS) {
    r -= sym.weight
    if (r <= 0) return sym.id
  }
  return SYMBOLS[0].id
}

/** Returns grid[reelIndex][rowIndex], 3×3 */
export function spinReels(): SymbolId[][] {
  return Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => pickSymbol())
  )
}

function checkPayline(
  grid: SymbolId[][],
  rows: [number, number, number],
  bet: number,
  paylineId: number
): WinResult | null {
  const syms = rows.map((row, reel) => grid[reel][row]) as SymbolId[]
  const base = syms.filter((s) => s !== 'wild' && s !== 'scatter')

  // All wilds
  if (base.length === 0) {
    const wildDef = SYMBOL_MAP.get('wild')!
    return {
      paylineId,
      symbolId: 'wild',
      count: 3,
      multiplier: wildDef.payoutMultiplier,
      amount: bet * wildDef.payoutMultiplier,
    }
  }

  const target = base[0]
  if (!syms.every((s) => s === target || s === 'wild')) return null

  const symDef = SYMBOL_MAP.get(target)!
  if (symDef.payoutMultiplier === 0) return null

  return {
    paylineId,
    symbolId: target,
    count: 3,
    multiplier: symDef.payoutMultiplier,
    amount: bet * symDef.payoutMultiplier,
  }
}

export function calculateResult(grid: SymbolId[][], bet: number): SpinResult {
  const wins: WinResult[] = []

  for (const payline of PAYLINES) {
    const win = checkPayline(grid, payline.rows, bet, payline.id)
    if (win) wins.push(win)
  }

  const scatterCount = grid.flat().filter((s) => s === 'scatter').length
  const isScatterWin = scatterCount >= 3
  const freeSpinsAwarded = scatterCount >= 3 ? 10 : scatterCount === 2 ? 3 : 0
  const totalWin = wins.reduce((sum, w) => sum + w.amount, 0)

  return { grid, wins, totalWin, isScatterWin, freeSpinsAwarded, scatterCount }
}

export function getWinTier(totalWin: number, bet: number): WinTier {
  if (totalWin === 0) return 'none'
  const mult = totalWin / bet
  if (mult >= 80) return 'mega'
  if (mult >= 30) return 'big'
  if (mult >= 10) return 'medium'
  return 'small'
}

export function isJackpot(result: SpinResult): boolean {
  return result.wins.some((w) => w.symbolId === 'seven')
}
