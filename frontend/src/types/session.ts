/**
 * Session domain types.
 *
 * These describe the shape of an interview session — the configuration
 * the user picks, the live metrics, and the final result object.
 */

export type Language =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type Topic =
  | 'arrays'
  | 'strings'
  | 'trees'
  | 'graphs'
  | 'dynamic-programming'
  | 'linked-lists'
  | 'sorting'
  | 'binary-search'
  | 'recursion'
  | 'stacks-queues'

export type SessionDuration = 15 | 30 | 45 | 60

export interface SessionConfig {
  language: Language
  difficulty: Difficulty
  topic: Topic
  duration: SessionDuration
}

export interface SessionMetrics {
  adaptabilityScore: number
  problemsSolved: number
  totalProblems: number
  injectionCount: number
  /** Average response time in minutes. */
  avgResponseTime: number
  /** Time remaining in seconds. */
  timeRemaining: number
}

export type TimelineEventType = 'problem' | 'injection' | 'submission'

export interface TimelineEvent {
  type: TimelineEventType
  label: string
  /** Seconds from session start. */
  time: number
}
