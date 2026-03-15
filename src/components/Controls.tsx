import { BET_OPTIONS } from '../constants/symbols'
import type { BetOption } from '../constants/symbols'

interface ControlsProps {
  bet: number
  phase: string
  canSpin: boolean
  onSpin: () => void
  onSetBet: (bet: number) => void
  onChangeBet: (dir: 1 | -1) => void
}

export default function Controls({ bet, phase, canSpin, onSpin, onSetBet, onChangeBet }: ControlsProps) {
  const isSpinning = phase === 'spinning'

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Bet controls */}
      <div className="balance-display flex flex-col gap-1 min-w-[120px]">
        <p className="text-xs opacity-40 uppercase tracking-wider font-body">Bet Per Spin</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChangeBet(-1)}
            disabled={isSpinning}
            className="text-casino-gold opacity-60 hover:opacity-100 text-lg leading-none disabled:opacity-20 transition-opacity"
            aria-label="Decrease bet"
          >
            −
          </button>
          <p
            className="text-xl font-bold text-center w-10"
            style={{ fontFamily: "'Orbitron', monospace", color: '#FFE066' }}
          >
            ${bet}
          </p>
          <button
            onClick={() => onChangeBet(1)}
            disabled={isSpinning}
            className="text-casino-gold opacity-60 hover:opacity-100 text-lg leading-none disabled:opacity-20 transition-opacity"
            aria-label="Increase bet"
          >
            +
          </button>
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {BET_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => onSetBet(b)}
              disabled={isSpinning}
              className="text-xs px-1.5 py-0.5 rounded transition-all disabled:opacity-30"
              style={{
                background: bet === b ? 'rgba(212,175,55,0.25)' : 'transparent',
                border: `1px solid ${bet === b ? 'rgba(212,175,55,0.5)' : 'rgba(212,175,55,0.15)'}`,
                color: bet === b ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                fontFamily: "'Orbitron', monospace",
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Spin button */}
      <div className="flex flex-col items-center gap-2">
        <button
          className="btn-spin w-24 h-24 text-xs font-bold tracking-widest"
          onClick={onSpin}
          disabled={!canSpin || isSpinning}
          style={{ fontFamily: "'Cinzel Decorative', serif" }}
        >
          {isSpinning ? '···' : 'SPIN'}
        </button>
        {isSpinning && (
          <p className="text-xs opacity-40 font-body">Spinning...</p>
        )}
      </div>
    </div>
  )
}
