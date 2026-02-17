import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('Hangman App', () => {
  beforeEach(() => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
  })
  afterEach(() => {
    Math.random.mockRestore()
  })

  test('renders blanks for the chosen word', () => {
    render(<App />)
    // Math.random mocked to 0 -> first word in mock list is 'apple'
    const letters = document.querySelectorAll('.letter')
    expect(letters.length).toBe(5)
    letters.forEach(l => expect(l.textContent.trim()).toBe('_'))
  })

  test('reveals a correct letter when guessed', async () => {
    render(<App />)
    const user = userEvent.setup()
    const aBtn = screen.getByRole('button', { name: /Guess A/i })
    await user.click(aBtn)
    const wordContainer = document.querySelector('.word')
    const { getByText } = within(wordContainer)
    expect(getByText('A')).toBeInTheDocument()
  })

  test('increments wrong guesses on incorrect letters', async () => {
    render(<App />)
    const user = userEvent.setup()
    const zBtn = screen.getByRole('button', { name: /Guess Z/i })
    await user.click(zBtn)
    expect(screen.getByText(/Wrong guesses: 1 \/ 6/)).toBeInTheDocument()
  })

  test('player can win by guessing all letters', async () => {
    render(<App />)
    const user = userEvent.setup()
    // word 'apple' -> unique letters A,P,L,E
    for (const ch of ['A', 'P', 'L', 'E']) {
      await user.click(screen.getByRole('button', { name: new RegExp(`Guess ${ch}`, 'i') }))
    }
    expect(screen.getByText(/You win!/i)).toBeInTheDocument()
  })

  test('player loses after too many wrong guesses', async () => {
    render(<App />)
    const user = userEvent.setup()
    const wrongLetters = ['B', 'C', 'D', 'F', 'G', 'H']
    for (const ch of wrongLetters) {
      await user.click(screen.getByRole('button', { name: new RegExp(`Guess ${ch}`, 'i') }))
    }
    expect(screen.getByText(/You lose/i)).toBeInTheDocument()
    expect(screen.getByText(/the word was/i)).toBeInTheDocument()
  })
})
