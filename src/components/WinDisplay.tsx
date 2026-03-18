import { motion, AnimatePresence } from 'framer-motion'
import type { WinTier } from '../types'

interface WinDisplayProps {
  amount: number
  winTier: WinTier
  isScatterWin: boolean
  freeSpinsAwarded: number
}

const tierConfig = {
  none:   { color: 'rgba(255,255,255,0.15)', label: '' },
  small:  { color: '#D4AF37',  label: 'WIN!'        },
  medium: { color: '#FFE066',  label: 'BIG WIN!'    },
  big:    { color: '#FFD700',  label: '🔥 HUGE WIN!' },
  mega:   { color: '#FF2D55',  label: '💥 MEGA WIN!' },
}

export default function WinDisplay({ amount, winTier, isScatterWin, freeSpinsAwarded }: WinDisplayProps) {
  const config = tierConfig[winTier]
  const hasWin = winTier !== 'none'
  const showScatter = isScatterWin && freeSpinsAwarded > 0

  return (
    <div
      className="text-center py-3 px-4 rounded-lg transition-all duration-500"
      style={{
        background:  hasWin || showScatter ? 'rgba(212,175,55,0.07)' : 'rgba(0,0,0,0.4)',
        border:      `1px solid ${hasWin || showScatter ? 'rgba(212,175,55,0.25)' : 'rgba(212,175,55,0.08)'}`,
        boxShadow:   hasWin ? '0 0 25px rgba(212,175,55,0.08)' : 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {hasWin ? (
          <motion.div
            key={`win-${amount}`}
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <motion.p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-1"
              style={{ color: config.color, fontFamily: "'Cinzel Decorative', serif" }}
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {config.label}
            </motion.p>
            <p
              className="text-3xl font-black"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: config.color,
                textShadow: `0 0 20px ${config.color}`,
              }}
            >
              ${amount.toLocaleString()}
            </p>
          </motion.div>
        ) : (
          <motion.div key="no-win" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-xs uppercase tracking-widest opacity-30 font-body">Win</p>
            <p className="text-2xl font-bold opacity-20" style={{ fontFamily: "'Orbitron', monospace" }}>
              $0
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scatter free-spins message — shown regardless of payline win */}
      {showScatter && (
        <motion.p
          className="text-xs mt-1"
          style={{ color: '#5AC8FA' }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          💫 +{freeSpinsAwarded} free spins awarded!
        </motion.p>
      )}
    </div>
  )
}
