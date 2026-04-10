/**
 * Formatting helpers for time, duration, and numbers.
 *
 * Centralizing these keeps display logic consistent across the app
 * and makes it trivial to swap in Intl-based locale-aware formatters
 * later if we ship multi-language support.
 */

/** Pad a number with leading zeros to the given width. */
export function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0')
}

/** Format seconds as `mm:ss`. */
export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  return `${pad(Math.floor(safe / 60))}:${pad(safe % 60)}`
}

/** Format seconds as `Xm Ys` (compact, human). */
export function formatDurationHuman(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  if (m === 0) return `${s}s`
  if (s === 0) return `${m}m`
  return `${m}m ${s}s`
}

/** Format seconds from session start as `XmYYs` for timelines. */
export function formatEventTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  return `${Math.floor(safe / 60)}m${pad(safe % 60)}s`
}

/** Format a Date as `HH:MM:SS` localized time. */
export function formatWallClock(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Format a Date as `HH:MM` localized time. */
export function formatShortClock(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/** Format a Date as a relative string like "2 minutes ago". */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffSec < 5) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  const m = Math.floor(diffSec / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return date.toLocaleDateString()
}

/** Format a number with thousands separators. */
export function formatNumber(n: number): string {
  return n.toLocaleString()
}

/** Clamp a number between min and max. */
export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

/** Format a percent (0-100) with optional fraction digits. */
export function formatPercent(value: number, digits = 0): string {
  return `${clamp(value, 0, 100).toFixed(digits)}%`
}
