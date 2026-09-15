import { cn } from '@/lib/utils'
import { BUTTON_VARIANT_CLASSES } from './constants'
import type { ButtonProps } from './types'

export function Button({
  variant = 'solid',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-[0.95rem] font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-55',
        BUTTON_VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
