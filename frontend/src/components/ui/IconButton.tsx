import React, { forwardRef } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'ghost' | 'subtle' | 'solid' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible label — required since there is no visible text. */
  'aria-label': string
  icon: React.ReactNode
  variant?: Variant
  size?: Size
}

const sizeStyles: Record<Size, string> = {
  sm: 'w-6 h-6 rounded-md [&_svg]:w-3 [&_svg]:h-3',
  md: 'w-8 h-8 rounded-lg [&_svg]:w-3.5 [&_svg]:h-3.5',
  lg: 'w-10 h-10 rounded-lg [&_svg]:w-4 [&_svg]:h-4',
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  ghost: {
    background: 'transparent',
    color: 'var(--text-tertiary)',
  },
  subtle: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-primary)',
  },
  solid: {
    background: 'linear-gradient(135deg, var(--accent-blue), #0550ae)',
    color: '#ffffff',
    boxShadow: '0 1px 3px rgba(9,105,218,0.25)',
  },
  danger: {
    background: 'rgba(207,34,46,0.08)',
    color: 'var(--accent-severe)',
    border: '1px solid rgba(207,34,46,0.2)',
  },
}

const variantHoverClass: Record<Variant, string> = {
  ghost: 'hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)]',
  subtle: 'hover:bg-[var(--bg-tertiary)] hover:border-[var(--border-primary)]',
  solid: 'hover:brightness-110',
  danger: 'hover:bg-[rgba(207,34,46,0.14)]',
}

/**
 * Square icon-only button. Accessible label is required.
 */
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      icon,
      variant = 'ghost',
      size = 'md',
      className,
      style,
      type = 'button',
      ...rest
    },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150',
          'active:scale-[0.94] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
          variantHoverClass[variant],
          sizeStyles[size],
          className
        )}
        style={{ ...variantStyles[variant], ...style }}
        {...rest}
      >
        {icon}
      </button>
    )
  }
)

export default IconButton
