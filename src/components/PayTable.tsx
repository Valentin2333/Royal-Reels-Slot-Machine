import { motion, AnimatePresence } from 'framer-motion'
import { SYMBOLS, PAYLINES, BET_OPTIONS } from '../constants/symbols'

interface PayTableProps {
  isOpen: boolean
  onClose: () => void
  currentBet: number
}

export default function PayTable({ isOpen, onClose, currentBet }: PayTableProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 top-1/2 z-50 max-w-md mx-auto"
            style={{ transform: 'translateY(-50%)' }}
            initial={{ opacity: 0, scale: 0.9, y: '-40%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.9, y: '-40%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="machine-frame p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.3) transparent' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2
                  className="gold-text text-xl font-bold"
                  style={{ fontFamily: "'Cinzel Decorative', serif" }}
                >
                  Pay Table
                </h2>
                <button
                  onClick={onClose}
                  className="text-2xl opacity-40 hover:opacity-100 transition-opacity"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent)' }} />

              {/* Symbol payouts */}
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 font-body mb-3">Symbol Payouts (3 of a kind)</p>
                <div className="flex flex-col gap-1">
                  {SYMBOLS.filter((s) => s.payoutMultiplier > 0).map((sym) => (
                    <div
                      key={sym.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sym.emoji}</span>
                        <span className="text-sm font-body opacity-70">{sym.label}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ fontFamily: "'Orbitron', monospace", color: sym.color }}>
                          {sym.payoutMultiplier}× BET
                        </p>
                        <p className="text-xs opacity-40" style={{ fontFamily: "'Orbitron', monospace" }}>
                          = ${sym.payoutMultiplier * currentBet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special symbols */}
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 font-body mb-3">Special Symbols</p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
                    <span className="text-2xl">🃏</span>
                    <div>
                      <p className="text-sm font-body">Wild</p>
                      <p className="text-xs opacity-50">Substitutes for any symbol except Scatter</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(90,200,250,0.06)', border: '1px solid rgba(90,200,250,0.15)' }}>
                    <span className="text-2xl">💫</span>
                    <div>
                      <p className="text-sm font-body">Scatter</p>
                      <p className="text-xs opacity-50">2 Scatter = 3 free spins · 3 Scatter = 10 free spins</p>
                      <p className="text-xs opacity-50">Pays anywhere, no payline needed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paylines */}
              <div>
                <p className="text-xs uppercase tracking-widest opacity-40 font-body mb-3">Active Paylines</p>
                <div className="flex flex-col gap-1">
                  {PAYLINES.map((pl) => (
                    <div key={pl.id} className="flex items-center gap-2 px-3 py-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: pl.color, boxShadow: `0 0 6px ${pl.color}` }} />
                      <span className="text-sm font-body opacity-60">{pl.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-2 py-2 rounded-lg text-sm font-body transition-all"
                style={{
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: '#D4AF37',
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
