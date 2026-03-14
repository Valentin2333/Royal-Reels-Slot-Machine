import Reel from './Reel'
import { INITIAL_GRID, PAYLINES, BET_OPTIONS } from '../constants/symbols'

export default function SlotMachine() {
  const grid = INITIAL_GRID

  return (
    <div className="machine-frame w-full max-w-xl p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-2xl">👑</span>
          <h1 className="gold-text text-3xl font-black tracking-wider" style={{ fontFamily: "'Cinzel Decorative', serif" }}>
            Royal Reels
          </h1>
          <span className="text-2xl">👑</span>
        </div>
        <p className="text-xs tracking-widest uppercase opacity-50 font-body">
          Premium Casino Slots
        </p>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />
        <span className="text-casino-gold text-xs">✦</span>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)' }} />
      </div>

      {/* Payline indicators + reels */}
      <div className="flex gap-3 items-stretch">
        {/* Left payline indicators */}
        <div className="flex flex-col justify-around py-2 gap-1">
          {PAYLINES.map((pl) => (
            <div key={pl.id} className="flex items-center gap-1.5">
              <div className="payline-dot" style={{ background: pl.color, boxShadow: `0 0 6px ${pl.color}` }} />
              <span className="text-xs opacity-40 font-body whitespace-nowrap hidden sm:block">{pl.label}</span>
            </div>
          ))}
        </div>

        {/* Reel container */}
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
            />
          ))}
        </div>

        {/* Right payline indicators (mirrored) */}
        <div className="flex flex-col justify-around py-2 gap-1">
          {PAYLINES.map((pl) => (
            <div key={pl.id} className="payline-dot" style={{ background: pl.color, boxShadow: `0 0 6px ${pl.color}` }} />
          ))}
        </div>
      </div>

      {/* Win display placeholder */}
      <div
        className="text-center py-3 rounded-lg"
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(212,175,55,0.15)',
        }}
      >
        <p className="text-xs uppercase tracking-widest opacity-40 font-body">Win</p>
        <p className="font-mono text-2xl font-bold text-casino-gold-light" style={{ fontFamily: "'Orbitron', monospace" }}>
          $0.00
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Balance */}
        <div className="balance-display">
          <p className="text-xs opacity-40 uppercase tracking-wider font-body">Balance</p>
          <p className="text-xl font-bold text-casino-gold-light" style={{ fontFamily: "'Orbitron', monospace" }}>
            $1,000
          </p>
        </div>

        {/* Spin button */}
        <div className="flex flex-col items-center gap-2">
          <button
            className="btn-spin w-20 h-20 text-sm"
            style={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}
          >
            SPIN
          </button>
        </div>

        {/* Bet selector */}
        <div className="balance-display">
          <p className="text-xs opacity-40 uppercase tracking-wider font-body">Bet</p>
          <div className="flex items-center gap-2">
            <button className="text-casino-gold opacity-60 hover:opacity-100 text-lg leading-none">−</button>
            <p className="text-xl font-bold text-casino-gold-light" style={{ fontFamily: "'Orbitron', monospace" }}>
              $5
            </p>
            <button className="text-casino-gold opacity-60 hover:opacity-100 text-lg leading-none">+</button>
          </div>
          <div className="flex gap-1 mt-1">
            {BET_OPTIONS.map((bet) => (
              <button
                key={bet}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: bet === 5 ? 'rgba(212,175,55,0.25)' : 'transparent',
                  border: '1px solid rgba(212,175,55,0.2)',
                  color: bet === 5 ? '#D4AF37' : 'rgba(255,255,255,0.3)',
                  fontFamily: "'Orbitron', monospace",
                }}
              >
                {bet}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs opacity-25 font-body">
        5 paylines active · Max bet: $50
      </p>
    </div>
  )
}
