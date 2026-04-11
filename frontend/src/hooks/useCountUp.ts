import { useEffect, useRef, useState } from 'react'

/**
 * Smoothly animate a number toward a target value.
 *
 * Used by MetricsBar so "adaptability 70 → 65" doesn't just snap — it
 * ticks, which makes the change feel like it means something. Uses
 * requestAnimationFrame for 60fps and an ease-out curve.
 *
 * Honors `prefers-reduced-motion` by jumping straight to the target.
 */
export function useCountUp(
  target: number,
  { durationMs = 600 }: { durationMs?: number } = {}
): number {
  const [value, setValue] = useState<number>(target)
  const fromRef = useRef<number>(target)
  const startRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (value === target) return

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || durationMs <= 0) {
      setValue(target)
      return
    }

    fromRef.current = value
    startRef.current = performance.now()

    const step = (now: number): void => {
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / durationMs)
      // Ease-out cubic — decelerates toward the target.
      const eased = 1 - Math.pow(1 - t, 3)
      const next = fromRef.current + (target - fromRef.current) * eased
      setValue(next)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setValue(target)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
    // value intentionally omitted so we only re-run when the target moves
  }, [target, durationMs]) // eslint-disable-line react-hooks/exhaustive-deps

  return value
}

/** Round helper for integer metrics that still want the animation. */
export function useCountUpInt(target: number): number {
  const v = useCountUp(target)
  return Math.round(v)
}
