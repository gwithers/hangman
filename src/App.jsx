import React, { useEffect, useMemo, useState } from 'react'
import wordsRaw from './words.txt?raw'

/**
 * Simple Hangman game component.
 *
 * Features:
 * - Loads a newline-separated word list from `src/words.txt`
 * - Chooses a random word per round
 * - Renders letter buttons (A-Z)
 * - Tracks guessed letters and wrong guesses
 * - Shows a simple SVG hangman drawing that progresses with wrong guesses
 * - Reset / New Game button
 *
 * The implementation is intentionally compact and well-documented so you can
 * extend it (e.g., fetch word lists from the server, add difficulty levels).
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MAX_WRONG = 6

function pickRandomWord(words) {
  const filtered = words.map(w => w.trim()).filter(Boolean)
  return filtered[Math.floor(Math.random() * filtered.length)].toUpperCase()
}

export default function App() {
  // Parse words once using Vite's ?raw loader (imports file contents as string)
  const words = useMemo(() => wordsRaw.split(/\r?\n/), [])

  // Game state
  const [word, setWord] = useState(() => pickRandomWord(words))
  const [guessed, setGuessed] = useState(() => new Set())
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    // Reset game when new word chosen
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

  function handleGuess(letter) {
    if (gameOver) return
    setGuessed(prev => new Set(prev).add(letter))
  }

  function resetGame() {
    setWord(pickRandomWord(words))
  }

  return (
    <div className="hangman-root">
      <header>
        <h1>Hangman</h1>
        <p className="subtitle">Guess the word before the man is hanged.</p>
      </header>

      <section className="game-area">
        <div className="drawing" aria-hidden>
          <HangmanDrawing step={wrongGuesses} />
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
            <p>Wrong guesses: {wrongGuesses} / {MAX_WRONG}</p>
            {isWin && <p className="result win">You win! 🎉</p>}
            {!isWin && wrongGuesses >= MAX_WRONG && <p className="result lose">You lose — the word was <strong>{word}</strong></p>}
            <div className="actions">
              <button onClick={resetGame}>New Game</button>
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

/**
 * Incremental SVG hangman drawing. `step` controls how many parts are visible.
 * 0 = scaffold only, up to MAX_WRONG shows full figure.
 */
function HangmanDrawing({ step }) {
  return (
    <svg viewBox="0 0 120 140" className="hangman-svg">
      {/* scaffold */}
      <line x1="10" y1="130" x2="110" y2="130" stroke="#333" strokeWidth="3" />
      <line x1="30" y1="130" x2="30" y2="15" stroke="#333" strokeWidth="3" />
      <line x1="30" y1="15" x2="80" y2="15" stroke="#333" strokeWidth="3" />
      <line x1="80" y1="15" x2="80" y2="30" stroke="#333" strokeWidth="3" />

      {/* head */}
      {step > 0 && <circle cx="80" cy="40" r="10" stroke="#000" strokeWidth="2" fill="none" />}

      {/* body */}
      {step > 1 && <line x1="80" y1="50" x2="80" y2="85" stroke="#000" strokeWidth="2" />}

      {/* left arm */}
      {step > 2 && <line x1="80" y1="60" x2="65" y2="75" stroke="#000" strokeWidth="2" />}

      {/* right arm */}
      {step > 3 && <line x1="80" y1="60" x2="95" y2="75" stroke="#000" strokeWidth="2" />}

      {/* left leg */}
      {step > 4 && <line x1="80" y1="85" x2="65" y2="105" stroke="#000" strokeWidth="2" />}

      {/* right leg */}
      {step > 5 && <line x1="80" y1="85" x2="95" y2="105" stroke="#000" strokeWidth="2" />}
    </svg>
  )
}
