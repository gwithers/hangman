import React, { useEffect, useRef, useState } from 'react'
import { HangmanDrawing } from './HangmanDrawing'
import { useHangmanGame, ALPHABET, MAX_WRONG } from './useHangmanGame'

/**
 * Root application component. Renders the full Hangman game UI: the SVG
 * drawing, the word display, the on-screen keyboard, progress indicators,
 * and win/lose messages.
 *
 * All game state lives in the `useHangmanGame` hook; this component is
 * responsible only for presentation and wiring user interactions to that hook.
 */
export default function App(): JSX.Element {
  const { word, backdrop, guessed, gameOver, wrongGuesses, isWin, handleGuess, resetGame } = useHangmanGame()

  // ── Wrong-guess shake animation ───────────────────────────────────────────
  // Detect when wrongGuesses increases and briefly add the .shake class to the
  // drawing container so it jolts sideways as visual feedback.
  const prevWrongRef = useRef(wrongGuesses)
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (wrongGuesses > prevWrongRef.current) {
      setShaking(true)
      const t = setTimeout(() => setShaking(false), 500)
      prevWrongRef.current = wrongGuesses
      return () => clearTimeout(t)
    }
    prevWrongRef.current = wrongGuesses
  }, [wrongGuesses])

  return (
    <div className="hangman-root">
      <header>
        <h1>Hangman</h1>
        <p className="subtitle">Guess the word before the man is hanged.</p>
      </header>

      <section className="game-area">
        {/* Drawing shakes on each wrong guess */}
        <div className={`drawing${shaking ? ' shake' : ''}`} aria-hidden>
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
            {ALPHABET.split('').map(letter => {
              // Distinguish correct guesses (in word) from wrong ones so each
              // can receive a different colour and animation.
              const isCorrect = guessed.has(letter) && word.includes(letter)
              const isWrong   = guessed.has(letter) && !word.includes(letter)
              return (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessed.has(letter) || gameOver}
                  aria-label={`Guess ${letter}`}
                  className={isCorrect ? 'guessed correct' : isWrong ? 'guessed wrong' : ''}
                >
                  {letter}
                </button>
              )
            })}
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
            {!isWin && wrongGuesses >= MAX_WRONG && (
              <p className="result lose">You lose — the word was <strong>{word}</strong></p>
            )}
            <div className="actions">
              <button onClick={resetGame}>New Game</button>
            </div>
            {/* aria-live so screen readers announce newly guessed letters */}
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
