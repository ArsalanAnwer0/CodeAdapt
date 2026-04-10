import React, { useId, useRef, useState } from 'react'
import { cn } from '../../lib/cn'

type Placement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Element that triggers the tooltip. Must accept mouse/focus handlers. */
  children: React.ReactElement
  /** Tooltip body. */
  label: React.ReactNode
  placement?: Placement
  /** Open delay in ms. */
  delay?: number
  /** Disable the tooltip entirely. */
  disabled?: boolean
  className?: string
}

const placementStyles: Record<Placement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
}

/**
 * Lightweight tooltip. Wraps a single child and renders a label on
 * hover or focus. Uses CSS positioning only — no portal required.
 */
export default function Tooltip({
  children,
  label,
  placement = 'top',
  delay = 150,
  disabled,
  className,
}: TooltipProps): React.ReactElement {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const id = useId()

  const show = (): void => {
    if (disabled) return
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setOpen(true), delay)
  }

  const hide = (): void => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    setOpen(false)
  }

  const child = React.cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e)
      show()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e)
      hide()
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e)
      show()
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e)
      hide()
    },
  })

  return (
    <span className="relative inline-flex">
      {child}
      {open && !disabled && (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium',
            'animate-in fade-in duration-150',
            placementStyles[placement],
            className
          )}
          style={{
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {label}
        </span>
      )}
    </span>
  )
}
