import { useEffect, useRef } from 'react'

type WindowMap = WindowEventMap
type DocumentMap = DocumentEventMap
type HTMLElementMap = HTMLElementEventMap

/**
 * Strongly-typed `addEventListener` bound to a React lifecycle.
 *
 * Mirrors the classic pattern from usehooks.com but adds proper
 * overloads for window / document / element targets so the event
 * object is narrowed automatically based on the event name.
 */
export function useEventListener<K extends keyof WindowMap>(
  eventName: K,
  handler: (event: WindowMap[K]) => void,
  element?: undefined,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener<K extends keyof DocumentMap>(
  eventName: K,
  handler: (event: DocumentMap[K]) => void,
  element: Document,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener<
  K extends keyof HTMLElementMap,
  T extends HTMLElement = HTMLElement,
>(
  eventName: K,
  handler: (event: HTMLElementMap[K]) => void,
  element: React.RefObject<T> | T,
  options?: boolean | AddEventListenerOptions
): void
export function useEventListener(
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (event: any) => void,
  element?:
    | Document
    | HTMLElement
    | React.RefObject<HTMLElement>
    | undefined,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler)
  savedHandler.current = handler

  useEffect(() => {
    const target: EventTarget | null | undefined =
      element && 'current' in element ? element.current : element ?? window
    if (!target || !target.addEventListener) return

    const listener: EventListener = (event) => savedHandler.current(event)
    target.addEventListener(eventName, listener, options)
    return () => target.removeEventListener(eventName, listener, options)
  }, [eventName, element, options])
}

export default useEventListener
