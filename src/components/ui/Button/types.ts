import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type ButtonVariant =
  | 'solid'
  | 'outline'
  | 'subtle'
  | 'danger'
  | 'dangerSolid'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
}
