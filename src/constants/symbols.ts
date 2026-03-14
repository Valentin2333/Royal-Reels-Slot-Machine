import type { SlotSymbol, Payline, SymbolId } from '../types';

export const SYMBOLS: SlotSymbol[] = [
  { id: 'cherry',  emoji: '🍒', label: 'Cherry',   color: '#FF3B5C', glowColor: 'rgba(255,59,92,0.7)',   weight: 8, payoutMultiplier: 3   },
  { id: 'lemon',   emoji: '🍋', label: 'Lemon',    color: '#FFD60A', glowColor: 'rgba(255,214,10,0.7)',  weight: 7, payoutMultiplier: 5   },
  { id: 'orange',  emoji: '🍊', label: 'Orange',   color: '#FF9F0A', glowColor: 'rgba(255,159,10,0.7)',  weight: 6, payoutMultiplier: 8   },
  { id: 'grape',   emoji: '🍇', label: 'Grapes',   color: '#BF5AF2', glowColor: 'rgba(191,90,242,0.7)',  weight: 5, payoutMultiplier: 12  },
  { id: 'bell',    emoji: '🔔', label: 'Bell',     color: '#E8B84B', glowColor: 'rgba(232,184,75,0.7)',  weight: 4, payoutMultiplier: 20  },
  { id: 'star',    emoji: '⭐', label: 'Star',     color: '#FFD700', glowColor: 'rgba(255,215,0,0.7)',   weight: 3, payoutMultiplier: 30  },
  { id: 'diamond', emoji: '💎', label: 'Diamond',  color: '#0AC8B9', glowColor: 'rgba(10,200,185,0.7)', weight: 2, payoutMultiplier: 60  },
  { id: 'seven',   emoji: '7️⃣', label: 'Lucky 7', color: '#FF2D55', glowColor: 'rgba(255,45,85,0.9)',   weight: 1, payoutMultiplier: 150 },
  { id: 'wild',    emoji: '🃏', label: 'Wild',     color: '#D4AF37', glowColor: 'rgba(212,175,55,0.9)',  weight: 1, payoutMultiplier: 200 },
  { id: 'scatter', emoji: '💫', label: 'Scatter',  color: '#5AC8FA', glowColor: 'rgba(90,200,250,0.9)', weight: 1, payoutMultiplier: 0   },
];

export const SYMBOL_MAP = new Map<SymbolId, SlotSymbol>(
  SYMBOLS.map((s) => [s.id, s])
);

export const PAYLINES: Payline[] = [
  { id: 0, rows: [1, 1, 1], color: '#FFD700', label: 'Center'       },
  { id: 1, rows: [0, 0, 0], color: '#FF2D55', label: 'Top'          },
  { id: 2, rows: [2, 2, 2], color: '#30D158', label: 'Bottom'       },
  { id: 3, rows: [0, 1, 2], color: '#0AC8B9', label: 'Diagonal ↘'  },
  { id: 4, rows: [2, 1, 0], color: '#BF5AF2', label: 'Diagonal ↗'  },
];

export const BET_OPTIONS = [1, 2, 5, 10, 25, 50] as const;
export type BetOption = (typeof BET_OPTIONS)[number];

export const INITIAL_GRID: SymbolId[][] = [
  ['cherry', 'bell', 'seven'],
  ['lemon', 'diamond', 'star'],
  ['orange', 'grape', 'wild'],
];
