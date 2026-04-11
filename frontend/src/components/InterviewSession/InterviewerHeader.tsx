import React, { memo } from 'react'
import { cn } from '../../lib/cn'
import type { Persona } from './persona'
import {
  isBusy,
  statusLabel,
  type InterviewerState,
} from './interviewerState'

export interface InterviewerHeaderProps {
  persona: Persona
  state: InterviewerState
}

/**
 * Header card anchored at the top of the chat column. This single
 * component carries most of the "I'm talking to a real person" weight:
 * avatar, name, role, and an animated status line driven by the
 * interviewer state machine.
 */
function InterviewerHeaderImpl({
  persona,
  state,
}: InterviewerHeaderProps): React.ReactElement {
  const busy = isBusy(state)
  const label = statusLabel(state)
  const [from, to] = persona.gradient

  return (
    <div className="interviewer-card px-4 py-3 flex items-center gap-3">
      <div
        className={cn(
          'relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          busy && 'avatar-pulse'
        )}
        style={{
          background: `linear-gradient(135deg, ${from}, ${to})`,
          color: '#ffffff',
          boxShadow: '0 1px 3px rgba(1,4,9,0.2)',
        }}
        aria-hidden="true"
      >
        <span className="text-[12px] font-bold tracking-wide">
          {persona.initials}
        </span>
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
          style={{
            background: busy ? 'var(--accent-blue)' : 'var(--accent-green)',
            borderColor: 'var(--bg-secondary)',
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className="text-[13px] font-bold leading-tight truncate"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}
        >
          {persona.name}
        </div>
        <div
          className="text-[10px] font-medium uppercase tracking-wider truncate"
          style={{ color: 'var(--text-quaternary)' }}
        >
          {persona.role}
        </div>
        <div
          className="mt-0.5 text-[11px] font-medium flex items-center gap-1.5"
          style={{
            color: busy ? 'var(--accent-blue)' : 'var(--accent-green)',
          }}
          aria-live="polite"
        >
          <span
            className={cn(
              'inline-block w-1.5 h-1.5 rounded-full',
              busy && 'animate-pulse'
            )}
            style={{
              background: busy
                ? 'var(--accent-blue)'
                : 'var(--accent-green)',
            }}
          />
          {label}
        </div>
      </div>
    </div>
  )
}

const InterviewerHeader = memo(InterviewerHeaderImpl)
export default InterviewerHeader
