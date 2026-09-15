import { cn } from '@/lib/utils'
import { BADGE_TONE_CLASSES } from './constants'
import type { BadgeProps } from './types'

export function Badge({ children, tone = 'violet', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[3px] border px-1.5 py-0.5 text-[0.68rem] font-semibold leading-tight',
        BADGE_TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
