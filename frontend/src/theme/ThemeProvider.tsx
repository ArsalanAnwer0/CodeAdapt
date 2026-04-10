import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { STORAGE_KEYS } from '../lib/constants'

export type Theme = 'light' | 'dark'
export type ThemePreference = Theme | 'system'

interface ThemeContextValue {
  /** Resolved theme currently applied to the document. */
  theme: Theme
  /** The user's stored preference, which may be `"system"`. */
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
  /** Convenience: flip between light and dark (ignores `system`). */
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  } catch {
    // ignore
  }
  return 'system'
}

function systemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

/**
 * Provides theme state and wires CSS tokens via `data-theme` on `<html>`.
 *
 * Honors the `prefers-color-scheme` media query when the user's stored
 * preference is `"system"`. Adds a transition class on the first toggle
 * so the initial paint isn't animated.
 */
export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [preference, setPreferenceState] =
    useState<ThemePreference>(readPreference)
  const [resolvedTheme, setResolvedTheme] = useState<Theme>(() =>
    preference === 'system' ? systemTheme() : preference
  )

  // Apply theme synchronously whenever it changes.
  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  // Watch the OS setting while preference is `system`.
  useEffect(() => {
    if (preference !== 'system') {
      setResolvedTheme(preference)
      return
    }
    setResolvedTheme(systemTheme())
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent): void =>
      setResolvedTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [preference])

  // Enable CSS transitions after initial mount so toggles feel smooth
  // but the first paint is not animated.
  useEffect(() => {
    const t = window.setTimeout(() => {
      document.documentElement.classList.add('theme-transitions')
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const setPreference = useCallback((p: ThemePreference) => {
    setPreferenceState(p)
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, p)
    } catch {
      // ignore
    }
  }, [])

  const toggle = useCallback(() => {
    setPreferenceState((prev) => {
      const next: ThemePreference = resolvedTheme === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(STORAGE_KEYS.theme, next)
      } catch {
        // ignore
      }
      return next === prev ? prev : next
    })
  }, [resolvedTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ theme: resolvedTheme, preference, setPreference, toggle }),
    [resolvedTheme, preference, setPreference, toggle]
  )

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  )
}

/** Access the theme context. Must be used within a `<ThemeProvider>`. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>')
  return ctx
}
