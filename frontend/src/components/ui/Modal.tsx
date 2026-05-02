import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** Accessible title rendered in the header. */
  title?: React.ReactNode
  /** Optional secondary description below the title. */
  description?: React.ReactNode
  /** Footer content (typically action buttons). */
  footer?: React.ReactNode
  children?: React.ReactNode
  size?: Size
  /** Close when backdrop is clicked. Defaults to true. */
  dismissOnBackdrop?: boolean
  /** Close when Escape is pressed. Defaults to true. */
  dismissOnEscape?: boolean
  className?: string
}

const sizeStyles: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

/**
 * Accessible dialog rendered into a portal. Handles body scroll lock,
 * escape-to-close, backdrop dismissal, and focus management.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = 'md',
  dismissOnBackdrop = true,
  dismissOnEscape = true,
  className,
}: ModalProps): React.ReactPortal | null {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open || !dismissOnEscape) return
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, dismissOnEscape, onClose])

  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-150"
      style={{ background: 'rgba(1,4,9,0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      onMouseDown={(e) => {
        if (dismissOnBackdrop && e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl outline-none',
          'animate-in zoom-in-95 slide-in-from-bottom-2 duration-200',
          sizeStyles[size],
          className
        )}
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-secondary)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        {(title || description) && (
          <div
            className="px-5 pt-5 pb-4"
            style={{ borderBottom: '1px solid var(--border-secondary)' }}
          >
            {title && (
              <h2
                id="modal-title"
                className="text-[15px] font-bold leading-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="mt-1 text-[12px] leading-relaxed"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {description}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-md flex items-center justify-center transition-all hover:brightness-110 active:scale-95"
          style={{
            background: 'transparent',
            color: 'var(--text-tertiary)',
          }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="px-5 py-4" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </div>

        {footer && (
          <div
            className="px-5 py-3 flex items-center justify-end gap-2"
            style={{ borderTop: '1px solid var(--border-secondary)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
