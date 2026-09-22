import { ErrorText } from '@/components/ui/ListState'
import type { QueryStateProps } from './types'

/**
 * The loading → error → empty → content decision for a single value.
 *
 * `ListState` does this for a list; every screen that reads one object — the
 * metric row, the goals of a management, the cash flow — was spelling the same
 * three branches out by hand, and they had already drifted: some showed the
 * skeleton and the error at once, because `isPending` and `error` are not
 * mutually exclusive in the way the markup assumed.
 */
export function QueryState<T>({
  query,
  skeleton,
  empty,
  children,
}: QueryStateProps<T>) {
  if (query.isPending) return <>{skeleton}</>
  if (query.error) return <ErrorText>{query.error.message}</ErrorText>
  if (query.data === undefined || query.data === null) return <>{empty ?? null}</>
  return <>{children(query.data as NonNullable<T>)}</>
}
