import type { Injection } from '../../types'

/**
 * Injection resolution helpers.
 *
 * These live in their own module so `index.tsx` can stop inlining
 * "find the latest pending injection" every time it needs to render
 * the banner or decide whether the chat should dim. Pure functions,
 * no React — easy to unit-test.
 */

/** Return the most recent injection that has not been resolved yet. */
export function pendingInjection(
  injections: Injection[]
): Injection | null {
  for (let i = injections.length - 1; i >= 0; i -= 1) {
    if (!injections[i].resolvedAt) return injections[i]
  }
  return null
}

/** Has the candidate resolved every injection so far? */
export function allResolved(injections: Injection[]): boolean {
  return injections.every((inj) => Boolean(inj.resolvedAt))
}

/**
 * Mark the most recent pending injection as resolved at `at`. Returns
 * a new array (does not mutate). If nothing was pending, returns the
 * same reference so React reconciliation can skip it.
 */
export function resolveLatest(
  injections: Injection[],
  at: Date
): Injection[] {
  for (let i = injections.length - 1; i >= 0; i -= 1) {
    if (!injections[i].resolvedAt) {
      const next = injections.slice()
      next[i] = { ...next[i], resolvedAt: at }
      return next
    }
  }
  return injections
}

/** Count how many injections have been handled. */
export function resolvedCount(injections: Injection[]): number {
  let count = 0
  for (const inj of injections) if (inj.resolvedAt) count += 1
  return count
}

/**
 * Friendlier label for an injection type, used in the banner header,
 * timeline, and wrap-up summary. Kept here so there's a single place
 * to edit the wording.
 */
export function injectionTitle(type: Injection['type']): string {
  switch (type) {
    case 'bug':
      return 'A bug just appeared'
    case 'requirement':
      return 'Requirements just changed'
  }
}
