# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start Vite dev server (http://localhost:5173)
yarn build        # Production build → dist/
yarn preview      # Preview production build
yarn test         # Run Jest tests with coverage
yarn lint         # ESLint on src/
```

Run a single test file:
```bash
yarn test src/__tests__/App.test.tsx
```

First-time setup requires Corepack:
```bash
corepack enable && corepack prepare yarn@stable --activate
yarn install
```

## Architecture

This is a React + TypeScript + Vite hangman game. All game logic lives in a single custom hook; `App.tsx` is purely presentational.

**`src/useHangmanGame.ts`** — all game state and logic:
- Loads `src/words.txt` at build time via Vite's `?raw` import
- Picks a random word and backdrop (`mountain | ocean | plain`) on each game
- Tracks guessed letters as a `Set<string>` (always uppercase)
- Derives `wrongGuesses`, `isWin`, and `gameOver` from that set
- Listens for physical keyboard events (`keydown` on `window`)
- Exports `ALPHABET` and `MAX_WRONG = 6` for use in `App.tsx`

**`src/HangmanDrawing.tsx`** — pure SVG component:
- Accepts `step` (0–6) and `backdrop` props; no internal state
- Reveals body parts incrementally; each animates in via CSS on first render

**`src/App.tsx`** — UI only:
- Wires `useHangmanGame` to the keyboard, word display, progress bar, and win/lose messages
- Adds a shake animation when `wrongGuesses` increments (tracked via `useRef`)

**`src/words.txt`** — newline-separated word list; edit directly to add/remove words.

## Testing

Tests use Jest + jsdom + Testing Library. `Math.random` is mocked to `0` in `beforeEach` so the first word in the list (`APPLE`) is always selected — tests rely on this.

The `src/__mocks__/raw.ts` file provides the mock word list for tests (Vite's `?raw` imports are mapped via `moduleNameMapper` in `jest.config.cjs`).
