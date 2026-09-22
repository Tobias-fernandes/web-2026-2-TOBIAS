import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonRegionInnerProps {
  label: string
  className?: string
  children: ReactNode
}

/**
 * One announcement for a whole placeholder.
 *
 * The blocks are `aria-hidden`; this wrapper is what a screen reader hears, so
 * the experience is the same sentence the spinner used to say.
 */
export function SkeletonRegion({
  label,
  className,
  children,
}: SkeletonRegionInnerProps) {
  return (
    <div role="status" aria-busy className={cn(className)}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  )
}
