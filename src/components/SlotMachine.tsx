import { useState } from 'react'
import { motion } from 'framer-motion'
import { PAYLINES } from '../constants/symbols'
import { useSlotMachine } from '../hooks/useSlotMachine'
import { audio } from '../utils/audioManager'
import Balance from './Balance'
import Controls from './Controls'
import ReelGrid from './ReelGrid'
import WinDisplay from './WinDisplay'
import PayTable from './PayTable'
import WinHistory from './WinHistory'
import Statistics from './Statistics'
import MegaWinOverlay from './MegaWinOverlay'

export default function SlotMachine() {
  const { state, spin, setBet, changeBet, winTier, canSpin } = useSlotMachine()
  const {
    balance, bet, phase, grid, result, freeSpins,
    winHistory, spinCount, biggestWin, showMegaWin,
    reelsSpinning,
  } = state

  const [showPayTable, setShowPayTable] = useState(false)
  const [showStats,    setShowStats]    = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const wins = result?.wins ?? []

  const handleSpin = () => {
    audio.spinStart()
    spin()
  }

  const handleToggleSound = () => {
    setSoundEnabled(audio.toggle())
  }

  return (
    <>
      <MegaWinOverlay winTier={winTier} amount={result?.totalWin ?? 0} visible={showMegaWin} />
      <PayTable isOpen={showPayTable} onClose={() => setShowPayTable(false)} currentBet={bet} />

      <motion.div
        className="machine-frame w-full max-w-xl p-6 flex flex-col gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="text-center relative">
          <div className="flex items-center justify-center gap-3 mb-1">
            <motion.span className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}>👑</motion.span>
            <h1 className="gold-text text-3xl font-black tracking-wider"
              style={{ fontFamily: "'Cinzel Decorative', serif" }}>Royal Reels</h1>
            <motion.span className="text-2xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}>👑</motion.span>
          </div>
          <p className="text-xs tracking-widest uppercase opacity-40 font-body">
            {freeSpins > 0
              ? `🎰 ${freeSpins} FREE SPINS REMAINING`
              : 'Premium Casino Slots · 5 Paylines'}
          </p>
          <div className="absolute right-0 top-0 flex gap-2">
            <button onClick={handleToggleSound}
              className="text-lg opacity-40 hover:opacity-80 transition-opacity">
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button onClick={() => setShowStats(!showStats)}
              className="text-xs px-2 py-1 rounded font-body opacity-40 hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>📊</button>
            <button onClick={() => setShowPayTable(true)}
              className="text-xs px-2 py-1 rounded font-body opacity-40 hover:opacity-80 transition-opacity"
              style={{ border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>ℹ Pay</button>
          </div>
        </div>

        <div className="h-px"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent)' }} />

        {showStats && (
          <Statistics spinCount={spinCount} balance={balance} biggestWin={biggestWin} />
        )}

        {/* Reel area with payline dots */}
        <div className="flex gap-3 items-stretch">
          {/* Left payline dots */}
          <div className="flex flex-col justify-around py-1 gap-2">
            {PAYLINES.map((pl) => {
              const isActive = wins.some((w) => w.paylineId === pl.id)
              return (
                <motion.div key={pl.id} className="payline-dot"
                  animate={isActive
                    ? { scale: [1, 1.5, 1.2], opacity: [1, 0.7, 1] }
                    : { scale: 1, opacity: 0.6 }}
                  transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
                  style={{
                    background: pl.color,
                    boxShadow: isActive
                      ? `0 0 12px ${pl.color}, 0 0 20px ${pl.color}`
                      : `0 0 4px ${pl.color}`,
                  }}
                />
              )
            })}
          </div>

          {/* Reels */}
          <ReelGrid grid={grid} reelsSpinning={reelsSpinning} wins={wins} />

          {/* Right payline dots */}
          <div className="flex flex-col justify-around py-1 gap-2">
            {PAYLINES.map((pl) => {
              const isActive = wins.some((w) => w.paylineId === pl.id)
              return (
                <motion.div key={pl.id} className="payline-dot"
                  animate={isActive
                    ? { scale: [1, 1.5, 1.2], opacity: [1, 0.7, 1] }
                    : { scale: 1, opacity: 0.6 }}
                  transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
                  style={{
                    background: pl.color,
                    boxShadow: isActive
                      ? `0 0 12px ${pl.color}, 0 0 20px ${pl.color}`
                      : `0 0 4px ${pl.color}`,
                  }}
                />
              )
            })}
          </div>
        </div>

        <WinDisplay
          amount={result?.totalWin ?? 0}
          winTier={winTier}
          isScatterWin={result?.isScatterWin ?? false}
          freeSpinsAwarded={result?.freeSpinsAwarded ?? 0}
        />

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Balance balance={balance} freeSpins={freeSpins} />
          <Controls
            bet={bet} phase={phase} canSpin={canSpin}
            onSpin={handleSpin} onSetBet={setBet} onChangeBet={changeBet}
          />
        </div>

        <WinHistory history={winHistory} />

        <p className="text-center text-xs opacity-20 font-body">
          5 paylines · Wild substitutes all · 3× Scatter = 10 free spins
        </p>
      </motion.div>
    </>
  )
}
