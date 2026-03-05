import React from 'react'
import { HangmanDrawing } from './HangmanDrawing'
import { useHangmanGame, ALPHABET, MAX_WRONG } from './useHangmanGame'

export default function App(): JSX.Element {
  const { word, backdrop, guessed, gameOver, wrongGuesses, isWin, handleGuess, resetGame } = useHangmanGame()

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
