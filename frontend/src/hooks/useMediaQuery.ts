import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '../lib/constants'

/**
 * Subscribes to a CSS media query and returns its current match state.
 *
 * Initializes synchronously to avoid a hydration flicker. Works across
 * modern browsers that implement `MediaQueryList`.
 */
export function useMediaQuery(query: string): boolean {
  const getInitial = (): boolean => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent): void => setMatches(e.matches)
    // Sync in case the query changed between render and effect.
    setMatches(mql.matches)
    if ('addEventListener' in mql) {
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    }
    // Safari < 14 fallback.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mql as any).addListener(handler)
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mql as any).removeListener(handler)
    }
  }, [query])

  return matches
}

/** Convenience: `true` when viewport width is below the tablet breakpoint. */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`)
}

/** Convenience: `true` when viewport width is between tablet and desktop. */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.md}px) and (max-width: ${BREAKPOINTS.lg - 1}px)`
  )
}

/** Convenience: `true` when viewport width is at least the desktop breakpoint. */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`)
}

/** Convenience: honors the user's "reduce motion" OS preference. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export default useMediaQuery
