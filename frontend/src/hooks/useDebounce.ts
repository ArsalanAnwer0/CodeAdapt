import { useEffect, useRef, useState } from 'react'

/**
 * Returns a debounced copy of `value` that only updates after the input
 * has been stable for `delayMs` milliseconds. Useful for search inputs,
 * expensive derived state, and API calls that should not fire on every
 * keystroke.
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setDebounced(value), delayMs)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [value, delayMs])

  return debounced
}

export default useDebounce
