import React, { forwardRef } from 'react'
import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size
  /** Icon rendered inside the input, before the text. */
  leftIcon?: React.ReactNode
  /** Icon rendered inside the input, after the text. */
  rightIcon?: React.ReactNode
  /** Show an error ring and tie to the provided message via aria. */
  error?: string
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-7 text-[11px] px-2.5 rounded-md',
  md: 'h-8 text-[12px] px-3 rounded-lg',
  lg: 'h-10 text-sm px-3.5 rounded-lg',
}

/**
 * Text input primitive. All form inputs in the app should use this
 * component so focus rings, error states, and icon alignment are
 * consistent.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', leftIcon, rightIcon, error, className, style, id, ...rest },
  ref
) {
  const errorId = error && id ? `${id}-error` : undefined
  return (
    <div className="w-full">
      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className="absolute left-2.5 pointer-events-none [&_svg]:w-3.5 [&_svg]:h-3.5"
            style={{ color: 'var(--text-quaternary)' }}
          >
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={cn(
            'w-full font-medium outline-none transition-all duration-200',
            sizeStyles[size],
            leftIcon && 'pl-7',
            rightIcon && 'pr-7',
            className
          )}
          style={{
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: `1px solid ${error ? 'var(--accent-severe)' : 'var(--border-primary)'}`,
            ...style,
          }}
          {...rest}
        />
        {rightIcon && (
          <span
            className="absolute right-2.5 pointer-events-none [&_svg]:w-3.5 [&_svg]:h-3.5"
            style={{ color: 'var(--text-quaternary)' }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {error && (
        <p
          id={errorId}
          className="mt-1 text-[11px]"
          style={{ color: 'var(--accent-severe)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
