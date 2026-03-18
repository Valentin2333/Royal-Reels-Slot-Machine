import { useRef, useEffect, useState } from 'react'
import { PAYLINES } from '../constants/symbols'
import type { WinResult } from '../types'
import { SYMBOL_HEIGHT } from './Reel'
import Reel from './Reel'
import type { SymbolId } from '../types'

interface ReelGridProps {
  grid: SymbolId[][]
  reelsSpinning: [boolean, boolean, boolean]
  wins: WinResult[]
}

function getWinningRowsForReel(reelIdx: number, wins: WinResult[]): number[] {
  if (!wins.length) return []
  const ids = new Set(wins.map((w) => w.paylineId))
  const rows: number[] = []
  PAYLINES.forEach((pl) => { if (ids.has(pl.id)) rows.push(pl.rows[reelIdx]) })
  return [...new Set(rows)]
}

interface PaylineLineProps {
  rows: [number, number, number]
  color: string
  containerWidth: number
}

// Draws a polyline across the 3 reels connecting the winning cells
function PaylineLine({ rows, color, containerWidth }: PaylineLineProps) {
  const PADDING    = 12                      // felt padding
  const reelCount  = 3
  const gap        = 8                       // gap-2 = 8px
  const reelWidth  = (containerWidth - PADDING * 2 - gap * (reelCount - 1)) / reelCount

  // Centre X of each reel
  const cx = (ri: number) => PADDING + ri * (reelWidth + gap) + reelWidth / 2
  // Centre Y of a row
  const cy = (row: number) => PADDING + row * SYMBOL_HEIGHT + SYMBOL_HEIGHT / 2

  const points = rows.map((row, ri) => `${cx(ri)},${cy(row)}`).join(' ')

  const totalH = SYMBOL_HEIGHT * 3 + PADDING * 2

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={containerWidth}
      height={totalH}
      style={{ zIndex: 30 }}
    >
      <defs>
        <filter id={`glow-${color.replace('#','')}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Shadow line for depth */}
      <polyline
        points={points}
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Main coloured line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.9}
        filter={`url(#glow-${color.replace('#','')})`}
      />

      {/* Dot at each winning cell */}
      {rows.map((row, ri) => (
        <circle
          key={ri}
          cx={cx(ri)}
          cy={cy(row)}
          r={7}
          fill={color}
          fillOpacity={0.9}
          filter={`url(#glow-${color.replace('#','')})`}
        />
      ))}
    </svg>
  )
}

export default function ReelGrid({ grid, reelsSpinning, wins }: ReelGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const isAnySpinning = reelsSpinning.some(Boolean)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(containerRef.current)
    setContainerWidth(containerRef.current.offsetWidth)
    return () => ro.disconnect()
  }, [])

  const activePaylines = PAYLINES.filter((pl) =>
    wins.some((w) => w.paylineId === pl.id)
  )

  return (
    <div
      ref={containerRef}
      className="flex-1 flex gap-2 p-3 rounded-xl relative"
      style={{
        background:  'var(--casino-felt)',
        border:      '2px solid rgba(0,0,0,0.6)',
        boxShadow:   'inset 0 4px 20px rgba(0,0,0,0.7)',
      }}
    >
      {grid.map((reelSymbols, reelIdx) => (
        <Reel
          key={reelIdx}
          symbols={reelSymbols}
          isSpinning={reelsSpinning[reelIdx]}
          winningRows={getWinningRowsForReel(reelIdx, wins)}
        />
      ))}

      {/* SVG paylines — only shown when all reels have stopped */}
      {!isAnySpinning && containerWidth > 0 && activePaylines.map((pl) => (
        <PaylineLine
          key={pl.id}
          rows={pl.rows}
          color={pl.color}
          containerWidth={containerWidth}
        />
      ))}
    </div>
  )
}
