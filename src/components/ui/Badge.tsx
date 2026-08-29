// src/components/ui/Badge.tsx
import type { HTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

type BadgeVariant = 'neutral' | 'success' | 'error' | 'warning' | 'primary'

const styles: Record<BadgeVariant, string> = {
  neutral: 'bg-neutral-100 text-neutral-800',
  success: 'bg-success-100 text-success-500',
  error: 'bg-error-100 text-error-500',
  warning: 'bg-warning-100 text-warning-500',
  primary: 'bg-primary-50 text-primary-700',
}

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium',
        styles[variant],
        className
      )}
      {...props}
    />
  )
}