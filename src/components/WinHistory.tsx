import { motion, AnimatePresence } from 'framer-motion'
import type { WinRecord } from '../types'
import { SYMBOL_MAP } from '../constants/symbols'

interface WinHistoryProps {
  history: WinRecord[]
}

export default function WinHistory({ history }: WinHistoryProps) {
  if (history.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs uppercase tracking-widest opacity-30 font-body">Recent Wins</p>
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {history.slice(0, 5).map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex items-center justify-between px-3 py-1.5 rounded-lg"
              style={{
                background: 'rgba(212,175,55,0.05)',
                border: '1px solid rgba(212,175,55,0.1)',
              }}
            >
              <div className="flex items-center gap-1.5">
                {[...new Set(record.symbols)].slice(0, 3).map((sym, i) => (
                  <span key={i} className="text-sm">
                    {SYMBOL_MAP.get(sym)?.emoji}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs opacity-40 font-body">bet ${record.bet}</span>
                <span
                  className="text-sm font-bold"
                  style={{
                    fontFamily: "'Orbitron', monospace",
                    color: record.amount >= record.bet * 50 ? '#FFD700' :
                           record.amount >= record.bet * 20 ? '#FFE066' : '#D4AF37',
                  }}
                >
                  +${record.amount}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
