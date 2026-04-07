import { useEffect, useMemo, useState } from 'react'
import wordsRaw from './words.txt?raw'
import type { Backdrop } from './HangmanDrawing'

/** All uppercase letters A–Z, used for keyboard validation and rendering the on-screen keyboard. */
export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** Maximum number of wrong guesses before the game is lost. */
export const MAX_WRONG = 6

const BACKDROPS: Backdrop[] = ['mountain', 'ocean', 'plain']

/**
 * Selects a random word from the provided list, trimming whitespace and
 * converting to uppercase for consistent comparison.
 */
function pickRandomWord(words: string[]): string {
  const filtered = words.map(w => w.trim()).filter(Boolean)
  return filtered[Math.floor(Math.random() * filtered.length)].toUpperCase()
}

/**
 * Core game logic hook. Manages the secret word, guessed letters, win/loss
 * state, and keyboard input. Returns everything the UI needs to render the game
 * and respond to player actions.
 */
export function useHangmanGame() {
  /** Full word list parsed once from words.txt. */
  const words = useMemo(() => wordsRaw.split(/\r?\n/), [])

  const [word, setWord] = useState<string>(() => pickRandomWord(words))
  const [backdrop, setBackdrop] = useState<Backdrop>(() => BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)])
  /** Set of all letters the player has guessed so far (uppercase). */
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())

  // Clear guesses whenever a new word is chosen.
  useEffect(() => {
    setGuessed(new Set())
  }, [word])

  /** Number of guessed letters that are not in the secret word. */
  const wrongGuesses = useMemo(() => {
    let count = 0
    for (const ch of guessed) if (!word.includes(ch)) count++
    return count
  }, [guessed, word])

  /** True when every letter in the secret word has been guessed. */
  const isWin = useMemo(() => {
    for (const ch of word) if (!guessed.has(ch)) return false
    return true
  }, [guessed, word])

  /** True once the player has either won or exhausted all allowed wrong guesses. */
  const gameOver = wrongGuesses >= MAX_WRONG || isWin

  /**
   * Records a letter guess. No-ops if the game is already over or the letter
   * was already guessed.
   */
  function handleGuess(letter: string) {
    if (gameOver) return
    setGuessed(prev => new Set(prev).add(letter))
  }

  // Listen for physical keyboard presses (A–Z) so players don't need the mouse.
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

  /** Starts a fresh game with a new random word and backdrop. */
  function resetGame() {
    setWord(pickRandomWord(words))
    setBackdrop(BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)])
  }

  return { word, backdrop, guessed, gameOver, wrongGuesses, isWin, handleGuess, resetGame }
}
