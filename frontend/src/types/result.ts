/**
 * Session result types.
 *
 * A SessionResult is the immutable artifact of a completed session —
 * the thing we display on the results screen and persist to history.
 */
import type { ChatMessage, Injection } from './chat'
import type { SessionConfig, SessionMetrics, TimelineEvent } from './session'

export interface SessionResult {
  config: SessionConfig
  metrics: SessionMetrics
  /** Actual session duration in seconds. */
  duration: number
  messages: ChatMessage[]
  injections: Injection[]
  codeQualityScore: number
  communicationScore: number
  timeline: TimelineEvent[]
  aiSummary: string
}

export interface StoredResult extends SessionResult {
  /** Unique ID assigned when persisted to history. */
  id: string
  /** ISO timestamp when the session was completed. */
  completedAt: string
}
