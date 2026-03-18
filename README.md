# 🎰 Royal Reels — Casino Slot Machine

A fully-featured, production-grade casino slot machine game built with React 18, TypeScript, Tailwind CSS, and Framer Motion.

---

## ✨ Features

- **3×3 reel grid** with 10 distinct symbols (cherries through lucky 7s)
- **5 paylines** — centre, top, bottom, and two diagonals
- **Wild symbol** — substitutes for any non-scatter symbol
- **Scatter bonus** — 2 scatters = 3 free spins, 3 scatters = 10 free spins
- **Physics-based reel scrolling** — 50-symbol tape, full-speed RAF loop, exponential ease-out deceleration, pixel-perfect snap
- **Staggered per-reel stops** — reels stop left to right at 0.9 s, 1.5 s, 2.1 s
- **SVG payline overlay** — glowing polyline drawn across winning cells after all reels stop, works for straight and diagonal paylines
- **Mega-win overlay** — animated full-screen celebration for big hits
- **Procedural audio** — all sounds synthesised via the Web Audio API; no audio files required
- **Pay Table modal** — shows all symbol payouts and special rules
- **Session statistics** — spin count, profit/loss, biggest win
- **Win history** — animated ticker of the last 5 wins
- **Sound toggle** — mute/unmute at any time

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (functional components + hooks) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v3 + custom CSS variables |
| Animation | Framer Motion 11 + requestAnimationFrame |
| Build | Vite 5 |
| Testing | Vitest + Testing Library |
| Audio | Web Audio API (zero dependencies) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Single run (CI)
npm run test:run

# With coverage report
npm run test:coverage
```

### Test Coverage

| Module | Tests |
|---|---|
| `gameLogic.ts` | `spinReels`, `calculateResult` (paylines, wilds, scatters), `getWinTier` boundaries, `isJackpot` |
| `constants/symbols.ts` | Symbol data integrity, SYMBOL_MAP, PAYLINES, BET_OPTIONS |
| `audioManager.ts` | Enable/disable toggle, all sound methods mocked via `stubGlobal` |
| `components/Reel` | Idle render, correct emojis, win row glow, no-glow on non-winning rows, spinning state, overflow hidden |
| `components/ReelGrid` | 3 reels rendered, no SVG while spinning, payline SVG hidden during spin, correct winning rows passed per reel |
| `components/Symbol` | All 10 symbol ids, winning/non-winning glow state |
| `components/Balance` | Balance display, free spins label |
| `components/WinDisplay` | Win tiers, scatter messaging |
| `components/WinHistory` | Empty state, records, max 5 shown |
| `components/Statistics` | Profit/loss, biggest win, spin count |
| `components/Controls` | Spin, bet change, disabled states, interaction events |

---

## 📁 Project Structure

```
src/
├── __tests__/
│   ├── setup.ts               # Vitest + Testing Library setup
│   ├── gameLogic.test.ts      # Core RNG & payout logic
│   ├── symbols.test.ts        # Symbol constants
│   ├── audioManager.test.ts   # Web Audio API wrapper
│   └── components.test.tsx    # UI component tests
├── components/
│   ├── Balance.tsx            # Balance + free spins indicator
│   ├── Controls.tsx           # Spin button + bet selector
│   ├── MegaWinOverlay.tsx     # Full-screen win celebration
│   ├── PayTable.tsx           # Payout reference modal
│   ├── Reel.tsx               # Physics-based scrolling reel (RAF spin + ease-out decel, 50-symbol tape)
│   ├── ReelGrid.tsx           # 3-reel layout + SVG payline overlay (straight & diagonal)
│   ├── SlotMachine.tsx        # Root machine component
│   ├── Statistics.tsx         # Session stats panel
│   ├── Symbol.tsx             # Standalone symbol cell (used in PayTable)
│   ├── WinDisplay.tsx         # Win amount banner
│   └── WinHistory.tsx         # Recent wins list
├── constants/
│   └── symbols.ts             # All game data (symbols, paylines, bets)
├── hooks/
│   └── useSlotMachine.ts      # Game state machine (useReducer)
├── types/
│   └── index.ts               # Shared TypeScript interfaces
├── utils/
│   ├── audioManager.ts        # Procedural Web Audio synth
│   └── gameLogic.ts           # RNG, payline evaluation, win tiers
├── App.tsx
├── index.css                  # Tailwind + custom casino theme
└── main.tsx
```

---

## 🎮 Game Rules

### Symbols & Payouts (3 of a kind on any active payline)

| Symbol | Name | Multiplier |
|--------|------|-----------|
| 🍒 | Cherry | 3× |
| 🍋 | Lemon | 5× |
| 🍊 | Orange | 8× |
| 🍇 | Grapes | 12× |
| 🔔 | Bell | 20× |
| ⭐ | Star | 30× |
| 💎 | Diamond | 60× |
| 7️⃣ | Lucky 7 | 150× |
| 🃏 | Wild | 200× (substitutes all) |
| 💫 | Scatter | Bonus only (pays anywhere) |

### Paylines

```
Payline 0  ─ ─ ─   Centre row      (gold)
Payline 1  ─ ─ ─   Top row         (red)
Payline 2  ─ ─ ─   Bottom row      (green)
Payline 3  ╲ ╲ ╲   Diagonal ↘      (teal)
Payline 4  ╱ ╱ ╱   Diagonal ↗      (purple)
```

Winning paylines are shown as glowing SVG lines connecting the three matched cells after all reels stop.

### Win Tiers

| Tier | Multiplier range | Effect |
|------|-----------------|--------|
| Small | 1× – 9× bet | Win banner |
| Medium | 10× – 29× bet | Big win banner |
| Big | 30× – 79× bet | Full-screen overlay |
| Mega | ≥ 80× bet | Full-screen overlay + particles |

---

## ⚙️ Reel Physics

Each reel runs two independent `requestAnimationFrame` loops:

1. **Spin loop** — scrolls the tape upward at a fixed 22 px/frame (~1320 px/s). A 50-symbol random prefix is prepended to the 3 final result symbols, giving 5300 px of travel — enough for the full spin duration with no looping.

2. **Decel loop** — triggered when the per-reel stop signal fires. Uses exponential ease-out (`step = remaining × 0.13`) with an overshoot guard that clamps the final step to the exact target (`-5000 px`). On snap, the component switches to `idle` phase and renders only the 3 final symbols at `translateY(0)`, guaranteeing pixel-perfect alignment regardless of floating point drift.

Stop signals fire at **900 ms / 1500 ms / 2100 ms** via `REEL_STOP` actions dispatched by `useSlotMachine`. Each reel receives its own `isSpinning` boolean from `reelsSpinning` state, so stops are truly independent left-to-right.

---

## 🏗 Iteration History

| Version | What was added |
|---------|---------------|
| v0.1 | Project scaffold: Tailwind config, type system, symbol constants, static SlotMachine layout |
| v0.2 | `gameLogic.ts` (RNG + payout engine), `useSlotMachine` hook (useReducer state machine), live spinning reels, balance & bet controls wired up |
| v0.3 | Framer Motion animations, `PayTable` modal, `WinDisplay`, `AudioManager` (procedural Web Audio sounds), sound toggle |
| v0.4 | `MegaWinOverlay` (full-screen celebrations), `WinHistory`, `Statistics` panel, biggest-win tracking |
| v1.0 | Vitest + Testing Library test suite (game logic, constants, audio, components), README |
| v1.1 | Physics-based reel scrolling: 50-symbol tape, separate spin/decel RAF loops, pixel-perfect snap, staggered per-reel stop signals via `reelsSpinning` state |
| v1.2 | `ReelGrid` component with SVG polyline payline overlay for all 5 paylines (straight + diagonal); updated tests for `Reel` and `ReelGrid`; README updated |

---

## 📝 License

MIT — for educational and portfolio purposes. Not intended for real-money gambling.
