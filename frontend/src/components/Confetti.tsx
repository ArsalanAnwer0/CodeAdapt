import React, { useEffect, useMemo } from 'react'
import { usePrefersReducedMotion } from '../hooks/useMediaQuery'

export interface ConfettiProps {
  /** Number of pieces to emit. Defaults to 80. */
  pieces?: number
  /** Duration of the animation in ms. Defaults to 2400. */
  duration?: number
  /** Called once the animation has finished. */
  onDone?: () => void
}

interface Piece {
  left: number
  delay: number
  rotate: number
  color: string
  size: number
  driftX: number
  duration: number
}

const PALETTE = [
  'var(--accent-blue)',
  'var(--accent-purple)',
  'var(--accent-green)',
  'var(--accent-orange)',
  'var(--accent-amber)',
]

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

/**
 * Self-contained DOM-only confetti burst. Respects
 * `prefers-reduced-motion` and renders nothing in that case.
 */
export default function Confetti({
  pieces = 80,
  duration = 2400,
  onDone,
}: ConfettiProps): React.ReactElement | null {
  const reduced = usePrefersReducedMotion()

  const items = useMemo<Piece[]>(() => {
    const rand = seeded(42)
    return Array.from({ length: pieces }).map(() => ({
      left: rand() * 100,
      delay: rand() * 400,
      rotate: rand() * 360,
      color: PALETTE[Math.floor(rand() * PALETTE.length)],
      size: 6 + rand() * 6,
      driftX: (rand() - 0.5) * 160,
      duration: duration * (0.7 + rand() * 0.6),
    }))
  }, [pieces, duration])

  useEffect(() => {
    if (reduced) {
      onDone?.()
      return
    }
    const t = window.setTimeout(() => onDone?.(), duration + 400)
    return () => window.clearTimeout(t)
  }, [duration, reduced, onDone])

  if (reduced) return null

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-[55]">
      {items.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            width: `${p.size}px`,
            height: `${p.size * 0.4}px`,
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error custom CSS vars
            '--rot': `${p.rotate}deg`,
            '--drift': `${p.driftX}px`,
          }}
        />
      ))}
    </div>
  )
}
