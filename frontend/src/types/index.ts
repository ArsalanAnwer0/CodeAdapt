/**
 * Barrel export for all domain types.
 *
 * Components should import from `@/types` (or `../types`) and let this
 * file forward to the right domain file. This keeps individual modules
 * focused and lets us add more domains without breaking imports.
 */
export type {
  Language,
  Difficulty,
  Topic,
  SessionDuration,
  SessionConfig,
  SessionMetrics,
  TimelineEvent,
  TimelineEventType,
} from './session'

export type {
  Problem,
  ProblemExample,
} from './problem'

export type {
  ChatMessage,
  ChatRole,
  AIMessageKind,
  Injection,
  InjectionType,
} from './chat'

export type {
  SessionResult,
  StoredResult,
} from './result'
