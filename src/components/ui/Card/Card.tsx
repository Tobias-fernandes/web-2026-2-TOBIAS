import { cn } from '@/lib/utils'
import type { CardProps, CardTitleProps } from './types'

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-linha bg-papel-alto p-5', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, action }: CardTitleProps) {
  return (
    <div className="mb-4 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-base font-bold">{children}</h2>
      {action}
    </div>
  )
}
