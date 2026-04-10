import { useEffect, useRef } from 'react'

export interface ShortcutDescriptor {
  /** Key to match, compared case-insensitively against `event.key`. */
  key: string
  meta?: boolean
  ctrl?: boolean
  /** Matches if either ctrl or meta is pressed. Overrides `ctrl`/`meta`. */
  mod?: boolean
  shift?: boolean
  alt?: boolean
}

export type Shortcut = string | ShortcutDescriptor

export interface UseKeyboardShortcutOptions {
  /** Disable the listener when false. */
  enabled?: boolean
  /** Prevent default on match. Defaults to `true`. */
  preventDefault?: boolean
  /** Fire even when focus is inside a text input. Defaults to `false`. */
  allowInInputs?: boolean
  /** Attach to this target. Defaults to `window`. */
  target?: Window | HTMLElement | null
}

const MODIFIER_RE = /\s*\+\s*/

function parse(shortcut: Shortcut): ShortcutDescriptor {
  if (typeof shortcut !== 'string') return shortcut
  const parts = shortcut.toLowerCase().split(MODIFIER_RE)
  const descriptor: ShortcutDescriptor = { key: '' }
  for (const part of parts) {
    if (part === 'mod' || part === 'cmdorctrl') descriptor.mod = true
    else if (part === 'cmd' || part === 'meta') descriptor.meta = true
    else if (part === 'ctrl' || part === 'control') descriptor.ctrl = true
    else if (part === 'shift') descriptor.shift = true
    else if (part === 'alt' || part === 'option') descriptor.alt = true
    else descriptor.key = part
  }
  return descriptor
}

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  if (target.isContentEditable) return true
  return false
}

function matches(e: KeyboardEvent, d: ShortcutDescriptor): boolean {
  if (e.key.toLowerCase() !== d.key.toLowerCase()) return false
  if (d.mod) {
    if (!(e.metaKey || e.ctrlKey)) return false
  } else {
    if (d.meta && !e.metaKey) return false
    if (d.ctrl && !e.ctrlKey) return false
    if (!d.meta && !d.ctrl && (e.metaKey || e.ctrlKey)) return false
  }
  if (Boolean(d.shift) !== e.shiftKey) return false
  if (Boolean(d.alt) !== e.altKey) return false
  return true
}

/**
 * Registers a keyboard shortcut. Accepts either a human-readable
 * string like `"mod+k"` or a structured descriptor.
 *
 * Modifier key `mod` maps to ⌘ on macOS and Ctrl elsewhere.
 */
export function useKeyboardShortcut(
  shortcut: Shortcut | Shortcut[],
  handler: (event: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
): void {
  const {
    enabled = true,
    preventDefault = true,
    allowInInputs = false,
    target,
  } = options

  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (!enabled) return
    const el: (Window | HTMLElement) =
      target ?? (typeof window !== 'undefined' ? window : (null as never))
    if (!el) return

    const descriptors = (Array.isArray(shortcut) ? shortcut : [shortcut]).map(
      parse
    )

    const listener = (event: Event): void => {
      const e = event as KeyboardEvent
      if (!allowInInputs && isEditable(e.target)) return
      for (const d of descriptors) {
        if (matches(e, d)) {
          if (preventDefault) e.preventDefault()
          handlerRef.current(e)
          return
        }
      }
    }

    el.addEventListener('keydown', listener)
    return () => el.removeEventListener('keydown', listener)
  }, [shortcut, enabled, preventDefault, allowInInputs, target])
}

export default useKeyboardShortcut
