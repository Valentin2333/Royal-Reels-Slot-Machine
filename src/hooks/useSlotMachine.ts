import { useCallback, useReducer, useRef, useEffect } from 'react'
import type { GamePhase, SpinResult, WinRecord, SymbolId } from '../types'
import { BET_OPTIONS, INITIAL_GRID } from '../constants/symbols'
import { spinReels, calculateResult, getWinTier } from '../utils/gameLogic'

const STARTING_BALANCE = 1000
const REEL_STOP_DELAYS = [900, 1500, 2100] as const
const RESULT_DELAY = 2400

interface State {
  balance: number
  bet: number
  phase: GamePhase
  grid: SymbolId[][]
  result: SpinResult | null
  freeSpins: number
  spinCount: number
  winHistory: WinRecord[]
  reelsSpinning: [boolean, boolean, boolean]
  winRecordIdCounter: number
}

type Action =
  | { type: 'SPIN_START'; newGrid: SymbolId[][] }
  | { type: 'REEL_STOP'; index: 0 | 1 | 2 }
  | { type: 'SPIN_COMPLETE'; result: SpinResult }
  | { type: 'CELEBRATION_END' }
  | { type: 'SET_BET'; bet: number }

const initialState: State = {
  balance: STARTING_BALANCE,
  bet: 5,
  phase: 'idle',
  grid: INITIAL_GRID,
  result: null,
  freeSpins: 0,
  spinCount: 0,
  winHistory: [],
  reelsSpinning: [false, false, false],
  winRecordIdCounter: 0,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SPIN_START': {
      const cost = state.freeSpins > 0 ? 0 : state.bet
      return {
        ...state,
        balance: state.balance - cost,
        phase: 'spinning',
        grid: action.newGrid,
        result: null,
        reelsSpinning: [true, true, true],
        spinCount: state.spinCount + 1,
        freeSpins: Math.max(0, state.freeSpins - 1),
      }
    }
    case 'REEL_STOP': {
      const reelsSpinning = [...state.reelsSpinning] as [boolean, boolean, boolean]
      reelsSpinning[action.index] = false
      return { ...state, reelsSpinning }
    }
    case 'SPIN_COMPLETE': {
      const { result } = action
      const newBalance = state.balance + result.totalWin
      const newFreeSpins = state.freeSpins + result.freeSpinsAwarded

      let newHistory = state.winHistory
      if (result.totalWin > 0) {
        const record: WinRecord = {
          id: state.winRecordIdCounter + 1,
          amount: result.totalWin,
          bet: state.bet,
          symbols: result.wins.map((w) => w.symbolId),
        }
        newHistory = [record, ...state.winHistory].slice(0, 10)
      }

      return {
        ...state,
        balance: newBalance,
        freeSpins: newFreeSpins,
        result,
        phase: result.totalWin > 0 ? 'won' : 'lost',
        winHistory: newHistory,
        winRecordIdCounter: state.winRecordIdCounter + (result.totalWin > 0 ? 1 : 0),
      }
    }
    case 'CELEBRATION_END':
      return { ...state, phase: 'idle' }
    case 'SET_BET':
      return { ...state, bet: action.bet }
    default:
      return state
  }
}

export function useSlotMachine() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const spin = useCallback(() => {
    if (state.phase !== 'idle' && state.phase !== 'won' && state.phase !== 'lost') return
    if (state.balance < state.bet && state.freeSpins === 0) return

    clearTimers()
    const newGrid = spinReels()
    dispatch({ type: 'SPIN_START', newGrid })

    // Stop reels staggered
    REEL_STOP_DELAYS.forEach((delay, i) => {
      const t = setTimeout(() => {
        dispatch({ type: 'REEL_STOP', index: i as 0 | 1 | 2 })
      }, delay)
      timersRef.current.push(t)
    })

    // Calculate result after last reel stops
    const resultT = setTimeout(() => {
      const result = calculateResult(newGrid, state.bet)
      dispatch({ type: 'SPIN_COMPLETE', result })

      if (result.totalWin > 0) {
        const celebT = setTimeout(() => {
          dispatch({ type: 'CELEBRATION_END' })
        }, 2000)
        timersRef.current.push(celebT)
      } else {
        dispatch({ type: 'CELEBRATION_END' })
      }
    }, RESULT_DELAY)
    timersRef.current.push(resultT)
  }, [state.phase, state.balance, state.bet, state.freeSpins])

  const setBet = useCallback((bet: number) => {
    if (state.phase !== 'idle') return
    dispatch({ type: 'SET_BET', bet })
  }, [state.phase])

  const changeBet = useCallback((dir: 1 | -1) => {
    const idx = BET_OPTIONS.indexOf(state.bet as typeof BET_OPTIONS[number])
    const nextIdx = Math.max(0, Math.min(BET_OPTIONS.length - 1, idx + dir))
    dispatch({ type: 'SET_BET', bet: BET_OPTIONS[nextIdx] })
  }, [state.bet])

  useEffect(() => () => clearTimers(), [])

  const winTier = state.result ? getWinTier(state.result.totalWin, state.bet) : 'none'
  const canSpin = (state.phase === 'idle' || state.phase === 'won' || state.phase === 'lost')
    && (state.balance >= state.bet || state.freeSpins > 0)

  return { state, spin, setBet, changeBet, winTier, canSpin }
}
