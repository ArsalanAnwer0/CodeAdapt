/**
 * Client-side message streaming.
 *
 * Reveals a string progressively so AI messages *feel* typed rather
 * than dumped all at once. This is an animation primitive, not a
 * network one — when the real backend lands, the caller can replace
 * the body with "read from a ReadableStream" and every caller keeps
 * working unchanged.
 *
 * The default rate (~45 chars/sec) is tuned to read like a fast but
 * plausible typist. Callers can override per-message.
 */

export interface StreamOptions {
  /** Characters to reveal per tick. Defaults to 2. */
  chunkSize?: number
  /** Delay between ticks in ms. Defaults to ~44 chars/sec. */
  tickMs?: number
  /** Called when the stream has emitted its final chunk. */
  onDone?: () => void
  /** AbortSignal to cancel the stream early. */
  signal?: AbortSignal
}

/**
 * Reveal `text` progressively by calling `onChunk(soFar)` with the
 * accumulated substring on each tick. Returns a cancel function that
 * stops the stream at its current position.
 */
export function streamText(
  text: string,
  onChunk: (soFar: string) => void,
  options: StreamOptions = {}
): () => void {
  const { chunkSize = 2, tickMs = 18, onDone, signal } = options

  if (!text) {
    onChunk('')
    onDone?.()
    return () => {}
  }

  let cursor = 0
  let cancelled = false
  let timer: number | null = null

  const tick = (): void => {
    if (cancelled) return
    cursor = Math.min(text.length, cursor + chunkSize)
    onChunk(text.slice(0, cursor))
    if (cursor >= text.length) {
      onDone?.()
      return
    }
    timer = window.setTimeout(tick, tickMs)
  }

  const cancel = (): void => {
    if (cancelled) return
    cancelled = true
    if (timer != null) window.clearTimeout(timer)
  }

  if (signal) {
    if (signal.aborted) {
      cancel()
      return cancel
    }
    signal.addEventListener('abort', cancel, { once: true })
  }

  // Kick off on the next tick so the first chunk animates in rather
  // than appearing synchronously with the message bubble.
  timer = window.setTimeout(tick, tickMs)
  return cancel
}

/**
 * Choose a sensible tick rate for a given message length so short
 * acknowledgements don't feel sluggish and long monologues don't
 * take forever.
 */
export function autoTickMs(length: number): number {
  if (length < 40) return 22
  if (length < 120) return 18
  if (length < 240) return 14
  return 10
}
