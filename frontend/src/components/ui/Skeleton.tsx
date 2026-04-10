import React from 'react'
import { cn } from '../../lib/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width as a CSS length or number (px). */
  width?: number | string
  /** Height as a CSS length or number (px). */
  height?: number | string
  /** Shape of the skeleton block. */
  shape?: 'rect' | 'circle' | 'text'
  /** Number of stacked lines (for `shape="text"`). */
  lines?: number
}

function toLen(v: number | string | undefined): string | undefined {
  if (v == null) return undefined
  return typeof v === 'number' ? `${v}px` : v
}

/**
 * Content placeholder shown while data loads. Uses a subtle shimmer
 * driven by CSS keyframes declared in `index.css`.
 */
const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  function Skeleton(
    { width, height, shape = 'rect', lines = 1, className, style, ...rest },
    ref
  ) {
    const base = cn(
      'relative overflow-hidden',
      shape === 'circle' ? 'rounded-full' : 'rounded-md',
      'animate-pulse'
    )

    const baseStyle: React.CSSProperties = {
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--border-secondary)',
      width: toLen(width),
      height: toLen(height) ?? (shape === 'text' ? '0.75rem' : '1rem'),
      ...style,
    }

    if (shape === 'text' && lines > 1) {
      return (
        <div
          ref={ref}
          className={cn('flex flex-col gap-1.5', className)}
          aria-hidden="true"
          {...rest}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={base}
              style={{
                ...baseStyle,
                width:
                  i === lines - 1 ? `calc(${toLen(width) ?? '100%'} - 20%)` : toLen(width) ?? '100%',
              }}
            />
          ))}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(base, className)}
        style={baseStyle}
        aria-hidden="true"
        {...rest}
      />
    )
  }
)

export default Skeleton
