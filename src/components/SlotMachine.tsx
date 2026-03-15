import { PAYLINES } from '../constants/symbols'
import { useSlotMachine } from '../hooks/useSlotMachine'
import Balance from './Balance'
import Controls from './Controls'
import Reel from './Reel'

const REEL_STOP_DELAYS = [900, 1500, 2100]

function getWinningRowsForReel(reelIdx: number, wins: { paylineId: number }[]): number[] {
  if (!wins.length) return []
  const winningPaylineIds = new Set(wins.map((w) => w.paylineId))
  const rows: number[] = []
  PAYLINES.forEach((pl) => {
    if (winningPaylineIds.has(pl.id)) {
      rows.push(pl.rows[reelIdx])
    }
  })
  return [...new Set(rows)]
}

export default function SlotMachine() {
  const { state, spin, setBet, changeBet, winTier, canSpin } = useSlotMachine()
  const { balance, bet, phase, grid, result, freeSpins } = state

  const isSpinning = phase === 'spinning'
  const wins = result?.wins ?? []

  return (
    <div className="machine-frame w-full max-w-xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-2xl">👑</span>
          <h1
            className="gold-text text-3xl font-black tracking-wider"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            Royal Reels
          </h1>
          <span className="text-2xl">👑</span>
        </div>
        <p className="text-xs tracking-widest uppercase opacity-40 font-body">
          {freeSpins > 0 ? `🎰 ${freeSpins} FREE SPINS REMAINING` : 'Premium Casino Slots · 5 Paylines'}
        </p>
      </div>

      <div
        className="flex-1 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }}
      />

      {/* Reel area */}
      <div className="flex gap-3 items-stretch">
        {/* Left payline indicators */}
        <div className="flex flex-col justify-around py-1 gap-2">
          {PAYLINES.map((pl) => (
            <div
              key={pl.id}
              className="payline-dot transition-all duration-300"
              style={{
                background: pl.color,
                boxShadow: wins.some((w) => w.paylineId === pl.id)
                  ? `0 0 10px ${pl.color}, 0 0 20px ${pl.color}`
                  : `0 0 4px ${pl.color}`,
                transform: wins.some((w) => w.paylineId === pl.id) ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Reels */}
        <div
          className="flex-1 flex gap-2 p-3 rounded-xl"
          style={{
            background: 'var(--casino-felt)',
            border: '2px solid rgba(0,0,0,0.6)',
            boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.7)',
          }}
        >
          {grid.map((reelSymbols, reelIdx) => (
            <Reel
              key={reelIdx}
              symbols={reelSymbols}
              isSpinning={isSpinning}
              stopDelay={REEL_STOP_DELAYS[reelIdx]}
              winningRows={getWinningRowsForReel(reelIdx, wins)}
            />
          ))}
        </div>

        {/* Right payline indicators */}
        <div className="flex flex-col justify-around py-1 gap-2">
          {PAYLINES.map((pl) => (
            <div
              key={pl.id}
              className="payline-dot transition-all duration-300"
              style={{
                background: pl.color,
                boxShadow: wins.some((w) => w.paylineId === pl.id)
                  ? `0 0 10px ${pl.color}, 0 0 20px ${pl.color}`
                  : `0 0 4px ${pl.color}`,
                transform: wins.some((w) => w.paylineId === pl.id) ? 'scale(1.4)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Win display */}
      <div
        className="text-center py-3 rounded-lg transition-all duration-300"
        style={{
          background:
            winTier !== 'none'
              ? 'rgba(212,175,55,0.08)'
              : 'rgba(0,0,0,0.4)',
          border: `1px solid ${winTier !== 'none' ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)'}`,
          boxShadow: winTier !== 'none' ? '0 0 20px rgba(212,175,55,0.1)' : 'none',
        }}
      >
        <p className="text-xs uppercase tracking-widest opacity-40 font-body">Win</p>
        <p
          className="text-2xl font-bold"
          style={{
            fontFamily: "'Orbitron', monospace",
            color:
              winTier === 'mega' ? '#FFD700' :
              winTier === 'big' ? '#FFE066' :
              winTier !== 'none' ? '#D4AF37' : 'rgba(255,255,255,0.2)',
            textShadow: winTier !== 'none' ? '0 0 15px rgba(212,175,55,0.6)' : 'none',
            transition: 'all 0.4s ease',
          }}
        >
          {result?.totalWin ? `$${result.totalWin.toLocaleString()}` : '$0'}
        </p>
        {result?.isScatterWin && (
          <p className="text-xs mt-1" style={{ color: '#5AC8FA' }}>
            💫 Scatter win! +{result.freeSpinsAwarded} free spins!
          </p>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Balance balance={balance} freeSpins={freeSpins} />
        <Controls
          bet={bet}
          phase={phase}
          canSpin={canSpin}
          onSpin={spin}
          onSetBet={setBet}
          onChangeBet={changeBet}
        />
      </div>

      <p className="text-center text-xs opacity-20 font-body">
        5 paylines active · Wild substitutes all · 3× Scatter = 10 free spins
      </p>
    </div>
  )
}
