import React from 'react'

export type Backdrop = 'mountain' | 'ocean' | 'plain'

export function HangmanDrawing({ step, backdrop }: { step: number; backdrop?: Backdrop }) {
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
