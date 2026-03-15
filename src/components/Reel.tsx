import { useEffect, useState } from 'react'
import type { SymbolId } from '../types'
import { SYMBOLS } from '../constants/symbols'
import Symbol from './Symbol'

interface ReelProps {
  symbols: SymbolId[]
  isSpinning: boolean
  winningRows?: number[]
  stopDelay?: number
}

function randomSymbolId(): SymbolId {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id
}

export default function Reel({ symbols, isSpinning, winningRows = [], stopDelay = 0 }: ReelProps) {
  const [localSpinning, setLocalSpinning] = useState(false)
  const [displaySymbols, setDisplaySymbols] = useState<SymbolId[]>(symbols)
  const [tickInterval, setTickInterval] = useState<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isSpinning) {
      setLocalSpinning(true)
      const interval = setInterval(() => {
        setDisplaySymbols([randomSymbolId(), randomSymbolId(), randomSymbolId()])
      }, 80)
      setTickInterval(interval)
    } else {
      const timeout = setTimeout(() => {
        setLocalSpinning(false)
        setDisplaySymbols(symbols)
        if (tickInterval) clearInterval(tickInterval)
        setTickInterval(null)
      }, stopDelay)
      return () => clearTimeout(timeout)
    }
    return () => {
      if (tickInterval) clearInterval(tickInterval)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning])

  useEffect(() => {
    if (!localSpinning) setDisplaySymbols(symbols)
  }, [symbols, localSpinning])

  return (
    <div
      className="reel-window flex-1 relative"
      style={{
        minWidth: 0,
        boxShadow: localSpinning
          ? 'inset 0 0 40px rgba(0,0,0,0.9), 0 0 15px rgba(212,175,55,0.15)'
          : 'inset 0 0 40px rgba(0,0,0,0.9)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div
        className="flex flex-col"
        style={{
          filter: localSpinning ? 'blur(2px)' : 'none',
          transition: localSpinning ? 'none' : 'filter 0.15s ease',
        }}
      >
        {displaySymbols.slice(0, 3).map((sym, rowIdx) => (
          <Symbol
            key={rowIdx}
            symbolId={sym}
            size="md"
            isWinning={!localSpinning && winningRows.includes(rowIdx)}
          />
        ))}
      </div>
    </div>
  )
}
