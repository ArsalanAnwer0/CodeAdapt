import React from 'react'
import { cn } from '../../lib/cn'

type Padding = 'none' | 'sm' | 'md' | 'lg'
type Elevation = 'flat' | 'raised' | 'floating'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: Padding
  elevation?: Elevation
  /** Adds a subtle hover lift effect. */
  interactive?: boolean
}

const paddingStyles: Record<Padding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const elevationStyles: Record<Elevation, string> = {
  flat: '',
  raised: 'shadow-card',
  floating: 'shadow-elevated',
}

/**
 * Card primitive. The base surface for grouped content throughout the app.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = 'md', elevation = 'flat', interactive, className, style, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-200',
        paddingStyles[padding],
        elevationStyles[elevation],
        interactive && 'cursor-pointer hover:-translate-y-px hover:shadow-card',
        className
      )}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-secondary)',
        ...style,
      }}
      {...rest}
    />
  )
})

export default Card
