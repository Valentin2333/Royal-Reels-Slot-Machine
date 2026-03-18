import { motion } from 'framer-motion'

interface StatisticsProps {
  spinCount: number
  balance: number
  startingBalance?: number
  biggestWin: number
}

export default function Statistics({ spinCount, balance, startingBalance = 1000, biggestWin }: StatisticsProps) {
  const profit = balance - startingBalance
  const profitColor = profit >= 0 ? '#30D158' : '#FF3B5C'

  return (
    <motion.div
      className="rounded-xl p-4 flex flex-col gap-3"
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <p className="text-xs uppercase tracking-widest opacity-30 font-body">Session Stats</p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Spins', value: spinCount.toString(), color: '#D4AF37' },
          {
            label: 'Profit',
            value: `${profit >= 0 ? '+' : '-'}$${Math.abs(profit)}`,
            color: profitColor,
          },
          {
            label: 'Best Win',
            value: biggestWin > 0 ? `$${biggestWin}` : '—',
            color: '#5AC8FA',
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className="text-xs opacity-30 font-body">{label}</p>
            <p
              className="text-base font-bold"
              style={{ fontFamily: "'Orbitron', monospace", color }}
            >
              {value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
