import { motion, AnimatePresence } from 'framer-motion'
import type { WinTier } from '../types'

interface MegaWinOverlayProps {
  winTier: WinTier
  amount: number
  visible: boolean
}

const configs = {
  mega: { label: '💥 MEGA WIN! 💥', color: '#FF2D55', glow: 'rgba(255,45,85,0.6)' },
  big: { label: '🔥 HUGE WIN! 🔥', color: '#FFD700', glow: 'rgba(255,215,0,0.6)' },
  medium: { label: '⭐ BIG WIN! ⭐', color: '#FFE066', glow: 'rgba(255,224,102,0.5)' },
  small: { label: '', color: '', glow: '' },
  none: { label: '', color: '', glow: '' },
}

export default function MegaWinOverlay({ winTier, amount, visible }: MegaWinOverlayProps) {
  const show = visible && (winTier === 'mega' || winTier === 'big' || winTier === 'medium')
  const cfg = configs[winTier]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial glow bg */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${cfg.glow} 0%, transparent 70%)`,
            }}
          />

          {/* Coin particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              initial={{ opacity: 0, scale: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                rotate: [0, 360],
                y: [0, -60 - Math.random() * 60],
              }}
              transition={{
                duration: 1.5,
                delay: Math.random() * 0.8,
                ease: 'easeOut',
              }}
            >
              {['💰', '🪙', '✨', '⭐', '💎'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}

          {/* Main label */}
          <motion.div
            className="relative text-center px-10 py-8 rounded-2xl"
            style={{
              background: 'rgba(0,0,0,0.85)',
              border: `2px solid ${cfg.color}`,
              boxShadow: `0 0 60px ${cfg.glow}, 0 0 120px ${cfg.glow}`,
            }}
            initial={{ scale: 0.5, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.p
              className="text-2xl font-black mb-2"
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                color: cfg.color,
                textShadow: `0 0 30px ${cfg.color}`,
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {cfg.label}
            </motion.p>
            <motion.p
              className="text-4xl font-black"
              style={{
                fontFamily: "'Orbitron', monospace",
                color: '#fff',
                textShadow: `0 0 20px ${cfg.color}`,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              ${amount.toLocaleString()}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
