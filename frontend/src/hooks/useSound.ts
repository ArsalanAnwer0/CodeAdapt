import { useCallback, useEffect, useRef } from 'react'

/**
 * Synthesized UI sound effects.
 *
 * We deliberately avoid shipping audio files: every asset we add is
 * another 404 risk during the mock → backend transition, and WebAudio
 * gives us short, tasteful cues for free. Each preset is a tiny
 * envelope-shaped tone (or a two-note chord for richer events).
 *
 * The hook also respects `prefers-reduced-motion` as a proxy for
 * "minimize distractions" since we don't have a dedicated audio pref
 * yet — and it silently no-ops if the browser blocks audio before a
 * user gesture.
 */

export type SoundName =
  | 'messageIn'
  | 'messageOut'
  | 'followUp'
  | 'dingSoft'
  | 'wrapUp'

interface Tone {
  freq: number
  /** Seconds. */
  duration: number
  /** 0..1 — peak volume. */
  volume?: number
  /** Oscillator shape. */
  type?: OscillatorType
  /** Delay from the start of the cue, in seconds. */
  offset?: number
}

const PRESETS: Record<SoundName, Tone[]> = {
  // Interviewer message arrived — soft rising fifth.
  messageIn: [
    { freq: 523.25, duration: 0.08, volume: 0.08, type: 'sine' },
    { freq: 783.99, duration: 0.1, volume: 0.08, type: 'sine', offset: 0.06 },
  ],
  // Candidate sent a message — single muted blip.
  messageOut: [
    { freq: 392.0, duration: 0.06, volume: 0.05, type: 'sine' },
  ],
  // A follow-up just landed — a more attention-grabbing descending chord.
  followUp: [
    { freq: 880.0, duration: 0.1, volume: 0.1, type: 'triangle' },
    { freq: 659.25, duration: 0.14, volume: 0.1, type: 'triangle', offset: 0.08 },
  ],
  // A test run passed, or a small success.
  dingSoft: [
    { freq: 1046.5, duration: 0.12, volume: 0.09, type: 'sine' },
  ],
  // Session wrapping up — warm fade.
  wrapUp: [
    { freq: 440.0, duration: 0.25, volume: 0.08, type: 'sine' },
    { freq: 554.37, duration: 0.3, volume: 0.08, type: 'sine', offset: 0.12 },
  ],
}

function playTone(ctx: AudioContext, tone: Tone, startAt: number): void {
  const { freq, duration, volume = 0.08, type = 'sine', offset = 0 } = tone
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  const t0 = startAt + offset

  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  // Envelope: fast attack, exponential release. Keeps clicks out.
  gain.gain.setValueAtTime(0.0001, t0)
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

/**
 * Returns a stable `play(name)` function. The AudioContext is lazily
 * created on first call so we don't trip browser autoplay policies.
 */
export function useSound(): {
  play: (name: SoundName) => void
  enabled: boolean
} {
  const ctxRef = useRef<AudioContext | null>(null)
  const enabledRef = useRef<boolean>(true)

  useEffect(() => {
    // Respect reduced-motion as a "minimize distractions" proxy until
    // we add a dedicated sound preference.
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mq?.matches) enabledRef.current = false
    const handler = (e: MediaQueryListEvent): void => {
      enabledRef.current = !e.matches
    }
    mq?.addEventListener?.('change', handler)
    return () => mq?.removeEventListener?.('change', handler)
  }, [])

  const play = useCallback((name: SoundName): void => {
    if (!enabledRef.current) return
    if (typeof window === 'undefined') return
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return

    try {
      if (!ctxRef.current) ctxRef.current = new AC()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') {
        // Best-effort resume; ignore if the browser rejects.
        ctx.resume().catch(() => undefined)
      }
      const tones = PRESETS[name]
      const startAt = ctx.currentTime + 0.01
      for (const t of tones) playTone(ctx, t, startAt)
    } catch {
      // Audio blocked (autoplay policy, no permission, etc.). Silent.
    }
  }, [])

  return { play, enabled: enabledRef.current }
}
