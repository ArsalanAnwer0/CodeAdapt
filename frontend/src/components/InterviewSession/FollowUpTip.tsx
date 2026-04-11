import React from 'react'
import { Lightbulb, X } from 'lucide-react'

export interface FollowUpTipProps {
  /** Whether the tip is visible. */
  open: boolean
  /** Called when the user dismisses the tip. */
  onDismiss: () => void
}

/**
 * One-time inline tooltip shown right after the first injection fires
 * in a new user's first session. Teaches the mechanic without
 * blocking the UI — candidates can dismiss it and keep working.
 *
 * Rendered as a sibling of the InjectionBanner so it shares the same
 * center-column alignment.
 */
export default function FollowUpTip({
  open,
  onDismiss,
}: FollowUpTipProps): React.ReactElement | null {
  if (!open) return null

  return (
    <div
      className="mx-3 mt-2 rounded-lg flex items-start gap-2 px-3 py-2 animate-message"
      style={{
        background: 'rgba(191,135,0,0.06)',
        border: '1px dashed rgba(191,135,0,0.3)',
      }}
      role="note"
    >
      <Lightbulb
        className="w-3.5 h-3.5 mt-0.5 flex-shrink-0"
        style={{ color: 'var(--accent-amber)' }}
      />
      <p
        className="text-[11px] leading-relaxed flex-1"
        style={{ color: 'var(--text-tertiary)' }}
      >
        <strong>Tip:</strong> The interviewer just pushed a follow-up. Reply
        in chat or update your code to address it — adaptability score
        rewards quick, thoughtful responses.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss tip"
        className="flex-shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition"
        style={{ color: 'var(--text-quaternary)' }}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
