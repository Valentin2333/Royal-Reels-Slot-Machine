import type { SymbolId } from '../types'
import { SYMBOL_MAP } from '../constants/symbols'

interface SymbolProps {
  symbolId: SymbolId
  size?: 'sm' | 'md' | 'lg'
  isWinning?: boolean
}

const sizeClasses = {
  sm: 'text-2xl h-16',
  md: 'text-4xl h-24',
  lg: 'text-5xl h-28',
}

export default function Symbol({ symbolId, size = 'md', isWinning = false }: SymbolProps) {
  const sym = SYMBOL_MAP.get(symbolId)
  if (!sym) return null

  return (
    <div
      className={`symbol-cell ${sizeClasses[size]} select-none`}
      style={{
        background: isWinning
          ? `radial-gradient(circle at center, ${sym.glowColor} 0%, transparent 70%)`
          : 'transparent',
        boxShadow: isWinning ? `0 0 30px ${sym.glowColor}` : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <span
        style={{
          filter: isWinning ? `drop-shadow(0 0 12px ${sym.color})` : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {sym.emoji}
      </span>
    </div>
  )
}
