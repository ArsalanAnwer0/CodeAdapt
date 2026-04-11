import React, { useMemo } from 'react'
import { ChatMessage } from '../../types'
import InterviewerHeader from './InterviewerHeader'
import ChatThread from './ChatThread'
import ChatComposer from './ChatComposer'
import { defaultPersona, type Persona } from './persona'
import {
  initialInterviewerState,
  type InterviewerState,
} from './interviewerState'

export interface ChatPanelProps {
  messages: ChatMessage[]
  isTyping: boolean
  onSendMessage: (content: string) => void
  /**
   * Persona shown in the header and message avatars. Optional so
   * existing callers keep working; the default persona is used until
   * the parent starts picking one deterministically per session.
   */
  persona?: Persona
  /**
   * Interviewer state from the parent's reducer. Optional for the
   * same reason — legacy callers fall back to a synthesized state
   * derived from `isTyping`.
   */
  interviewerState?: InterviewerState
  /** Called when the composer gains/loses focus. */
  onComposerFocus?: () => void
  onComposerBlur?: () => void
}

/**
 * Right-hand chat column composed of four concerns:
 *
 *   1. InterviewerHeader — persona card + live status
 *   2. ChatThread        — scrollable message history + typing dots
 *   3. ChatComposer      — autosizing textarea + send button
 *
 * The sticky InjectionBanner lives one level up (inside the session
 * shell) so it can dim the rest of the UI without being clipped by
 * this panel's overflow boundary.
 *
 * This file used to own all three concerns inline; splitting it keeps
 * each subcomponent memoizable and lets the header read directly from
 * the interviewer state machine instead of booleans.
 */
export default function ChatPanel({
  messages,
  isTyping,
  onSendMessage,
  persona = defaultPersona,
  interviewerState,
  onComposerFocus,
  onComposerBlur,
}: ChatPanelProps): React.ReactElement {
  // Synthesize a state if the parent hasn't plumbed the reducer through
  // yet. This keeps backwards compatibility during the rollout: the
  // header still animates on isTyping, and no caller breaks.
  const effectiveState = useMemo<InterviewerState>(() => {
    if (interviewerState) return interviewerState
    if (isTyping) return { kind: 'thinking', since: Date.now() }
    return initialInterviewerState
  }, [interviewerState, isTyping])

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--bg-primary)' }}
    >
      <InterviewerHeader persona={persona} state={effectiveState} />
      <ChatThread
        messages={messages}
        persona={persona}
        isTyping={isTyping}
      />
      <ChatComposer
        persona={persona}
        onSend={onSendMessage}
        onFocus={onComposerFocus}
        onBlur={onComposerBlur}
      />
    </div>
  )
}
