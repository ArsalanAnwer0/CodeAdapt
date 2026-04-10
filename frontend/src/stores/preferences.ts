import { useCallback } from 'react'
import { STORAGE_KEYS } from '../lib/constants'
import type { Language, Difficulty, Topic } from '../types'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface Preferences {
  /** Last-used language, restored on the setup screen. */
  language: Language
  /** Last-used topic, restored on the setup screen. */
  topic: Topic
  /** Last-used difficulty, restored on the setup screen. */
  difficulty: Difficulty
  /** Sound effects on message / injection. */
  soundsEnabled: boolean
  /** Vibrate the screen subtly on injection. */
  reduceMotion: boolean
  /** Show the problem description panel on session start. */
  showProblemOnStart: boolean
}

const defaults: Preferences = {
  language: 'javascript',
  topic: 'arrays',
  difficulty: 'medium',
  soundsEnabled: true,
  reduceMotion: false,
  showProblemOnStart: true,
}

export interface UsePreferencesResult {
  preferences: Preferences
  setPreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) => void
  reset: () => void
}

/**
 * Persistent user preferences. Stored under a single key so we can
 * version the shape later without scattering migrations.
 */
export function usePreferences(): UsePreferencesResult {
  const [stored, setStored, remove] = useLocalStorage<Preferences>(
    STORAGE_KEYS.preferences,
    defaults
  )

  // Merge with defaults in case new fields are added across versions.
  const preferences: Preferences = { ...defaults, ...stored }

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setStored((prev) => ({ ...defaults, ...prev, [key]: value }))
    },
    [setStored]
  )

  return { preferences, setPreference, reset: remove }
}

export const preferenceDefaults = defaults
