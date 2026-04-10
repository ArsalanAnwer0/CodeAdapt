import { useCallback, useEffect, useRef, useState } from 'react'
import { createLogger } from '../lib/logger'

const log = createLogger('use-local-storage')

type Updater<T> = T | ((prev: T) => T)

export interface UseLocalStorageOptions<T> {
  /** Custom serializer. Defaults to `JSON.stringify`. */
  serialize?: (value: T) => string
  /** Custom deserializer. Defaults to `JSON.parse`. */
  deserialize?: (raw: string) => T
  /** Keep multiple tabs in sync via the `storage` event. Default `true`. */
  syncTabs?: boolean
}

/**
 * Typed `useState` that is transparently persisted to `localStorage`.
 *
 * Falls back to in-memory state when storage is unavailable (e.g. SSR,
 * privacy mode). Reads/writes and JSON (de)serialization are wrapped
 * in try/catch so a corrupted value never crashes the app.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
): [T, (value: Updater<T>) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncTabs = true,
  } = options

  const serializeRef = useRef(serialize)
  const deserializeRef = useRef(deserialize)
  serializeRef.current = serialize
  deserializeRef.current = deserialize

  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      if (raw == null) return initialValue
      return deserializeRef.current(raw)
    } catch (err) {
      log.warn('read failed', key, err)
      return initialValue
    }
  }, [key, initialValue])

  const [value, setValue] = useState<T>(readValue)

  const setStored = useCallback(
    (next: Updater<T>) => {
      setValue((prev) => {
        const resolved =
          typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, serializeRef.current(resolved))
          }
        } catch (err) {
          log.warn('write failed', key, err)
        }
        return resolved
      })
    },
    [key]
  )

  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (err) {
      log.warn('remove failed', key, err)
    }
    setValue(initialValue)
  }, [key, initialValue])

  useEffect(() => {
    if (!syncTabs || typeof window === 'undefined') return
    const handler = (e: StorageEvent): void => {
      if (e.key !== key || e.storageArea !== window.localStorage) return
      if (e.newValue == null) {
        setValue(initialValue)
        return
      }
      try {
        setValue(deserializeRef.current(e.newValue))
      } catch (err) {
        log.warn('sync failed', key, err)
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [key, initialValue, syncTabs])

  return [value, setStored, remove]
}

export default useLocalStorage
