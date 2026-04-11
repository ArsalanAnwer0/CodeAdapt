import React, { memo } from 'react'
import { Zap, X } from 'lucide-react'
import type { Injection } from '../../types'
import { injectionTitle } from './injectionHelpers'

export interface InjectionBannerProps {
  /** The pending injection to surface. Null hides the banner. */
  injection: Injection | null
  /** Manually dismiss the banner (used for the "got it" affordance). */
  onDismiss?: () => void
}

/**
 * Sticky follow-up banner shown above the editor when a chaos
 * injection is waiting to be addressed. This is the interview's
 * "look at me" surface — it uses the shared `.injection-banner`
 * CSS class so the arrival animation stays consistent with the
 * inline thread card.
 *
 * Rendered by the session shell (not ChatPanel) so it can span the
 * full content area and so dimming the rest of the UI doesn't collide
 * with ChatPanel's own overflow boundary.
 */
function InjectionBannerImpl({
  injection,
  onDismiss,
}: InjectionBannerProps): React.ReactElement | null {
  if (!injection) return null

  return (
    <div
      className="injection-banner mx-3 mt-3 rounded-xl px-4 py-3 flex items-start gap-3"
      role="alert"
      aria-live="assertive"
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: 'rgba(188,76,0,0.12)',
          border: '1px solid rgba(188,76,0,0.22)',
        }}
        aria-hidden="true"
      >
        <Zap
          className="w-4 h-4 fill-current"
          style={{ color: 'var(--accent-orange)' }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: 'var(--accent-orange)' }}
          >
            Follow-up
          </span>
          <span
            className="text-[11px] font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {injectionTitle(injection.type)}
          </span>
        </div>
        <p
          className="text-[12px] leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {injection.content}
        </p>
        <p
          className="text-[10px] mt-1.5 font-medium"
          style={{ color: 'var(--text-quaternary)' }}
        >
          Reply in chat or push a new run to address this.
        </p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss follow-up"
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition"
          style={{ color: 'var(--text-quaternary)' }}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

const InjectionBanner = memo(InjectionBannerImpl)
export default InjectionBanner
