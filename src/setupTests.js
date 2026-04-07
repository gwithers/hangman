import '@testing-library/jest-dom'

// Stub fetch so post-game definition requests don't throw in jsdom
global.fetch = jest.fn(() =>
  Promise.resolve({ ok: false, json: () => Promise.resolve(null) })
)
