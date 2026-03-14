import type { SymbolId } from '../types'
import Symbol from './Symbol'

interface ReelProps {
  symbols: SymbolId[]
  isSpinning?: boolean
  winningRows?: number[]
}

export default function Reel({ symbols, isSpinning = false, winningRows = [] }: ReelProps) {
  return (
    <div className="reel-window flex-1 relative" style={{ minWidth: 0 }}>
      {/* Spinning overlay */}
      {isSpinning && (
        <div
          className="absolute inset-0 z-20 flex flex-col"
          style={{
            background: 'rgba(7,7,15,0.3)',
          }}
        >
          <div
            className="flex-1 flex flex-col"
            style={{
              animation: 'spinBlur 0.08s linear infinite',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Symbol
                key={i}
                symbolId={symbols[i % symbols.length]}
                size="md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Static symbols */}
      <div className={`flex flex-col ${isSpinning ? 'opacity-0' : 'opacity-100'}`} style={{ transition: 'opacity 0.1s' }}>
        {symbols.slice(0, 3).map((sym, rowIdx) => (
          <Symbol
            key={rowIdx}
            symbolId={sym}
            size="md"
            isWinning={winningRows.includes(rowIdx)}
          />
        ))}
      </div>
    </div>
  )
}
