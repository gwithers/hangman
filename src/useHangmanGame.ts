import { useEffect, useMemo, useState } from 'react'
import wordsRaw from './words.txt?raw'
import type { Backdrop } from './HangmanDrawing'

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const MAX_WRONG = 6

const BACKDROPS: Backdrop[] = ['mountain', 'ocean', 'plain']

function pickRandomWord(words: string[]) {
  const filtered = words.map(w => w.trim()).filter(Boolean)
  return filtered[Math.floor(Math.random() * filtered.length)].toUpperCase()
}

export function useHangmanGame() {
  const words = useMemo(() => wordsRaw.split(/\r?\n/), [])

  const [word, setWord] = useState<string>(() => pickRandomWord(words))
  const [backdrop, setBackdrop] = useState<Backdrop>(() => BACKDROPS[Math.floor(Math.random() * BACKDROPS.length)])
  const [guessed, setGuessed] = useState<Set<string>>(() => new Set())

  useEffect(() => {
    setGuessed(new Set())
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

  const gameOver = wrongGuesses >= MAX_WRONG || isWin

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

  return { word, backdrop, guessed, gameOver, wrongGuesses, isWin, handleGuess, resetGame }
}
