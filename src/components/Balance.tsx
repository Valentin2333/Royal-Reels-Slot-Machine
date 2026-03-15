interface BalanceProps {
  balance: number
  freeSpins: number
}

export default function Balance({ balance, freeSpins }: BalanceProps) {
  return (
    <div className="balance-display flex flex-col gap-0.5 min-w-[120px]">
      <p className="text-xs opacity-40 uppercase tracking-wider font-body">Balance</p>
      <p
        className="text-xl font-bold"
        style={{
          fontFamily: "'Orbitron', monospace",
          color: balance < 20 ? '#FF3B5C' : '#FFE066',
        }}
      >
        ${balance.toLocaleString()}
      </p>
      {freeSpins > 0 && (
        <p className="text-xs font-body" style={{ color: '#5AC8FA' }}>
          🎰 {freeSpins} free spins
        </p>
      )}
    </div>
  )
}
