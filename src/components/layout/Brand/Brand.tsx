import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { BrandProps } from './types'

/** Wordmark used on the landing page and at the top of the system. */
export function Brand({ to = '/', className }: BrandProps) {
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2.5 font-display text-[1.05rem] font-bold text-tinta no-underline',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-[26px] shrink-0 place-items-center rounded-md bg-violeta text-[0.8rem] text-white"
      >
        A
      </span>
      AltoTech Manager
    </Link>
  )
}
