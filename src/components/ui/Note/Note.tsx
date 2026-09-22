import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface NoteProps {
  children: ReactNode
  className?: string
}

/**
 * The line that explains what a number means, under the thing it explains.
 *
 * Every card used to end with its own hand-written muted paragraph, each at a
 * slightly different size and distance. Separated by a rule and set apart from
 * the content, the explanation stops competing with the figures above it — it
 * is there for the reader who needs it and skipped by the one who does not.
 */
export function Note({ children, className }: NoteProps) {
  return (
    <p
      className={cn(
        'mt-5 mb-0 border-t border-linha pt-3 text-xs leading-relaxed text-tinta-suave',
        className,
      )}
    >
      {children}
    </p>
  )
}
