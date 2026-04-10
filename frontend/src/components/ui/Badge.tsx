import React from 'react'
import { cn } from '../../lib/cn'

type Tone =
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
type Size = 'sm' | 'md'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
  size?: Size
  /** Optional leading icon rendered before the label. */
  icon?: React.ReactNode
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-5 px-1.5 text-[10px] gap-1 rounded-md',
  md: 'h-6 px-2 text-[11px] gap-1.5 rounded-md',
}

const toneStyles: Record<Tone, React.CSSProperties> = {
  neutral: {
    background: 'var(--bg-tertiary)',
    color: 'var(--text-tertiary)',
    border: '1px solid var(--border-secondary)',
  },
  info: {
    background: 'rgba(9,105,218,0.08)',
    color: 'var(--accent-blue)',
    border: '1px solid rgba(9,105,218,0.18)',
  },
  success: {
    background: 'rgba(26,127,55,0.08)',
    color: 'var(--accent-success)',
    border: '1px solid rgba(26,127,55,0.18)',
  },
  warning: {
    background: 'rgba(188,76,0,0.08)',
    color: 'var(--accent-orange)',
    border: '1px solid rgba(188,76,0,0.18)',
  },
  danger: {
    background: 'rgba(207,34,46,0.08)',
    color: 'var(--accent-severe)',
    border: '1px solid rgba(207,34,46,0.18)',
  },
  accent: {
    background: 'rgba(130,80,223,0.08)',
    color: 'var(--accent-purple, #8250df)',
    border: '1px solid rgba(130,80,223,0.18)',
  },
}

/**
 * Compact status badge used for tags, severities, and counts.
 */
const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', size = 'md', icon, className, style, children, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center font-semibold whitespace-nowrap',
        sizeStyles[size],
        className
      )}
      style={{ ...toneStyles[tone], ...style }}
      {...rest}
    >
      {icon}
      {children}
    </span>
  )
})

export default Badge
