import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

type ToastTone = 'info' | 'success' | 'warning' | 'danger'

export interface ToastOptions {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  tone?: ToastTone
  /** Milliseconds before auto-dismiss. Pass 0 to keep until dismissed. */
  duration?: number
}

interface ToastItem extends Required<Omit<ToastOptions, 'description' | 'title'>> {
  title?: React.ReactNode
  description?: React.ReactNode
}

interface ToastContextValue {
  toast: (opts: ToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

type Action =
  | { type: 'add'; toast: ToastItem }
  | { type: 'remove'; id: string }
  | { type: 'clear' }

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case 'add':
      return [...state, action.toast]
    case 'remove':
      return state.filter((t) => t.id !== action.id)
    case 'clear':
      return []
  }
}

const toneIcon: Record<ToastTone, React.ReactNode> = {
  info: <Info className="w-4 h-4" />,
  success: <CheckCircle2 className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  danger: <XCircle className="w-4 h-4" />,
}

const toneStyle: Record<ToastTone, React.CSSProperties> = {
  info: { color: 'var(--accent-blue)' },
  success: { color: 'var(--accent-success)' },
  warning: { color: 'var(--accent-orange)' },
  danger: { color: 'var(--accent-severe)' },
}

function genId(): string {
  return Math.random().toString(36).slice(2)
}

/**
 * Mounts the toast portal and exposes the `useToast()` hook.
 */
export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const [toasts, dispatch] = useReducer(reducer, [])
  const timers = useRef<Map<string, number>>(new Map())

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id)
    if (t) {
      window.clearTimeout(t)
      timers.current.delete(id)
    }
    dispatch({ type: 'remove', id })
  }, [])

  const toast = useCallback(
    (opts: ToastOptions): string => {
      const id = opts.id ?? genId()
      const item: ToastItem = {
        id,
        tone: opts.tone ?? 'info',
        duration: opts.duration ?? 4000,
        title: opts.title,
        description: opts.description,
      }
      dispatch({ type: 'add', toast: item })
      if (item.duration > 0) {
        const handle = window.setTimeout(() => dismiss(id), item.duration)
        timers.current.set(id, handle)
      }
      return id
    },
    [dismiss]
  )

  const clear = useCallback(() => {
    timers.current.forEach((h) => window.clearTimeout(h))
    timers.current.clear()
    dispatch({ type: 'clear' })
  }, [])

  useEffect(() => {
    return () => {
      timers.current.forEach((h) => window.clearTimeout(h))
      timers.current.clear()
    }
  }, [])

  const value = useMemo<ToastContextValue>(
    () => ({ toast, dismiss, clear }),
    [toast, dismiss, clear]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              role="status"
              className={cn(
                'pointer-events-auto min-w-[280px] max-w-sm rounded-xl p-3 pr-8 relative',
                'animate-in slide-in-from-right-4 fade-in duration-200'
              )}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-secondary)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 flex-shrink-0"
                  style={toneStyle[t.tone]}
                >
                  {toneIcon[t.tone]}
                </span>
                <div className="flex-1 min-w-0">
                  {t.title && (
                    <div
                      className="text-[12px] font-semibold leading-tight"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {t.title}
                    </div>
                  )}
                  {t.description && (
                    <div
                      className={cn(
                        'text-[11px] leading-relaxed',
                        t.title && 'mt-0.5'
                      )}
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {t.description}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(t.id)}
                className="absolute top-2 right-2 w-5 h-5 rounded flex items-center justify-center transition-all hover:brightness-125 active:scale-90"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/**
 * Access the toast API from any descendant of `<ToastProvider>`.
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a <ToastProvider>')
  }
  return ctx
}
