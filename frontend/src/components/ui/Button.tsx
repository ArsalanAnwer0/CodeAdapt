import React, { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'warning'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Show a spinner and disable the button. */
  loading?: boolean
  /** Icon rendered before the label. */
  leftIcon?: React.ReactNode
  /** Icon rendered after the label. */
  rightIcon?: React.ReactNode
  /** Grow to fill the parent width. */
  fullWidth?: boolean
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 px-2.5 text-[11px] rounded-md gap-1.5',
  md: 'h-8 px-3.5 text-[12px] rounded-lg gap-1.5',
  lg: 'h-11 px-5 text-sm rounded-xl gap-2',
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, var(--accent-blue), #0550ae)',
    color: '#ffffff',
    boxShadow:
      '0 1px 3px rgba(9,105,218,0.25), 0 0 0 1px rgba(9,105,218,0.1)',
  },
  secondary: {
    background: 'var(--bg-secondary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-primary)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-tertiary)',
  },
  danger: {
    background: 'rgba(207,34,46,0.05)',
    color: 'var(--accent-severe)',
    border: '1px solid rgba(207,34,46,0.15)',
  },
  warning: {
    background: 'rgba(188,76,0,0.07)',
    color: 'var(--accent-orange)',
    border: '1px solid rgba(188,76,0,0.18)',
  },
}

/**
 * Primary button primitive with variants, sizes, and loading state.
 *
 * All app buttons should prefer this component over raw `<button>`.
 * It encodes our focus ring, active scale, and disabled states once.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200',
        'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      style={variantStyles[variant]}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
})

export default Button
