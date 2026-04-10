/**
 * Barrel export for UI primitives. Feature code should import from
 * `@/components/ui` rather than reach into individual files, so adding
 * a new primitive only requires one import-path change at the call site.
 */
export { default as Button } from './Button'
export type { ButtonProps } from './Button'

export { default as IconButton } from './IconButton'
export type { IconButtonProps } from './IconButton'

export { default as Card } from './Card'
export type { CardProps } from './Card'

export { default as Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { default as Skeleton } from './Skeleton'
export type { SkeletonProps } from './Skeleton'

export { default as Tooltip } from './Tooltip'
export type { TooltipProps } from './Tooltip'

export { default as Modal } from './Modal'
export type { ModalProps } from './Modal'

export { default as Input } from './Input'
export type { InputProps } from './Input'

export { ToastProvider, useToast } from './Toast'
export type { ToastOptions } from './Toast'
