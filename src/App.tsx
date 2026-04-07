import React, { useEffect, useRef, useState } from 'react'
import { HangmanDrawing } from './HangmanDrawing'
import { useHangmanGame, ALPHABET, MAX_WRONG, type Difficulty } from './useHangmanGame'

interface ApiMeaning {
  partOfSpeech: string
  definitions: { definition: string }[]
}
interface ApiEntry {
  meanings: ApiMeaning[]
}

/**
 * Root application component. Renders the full Hangman game UI: the SVG
 * drawing, the word display, the on-screen keyboard, progress indicators,
 * win/lose messages, difficulty picker, and post-game word definitions.
 *
 * All game state lives in the `useHangmanGame` hook; this component is
 * responsible only for presentation and wiring user interactions to that hook.
 */
export default function App(): JSX.Element {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const { word, backdrop, guessed, gameOver, wrongGuesses, isWin, handleGuess, resetGame } = useHangmanGame(difficulty)

  // ── Wrong-guess shake animation ───────────────────────────────────────────
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

  // ── Post-game definition fetch ────────────────────────────────────────────
  const [definition, setDefinition] = useState<ApiEntry[] | null>(null)
  const [defLoading, setDefLoading] = useState(false)

  useEffect(() => {
    if (!gameOver) {
      setDefinition(null)
      return
    }
    setDefLoading(true)
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`)
      .then(r => (r.ok ? r.json() : null))
      .then((data: ApiEntry[] | null) => setDefinition(Array.isArray(data) ? data : null))
      .catch(() => setDefinition(null))
      .finally(() => setDefLoading(false))
  }, [gameOver, word])

  return (
    <div className="hangman-root">
      <header>
        <h1>Hangman</h1>
        <p className="subtitle">Guess the word before the man is hanged.</p>
        <div className="difficulty-picker" role="group" aria-label="Difficulty">
          {(['easy', 'moderate', 'hard'] as Difficulty[]).map(d => (
            <button
              key={d}
              className={`difficulty-btn${difficulty === d ? ' active' : ''}`}
              onClick={() => setDifficulty(d)}
              aria-pressed={difficulty === d}
            >
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </button>
          ))}
        </div>
      </header>

      <section className="game-area">

        {/* ── Left column: drawing → result → definition ── */}
        <div className="left-col">
          <div className={`drawing${shaking ? ' shake' : ''}`} aria-hidden>
            <HangmanDrawing step={wrongGuesses} backdrop={backdrop} />
          </div>

          {isWin && <p className="result win">You win! 🎉</p>}
          {!isWin && wrongGuesses >= MAX_WRONG && (
            <p className="result lose">You lose — the word was <strong>{word}</strong></p>
          )}

          {gameOver && (
            <section className="definition-panel" aria-label="Word definition">
              <h3 className="def-title">
                Definition: <em>{word.toLowerCase()}</em>
              </h3>
              {defLoading && <p className="def-loading">Looking up definition…</p>}
              {!defLoading && definition === null && (
                <p className="def-missing">No definition found for this word.</p>
              )}
              {!defLoading && definition && (
                <div className="def-entries">
                  {definition[0].meanings.slice(0, 2).map((meaning, i) => (
                    <div key={i} className="definition-meaning">
                      <span className="part-of-speech">{meaning.partOfSpeech}</span>
                      <ol className="def-list">
                        {meaning.definitions.slice(0, 2).map((d, j) => (
                          <li key={j}>{d.definition}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* ── Right column: word → keyboard → meta ── */}
        <div className="right-col">
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
              <div className="actions">
                <button onClick={resetGame}>New Game</button>
              </div>
              {/* aria-live so screen readers announce newly guessed letters */}
              <div className="guessed-list" aria-live="polite">
                <strong>Guessed:</strong> {Array.from(guessed).sort().join(', ') || '—'}
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}
