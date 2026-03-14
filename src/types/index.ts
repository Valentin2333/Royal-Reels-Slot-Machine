export type SymbolId =
  | 'cherry' | 'lemon' | 'orange' | 'grape'
  | 'bell' | 'star' | 'diamond' | 'seven'
  | 'wild' | 'scatter';

export interface SlotSymbol {
  id: SymbolId;
  emoji: string;
  label: string;
  color: string;
  glowColor: string;
  weight: number;
  payoutMultiplier: number;
}

export interface Payline {
  id: number;
  rows: [number, number, number];
  color: string;
  label: string;
}

export interface WinResult {
  paylineId: number;
  symbolId: SymbolId;
  count: number;
  multiplier: number;
  amount: number;
}

export interface SpinResult {
  grid: SymbolId[][];
  wins: WinResult[];
  totalWin: number;
  isScatterWin: boolean;
  freeSpinsAwarded: number;
  scatterCount: number;
}

export type GamePhase = 'idle' | 'spinning' | 'won' | 'lost';

export type WinTier = 'none' | 'small' | 'medium' | 'big' | 'mega';

export interface WinRecord {
  id: number;
  amount: number;
  bet: number;
  symbols: SymbolId[];
}
