import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'
import { AVATAR_SIZE_CLASSES } from './constants'
import type { AvatarProps } from './types'

/**
 * A person, as a circle.
 *
 * Falls back to initials rather than to a generic silhouette: in a junior
 * enterprise almost nobody uploads a picture, and a column of identical grey
 * heads tells the reader less than two letters do.
 */
export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const classes = cn(
    'shrink-0 rounded-full object-cover',
    AVATAR_SIZE_CLASSES[size],
    className,
  )

  if (src) {
    return <img src={src} alt="" aria-hidden className={classes} />
  }

  return (
    <span
      aria-hidden
      className={cn(
        classes,
        'grid place-items-center bg-violeta-lav font-semibold text-violeta',
      )}
    >
      {getInitials(name)}
    </span>
  )
}
