import type { ReactNode } from 'react'

export interface CardProps {
  children: ReactNode
  className?: string
}

export interface CardTitleProps {
  children: ReactNode
  action?: ReactNode
}
