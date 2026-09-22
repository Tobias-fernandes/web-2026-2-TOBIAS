import type { ReactNode } from 'react'
import type { Tone } from '@/domain/constants'
import { cn } from '@/lib/utils'
import { BADGE_TONE_CLASSES } from './constants'

export interface BadgeProps {
  children: ReactNode
  tone?: Tone
  className?: string
}

export function Badge({ children, tone = 'violet', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-2xs font-semibold',
        BADGE_TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
