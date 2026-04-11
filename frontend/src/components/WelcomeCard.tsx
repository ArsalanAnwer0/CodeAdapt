import React from 'react'
import { Sparkles, Zap, X, MessageSquare } from 'lucide-react'

export interface WelcomeCardProps {
  /** Called when the user dismisses the card. */
  onDismiss: () => void
}

/**
 * First-run explainer shown above the setup form. The goal is not to
 * teach features — it's to set expectations: "this is a mock
 * interview, not a typing test, and follow-ups are the whole point."
 *
 * Rendered once per browser; dismissal is persisted via the
 * `hasSeenWelcome` preference flag.
 */
export default function WelcomeCard({
  onDismiss,
}: WelcomeCardProps): React.ReactElement {
  return (
    <div
      className="relative mb-6 rounded-xl overflow-hidden animate-fade-in"
      style={{
        background:
          'linear-gradient(135deg, rgba(9,105,218,0.05), rgba(130,80,223,0.05))',
        border: '1px solid var(--border-secondary)',
      }}
      role="region"
      aria-label="Welcome"
    >
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss welcome message"
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition"
        style={{ color: 'var(--text-quaternary)' }}
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="p-4 pr-10">
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-white"
            style={{
              background:
                'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            }}
            aria-hidden="true"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3
            className="text-[13px] font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome to CodeAdapt
          </h3>
        </div>

        <p
          className="text-[12px] leading-relaxed mb-3"
          style={{ color: 'var(--text-tertiary)' }}
        >
          You'll chat with an AI interviewer while you code. Partway through,
          they'll push <strong>follow-ups</strong> — a new requirement, a
          hidden bug, a tricky question. Handling them well is the point.
        </p>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <MessageSquare
              className="w-3 h-3 mt-0.5 flex-shrink-0"
              style={{ color: 'var(--accent-blue)' }}
            />
            <span style={{ color: 'var(--text-tertiary)' }}>
              Reply in chat — they're listening.
            </span>
          </div>
          <div
            className="flex items-start gap-2 p-2 rounded-lg"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <Zap
              className="w-3 h-3 mt-0.5 flex-shrink-0"
              style={{ color: 'var(--accent-orange)' }}
            />
            <span style={{ color: 'var(--text-tertiary)' }}>
              Adapt fast when follow-ups land.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
