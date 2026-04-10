import { useCallback, useEffect, useRef } from 'react'
import { STORAGE_KEYS, SESSION } from '../lib/constants'
import type { ChatMessage, Injection, SessionConfig } from '../types'
import { createLogger } from '../lib/logger'

const log = createLogger('session-persistence')

export interface PersistedSession {
  /** Monotonic schema version — bump to invalidate old snapshots. */
  version: number
  config: SessionConfig
  code: string
  messages: ChatMessage[]
  injections: Injection[]
  /** Session start time, ISO string. */
  startedAt: string
  /** Last write time, epoch ms. */
  updatedAt: number
}

const VERSION = 1

function read(): PersistedSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.activeSession)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedSession
    if (parsed.version !== VERSION) return null
    return parsed
  } catch (err) {
    log.warn('read failed', err)
    return null
  }
}

function write(snapshot: PersistedSession): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.activeSession,
      JSON.stringify(snapshot)
    )
  } catch (err) {
    log.warn('write failed', err)
  }
}

function clear(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEYS.activeSession)
  } catch (err) {
    log.warn('clear failed', err)
  }
}

export interface UseSessionPersistenceOptions {
  /** Skip persistence when false (e.g. after the session has ended). */
  enabled: boolean
  config: SessionConfig | null
  code: string
  messages: ChatMessage[]
  injections: Injection[]
  startedAt: Date | null
}

/**
 * Debounced autosave for the current session. Writes to localStorage
 * on each change, but never more often than every `SESSION.autosaveMs`
 * milliseconds, to avoid thrashing on every keystroke.
 */
export function useSessionPersistence({
  enabled,
  config,
  code,
  messages,
  injections,
  startedAt,
}: UseSessionPersistenceOptions): {
  restore: () => PersistedSession | null
  clearSnapshot: () => void
} {
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || !config || !startedAt) return
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      write({
        version: VERSION,
        config,
        code,
        messages,
        injections,
        startedAt: startedAt.toISOString(),
        updatedAt: Date.now(),
      })
    }, SESSION?.autosaveMs ?? 500)
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [enabled, config, code, messages, injections, startedAt])

  const restore = useCallback(() => read(), [])
  const clearSnapshot = useCallback(() => clear(), [])

  return { restore, clearSnapshot }
}
