import type { ReactNode } from 'react'
import { SkeletonTable } from '@/components/ui/Skeleton'
import type { Loadable } from '@/components/ui/QueryState'

/** Failure message, styled the same wherever a request or a form can fail. */
export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="m-0 text-sm text-ambar">
      {children}
    </p>
  )
}

interface ListStateProps<T, TData> {
  /** The read this list came from; `isPending` and `error` travel together. */
  query: Loadable<TData>
  /** Already filtered and sorted by the page — the state machine only counts them. */
  rows: T[]
  loadingLabel?: string
  /**
   * Placeholder shaped like what is coming. Defaults to a table, which is what
   * most screens render; a board or a list of bars passes its own.
   */
  skeleton?: ReactNode
  empty: ReactNode
  children: (rows: T[]) => ReactNode
}

/**
 * The loading → error → empty → content decision, made in one place.
 *
 * Every list screen used to spell these four branches out by hand, and they had
 * already drifted: some rendered the empty state *underneath* the error message,
 * because `data` is undefined on failure and `[].length === 0` reads as "empty".
 * The branches here are exclusive, so that cannot happen again.
 *
 * It takes the query rather than a loose `pending`/`error` pair: the two always
 * came from the same read, and passing them apart made it possible to show one
 * list's spinner over another list's error.
 *
 * Loading is a skeleton rather than a spinner: it holds the shape of the table
 * or board that is coming, so the page does not jump when the rows land.
 */
export function ListState<T, TData>({
  query,
  rows,
  loadingLabel,
  skeleton,
  empty,
  children,
}: ListStateProps<T, TData>) {
  if (query.isPending) return <>{skeleton ?? <SkeletonTable label={loadingLabel} />}</>
  if (query.error) return <ErrorText>{query.error.message}</ErrorText>
  if (rows.length === 0) return <>{empty}</>
  return <>{children(rows)}</>
}
