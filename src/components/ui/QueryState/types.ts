import type { ReactNode } from 'react'

/**
 * The slice of a query the component layer actually reads.
 *
 * Declared structurally rather than imported from React Query, so the UI keeps
 * knowing nothing about the data layer — and so a screen can hand these
 * components a value it computed itself.
 */
export interface Loadable<T> {
  data: T | undefined
  isPending: boolean
  error: Error | null
}

export interface QueryStateProps<T> {
  query: Loadable<T>
  /** Placeholder shaped like what is coming, shown while it loads. */
  skeleton: ReactNode
  /** Rendered when the query resolved to nothing — absent by default. */
  empty?: ReactNode
  children: (data: NonNullable<T>) => ReactNode
}
