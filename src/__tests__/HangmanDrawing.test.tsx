import React from 'react'
import { render } from '@testing-library/react'
import { HangmanDrawing } from '../HangmanDrawing'

describe('HangmanDrawing', () => {
  test('renders gallows structure at step 0', () => {
    const { container } = render(<HangmanDrawing step={0} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    const lines = svg!.querySelectorAll('line')
    expect(lines.length).toBe(4) // base + pole + top + noose
  })

  test('adds head at step 1', () => {
    const { container } = render(<HangmanDrawing step={1} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBe(1)
  })

  test('adds no head at step 0', () => {
    const { container } = render(<HangmanDrawing step={0} />)
    expect(container.querySelectorAll('circle').length).toBe(0)
  })

  test('renders full figure at step 6', () => {
    const { container } = render(<HangmanDrawing step={6} />)
    // 4 gallows lines + 5 body lines (body, left arm, right arm, left leg, right leg)
    const lines = container.querySelectorAll('line')
    expect(lines.length).toBe(9)
    expect(container.querySelectorAll('circle').length).toBe(1)
  })

  test('renders mountain backdrop', () => {
    const { container } = render(<HangmanDrawing step={0} backdrop="mountain" />)
    const polygons = container.querySelectorAll('polygon')
    expect(polygons.length).toBe(2)
  })

  test('renders ocean backdrop', () => {
    const { container } = render(<HangmanDrawing step={0} backdrop="ocean" />)
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  test('renders plain backdrop', () => {
    const { container } = render(<HangmanDrawing step={0} backdrop="plain" />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBe(1)
  })
})
