/**
 * Barrel export for all shared React hooks. Feature code should import
 * from `@/hooks` (or `../hooks`) so adding a new hook is a one-file change.
 */
export { useLocalStorage } from './useLocalStorage'
export type { UseLocalStorageOptions } from './useLocalStorage'

export { useKeyboardShortcut } from './useKeyboardShortcut'
export type {
  Shortcut,
  ShortcutDescriptor,
  UseKeyboardShortcutOptions,
} from './useKeyboardShortcut'

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
} from './useMediaQuery'

export { useDebounce } from './useDebounce'
export { useInterval } from './useInterval'
export { useEventListener } from './useEventListener'
export { useSessionPersistence } from './useSessionPersistence'
export type { PersistedSession } from './useSessionPersistence'
