import { useCallback, useMemo } from 'react'
import { HISTORY_LIMIT, STORAGE_KEYS } from '../lib/constants'
import type { SessionResult, StoredResult } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

function genId(): string {
  return (
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  )
}

/**
 * Revive `Date` instances that were serialized as ISO strings inside
 * message and injection objects. We keep this defensive because the
 * shape is read from disk and may originate from an older version.
 */
function reviveDates(result: StoredResult): StoredResult {
  const messages = result.messages.map((m) => ({
    ...m,
    timestamp:
      m.timestamp instanceof Date ? m.timestamp : new Date(m.timestamp),
  }))
  const injections = result.injections.map((inj) => ({
    ...inj,
    timestamp:
      inj.timestamp instanceof Date ? inj.timestamp : new Date(inj.timestamp),
  }))
  return { ...result, messages, injections }
}

export interface UseHistoryResult {
  history: StoredResult[]
  add: (result: SessionResult) => StoredResult
  remove: (id: string) => void
  clear: () => void
  findById: (id: string) => StoredResult | undefined
}

/**
 * Persistent session history. Newest entries first. Caps at
 * `HISTORY_LIMIT` entries to keep `localStorage` usage bounded.
 */
export function useHistory(): UseHistoryResult {
  const [raw, setRaw, clearRaw] = useLocalStorage<StoredResult[]>(
    STORAGE_KEYS.history,
    []
  )

  const history = useMemo(() => raw.map(reviveDates), [raw])

  const add = useCallback(
    (result: SessionResult): StoredResult => {
      const stored: StoredResult = {
        ...result,
        id: genId(),
        completedAt: new Date().toISOString(),
      }
      setRaw((prev) => [stored, ...prev].slice(0, HISTORY_LIMIT))
      return stored
    },
    [setRaw]
  )

  const remove = useCallback(
    (id: string) => {
      setRaw((prev) => prev.filter((r) => r.id !== id))
    },
    [setRaw]
  )

  const findById = useCallback(
    (id: string): StoredResult | undefined => history.find((r) => r.id === id),
    [history]
  )

  return { history, add, remove, clear: clearRaw, findById }
}
