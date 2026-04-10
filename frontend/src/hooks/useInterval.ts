import { useEffect, useRef } from 'react'

/**
 * Declarative `setInterval`. The callback always sees the latest
 * closure values without needing to restart the timer, and passing
 * `delay === null` pauses the interval cleanly.
 *
 * Based on Dan Abramov's pattern:
 * https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(
  callback: () => void,
  delay: number | null
): void {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (delay === null) return
    const id = window.setInterval(() => savedCallback.current(), delay)
    return () => window.clearInterval(id)
  }, [delay])
}

export default useInterval
