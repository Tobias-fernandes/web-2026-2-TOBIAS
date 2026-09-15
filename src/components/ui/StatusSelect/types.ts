import type { Tone } from '@/domain/constants'

export interface StatusOption<T extends string> {
  value: T
  label: string
}

export interface StatusSelectProps<T extends string> {
  value: T
  tone: Tone
  /** Announced to screen readers, since the visible label is the value itself. */
  accessibleLabel: string
  options: StatusOption<T>[]
  disabled?: boolean
  onChange: (value: T) => void
}
