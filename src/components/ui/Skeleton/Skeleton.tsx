import { cn } from '@/lib/utils'
import { SKELETON_BLOCK } from './constants'
import type { SkeletonProps } from './types'

/**
 * A grey block standing in for content that has not arrived.
 *
 * Preferred over a spinner because it says *what* is coming: the reader sees
 * the shape of the table or the four cards before the numbers land, so the page
 * does not jump when they do and there is nothing to re-read. A spinner
 * communicates only that something is happening.
 *
 * Hidden from screen readers — the composites below carry one `role="status"`
 * for the whole region instead of announcing a dozen empty boxes.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <span aria-hidden className={cn(SKELETON_BLOCK, className)} />
}
