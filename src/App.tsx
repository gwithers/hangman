import React, { useEffect, useMemo, useState } from 'react'
import wordsRaw from './words.txt?raw'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MAX_WRONG = 6

function pickRandomWord(words: string[]) {
  const filtered = words.map(w => w.trim()).filter(Boolean)
  return filtered[Math.floor(Math.random() * filtered.length)].toUpperCase()
}

export default function App(): JSX.Element {
  const words = useMemo(() => wordsRaw.split(/\r?\n/), [])
  const BACKDROPS = ['mountain', 'ocean', 'plain'] as const

  const [word, setWord] = useState<string>(() => pickRandomWord(words))
  const [backdrop, setBackdrop] = useState<string>(() => BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)])
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    setGuessed(new Set())
    setGameOver(false)
  }, [word])

  const wrongGuesses = useMemo(() => {
    let count = 0
    for (const ch of guessed) if (!word.includes(ch)) count++
    return count
  }, [guessed, word])

  const isWin = useMemo(() => {
    for (const ch of word) if (!guessed.has(ch)) return false
    return true
  }, [guessed, word])

  useEffect(() => {
    if (wrongGuesses >= MAX_WRONG) setGameOver(true)
    if (isWin) setGameOver(true)
  }, [wrongGuesses, isWin])

  function handleGuess(letter: string) {
    if (gameOver) return
    setGuessed(prev => new Set(prev).add(letter))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (gameOver) return
      const key = String(e.key || '').toUpperCase()
      if (ALPHABET.includes(key) && !guessed.has(key)) {
        setGuessed(prev => new Set(prev).add(key))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [gameOver, guessed])

  function resetGame() {
    setWord(pickRandomWord(words))
    setBackdrop(BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)])
  }

  return (
    <div className="hangman-root">
      <header>
        <h1>Hangman</h1>
        <p className="subtitle">Guess the word before the man is hanged.</p>
      </header>

      <section className="game-area">
        <div className="drawing" aria-hidden>
          <HangmanDrawing step={wrongGuesses} backdrop={backdrop} />
        </div>

        <div className="word">
          {word.split('').map((ch, i) => (
            <span key={i} className={`letter ${guessed.has(ch) ? 'revealed' : ''}`}>
              {guessed.has(ch) ? ch : '_'}
            </span>
          ))}
        </div>

        <div className="controls">
          <div className="keyboard">
            {ALPHABET.split('').map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessed.has(letter) || gameOver}
                aria-label={`Guess ${letter}`}
                className={guessed.has(letter) ? 'guessed' : ''}
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="meta">
            <div className="progress-row">
              <label className="sr-only">Remaining attempts</label>
              <div className="progress">
                <div className="progress-fill" style={{ width: `${(wrongGuesses / MAX_WRONG) * 100}%` }} />
              </div>
              <div className="progress-text">{MAX_WRONG - wrongGuesses} attempts left</div>
            </div>

            <p>Wrong guesses: {wrongGuesses} / {MAX_WRONG}</p>
            {isWin && <p className="result win">You win! 🎉</p>}
            {!isWin && wrongGuesses >= MAX_WRONG && <p className="result lose">You lose — the word was <strong>{word}</strong></p>}
            <div className="actions">
              <button onClick={resetGame}>New Game</button>
            </div>
            <div className="guessed-list" aria-live="polite">
              <strong>Guessed:</strong> {Array.from(guessed).sort().join(', ') || '—'}
            </div>
          </div>
        </div>
      </section>

      <footer className="note">
        <p>Word list: <em>src/words.txt</em>. Edit it to add/remove words.</p>
      </footer>
    </div>
  )
}

type Backdrop = 'mountain' | 'ocean' | 'plain'

function HangmanDrawing({ step, backdrop }: { step: number; backdrop?: Backdrop }) {
  const fg = '#ffffff'
  const strokeWidth = 2
  return (
    <svg viewBox="0 0 120 140" className="hangman-svg">
      {backdrop === 'mountain' && (
        <g transform="translate(0,70)">
          <polygon points="0,70 35,10 70,70" fill="#073b2b" />
          <polygon points="40,70 70,20 110,70" fill="#0a5b3e" />
        </g>
      )}
      {backdrop === 'ocean' && (
        <g transform="translate(0,90)">
          <rect x="0" y="0" width="120" height="40" fill="#043a5b" />
          <path d="M0 10 Q20 0 40 10 T80 10 T120 10 V40 H0 Z" fill="#0b6fa8" opacity="0.9" />
        </g>
      )}
      {backdrop === 'plain' && (
        <g transform="translate(0,90)">
          <rect x="0" y="0" width="120" height="40" fill="#064b2e" />
        </g>
      )}

      <line x1="10" y1="130" x2="110" y2="130" stroke="#e6eef6" strokeWidth="3" />
      <line x1="30" y1="130" x2="30" y2="15" stroke="#e6eef6" strokeWidth="3" />
      <line x1="30" y1="15" x2="80" y2="15" stroke="#e6eef6" strokeWidth="3" />
      <line x1="80" y1="15" x2="80" y2="30" stroke="#e6eef6" strokeWidth="3" />

      {step > 0 && <circle cx="80" cy="40" r="10" stroke={fg} strokeWidth={strokeWidth} fill="none" />}
      {step > 1 && <line x1="80" y1="50" x2="80" y2="85" stroke={fg} strokeWidth={strokeWidth} />}
      {step > 2 && <line x1="80" y1="60" x2="65" y2="75" stroke={fg} strokeWidth={strokeWidth} />}
      {step > 3 && <line x1="80" y1="60" x2="95" y2="75" stroke={fg} strokeWidth={strokeWidth} />}
      {step > 4 && <line x1="80" y1="85" x2="65" y2="105" stroke={fg} strokeWidth={strokeWidth} />}
      {step > 5 && <line x1="80" y1="85" x2="95" y2="105" stroke={fg} strokeWidth={strokeWidth} />}
    </svg>
  )
}
