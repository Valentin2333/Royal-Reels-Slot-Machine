import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Symbol from '../components/Symbol'
import Balance from '../components/Balance'
import WinHistory from '../components/WinHistory'
import Statistics from '../components/Statistics'
import WinDisplay from '../components/WinDisplay'
import Controls from '../components/Controls'
import Reel from '../components/Reel'
import ReelGrid from '../components/ReelGrid'

vi.mock('framer-motion', () => ({
  motion: {
    div:  ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>)       => <div {...props}>{children}</div>,
    p:    ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>)      => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', (_cb: FrameRequestCallback) => 0)
  vi.stubGlobal('cancelAnimationFrame', (_id: number) => {})
  vi.stubGlobal('ResizeObserver', class {
    observe    = vi.fn()
    unobserve  = vi.fn()
    disconnect = vi.fn()
  })
})

afterEach(() => { vi.unstubAllGlobals() })

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Match text that may be split across child nodes, ignoring whitespace and locale comma formatting */
const byAmount = (amount: number) =>
  (_: string, el: Element | null) => {
    const text = el?.textContent?.replace(/[\s,]/g, '') ?? ''
    return text === `$${amount}` || text === `$${amount.toLocaleString().replace(/,/g, '')}`
  }

// ─── Symbol ──────────────────────────────────────────────────────────────────

describe('Symbol component', () => {
  it('renders the correct emoji for cherry', () => {
    const { container } = render(<Symbol symbolId="cherry" />)
    expect(container.textContent).toContain('🍒')
  })

  it('renders the correct emoji for seven', () => {
    const { container } = render(<Symbol symbolId="seven" />)
    expect(container.textContent).toContain('7️⃣')
  })

  it('renders the correct emoji for wild', () => {
    const { container } = render(<Symbol symbolId="wild" />)
    expect(container.textContent).toContain('🃏')
  })

  it('renders the correct emoji for scatter', () => {
    const { container } = render(<Symbol symbolId="scatter" />)
    expect(container.textContent).toContain('💫')
  })

  it('applies winning glow styles when isWinning=true', () => {
    const { container } = render(<Symbol symbolId="diamond" isWinning={true} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.style.background).not.toBe('')
  })

  it('does not apply glow when isWinning=false', () => {
    const { container } = render(<Symbol symbolId="diamond" isWinning={false} />)
    const cell = container.firstChild as HTMLElement
    expect(cell.style.background).toBe('transparent')
  })

  it('renders without crashing for all symbol ids', () => {
    const ids = ['cherry','lemon','orange','grape','bell','star','diamond','seven','wild','scatter'] as const
    ids.forEach((id) => { const { unmount } = render(<Symbol symbolId={id} />); unmount() })
  })
})

// ─── Reel ─────────────────────────────────────────────────────────────────────

describe('Reel component', () => {
  const symbols = ['cherry', 'bell', 'lemon'] as const

  it('renders 3 cells with data-testid in idle state', () => {
    render(<Reel symbols={[...symbols]} isSpinning={false} />)
    expect(screen.getByTestId('reel-cell-0')).toBeInTheDocument()
    expect(screen.getByTestId('reel-cell-1')).toBeInTheDocument()
    expect(screen.getByTestId('reel-cell-2')).toBeInTheDocument()
  })

  it('renders correct emoji symbols in idle state', () => {
    const { container } = render(<Reel symbols={['cherry', 'bell', 'lemon']} isSpinning={false} />)
    expect(container.textContent).toContain('🍒')
    expect(container.textContent).toContain('🔔')
    expect(container.textContent).toContain('🍋')
  })

  it('applies win row glow to winning rows when idle', () => {
    render(<Reel symbols={['cherry', 'bell', 'lemon']} isSpinning={false} winningRows={[1]} />)
    const midCell = screen.getByTestId('reel-cell-1')
    expect(midCell.style.background).toContain('radial-gradient')
  })

  it('does not apply win glow to non-winning rows', () => {
    render(<Reel symbols={['cherry', 'bell', 'lemon']} isSpinning={false} winningRows={[1]} />)
    const topCell = screen.getByTestId('reel-cell-0')
    // Non-winning cells have background 'transparent' (may be '' in jsdom — either is correct)
    expect(['', 'transparent']).toContain(topCell.style.background)
  })

  it('renders without crashing when isSpinning=true', () => {
    expect(() => render(<Reel symbols={[...symbols]} isSpinning={true} />)).not.toThrow()
  })

  it('renders without crashing with empty winningRows', () => {
    expect(() => render(<Reel symbols={[...symbols]} isSpinning={false} winningRows={[]} />)).not.toThrow()
  })

  it('renders without crashing with all 3 rows winning', () => {
    expect(() => render(<Reel symbols={[...symbols]} isSpinning={false} winningRows={[0, 1, 2]} />)).not.toThrow()
  })

  it('has overflow hidden to mask scrolling strip', () => {
    const { container } = render(<Reel symbols={[...symbols]} isSpinning={false} />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.overflow).toBe('hidden')
  })
})

// ─── ReelGrid ─────────────────────────────────────────────────────────────────

describe('ReelGrid component', () => {
  const grid = [
    ['cherry', 'bell',    'lemon'  ],
    ['star',   'diamond', 'grape'  ],
    ['orange', 'wild',    'seven'  ],
  ] as const

  it('renders 3 Reel columns (3 × 3 cells via data-testid)', () => {
    render(
      <ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[false, false, false]} wins={[]} />
    )
    // Each reel renders cells 0-2; all 9 must be present
    ;[0, 1, 2].forEach((cell) => {
      expect(screen.getAllByTestId(`reel-cell-${cell}`)).toHaveLength(3)
    })
  })

  it('renders no SVG payline when there are no wins', () => {
    const { container } = render(
      <ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[false, false, false]} wins={[]} />
    )
    expect(container.querySelectorAll('svg')).toHaveLength(0)
  })

  it('does not render SVG paylines while any reel is spinning', () => {
    const wins = [{ paylineId: 0, symbolId: 'bell' as const, count: 3, multiplier: 20, amount: 100 }]
    const { container } = render(
      <ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[false, false, true]} wins={wins} />
    )
    expect(container.querySelectorAll('svg')).toHaveLength(0)
  })

  it('renders without crashing when all reels are spinning', () => {
    expect(() =>
      render(<ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[true, true, true]} wins={[]} />)
    ).not.toThrow()
  })

  it('passes correct winning rows to middle reel — centre payline highlights row 1', () => {
    // Payline 0 = rows [1,1,1]. All 3 reels' cell-1 should glow.
    const wins = [{ paylineId: 0, symbolId: 'bell' as const, count: 3, multiplier: 20, amount: 100 }]
    render(
      <ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[false, false, false]} wins={wins} />
    )
    // getAllByTestId returns one per reel (3 total)
    const midCells = screen.getAllByTestId('reel-cell-1')
    midCells.forEach((cell) => {
      expect(cell.style.background).toContain('radial-gradient')
    })
  })

  it('does not highlight row 0 cells when only centre payline wins', () => {
    const wins = [{ paylineId: 0, symbolId: 'bell' as const, count: 3, multiplier: 20, amount: 100 }]
    render(
      <ReelGrid grid={[...grid.map(r => [...r])]} reelsSpinning={[false, false, false]} wins={wins} />
    )
    const topCells = screen.getAllByTestId('reel-cell-0')
    topCells.forEach((cell) => {
      expect(['', 'transparent']).toContain(cell.style.background)
    })
  })
})

// ─── Balance ─────────────────────────────────────────────────────────────────

describe('Balance component', () => {
  it('displays balance with $ sign', () => {
    render(<Balance balance={1000} freeSpins={0} />)
    // toLocaleString may split "$" and "1,000" into sibling nodes — match full text
    const el = screen.getByText(byAmount(1000))
    expect(el).toBeInTheDocument()
  })

  it('does not show free spins text when freeSpins is 0', () => {
    render(<Balance balance={500} freeSpins={0} />)
    expect(screen.queryByText(/free spins/i)).not.toBeInTheDocument()
  })

  it('shows free spins count when freeSpins > 0', () => {
    render(<Balance balance={500} freeSpins={10} />)
    expect(screen.getByText(/10 free spins/i)).toBeInTheDocument()
  })

  it('shows correct balance for small amounts', () => {
    render(<Balance balance={5} freeSpins={0} />)
    expect(screen.getByText(byAmount(5))).toBeInTheDocument()
  })
})

// ─── WinDisplay ──────────────────────────────────────────────────────────────

describe('WinDisplay component', () => {
  it('shows $0 when winTier is none', () => {
    render(<WinDisplay amount={0} winTier="none" isScatterWin={false} freeSpinsAwarded={0} />)
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('shows WIN! label for small wins', () => {
    render(<WinDisplay amount={50} winTier="small" isScatterWin={false} freeSpinsAwarded={0} />)
    expect(screen.getByText('WIN!')).toBeInTheDocument()
  })

  it('shows the correct win amount', () => {
    render(<WinDisplay amount={1500} winTier="big" isScatterWin={false} freeSpinsAwarded={0} />)
    // "$" and the number may be split across sibling text nodes in jsdom
    expect(screen.getByText(byAmount(1500))).toBeInTheDocument()
  })

  it('shows free spins message when scatter win triggers free spins (no payline win)', () => {
    render(<WinDisplay amount={0} winTier="none" isScatterWin={true} freeSpinsAwarded={10} />)
    expect(screen.getByText(/\+10 free spins awarded/i)).toBeInTheDocument()
  })

  it('shows free spins message alongside a payline win', () => {
    render(<WinDisplay amount={150} winTier="small" isScatterWin={true} freeSpinsAwarded={3} />)
    expect(screen.getByText(/\+3 free spins awarded/i)).toBeInTheDocument()
  })

  it('does not show free spins message when freeSpinsAwarded is 0', () => {
    render(<WinDisplay amount={50} winTier="small" isScatterWin={false} freeSpinsAwarded={0} />)
    expect(screen.queryByText(/free spins/i)).not.toBeInTheDocument()
  })
})

// ─── WinHistory ───────────────────────────────────────────────────────────────

describe('WinHistory component', () => {
  it('renders nothing when history is empty', () => {
    const { container } = render(<WinHistory history={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders win records', () => {
    const history = [{ id: 1, amount: 200, bet: 10, symbols: ['bell' as const] }]
    render(<WinHistory history={history} />)
    expect(screen.getByText('+$200')).toBeInTheDocument()
  })

  it('shows bet amount for each record', () => {
    const history = [{ id: 1, amount: 100, bet: 5, symbols: ['star' as const] }]
    render(<WinHistory history={history} />)
    expect(screen.getByText('bet $5')).toBeInTheDocument()
  })

  it('renders at most 5 records even when given 8', () => {
    const history = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1, amount: (i + 1) * 10, bet: 5, symbols: ['cherry' as const],
    }))
    render(<WinHistory history={history} />)
    expect(screen.getAllByText(/\+\$/).length).toBeLessThanOrEqual(5)
  })
})

// ─── Statistics ───────────────────────────────────────────────────────────────

describe('Statistics component', () => {
  it('displays spin count', () => {
    render(<Statistics spinCount={42} balance={1000} biggestWin={500} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('shows +$0 when balance equals starting balance', () => {
    render(<Statistics spinCount={0} balance={1000} biggestWin={0} startingBalance={1000} />)
    expect(screen.getByText('+$0')).toBeInTheDocument()
  })

  it('shows -$200 (sign before $) when in deficit', () => {
    render(<Statistics spinCount={10} balance={800} biggestWin={0} startingBalance={1000} />)
    expect(screen.getByText('-$200')).toBeInTheDocument()
  })

  it('shows +$250 when in profit', () => {
    render(<Statistics spinCount={5} balance={1250} biggestWin={250} startingBalance={1000} />)
    expect(screen.getByText('+$250')).toBeInTheDocument()
  })

  it('shows em dash when biggest win is 0', () => {
    render(<Statistics spinCount={0} balance={1000} biggestWin={0} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows biggest win amount', () => {
    render(<Statistics spinCount={5} balance={1000} biggestWin={750} />)
    expect(screen.getByText('$750')).toBeInTheDocument()
  })
})

// ─── Controls ─────────────────────────────────────────────────────────────────

describe('Controls component', () => {
  const defaultProps = {
    bet: 5, phase: 'idle' as const, canSpin: true,
    onSpin: vi.fn(), onSetBet: vi.fn(), onChangeBet: vi.fn(),
  }

  it('renders the SPIN button', () => {
    render(<Controls {...defaultProps} />)
    expect(screen.getByRole('button', { name: /spin/i })).toBeInTheDocument()
  })

  it('calls onSpin when SPIN button is clicked', () => {
    const onSpin = vi.fn()
    render(<Controls {...defaultProps} onSpin={onSpin} />)
    fireEvent.click(screen.getByRole('button', { name: /spin/i }))
    expect(onSpin).toHaveBeenCalledOnce()
  })

  it('disables SPIN button when canSpin is false', () => {
    render(<Controls {...defaultProps} canSpin={false} />)
    expect(screen.getByRole('button', { name: /spin/i })).toBeDisabled()
  })

  it('disables bet controls when spinning', () => {
    render(<Controls {...defaultProps} phase="spinning" canSpin={false} />)
    expect(screen.getByLabelText(/decrease bet/i)).toBeDisabled()
    expect(screen.getByLabelText(/increase bet/i)).toBeDisabled()
  })

  it('calls onChangeBet(-1) on decrease click', () => {
    const onChangeBet = vi.fn()
    render(<Controls {...defaultProps} onChangeBet={onChangeBet} />)
    fireEvent.click(screen.getByLabelText(/decrease bet/i))
    expect(onChangeBet).toHaveBeenCalledWith(-1)
  })

  it('calls onChangeBet(1) on increase click', () => {
    const onChangeBet = vi.fn()
    render(<Controls {...defaultProps} onChangeBet={onChangeBet} />)
    fireEvent.click(screen.getByLabelText(/increase bet/i))
    expect(onChangeBet).toHaveBeenCalledWith(1)
  })

  it('calls onSetBet with correct value on bet chip click', () => {
    const onSetBet = vi.fn()
    render(<Controls {...defaultProps} onSetBet={onSetBet} />)
    fireEvent.click(screen.getByText('10'))
    expect(onSetBet).toHaveBeenCalledWith(10)
  })
})
