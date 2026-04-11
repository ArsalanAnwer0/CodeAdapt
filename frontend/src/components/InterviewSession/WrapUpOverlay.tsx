import React from 'react'
import type { Persona } from './persona'

export interface WrapUpOverlayProps {
  /** Whether the overlay is visible. */
  open: boolean
  persona: Persona
  /**
   * Number of follow-ups the candidate resolved — shown as a tiny
   * "good job you survived N curveballs" touch before results.
   */
  resolvedFollowUps: number
}

/**
 * Full-viewport overlay shown in the last ~1.2s of a session, after
 * the user confirms "End Session" but before results mount. Turns
 * the transition into a moment instead of a hard cut.
 *
 * It's intentionally quiet: big persona avatar, one line of copy,
 * a thin progress meter that fills during the wrap-up delay. The
 * copy changes based on how many follow-ups the candidate handled.
 */
export default function WrapUpOverlay({
  open,
  persona,
  resolvedFollowUps,
}: WrapUpOverlayProps): React.ReactElement | null {
  if (!open) return null

  const [from, to] = persona.gradient
  const line =
    resolvedFollowUps === 0
      ? 'Scoring your session…'
      : resolvedFollowUps === 1
        ? 'Reviewing your follow-up response…'
        : `Reviewing your ${resolvedFollowUps} follow-up responses…`

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center animate-message"
      style={{ background: 'rgba(1,4,9,0.72)', backdropFilter: 'blur(8px)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-white avatar-pulse mb-5"
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          boxShadow: '0 8px 32px rgba(1,4,9,0.5)',
        }}
        aria-hidden="true"
      >
        <span className="text-[20px] font-bold tracking-wide">
          {persona.initials}
        </span>
      </div>
      <p className="text-white text-[14px] font-semibold mb-1">
        {persona.name} is wrapping up
      </p>
      <p
        className="text-[12px] mb-5"
        style={{ color: 'rgba(255,255,255,0.7)' }}
      >
        {line}
      </p>
      <div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      >
        {/*
          Inline keyframe via a style tag would be overkill — reuse the
          progress-like fill driven by CSS `animate-message` timing.
          The parent is only mounted for ~1.2s, so a simple transform
          animation on mount is enough.
        */}
        <div
          className="h-full"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.9))',
            animation: 'wrapup-fill 1.1s ease-out forwards',
          }}
        />
      </div>
      <style>
        {`@keyframes wrapup-fill {
          from { width: 0%; }
          to { width: 100%; }
        }`}
      </style>
    </div>
  )
}
