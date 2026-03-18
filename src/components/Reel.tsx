import { useEffect, useRef, useState } from 'react'
import type { SymbolId } from '../types'
import { SYMBOLS, SYMBOL_MAP } from '../constants/symbols'

export const SYMBOL_HEIGHT = 100

// Use a large random prefix so we never need to loop mid-spin.
// At 1320 px/s for up to 2100ms we scroll ~2772px → 28 symbols.
// 50 symbols gives plenty of buffer.
const RANDOM_PREFIX = 50
const STOP_TARGET   = -(RANDOM_PREFIX * SYMBOL_HEIGHT) // -5000px

const FULL_SPEED     = 22    // px per frame @ 60 fps
const EASE           = 0.13  // pull strength during deceleration
const SNAP_THRESHOLD = 1     // px – within this, snap to exact target

function randomSymbolId(): SymbolId {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id
}

/** [50 random] + [top, mid, bot] → 53-symbol tape */
function buildStrip(finalSymbols: SymbolId[]): SymbolId[] {
  return [
    ...Array.from({ length: RANDOM_PREFIX }, () => randomSymbolId()),
    ...finalSymbols,
  ]
}

interface ReelProps {
  symbols: SymbolId[]     // [top, mid, bot] final result
  isSpinning: boolean     // per-reel signal controlled by hook
  winningRows?: number[]  // which row indices (0/1/2) to highlight
}

type Phase = 'idle' | 'spinning' | 'decelerating'

export default function Reel({ symbols, isSpinning, winningRows = [] }: ReelProps) {
  const [phase,     setPhase]     = useState<Phase>('idle')
  const [strip,     setStrip]     = useState<SymbolId[]>(symbols)
  const [renderPos, setRenderPos] = useState(0)

  const phaseRef   = useRef<Phase>('idle')
  const posRef     = useRef(0)
  const rafRef     = useRef<number | null>(null)
  const symbolsRef = useRef(symbols)

  useEffect(() => { symbolsRef.current = symbols }, [symbols])

  // Deceleration loop — separated so we can start it independently
  const startDecel = () => {
    const decelTick = () => {
      const remaining = STOP_TARGET - posRef.current

      if (Math.abs(remaining) <= SNAP_THRESHOLD) {
        // Snap exactly to the final symbols
        posRef.current = 0
        setRenderPos(0)
        setStrip(symbolsRef.current)
        phaseRef.current = 'idle'
        setPhase('idle')
        return
      }

      const step = remaining * EASE
      // Don't overshoot
      const next = Math.abs(step) > Math.abs(remaining)
        ? STOP_TARGET
        : posRef.current + step

      posRef.current = next
      setRenderPos(next)
      rafRef.current = requestAnimationFrame(decelTick)
    }

    rafRef.current = requestAnimationFrame(decelTick)
  }

  useEffect(() => {
    if (isSpinning) {
      // ── Start a fresh spin ─────────────────────────────────────────
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)

      const newStrip = buildStrip(symbolsRef.current)
      setStrip(newStrip)
      posRef.current = 0
      setRenderPos(0)
      phaseRef.current = 'spinning'
      setPhase('spinning')

      const spinTick = () => {
        if (phaseRef.current !== 'spinning') return // stopped mid-tick

        const next = posRef.current - FULL_SPEED
        posRef.current = next
        setRenderPos(next)
        rafRef.current = requestAnimationFrame(spinTick)
      }

      rafRef.current = requestAnimationFrame(spinTick)

    } else {
      // ── Stop signal ────────────────────────────────────────────────
      if (phaseRef.current === 'spinning') {
        // Cancel the spin RAF (if still alive) and start decel
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
        phaseRef.current = 'decelerating'
        setPhase('decelerating')
        startDecel()
      }
      // If already decelerating or idle, do nothing
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning])

  const displayStrip = phase === 'idle' ? symbols : strip
  const displayPos   = phase === 'idle' ? 0       : renderPos

  return (
    <div
      className="reel-window flex-1 relative"
      style={{ height: SYMBOL_HEIGHT * 3, minWidth: 0, overflow: 'hidden' }}
    >
      {/* Top / bottom depth fade */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: [
            'linear-gradient(180deg,',
            'rgba(0,0,0,0.78) 0%,',
            'transparent 22%,',
            'transparent 78%,',
            'rgba(0,0,0,0.78) 100%)',
          ].join(' '),
        }}
      />

      {/* Winning row highlight lines (z above shadow) */}
      {phase === 'idle' && winningRows.map((row) => (
        <div
          key={row}
          className="absolute left-0 right-0 z-20 pointer-events-none"
          style={{
            top:    row * SYMBOL_HEIGHT,
            height: SYMBOL_HEIGHT,
            border: '2px solid rgba(212,175,55,0.55)',
            boxShadow: '0 0 12px rgba(212,175,55,0.35)',
            borderRadius: 4,
          }}
        />
      ))}

      {/* Scrolling tape */}
      <div style={{ transform: `translateY(${displayPos}px)`, willChange: 'transform' }}>
        {displayStrip.map((symId, i) => {
          const sym      = SYMBOL_MAP.get(symId)
          const isWinRow = phase === 'idle' && winningRows.includes(i)

          return (
            <div
              key={i}
              data-testid={phase === 'idle' ? `reel-cell-${i}` : undefined}
              style={{
                height:         SYMBOL_HEIGHT,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontSize:       '3rem',
                borderBottom:   '1px solid rgba(255,255,255,0.04)',
                background: isWinRow
                  ? `radial-gradient(circle at center, ${sym?.glowColor} 0%, transparent 68%)`
                  : 'transparent',
                transition: 'background 0.3s ease',
                userSelect: 'none',
              }}
            >
              <span style={{
                filter:     isWinRow ? `drop-shadow(0 0 14px ${sym?.color})` : 'none',
                transition: 'filter 0.3s ease',
                lineHeight:  1,
              }}>
                {sym?.emoji}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
