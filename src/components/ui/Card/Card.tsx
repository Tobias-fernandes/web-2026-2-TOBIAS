import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface CardProps {
  children: ReactNode
  className?: string
}

export interface CardTitleProps {
  children: ReactNode
  action?: ReactNode
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-linha bg-papel-alto p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, action }: CardTitleProps) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-md font-bold">{children}</h2>
      {action}
    </div>
  )
}

export interface CardLinkProps {
  to: string
  children: ReactNode
}

/**
 * "See the whole thing" link in a card's header.
 *
 * A card that summarises a screen always offers a way into it, and the four
 * that did were each carrying the same class string.
 */
export function CardLink({ to, children }: CardLinkProps) {
  return (
    <Link to={to} className="text-sm text-violeta no-underline">
      {children}
    </Link>
  )
}
