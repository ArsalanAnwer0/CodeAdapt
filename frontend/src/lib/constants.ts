/**
 * Application-wide constants.
 *
 * Anything that is a "magic number" or a shared literal should live here.
 * This makes tuning behavior a one-line change and documents intent.
 */

export const APP_NAME = 'CodeAdapt'
export const APP_TAGLINE = 'Coding interviews that adapt in real-time'

/** localStorage key namespace to avoid collisions with other apps. */
export const STORAGE_NAMESPACE = 'codeadapt'

export const STORAGE_KEYS = {
  preferences: `${STORAGE_NAMESPACE}:preferences`,
  theme: `${STORAGE_NAMESPACE}:theme`,
  activeSession: `${STORAGE_NAMESPACE}:active-session`,
  history: `${STORAGE_NAMESPACE}:history`,
  lastConfig: `${STORAGE_NAMESPACE}:last-config`,
} as const

/** Session-related tunables. */
export const SESSION = {
  /** Number of injections a user can expect in a typical session. */
  expectedInjections: 3,
  /** Time (seconds) after an injection where a fast response earns a bonus. */
  fastResponseWindow: 180,
  /** Adaptability score boost on fast injection response. */
  fastResponseBoost: 5,
  /** Adaptability score penalty for a new injection. */
  injectionPenalty: 5,
  /** Adaptability score boost for passing tests. */
  solutionBoost: 3,
  /** Minimum clamp for adaptability score. */
  minScore: 10,
  /** Maximum clamp for adaptability score. */
  maxScore: 100,
  /** Starting adaptability score. */
  initialScore: 70,
} as const

/** Weights for the composite final score (must sum to 1). */
export const SCORE_WEIGHTS = {
  adaptability: 0.4,
  codeQuality: 0.35,
  communication: 0.25,
} as const

/** Maximum number of history entries to keep in localStorage. */
export const HISTORY_LIMIT = 50

/** Monaco editor tunables. */
export const EDITOR = {
  fontSize: 13,
  fontFamily: "'JetBrains Mono', monospace",
  tabSize: 2,
} as const

/** Breakpoints (match tailwind defaults for consistency). */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

/** Minimum viewport width for the full interview layout. */
export const MIN_INTERVIEW_WIDTH = 1024
